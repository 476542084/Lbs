<!-- popularMsg -->
<template>
    <div class="popularMsg-container">

        <div v-if="List.length == 0" class="empty-div">
            <p><img :src="emptyPic" alt=""></p>
            <p>暂无推广</p>
        </div>

        <div v-if="List.length != 0" class="popularMsg-content" :style="{height:(markList != undefined ? 'calc(100vh - 100px)':'calc(100vh - 60px)')}">
            <div class="popularMsg-item" v-for="(item,index) in List" :key="index" >
                <div class="popularMsg-img">
                    <img :src="item.headImage" alt="头像">
                    <div style="display: flex;
                        flex-flow: column;
                        justify-content: center;"
                    >
                        <p class="popularMsg-name">{{item.name}}</p>
                        <p class="popularMsg-title">{{item.title}}</p>
                    </div>
                </div>
                <div class="popularMsg-detail">
                    <div class="popularMsg-detail-div">
                        <p class="popularMsg-detail-content">{{item.content}}</p>
                    </div>
                  
                    <p class="popularMsg-time">{{item.createTime | dateFormat}}</p>
                    <p class="popularMsg-address" >地点:{{item.address == '[]' ? '[地址异常]' : item.address}}</p>
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
  name: 'PopularMsg',
  components: {Cell,LbsNav},
  props:{markList:Array},
  data(){
    return{
        List:[],    
        clickPic: require('@/assets/clickPic.png'),
        emptyPic: require('@/assets/emptyPic.png'),
        token:'',
        tempData:[]
    }
  },
  created() {
      this.token = this.$store.state.token
      if(this.markList != undefined){
        showSuccess('')
        let data = []
        let res = [...this.markList]
        res.map((item) => {
            if(item != null){
                item['showAddress']  = ''
                data.push({...item})
            }
        })
        this.List = data
      }else{
        if(this.token != ''){
            this.handleGetUserMsg()
        }
      }
  },
  mounted () {
    
  },
  filters:{
      dateFormat:function(value){
        return moment(value).format("YYYY/MM/DD HH:mm")
      }
  },
  methods:{
    // async haneleGetAmapAddress(lat,lng,index,address){
    //     if(address != '') return
    //     Indicator.open();
    //     try {
    //         let res = await getAmapAddress(lat, lng)
    //         if(res.infocode == '10000'){
    //             showSuccess('')
    //             this.List[index]['showAddress'] = res.regeocode.formatted_address
    //         }else{
    //             showError(res.msg||res.error)
    //         }
    //     } catch (error) {
    //          showError('网络错误，请稍后重试！')
    //     }

    // },
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
    height: calc(100vh - 60px);
    overflow-y: auto;
}
.popularMsg-item{
    display: flex;
    flex-flow: column;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    box-sizing: content-box;
    box-shadow: 0px 3px 7px -1px #888888;
    margin-bottom: 15px;
}
.popularMsg-img{
    display: flex;
    border-bottom: 1px solid #eae4e4;
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
    /* margin: 7px 0; */
     overflow: hidden;  
      display: -webkit-box;  
     -webkit-line-clamp: 1;

      -webkit-box-orient: vertical; 
}
.popularMsg-detail-div{
    /* box-shadow: 6px 5px 5px -4px #e5e3e3; */
    /* border: 1px solid #e5e3e3; */
    padding: 5px 3px;
    /* border-radius: 3px; */
}
.popularMsg-detail-content{
    font-size: 15px;
    text-align: justify;

     overflow: hidden;  
      display: -webkit-box;  
     -webkit-line-clamp: 4;

      -webkit-box-orient: vertical; 
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