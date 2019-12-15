<!-- home -->
<template>
  <div>
    <!-- <div>
        <mt-header fixed title="基于lbs社交"></mt-header>
    </div> -->
    <div class="home">
      <div class="user">
        <img class="index-headImg" :src=userPic alt="头像">
      </div>
      <div class="user">
        <!-- <img src="@/assets/user.png" alt=""> -->
        <!-- <button @click="getMypostion()">获取当前经纬度</button> -->
      </div>
      <div class="center-icon">
        <img src="@/assets/position.png" alt="坐标">
      </div>
      <div class="add-icon">
        <img  @click="handleAddMarker"  src='@/assets/addAction.png' alt="添加">
      </div>
      <mt-popup
          v-model="popupVisible"
          :closeOnClickModal=false
          popup-transition="popup-fade">
          <div>
            <mt-field label="标题" placeholder="请输入标题" v-model="title"></mt-field>
            <mt-field label="详细内容" placeholder="请输入详细内容" type="textarea" rows="6" v-model="content"></mt-field>
            <div class="popup-button">
              <mt-button  type="primary" @click.native="actionAddMarker">确定</mt-button>
              <mt-button  plain @click.native="handleCancel">取消</mt-button>
            </div>

          </div>
        </mt-popup>
      <div id="container" style="width:100%;height:600px">
      </div>
       
    </div>
   <LbsNav propSelected="home"></LbsNav>
  </div>
</template>

<script>

import AMap from 'AMap';
import {getMobileHome,publicMessage,getMarkDetail} from '@/api/getData'
import {showError,showSuccess} from '@/utils/common'
import LbsNav from '@/components/nav'
import { Cell,Indicator,MessageBox,Popup,Field} from 'mint-ui';
import { async } from 'q';
export default {
  name: 'home',
  components: {LbsNav},
  data(){
    return{
      infoWindow:'',
      title:'',
      content:'',
      popupVisible:false,
      userPic: require('@/assets/defaultPic.png'),
      token:this.$store.state.token,
      map: null,
      isGeolocation:false,
      myLng:100,
      myLat:22,
      titleIndex:0,
      lnglats:[
          [113.9010,22.56200],
          [113.9020,22.56300],
          [113.9030,22.56200],
          [113.9048,22.56500],
        ]
    }
  },
  created() {
   
  },
  mounted () {
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 8
      })  
      //缩放
      this.map.addControl(new AMap.ToolBar({
        // 简易缩放模式，默认为 false
        liteStyle: true
      }));


    this.init()
    document.querySelector('#container').style.height = (document.documentElement.clientHeight || document.body.clientHeight) + 'px'

    //获取所有标注信息
    if(this.$store.state.token !== ''){
          this.handleGetMobileHome()
    }

    console.log('this.$store',this.$store)
    //获取头像
    if(this.$store.state.userInfo.headImage && this.$store.state.userInfo.headImage !== null){
      this.userPic = this.$store.state.userInfo.headImage
    }
    
  },
  methods:{
    async handleGetMobileHome(){
        Indicator.open();
        try {
          let res = await getMobileHome()
          if(res.status === 200){
            showSuccess('')
            if(res.result.length > 0){
              let data = []
              res.result.map((resItem) => {
                data.push(resItem.lng)
                data.push(resItem.lat)
                this.addMarker(data,resItem)
                data.length = 0
              })
        //       var zoom = this.map.getZoom();
				// this.map.setZoom(zoom - 9); 	
              // this.map.setFitView(null,true,[10,10,10,10],3)
            }
            // this.lnglats.map((item,index) => {
            //   this.addMarker(item)
            // })
          }else{
            showError(res.msg||res.error)
          }
        } catch (error) {
          showError('网络错误，请稍后重试！')
        }
    },
    //标注完获取标注信息
    async handleGetMobileHomeForMark(){
        try {
          let res = await getMobileHome()
          if(res.status === 200){
            let userId = this.$store.state.userInfo.userId
            let data = {}
            if(res.result.length > 0){
              res.result.map((item,index) => {
                  if(item.userId === userId){
                    data = item
                  }
              })
              this.addMarker([],data)  
            }

          }else{
            showError(res.msg||res.error)
          }
        } catch (error) {
          showError('网络错误，请稍后重试！')
        }
    },
    //添加标注点
    handleAddMarker(){
      // this.addMarker()
      MessageBox.confirm('确定标注该位置吗？').then(action => {
            if(action == 'confirm'){
                console.log('ddddd')
                this.popupVisible = true
                // this.actionAddMarker()
            }
        });
    },
    handleCancel(){
      this.popupVisible = false
    },
    returnGetCenter(){
      let data = []
      let {P,O} = this.map.getCenter()
      data.push(P)
      data.push(O)
      console.log('data',data)
      return data
    },
    async actionAddMarker(){
        if(this.title.trim() == '' || this.content.trim() == ''){
          console.log('error')
          showError('请填写完整！')
          return
        }
        let {P,O} = this.map.getCenter()
        // P:纬度lat
        // O:经度lng
        Indicator.open();
        try {
          let res = await publicMessage(this.content.trim(),P,O,this.title.trim())
          if(res.status === 200){
            showSuccess('标注成功！')
            this.popupVisible = false
            this.handleGetMobileHomeForMark()
            
          }else{
            showError(res.msg||res.error)
          }
        } catch (error) {
          showError('网络错误，请稍后重试！')
        }

    },
    async handleGetMarkDetail(e){
      let that = this
        Indicator.open();
        try {
          let res = await getMarkDetail(e.target.markId)
          if(res.status === 200){
            showSuccess('')
            let title = res.markDetail.title,
            content = [];
            content.push(res.markDetail.content);

            var infoWindow = new AMap.InfoWindow({ 
              isCustom: true,  //使用自定义窗体
              content: that.initInfoWindow(title, content.join("<br/>"),res.markDetail),
              offset: new AMap.Pixel(16, -45)
            });
            infoWindow.open(this.map, e.target.getPosition());
          }else{
            showError(res.msg||res.error)
          }
        } catch (error) {
          showError('网络错误，请稍后重试！')
        }
    },
    init () {
      let that = this;

      let options = {
      'showButton': true,//是否显示定位按钮
      'buttonPosition': 'LB',//定位按钮的位置
      /* LT LB RT RB */
      'buttonOffset': new AMap.Pixel(10, 20),//定位按钮距离对应角落的距离
      'showMarker': true,//是否显示定位点
      'markerOptions':{//自定义定位点样式，同Marker的Options
        'offset': new AMap.Pixel(-18, -36),
        'content':'<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
      },
      'showCircle': false,//是否显示定位精度圈
      }

      //按钮
      AMap.plugin(["AMap.Geolocation", 'AMap.ToolBar'], function() {  
          //定位
          var geolocation = new AMap.Geolocation(options);
          that.map.addControl(geolocation);
          geolocation.getCurrentPosition(function(status,result){
            if(status=='complete'){
              that.showLocationMsg(result)
            }else{
              that.showLocationMsg(result)
            }
          });

         
      });
    

    },
    showLocationMsg(data){
      console.log('data',data)
      // alert(JSON.stringify(data))
      if(data.message == "Geolocation permission denied."){
        navigator.geolocation.getCurrentPosition(this.showPosition(),this.showError());
      }
      if(data.info == 'SUCCESS'){
        console.log(data.position);
        this.myLat = data.position.lat
        this.myLng = data.position.lng
      }

    },
// 实例化点标记 
    addMarker(item = [],data = {headImage:null}) {
      let that = this;
      // that.map.clearMap();
        //创建icon
        var icon = new AMap.Icon({
              size: new AMap.Size(40, 40),
              image: data.headImage == null ? 'https://upload.jianshu.io/users/upload_avatars/1758676/fa0d96a7c0c6.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/180/h/180' : data.headImage,
              // image: 'https://upload.jianshu.io/users/upload_avatars/1758676/fa0d96a7c0c6.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/180/h/180',
              imageSize: new AMap.Size(40, 40) 
        });

        //实例化信息窗体  
        let title = 'title',
            content = [];
        content.push("contentcontentcontentcontent");
        // content.push("电话：010-64733333"); 
        // content.push("<div><button></div>");

        let marker = new AMap.Marker({
            icon: icon,
            // position: item.length == 0 ? that.returnGetCenter() : item,
            position: item.length == 0 ? that.map.getCenter() : item,
            map:that.map,
            offset: new AMap.Pixel(-26, -55),
        });
        // console.log('create',that.createInfoWindow(title, content.join("<br/>"),data))
        //鼠标点击marker弹出自定义的信息窗体
        marker.markId = data.markId
        marker.on('click',this.mclick);

        // AMap.event.addListener(marker, 'click', function () {
        //    let infoWindow = new AMap.InfoWindow({
        //     isCustom: true,  //使用自定义窗体
        //     content: that.initInfoWindow(title, content.join("<br/>"),data),
        //     offset: new AMap.Pixel(16, -45)
        // });
        //     infoWindow.open(that.map, marker.getPosition());
        // });


    },
    mclick(e){
      console.log('e',e)
      this.handleGetMarkDetail(e)
    },
    //构建自定义信息窗体
    async createInfoWindow(title, content,data) {
        // console.log('data',data)
        // console.log('content',content)
        // let that = this;
        // this.handleGetMarkDetail(data,title,content)
         
        // console.log('test',test)
        // console.log('handleGetMarkDetail',this.handleGetMarkDetail(data,title,content).then((test)=>{console.log('test',test)}))


       
    },

    initInfoWindow(title,content,data){

      //  let test = await this.handleGetMarkDetail(data,title,content)
      //   console.log('test',test)

      //   console.log('data',data)
        var info = document.createElement("div");
        info.className = "custom-info input-card content-window-card";

        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        closeX.src = "https://webapi.amap.com/images/close2.gif";
        closeX.onclick = this.closeInfoWindow;

        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);

        // 定义状态
        var flag = document.createElement("div");
        flag.className = "info-button";
        flag.style.backgroundColor = 'white';
        let leftFlag = document.createElement('button');
        leftFlag.className = 'info-button-left'
        leftFlag.innerHTML ='左边哈哈'
        leftFlag.onclick = this.handleLike

        let rightFlag = document.createElement('button');
        rightFlag.className = 'info-button-right'
        rightFlag.innerHTML='右边边哈哈'
        rightFlag.onclick = this.handleExtend

        flag.appendChild(leftFlag)
        flag.appendChild(rightFlag)
        info.appendChild(flag);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "https://webapi.amap.com/images/sharp.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        console.log('info',info)
        return info;
    },
    //关闭信息窗体
    closeInfoWindow() {
        this.map.clearInfoWindow();
    },
    //关注
    handleLike() {
      alert('关注')
    },
    //推广
    handleExtend() {
      alert('推广')
    },
    showInfoM(e){
      console.log('e',e)
      // alert(e);
    },
    getMypostion(){
      alert(`lat:${this.myLat},lng:${this.myLng}`)
      this.login()
    },
    postPostion(){

    },

    showPosition(position){
      console.log('position',position)
    },

    showError(error){
      console.log('error',error)
      
    }
  }
}
</script>

<style>
.amap-geolocation-con{
  left: 6px !important;
    bottom: 60px !important;
    z-index: 500 !important;
}
.amap-touch-toolbar .amap-zoomcontrol{
  right: -5px !important;
    bottom: -50px !important;
}

.popup-button{
  display: flex;
  width: 90%;
  justify-content: space-between;
  margin: 0 auto;
  padding: 10px 0;
}
.popup-button button{
  width: 40%;
}
   p.my-desc {
        margin: 5px 0;
        line-height: 150%;
    }
 .info{
            position: relative;
            top: 0;
            right: 0;
            min-width: 0;
        }
  .custom-content-marker img{
    width: 40px;
    border-radius: 50%;
  }
.home{
  display: flex;
}
.amap-logo{
  display: none !important;
}
.amap-copyright{
  display: none !important;
}
.user{
  position: fixed;
  top: 10px;
  left: 10px;
  cursor: pointer;
  z-index: 999;
}
.center-icon{
  position: fixed;
  top: 45%;
  left: 45%;
  cursor: pointer;
  z-index: 10;
}
.center-icon img{
  width: 40px;
}
.add-icon{
  transform: translate(-50%, 0);
  background-color: white;
  position: fixed;
  bottom: 100px;
  cursor: pointer;
  z-index: 10;
  left: 50%;
  border-radius: 50%;
  box-shadow: 2px 3px 8px #888888;
}
.add-icon img{
  width: 60px;
}
.index-headImg{
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}
html, body, #container {
              height: 100%;
              width: 100%;
          }

        .content-window-card {
            position: relative;
            box-shadow: none;
            bottom: 0;
          left: 0;
          width: auto;
          padding: 0;
      }

        .content-window-card p {
            height: 2rem;
        }

        .custom-info {
            border: solid 1px silver;
        }

        div.info-top {
            position: relative;
            background: none repeat scroll 0 0 #F9F9F9;
            border-bottom: 1px solid #CCC;
            border-radius: 5px 5px 0 0;
        }

        div.info-top div {
            display: inline-block;
            color: #333333;
            font-size: 14px;
            font-weight: bold;
            line-height: 31px;
            padding: 0 10px;
        }

        div.info-top img {
            position: absolute;
            top: 10px;
            right: 10px;
            transition-duration: 0.25s;
        }

        div.info-top img:hover {
            box-shadow: 0px 0px 5px #000;
        }

        div.info-middle {
            font-size: 12px;
            padding: 10px 6px;
            line-height: 20px;
        }

        div.info-bottom {
            height: 0px;
            width: 100%;
            clear: both;
            text-align: center;
        }

        div.info-bottom img {
            position: relative;
            z-index: 104;
        }

        span {
            margin-left: 5px;
            font-size: 11px;
        }

        .info-middle img {
            float: left;
            margin-right: 6px;
        }
</style>