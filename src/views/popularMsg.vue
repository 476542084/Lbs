<!-- popularMsg -->
<template>
    <div class="popularMsg-container">
        <div class="popularMsg-content">
            <div class="popularMsg-item" v-for="(item,index) in List" :key="index">
                <div class="popularMsg-img">
                    <img :src="item.headImage" alt="头像">
                </div>
                <div class="popularMsg-detail">
                    <p class="popularMsg-name">{{item.name}}</p>
                    <p class="popularMsg-title">{{item.title}}</p>
                    <p class="popularMsg-detail-content">{{item.content}}</p>
                    <p class="popularMsg-time">{{item.createTime | dateFormat}}</p>
                    <button class="popularMsg-button-address" v-if="item.showAddress == ''" @click="haneleGetAmapAddress(item.lat,item.lng,index)" ><span><img class="popularMsg-click-image" :src="clickPic" alt=""></span>获取具体地址</button>
                    <p class="popularMsg-address" v-else >地点:{{item.showAddress}}</p>
                </div>
            </div>
        </div>
        
        
        <LbsNav propSelected="popularMsg"></LbsNav>
    </div>
</template>

<script>

import {getPopularMsg,getAmapAddress} from '@/api/getData'
import { async } from 'q'
import { Cell,Indicator,MessageBox } from 'mint-ui';
import moment from 'moment'
import LbsNav from '@/components/nav'
import {showError,showSuccess,compressImage,canvasToBlob} from '@/utils/common'
export default {
  name: 'popularMsg',
  components: {Cell,LbsNav},
  data(){
    return{
        List:[],    
        clickPic: require('@/assets/clickPic.png'),
        token:this.$store.state.token
    }
  },
  created() {
   this.handleGetUserMsg()
  },
  mounted () {

  },
  filters:{
      dateFormat:function(value){
            return moment(value).format("- YYYY-MM-DD HH:mm")
      }
  },
  methods:{
    async haneleGetAmapAddress(lat,lng,index){
        Indicator.open();
        try {
            let res = await getAmapAddress(lat, lng)
            if(res.infocode == '10000'){
                showSuccess('')
                this.List[index]['showAddress'] = res.regeocode.formatted_address
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }

    },
    async handleGetUserMsg(){
        Indicator.open();
        try {
            let res = await getPopularMsg()
            if(res.status === 200){
                showSuccess('')
                let data = []
                 res.result.map((item) => {
                    item.showAddress = ''
                    data.push({...item})
                })
                this.List = data
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },
  }
}
</script>

<style scoped>
.popularMsg-content{
        padding-bottom: 100px;
}
.popularMsg-item{
    display: flex;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    box-sizing: content-box;
    box-shadow: 0px 3px 7px -1px #888888;
    margin-bottom: 15px;
}

.popularMsg-img>img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 10px;
    box-shadow: 2px 3px 8px #888888;
}


.popularMsg-detail{
    padding: 5px;
}
.popularMsg-name{
    font-size: 14px;
}
.popularMsg-title{
    font-size: 18px;
    font-weight: bold;
    margin: 7px 0;
}
.popularMsg-detail-content{
    font-size: 15px;
    text-align: justify;
}
.popularMsg-time,.popularMsg-address{
    font-size: 15px;
    
}
.popularMsg-time{
    margin: 3px 0 8px;
}
.popularMsg-button-address{
    display: flex;
    align-items: center;
}
.popularMsg-click-image{
    width: 20px;
    height: 20px;
    margin-right: 5px;
}
</style>