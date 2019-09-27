<!-- home -->
<template>
  <div class="home">
    <div class="user">
      <img src="@/assets/user.png" alt="">
      <i class="mint-toast-icon mintui mintui-search"></i>
    </div>
    <div class="user">
      <img src="@/assets/user.png" alt="">
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
      test:'dd'
    }
  },
  mounted () {
    this.init()
    document.querySelector('#container').style.height = (document.documentElement.clientHeight || document.body.clientHeight) + 'px'
  },
  methods:{
    init () {
      let map = new AMap.Map('container', {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 16
      })  

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
          map.addControl(geolocation);
          geolocation.getCurrentPosition()

          //缩放
          map.addControl(new AMap.ToolBar({
            // 简易缩放模式，默认为 false
            liteStyle: true
        }));
      });
    }
  }
}
</script>

<style>
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
</style>