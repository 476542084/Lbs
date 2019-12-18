<!-- home -->
<template>
  <div>
    <!-- <div>
        <mt-header fixed title="基于lbs社交"></mt-header>
    </div> -->
    <div >
        <div v-if="token == ''" class="empty-div">
            <p><img :src="emptyPic" alt=""></p>
            <p>请登录！</p>
        </div>
        <div v-if="token != ''" class="home" >
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
                    <div class="popup-diy-title"><p>标注内容</p></div>
                    <mt-field  placeholder="请输入标题" :attr="{ maxlength: 25 }" v-model="title"></mt-field>
                    <mt-field  placeholder="请输入详细内容" :attr="{ maxlength: 160 }" type="textarea" rows="6" v-model="content"></mt-field>
                    <div class="popup-button">
                    <mt-button  type="primary" @click.native="actionAddMarker">确定</mt-button>
                    <mt-button  plain @click.native="handleCancel">取消</mt-button>
                    </div>
                </div>
            </mt-popup>
            <div id="container" style="width:100%;height:600px">
            </div>
        </div>
    </div>
   <LbsNav propSelected="home"></LbsNav>
  </div>
</template>

<script>

import AMap from 'AMap';
import {getMobileHome,publicMessage,getMarkDetail,attention,cancelAttention,publicPopularMsg} from '@/api/getData'
import {showError,showSuccess} from '@/utils/common'
import moment from 'moment'
import LbsNav from '@/components/nav'
import { Cell,Indicator,MessageBox,Popup,Field} from 'mint-ui';
import { async } from 'q';
export default {
  name: 'home',
  components: {LbsNav},
  data(){
    return{
      e: null,
      buttonType:{
        0:{class:'button-default',text:'推广'},
        1:{class:'button-complete',text:'已推广'},
        2:{class:'button-reject',text:'推广被拒'},
        3:{class:'button-wait',text:'推广审核中'},
      },
      emptyPic: require('@/assets/emptyPic.png'),
      localAddress: require('@/static/images/localAddress.png'),
      defaultPic: require('@/assets/defaultPic.png'),
      closePic: require('@/static/images/close.gif'),
      sharpPic: require('@/static/images/sharp.png'),
      infoWindow:'',
      title:'',
      content:'',
      popupVisible:false,
      userPic: require('@/assets/defaultPic.png'),
      token:this.$store.state.token,
      map: null,
      isGeolocation:false,
    }
  },
  created() {
   this.token = this.$store.state.token
//    if(this.token != ''){
       
//    }
  },
  mounted () {
    if(this.token == ''){
        return
    }
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
    if(this.token != ''){
    document.querySelector('#container').style.height = (document.documentElement.clientHeight || document.body.clientHeight) + 'px'

    }

    //获取所有标注信息
    if(this.token !== ''){
          this.handleGetMobileHome()
    }

    console.log('this.$store',this.$store)
    //获取头像
    // if(this.$store.state.userInfo.headImage && this.$store.state.userInfo.headImage !== null){
    //   this.userPic = this.$store.state.userInfo.headImage
    // }
    
  },
  methods:{
    async handleGetMobileHome(){
        Indicator.open();
        try {
          let res = await getMobileHome()
          if(res.status === 200){
           
            if(res.result.length > 0){
              let data = []
              res.result.map((resItem) => {
                data.push(resItem.lng)
                data.push(resItem.lat)
                this.addMarker(data,resItem)
                data.length = 0
              })
               showSuccess('')
            }
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
        MessageBox.confirm('确定标注该位置吗？').then(action => {
            if(action == 'confirm'){
                this.popupVisible = true
            }
        });
    },
    handleCancel(){
      this.popupVisible = false
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
            let title = `${res.markDetail.title}<span>(${res.markDetail.selfStatus ? '自己' : res.markDetail.name})</span>`,
            content = [];
            content.push(res.markDetail.content);
            content.push('-' + moment(res.createTime).format("YYYY-MM-DD HH:mm"))
            var infoWindow = new AMap.InfoWindow({ 
              isCustom: true,  //使用自定义窗体
              content: that.initInfoWindow(title, content.join("<br/><br/>"),res.markDetail),
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
      Indicator.open();
      let that = this;
      let options = {
      'showButton': true,//是否显示定位按钮
      'buttonPosition': 'LB',//定位按钮的位置
      /* LT LB RT RB */
      'buttonOffset': new AMap.Pixel(10, 20),//定位按钮距离对应角落的距离
      'showMarker': true,//是否显示定位点
      'markerOptions':{//自定义定位点样式，同Marker的Options
        'offset': new AMap.Pixel(-18, -36),
        'content':`<img src=${this.localAddress} style="width:36px;height:36px"/>`
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
              showSuccess('')
              that.showLocationMsg(result)
            }else{
              showError(result)
              that.showLocationMsg(result)
            }
          });
      });
    

    },
    showLocationMsg(data){
      console.log('data',data)
     
      if(data.message == "Geolocation permission denied."){
         showError('定位失败，请允许')
        navigator.geolocation.getCurrentPosition(this.showPosition(),this.showError());
      }
      if(data.info == 'SUCCESS'){
        console.log('position',data.position);
        showSuccess('')
      }
    },
// 实例化点标记 
    addMarker(item = [],data = {headImage:null}) {
      let that = this;
        //创建icon
        var icon = new AMap.Icon({
              size: new AMap.Size(40, 40),
              image: data.headImage == null ? that.defaultPic : data.headImage,
              imageSize: new AMap.Size(40, 40) 
        });

        //实例化信息窗体  
        let title = 'title',
            content = [];
            content.push('');
        let marker = new AMap.Marker({
            icon: icon,
            position: item.length == 0 ? that.map.getCenter() : item,
            map:that.map,
            offset: new AMap.Pixel(-26, -55),
        });
        //鼠标点击marker弹出自定义的信息窗体
        marker.markId = data.markId
        marker.on('click',this.mclick);
    },
    mclick(e){
      this.e = e
      console.log('ee',e)
      this.handleGetMarkDetail(e)
    },

    //构建自定义信息窗体
    initInfoWindow(title,content,data){

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
        closeX.src = this.closePic;
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
        let rightFlag = document.createElement('button');

        //其他人
        if(!data.selfStatus){
          if(data.attentionStatus){
            //已经关注
            leftFlag.className = 'button-cancel'
            leftFlag.innerHTML='取消关注'
            leftFlag.onclick = this.handleCancelAttention.bind(this,data)
          }else{
            //未关注
            leftFlag.className = 'button-default'
            leftFlag.innerHTML ='关注'
            leftFlag.onclick = this.handleAttention.bind(this,data)
          }

          if(data.status == 1){
            rightFlag.className = 'button-complete'
            rightFlag.innerHTML='已推广'
          }else{
             rightFlag.className = 'button-reject'
             rightFlag.innerHTML='未推广'
          }
          
          flag.appendChild(leftFlag)
          flag.appendChild(rightFlag)
        }else{
          //自己
          let buttonType = {...this.buttonType}
          if(data.status == 0){
            rightFlag.onclick = this.handlePublicPopularMsg.bind(this,data.markId)
          }
          rightFlag.className = buttonType[`${data.status}`]['class']
          rightFlag.innerHTML= buttonType[`${data.status}`]['text']
          flag.appendChild(rightFlag)
        }

        info.appendChild(flag);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = this.sharpPic;
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
    },
    //关闭信息窗体
    closeInfoWindow() {
        this.map.clearInfoWindow();
    },
    //关注
    async handleAttention(data) {
        if(!data.selfStatus){
            Indicator.open();
            try {
                let res = await attention(data.userId)
                if(res.status === 200){
                    showSuccess('关注成功！')
                    this.closeInfoWindow()
                    this.handleGetMarkDetail(this.e)
                }else{
                    showError(res.msg||res.error)
                }
            } catch (error) {
            showError('网络错误，请稍后重试！')
            }
        }else{
            showError('不能关注自己！')
            return
        }
    },
    //取消关注
    async handleCancelAttention(data) {
        if(!data.selfStatus){
            Indicator.open();
            try {
                let res = await cancelAttention(data.userId)
                if(res.status === 200){
                    showSuccess('已取消关注!')
                this.closeInfoWindow()
                    this.handleGetMarkDetail(this.e)
                }else{
                    showError(res.msg||res.error)
                }
            } catch (error) {
            showError('网络错误，请稍后重试！')
            }
        }else{
            return
        }
    },
    //发布推广
    async handlePublicPopularMsg(markId){
            Indicator.open();
            try {
                let res = await publicPopularMsg(markId)
                if(res.status === 200){
                    showSuccess('已申请推广!')
                    this.closeInfoWindow()
                    this.handleGetMarkDetail(this.e)
                }else{
                    showError(res.msg||res.error)
                }
            } catch (error) {
            showError('网络错误，请稍后重试！')
            }
    },

    //定位事件
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
              width: 60vw;
            border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
            box-sizing: content-box;
            box-shadow: 2px 3px 8px #888888;
        }
        div.info-button{
          display: flex;
          padding: 0 8px 5px;
          margin: 0 auto;
          justify-content: space-between;
        }
        div.info-button button{
          font-size: 16px;
          padding: 6px 15px;
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
          border-radius: 5px;
        }
        div.info-button .button-default{
          background-color: #409eff;
          border-color: #409eff;
        }
        div.info-button .button-complete{
          background-color: #b3e19d;
          border-color: #b3e19d;
        }
        div.info-button .button-reject{
          background-color: #fab6b6;
          border-color: #fab6b6;
        }
        div.info-button .button-wait{
          background-color: #c8c9cc;
          border-color: #c8c9cc;
        }

        div.info-button .button-cancel{
          background-color: #f56c6c;
          border-color:#f56c6c;
        }

        div.info-top {
            position: relative;
            background: none repeat scroll 0 0 #F9F9F9;
            border-bottom: 1px solid #ebebeb;
            border-radius: 3px 3px 0 0;
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
            padding: 10px 10px;
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