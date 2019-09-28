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
        let marker = new AMap.Marker({
            icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
            position: this.map.getCenter(),
            content: this.returnContent(),
            offset: new AMap.Pixel(-26, -55),
            title:this.titleIndex++
        });

          //标记点击事件
          // marker.off('click', this.showInfoM());
        marker.setMap(this.map);
        marker.on('click', function(e){alert('e',e);console.log('e',e)});

      
        
        console.log('sdsd0',this.map.getCenter())
    },
    returnContent(){
      return `<div  class="custom-content-marker"> 
        <img src="https://upload.jianshu.io/users/upload_avatars/1758676/fa0d96a7c0c6.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/180/h/180" alt="">
        </div>`;
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
</style>