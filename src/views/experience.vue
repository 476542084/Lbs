<!-- experience -->
<template>
    <div class="experience-container">

        <div v-if="List.length == 0" class="empty-div">
            <p><img :src="emptyPic" alt=""></p>
            <p>暂无心得</p>
        </div>

        <div v-if="List.length != 0" class="experience-content" :style="{height:(commList != undefined ? 'calc(100vh - 100px)':'calc(100vh - 50px)')}">
            <div v-if="showPostExperience" class="experience-post" @click="handlePostExperience">
                <img :src="postExperience" alt="发表心得">
            </div>
            <div class="experience-item" v-for="(item,index) in List" :key="index" >
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
                    <div class="experience-detail-div" @click="handleGetExperienceDetail(item)">
                        <p class="experience-detail-content">{{item.content}}</p>
                        <img v-if="item.image != null" :src=item.image alt="心得图片缩略" class="experience-content-image-small">
                    </div>
                    <p class="experience-handleLike" >
                        <span v-if="item.operateStatus == null" @click="handleLikeOrHate(0,item.commId,0,index,item.operateStatus)"><img :src="likePic" alt="赞同">{{item.likeNum | likeNum}}</span>
                        <span v-if="item.operateStatus == null" @click="handleLikeOrHate(1,item.commId,0,index,item.operateStatus)"><img :src="unLikePic" alt="不同意">{{item.unlikeNum | likeNum}}</span>

                        <span v-if="item.operateStatus == 0" @click="handleCancelLikeOrHate(-1,item.commId,0,index,item.operateStatus)"><img :src="likeActivePic" alt="赞同">{{item.likeNum | likeNum}}</span>
                        <span v-if="item.operateStatus == 0" @click="handleCancelLikeOrHate(-1,item.commId,0,index,item.operateStatus,'second')"><img :src="unLikePic" alt="不同意">{{item.unlikeNum | likeNum}}</span>

                        <span v-if="item.operateStatus == 1" @click="handleCancelLikeOrHate(-1,item.commId,0,index,item.operateStatus,'second')"><img :src="likePic" alt="赞同">{{item.likeNum | likeNum}}</span>
                        <span v-if="item.operateStatus == 1" @click="handleCancelLikeOrHate(-1,item.commId,0,index,item.operateStatus)"><img :src="unLikeActivePic" alt="不同意">{{item.unlikeNum | likeNum}}</span>

                        <span ><img :src="responseNumPic" alt="评论数">{{(item.replyCount == undefined ? 0 : item.replyCount) | likeNum}}</span>
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
                    <div class="popup-diy-title"><p>发表心得</p></div>
                    <mt-field  placeholder="请输入标题" :attr="{ maxlength: 25 }" v-model="postTitle" style="font-weight:300;"></mt-field>
                    <mt-field  placeholder="请输入详细内容" :attr="{ maxlength: 500 }" type="textarea" style="border:1px solid #cccbcb" rows="8" v-model="postContent"></mt-field>
                    <img :src="addUploadPic" class="addUploadPic" @click="uploadFile" alt="添加图片">
                    <input type="file" style="display:none" ref="uploadFile" @change="getFile" accept="image/png,image/jpeg,image/jpg">

                    <div class="popup-button">
                        <mt-button  type="primary" @click.native="actionPostExperience">确定</mt-button>
                        <mt-button  plain @click.native="handleCancel">取消</mt-button>
                    </div>
                </div>
        </mt-popup>

        <!-- 回复心得 -->
        <mt-popup
            v-model="responseVisible"
            :closeOnClickModal=false
            popup-transition="popup-fade">
            <div>
                <div class="popup-diy-title"><p>回复心得</p></div>
                <mt-field  placeholder="请输入详细内容" :attr="{ maxlength: 160 }" type="textarea" rows="3" v-model="responseText"></mt-field>
                <div class="popup-button">
                    <mt-button  type="primary" @click.native="actionResponse">确定</mt-button>
                    <mt-button  plain @click.native="handleCancelResponse">取消</mt-button>
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
                    <div class="experience-content experienceDetail-content">
                        <div class="experience-item experienceDetail-item">
                            <p class="experience-title experienceDetail-title">{{tempCommData.title}}</p>

                            <div class="experience-img experienceDetail-img">
                                <img :src="tempCommData.headImage == null ? defaultPic : tempCommData.headImage" alt="头像">
                                <div style="display: flex;
                                    flex-flow: column;
                                    justify-content: center;"
                                >
                                    <p class="experience-name">{{tempCommData.name}}</p>
                                </div>
                            </div>
                            <div class="experience-detail">
                                <div class="experience-detail-div" style="text-align: center;">
                                    <p class="experience-detail-content experienceDetail-detail-content">{{detailData.content}}</p>
                                    <img v-if="detailData.image != null" :src=detailData.image alt="心得图片" class="experience-content-image-large">
                                </div>
                                <p class="experienceDetail-time">{{detailData.createTime | dateFormat}}</p>
                                <p class="experience-handleLike experienceDetail-handleLike" >
                                    <span>{{detailData.likeNum | likeNum}}&#32;赞同</span><span>·</span>
                                    <span>{{detailData.unlikeNum | likeNum}}&#32;反对</span><span>·</span>
                                    <span>{{(detailData.count && detailData.count) | likeNum}}&#32;评论</span>
                                </p>
                            </div>
                        </div>
                        <div v-if="detailData.result && detailData.result.length == 0" >
                            <div class="empty-div" style="height: auto;">
                                <p><img :src="emptyPic" alt="暂无回复"></p>
                                <p>--暂无回复--</p>
                            </div>
                        </div>
                        <div v-else style=" margin-left: 1rem;">
                            <div class="experienceDetail-response">
                                <div class="experienceDetail-response-item" v-for="(detailItem,detailIndex) in detailData.result" :key="detailIndex">
                                    <div class="experience-img experienceDetail-img">
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
                                            <p class="experience-detail-content experienceDetail-detail-content">{{detailItem.content}}</p>
                                        </div>
                                        <div>
                                            <p class="experience-handleLike" >
                                                <span v-if="detailItem.operateStatus == null" @click="handleLikeOrHate(0,detailItem.replyId,1,detailIndex,detailItem.operateStatus)"><img :src="likePic" alt="赞同">{{detailItem.likeNum | likeNum}}</span>
                                                <span v-if="detailItem.operateStatus == null" @click="handleLikeOrHate(1,detailItem.replyId,1,detailIndex,detailItem.operateStatus)"><img :src="unLikePic" alt="不同意">{{detailItem.unlikeNum | likeNum}}</span>

                                                <span v-if="detailItem.operateStatus == 0" @click="handleCancelLikeOrHate(-1,detailItem.replyId,1,detailIndex,detailItem.operateStatus)"><img :src="likeActivePic" alt="赞同">{{detailItem.likeNum | likeNum}}</span>
                                                <span v-if="detailItem.operateStatus == 0" @click="handleCancelLikeOrHate(-1,detailItem.replyId,1,detailIndex,detailItem.operateStatus,'second')"><img :src="unLikePic" alt="不同意">{{detailItem.unlikeNum | likeNum}}</span>

                                                <span v-if="detailItem.operateStatus == 1" @click="handleCancelLikeOrHate(-1,detailItem.replyId,1,detailIndex,detailItem.operateStatus,'second')"><img :src="likePic" alt="赞同">{{detailItem.likeNum | likeNum}}</span>
                                                <span v-if="detailItem.operateStatus == 1" @click="handleCancelLikeOrHate(-1,detailItem.replyId,1,detailIndex,detailItem.operateStatus)"><img :src="unLikeActivePic" alt="不同意">{{detailItem.unlikeNum | likeNum}}</span>
                                            </p>
                                            <p class="experienceDetail-time">{{detailItem.createTime | dateFormat}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="experienceDetail-response-icon"  @click="handleResponseText">
                    <img style="width:35px;height:35px;" :src="responsePic" alt="回复心得">
                </div>
            </div>
        </mt-popup>
        <LbsNav propSelected="experience"></LbsNav>
    </div>
</template>

<script>

import {getExperienceHome,getExperienceDetail,postExperience,postExperienceWithPic,replyExperience,likeOrHate} from '@/api/getData'
import { async } from 'q'
import { Cell,Indicator,MessageBox} from 'mint-ui';
import moment from 'moment'
import LbsNav from '@/components/nav'
import {showError,showSuccess,compressImage,canvasToBlob,getObjectURL} from '@/utils/common'
export default {
  name: 'Experience',
  components: {Cell,LbsNav},
  props:{commList:Array},
  data(){
    return{
        showPostExperience:true,
        responseText:'',
        tempCommData:{},
        responseVisible:false,
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
        likeActivePic:require('@/assets/likeActivePic.png'),
        unLikePic:require('@/assets/unLikePic.png'),
        unLikeActivePic:require('@/assets/unLikeActivePic.png'),
        responseNumPic:require('@/assets/responseNumPic.png'),
        postExperience:require('@/assets/postExperience.png'),
        responsePic:require('@/assets/responsePic.png'),
        addUploadPic:require('@/assets/addUploadPic.png'),
        token:'',
        addUploadFile:null,
    }
  },
  created() {
      this.token = this.$store.state.token || ''
      if(this.commList != undefined){
        this.showPostExperience = false
        let data = []
        this.commList.map((item) => {
            data.push({...item})
         })
        this.List = data
      }else{
        if(this.token != ''){
            this.handleGetExperienceHome()
        }
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
        return moment(value).format("YYYY/MM/DD HH:mm")
      }
  },
  methods:{
    handleCancelResponse(){
        this.openTouch()
        this.responseVisible = false
    },
    handleResponseText(){
        this.closeTouch()
        this.responseText = ''
        this.responseVisible = true
    },
    cancelExperienceDetail(){
        this.openTouch()
        this.detailVisible = false
    },
    handleCancel(){
      this.popupVisible = false
    },
    //触发发表心得
    handlePostExperience(){
        this.postTitle = ''
        this.postContent = ''
        this.addUploadFile = null
        this.addUploadPic = require('@/assets/addUploadPic.png')

        this.popupVisible = true
    },
    
    //禁止body滑动
    closeTouch:function(){
        document.getElementsByTagName("body")[0].addEventListener('touchmove',
            this.handler,{passive:false});//阻止默认事件
    },
    //解除body滑动
    openTouch:function(){
        document.getElementsByTagName("body")[0].removeEventListener('touchmove',
            this.handler,{passive:false});//打开默认事件
    },
    //回复心得
    async actionResponse(){
        if(this.responseText.trim() == ''){
          showError('请填写完整！')
          return
        }
        Indicator.open();
        try {
            let res = await replyExperience(this.tempCommData.commId,this.responseText)
            if(res.status === 200){
                showSuccess('回复成功')
                // 回复成功同步心得列表评论数
                this.List.some((item,index) => {
                    if(item.commId == this.tempCommData.commId){
                        this.detailData.count += 1
                        this.List[index].replyCount += 1
                        return true
                    }
                })
                this.openTouch()
                this.responseVisible = false
                this.handleGetExperienceDetail(this.tempCommData)
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },
    //发表心得
    async actionPostExperience(){
        if(this.postTitle.trim() == '' || this.postContent.trim() == ''){
          showError('请填写完整！')
          return
        }
        Indicator.open();

        try {
            let res = null
            if(this.addUploadFile != null){
                res = await postExperienceWithPic(this.postTitle, this.postContent,this.addUploadFile)
            }else{
                res = await postExperience(this.postTitle, this.postContent)
            }
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
    //
    uploadFile(){
        this.$refs.uploadFile.dispatchEvent(new MouseEvent('click')) 
    },
    getFile(e){
        let that = this
        let beforeFile = e.currentTarget.files[0]
        this.addUploadPic = getObjectURL(beforeFile)

        compressImage(beforeFile , 1200, 1200, 1).then(canvasToBlob).then((afterFile) => {
            if(afterFile.size >= (1024*1024*3)){
                showError('图片太大了！')
                that.addUploadPic = require('@/assets/addUploadPic.png')
            }else{
                this.addUploadFile = afterFile
            }
            
        })  
        // return
        // console.log('')
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
                this.closeTouch()
                this.detailVisible = true

                //组件置顶
                this.$nextTick(()=>{
                    let ele = document.querySelectorAll('.experienceDetail-content')[1]
                    ele.scrollTop = 0
                })
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },
    // 点赞/踩
    async handleLikeOrHate(operateType, targetId, targetType, index, operateStatus, flag = 'first'){
        Indicator.open();
        try {
            let res = await likeOrHate(operateType, targetId, targetType)
            if(res.status === 200){
                showSuccess('')
                // debugger;
                if(targetType == 0){
                    this.List[index].operateStatus = operateType
                    if(operateType == 0){
                        this.List[index].likeNum += 1
                    }else{
                        this.List[index].unlikeNum += 1
                    }
                }else{
                    this.detailData['result'] && (this.detailData['result'][index].operateStatus = operateType)
                    if(operateType == 0){
                        this.detailData['result'] && (this.detailData['result'][index].likeNum += 1)
                    }else{
                        this.detailData['result'] && (this.detailData['result'][index].unlikeNum += 1)
                    }
                }
                
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },
    //取消点赞/踩
    async handleCancelLikeOrHate(operateType, targetId, targetType, index, operateStatus, flag = 'first'){
        Indicator.open();
        try {
            let res = await likeOrHate(operateType, targetId, targetType)
            if(res.status === 200){
                showSuccess('')
                // debugger;
                if(targetType == 0){
                    if(operateStatus == 0){
                        this.List[index].likeNum -= 1
                    }else{
                        this.List[index].unlikeNum -= 1
                    }
                }else{
                    if(operateStatus == 0){
                        this.detailData['result'] && (this.detailData['result'][index].likeNum -= 1)
                    }else{
                        this.detailData['result'] && (this.detailData['result'][index].unlikeNum -= 1)
                    }
                }
                
                if(flag == 'first'){
                    if(targetType == 0){
                        this.List[index].operateStatus = null
                    }else{
                        this.detailData['result'] && (this.detailData['result'][index].operateStatus = null)
                    }
                }else{
                    let tempStatus = operateStatus == 1 ? 0 : 1
                    this.handleLikeOrHate(tempStatus, targetId, targetType, index, null, flag)
                }
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    }
  }
}
</script>

<style scoped>

.experience-content{
    height: calc(100vh - 50px);
    overflow-y: auto;
}

.experience-post,.experienceDetail-response-icon{
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
.experience-post>img,.experienceDetail-response-icon>img{
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
.experience-img>img,.addUploadPic{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 10px;
    box-shadow: 2px 3px 8px #888888;
}
.addUploadPic{
    border-radius: unset;
    box-shadow: unset;
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
.experience-content-image-small{
    max-width: 80px;
    max-height: 80px;
    margin-top: 10px;
}
.experience-content-image-large{
    max-width: 90vw;
    margin-top: 10px;
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

.experienceDetail-content{
    width: 100%;
    margin-top: 45px;
    height: calc(95vh - 50px);;
    background-color: #FFFFFF;
    border-radius: 20px 20px 0;
}
.experienceDetail-detail-content{
        -webkit-line-clamp: unset;
}
.experienceDetail-close{
    position: fixed;
    top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid#cccbcb;
    width: 100%;
}
.experienceDetail-close>img{
    margin-left: 10px;
    width: 25px;
    height: 25px;
}

.experienceDetail-response-item{
    border-bottom: 1px solid #ebebeb;
}
/* .experienceDetail-response-item:last-child{
    padding-bottom: 120px;
} */
.experienceDetail-item{
    border: unset;
    /* margin-top: 45px; */
    box-shadow: unset;
    margin-bottom: 0;
    border-bottom: 1px solid #ebebeb;
}

.experienceDetail-time{
    font-size: 15px;
    margin-top: 1rem;
    padding: 0 3px;
}
.experienceDetail-handleLike{
    margin-top: 10px;
    color: #858687;
}
.experienceDetail-title{
    margin: 12px;
    text-align: center;
    font-size: 20px;
    -webkit-line-clamp: 2;
}
.experienceDetail-img{
    border-bottom:unset;
}
.experienceDetail-bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid#cccbcb;
    width: 100%;
    padding: 0 15px;
    display: flex;
    height: 3rem;
    align-items: center;
    justify-content: space-between;
    font-size: 1.6rem;
}
.experienceDetail-bottom input{
    font-size: 1.6rem;
}
</style>