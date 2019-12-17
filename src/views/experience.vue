<!-- experience -->
<template>
    <div class="experience-container">

        <div v-if="List.length == 0" class="empty-div">
            <p><img :src="emptyPic" alt=""></p>
            <p>暂无心得</p>
        </div>

        <div v-if="List.length != 0" class="experience-content">
            <div class="experience-post" @click="handlePostExperience">
                <img :src="postExperience" alt="发表心得">
            </div>
            <div class="experience-item" v-for="(item,index) in List" :key="index" @click="handleGetExperienceDetail(item)">
                <div class="experience-img">
                    <img :src="item.headImage == null ? defaultPic : item.headImage" alt="头像">
                    <div style="display: flex;
                        flex-flow: column;
                        justify-content: center;"
                    >
                        <p class="experience-name">{{item.name}}</p>
                        <p class="experience-title">{{item.title}}</p>
                    </div>
                </div>
                <div class="experience-detail">
                    <div class="experience-detail-div">
                        <p class="experience-detail-content">{{item.content}}</p>
                    </div>
                    <p class="experience-handleLike" >
                        <span><img :src="likePic" alt="赞同">{{item.likeNum | likeNum}}</span>
                        <span><img :src="unLikePic" alt="不同意">{{item.unlikeNum | likeNum}}</span>
                    </p>
                </div>
            </div>
        </div>
        <!-- 发表心得 -->
        <mt-popup
                v-model="popupVisible"
                :closeOnClickModal=false
                popup-transition="popup-fade">
                <div>
                    <mt-field label="标题" placeholder="请输入标题" :attr="{ maxlength: 25 }" v-model="postTitle"></mt-field>
                    <mt-field label="详细内容" placeholder="请输入详细内容" :attr="{ maxlength: 500 }" type="textarea" rows="8" v-model="postContent"></mt-field>
                    <div class="popup-button">
                        <mt-button  type="primary" @click.native="actionPostExperience">确定</mt-button>
                        <mt-button  plain @click.native="handleCancel">取消</mt-button>
                    </div>
                </div>
        </mt-popup>

        <!-- 心得详情心得 -->
        <mt-popup
            v-model="detailVisible"
            position="bottom"
            :closeOnClickModal=false>
            <div class="experienceDetail">
                
                <div class="experienceDetail-close" @click="cancelExperienceDetail">
                    <img :src=closePic alt="关闭">
                </div>
                <div class="experienceDetail-content">
                    <div class="experience-content">
                        <div class="experience-item experienceDetail-item">
                            <div class="experience-img">
                                <img :src="tempCommData.headImage == null ? defaultPic : tempCommData.headImage" alt="头像">
                                <div style="display: flex;
                                    flex-flow: column;
                                    justify-content: center;"
                                >
                                    <p class="experience-name">{{tempCommData.name}}</p>
                                    <p class="experience-title">{{tempCommData.title}}</p>
                                </div>
                            </div>
                            <div class="experience-detail">
                                <div class="experience-detail-div">
                                    <p class="experience-detail-content">{{detailData.content}}</p>
                                </div>
                                <p class="experienceDetail-time">{{detailData.createTime | dateFormat}}</p>
                                <p class="experience-handleLike" >
                                    <span><img :src="likePic" alt="赞同">{{detailData.likeNum | likeNum}}</span>
                                    <span><img :src="unLikePic" alt="不同意">{{detailData.unlikeNum | likeNum}}</span>
                                </p>
                            </div>
                        </div>
                        <div v-if="detailData.result && detailData.result.length == 0" style="margin-top: 100px;">
                            <div class="empty-div" style="height: auto;">
                                <p><img :src="emptyPic" alt="暂无回复"></p>
                                <p>--暂无回复--</p>

                            </div>
                        </div>
                        <div v-else>
                            <div class="experienceDetail-response">
                                <div class="experienceDetail-response-item" v-for="(detailItem,detailIndex) in detailData.result" :key="detailIndex">
                                    <div class="experience-img">
                                        <img :src="detailItem.headImage == null ? defaultPic : detailItem.headImage" alt="头像">
                                        <div style="display: flex;
                                            flex-flow: column;
                                            justify-content: center;"
                                        >
                                            <p class="experience-name">{{detailItem.name}}</p>
                                        </div>
                                    </div>
                                    <div class="experience-detail">
                                        <div class="experience-detail-div">
                                            <p class="experience-detail-content">{{detailItem.content}}</p>
                                        </div>
                                        <p class="experienceDetail-time">{{detailItem.createTime | dateFormat}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </mt-popup>
        <LbsNav propSelected="experience"></LbsNav>
    </div>
</template>

<script>

import {getExperienceHome,getExperienceDetail,postExperience} from '@/api/getData'
import { async } from 'q'
import { Cell,Indicator,MessageBox} from 'mint-ui';
import moment from 'moment'
import LbsNav from '@/components/nav'
import {showError,showSuccess,compressImage,canvasToBlob} from '@/utils/common'
export default {
  name: 'popularMsg',
  components: {Cell,LbsNav},
  data(){
    return{
        tempCommData:{},
        detailVisible:false,
        popupVisible:false,
        postTitle:'',
        postContent:'',
        List:[],    
        detailData:{},
        closePic:require('@/assets/close.png'),
        defaultPic:require('@/assets/defaultPic.png'),
        clickPic: require('@/assets/clickPic.png'),
        emptyPic: require('@/assets/emptyPic.png'),
        likePic:require('@/assets/likePic.png'),
        unLikePic:require('@/assets/unLikePic.png'),
        postExperience:require('@/assets/postExperience.png'),
        emptyPic: require('@/assets/emptyPic.png'),
        token:''
    }
  },
  created() {
      this.token = this.$store.state.token || ''
      if(this.token != ''){
        this.handleGetExperienceHome()
      }
  },
  mounted () {

  },
  filters:{
      likeNum:function(value){
        if (!value) return '0'
        let intPart = Number(value).toFixed(0) // 获取整数部分
        let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
        return intPartFormat
      },
      dateFormat:function(value){
        return moment(value).format("- YYYY-MM-DD HH:mm")
      }
  },
  methods:{
    cancelExperienceDetail(){
        this.detailVisible = false
    },
    handleCancel(){
      this.popupVisible = false
    },
    //触发发表心得
    handlePostExperience(){
        this.popupVisible = true
    },
    async actionPostExperience(){
        if(this.postTitle.trim() == '' || this.postContent.trim() == ''){
          showError('请填写完整！')
          return
        }
        Indicator.open();
        try {
            let res = await postExperience(this.postTitle, this.postContent)
            if(res.status === 200){
                showSuccess('发表成功')
                this.popupVisible = false
                this.handleGetExperienceHome()
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },
    //获取心得列表
    async handleGetExperienceHome(){
        Indicator.open();
        try {
            let res = await getExperienceHome()
            if(res.status === 200){
                showSuccess('')
                let data = []
                 res.result.map((item) => {
                    data.push({...item})
                })
                res.result.map((item) => {
                    data.push({...item})
                })

                res.result.map((item) => {
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
    //获取心得详情
    async handleGetExperienceDetail(data){
        Indicator.open();
        try {
            let res = await getExperienceDetail(data.commId)
            if(res.status === 200){
                showSuccess('')
                this.detailData = res
                this.tempCommData = data
                this.detailVisible = true
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

.experience-content{
    height: calc(100vh - 50px);
    overflow-y: auto;
}
.experience-post{
    position: fixed;
    right: 20px;
    bottom: 100px;
    display: flex;
    width: 55px;
    height: 55px;
    align-items: center;
    justify-content: center;
   box-shadow: 2px 3px 8px #888888;
    background-color: white;
    border-radius: 50%;
    
}
.experience-post>img{
    width: 40px;
    height: 40px;
}
.experience-item{
    display: flex;
    flex-flow: column;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    box-sizing: content-box;
    box-shadow: 0px 3px 7px -1px #888888;
    margin-bottom: 15px;
}
.experience-img{
    display: flex;
    border-bottom: 1px solid #eae4e4;
}
.experience-img>img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 10px;
    box-shadow: 2px 3px 8px #888888;
}


.experience-detail{
    padding: 5px;
}
.experience-name{
    font-size: 14px;
}
.experience-title{
    font-size: 18px;
    font-weight: bold;
    /* margin: 7px 0; */
     overflow: hidden;  
      display: -webkit-box;  
     -webkit-line-clamp: 1;

      -webkit-box-orient: vertical; 
}
.experience-detail-div{
    padding: 5px 3px;
}
.experience-detail-content{
    font-size: 15px;
    text-align: justify;

     overflow: hidden;  
      display: -webkit-box;  
     -webkit-line-clamp: 4;

      -webkit-box-orient: vertical; 
}
.experience-handleLike{
    font-size: 15px;
    display: flex;
    margin-top: 20px;
}
.experience-handleLike span{
    align-items: center;
    display: flex;
        margin: 0 5px;
}
.experience-handleLike img{
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.experience-button-address{
    display: flex;
    align-items: center;
}
.experience-click-image{
    width: 20px;
    height: 20px;
    margin-right: 5px;
}
.experienceDetail{
    
}
.experienceDetail-content{
    width: 100%;
    min-height: 100vh;
    background-color: #FFFFFF;
    border-radius: 20px 20px 0;
}
.experienceDetail-close{
    position: fixed;
    top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid#cccbcb;
    width: 100%;
}

.experienceDetail-item{
    margin-top: 45px;
}
.experienceDetail-close>img{
    margin-left: 10px;
    width: 25px;
    height: 25px;
}
.experienceDetail-time{
     font-size: 15px;
}
</style>