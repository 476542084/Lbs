<!-- home -->
<template>
  <div class="home">
    <div class="user">
      <img src="@/assets/user.png" alt="">
      <!-- <i class="mint-toast-icon mintui mintui-search"></i> -->
    </div>
    <div class="user">
      <!-- <img src="@/assets/user.png" alt=""> -->
      <button @click="getMypostion()">获取当前经纬度</button>
      <button @click="addMarker()">定位</button>
    </div>
    <div class="center-icon">
      <img src="@/assets/position.png" alt="">
    </div>
    <div id="container" style="width:100%;height:600px">
    </div>
  </div>
</template>

<script>

import AMap from 'AMap';

export default {
  name: 'home',
  components: {},
  data(){
    return{
      map: null,
      isGeolocation:false,
      myLng:100,
      myLat:22,
      titleIndex:0
    }
  },
  created() {
   
  },
  mounted () {

    this.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 16
      })  

     //缩放
     this.map.addControl(new AMap.ToolBar({
            // 简易缩放模式，默认为 false
            liteStyle: true
          }));


    this.init()
    document.querySelector('#container').style.height = (document.documentElement.clientHeight || document.body.clientHeight) + 'px'
    
  },
  methods:{
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
    addMarker() {
      let that = this;
      // that.map.clearMap();
        //创建icon
        var icon = new AMap.Icon({
              size: new AMap.Size(40, 40),
              image: 'https://upload.jianshu.io/users/upload_avatars/1758676/fa0d96a7c0c6.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/180/h/180',
              imageSize: new AMap.Size(40, 40) 
        });

        //实例化信息窗体
        let title = '方恒假日酒店<span style="font-size:11px;color:#F00;">价格:318</span>',
            content = [];
        content.push("<img src='https://upload.jianshu.io/users/upload_avatars/1758676/fa0d96a7c0c6.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/180/h/180'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
        content.push("电话：010-64733333");
        content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
        let infoWindow = new AMap.InfoWindow({
            isCustom: true,  //使用自定义窗体
            content: that.createInfoWindow(title, content.join("<br/>")),
            offset: new AMap.Pixel(16, -45)
        });


        let marker = new AMap.Marker({
            icon: icon,
            position: that.map.getCenter(),
            map:that.map,
            offset: new AMap.Pixel(-26, -55),
        });


          //标记点击事件
          // marker.off('click', this.showInfoM());
        // marker.setMap(this.map);
        // marker.on('click', function(e){alert('e',e);console.log('e',e)});

        // console.log('sdsd0',this.map.getCenter())

        //鼠标点击marker弹出自定义的信息窗体
    AMap.event.addListener(marker, 'click', function () {
        infoWindow.open(that.map, marker.getPosition());
    });


    },
    //构建自定义信息窗体
    createInfoWindow(title, content) {
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
        return info;
    },

  //关闭信息窗体
  closeInfoWindow() {
      this.map.clearInfoWindow();
  },

    showInfoM(e){
      console.log('e',e)
      // alert(e);
    },
    getMypostion(){
      alert(`lat:${this.myLat},lng:${this.myLng}`)
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
  z-index: 999;
}
.center-icon img{
  width: 40px;
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