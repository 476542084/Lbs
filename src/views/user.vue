<!-- user -->
<template>
    <div class="user-container">
        <div class="user-user">
            <img  class="user-userPic" :src=userPic @click="uploadFile" alt="">
            <input type="file" style="display:none" ref="uploadFile" @change="getFile" accept="image/png,image/jpeg,image/jpg">
            <span>（点击可更换头像）</span>
        </div>
        
        <mt-cell title="用户名" :value="userName"></mt-cell>
        <mt-cell title="查看推广审核状态" is-link @click.native="showCheck">
            
        </mt-cell>
        

        
        <div class="button-div">
            <mt-button v-if="!isLogin" type="primary" @click.native="handleLogin">登录</mt-button>
            <mt-button v-else type="danger" @click.native="handleLogon">退出登录</mt-button>
        </div>
        

        <!-- 心得详情心得 -->
        <mt-popup
            v-model="checkListVisible"
            position="bottom"
            :closeOnClickModal=false>
            <div class="checkList">
                <div class="checkList-close" @click="cancelCheckList">
                    <img :src=closePic alt="关闭">
                </div>
                <div v-if="checkList.length != 0">
                    <van-collapse v-model="activeNames">
                        <van-collapse-item
                            v-for="(item,index) in checkList"
                            :key="index"
                            :title="item.title"
                            :value='checkType[`${item.status}`]["text"]'
                            :value-class='checkType[`${item.status}`]["class"]'
                            :name="index"
                        >
                            <p class="checkList-content">{{item.content}}</p>
                        </van-collapse-item>
                    </van-collapse>
                </div>
                <div v-else class="empty-div">
                    <p><img :src="emptyPic" alt=""></p>
                    <p>暂无审核信息</p>
                </div>
            </div>
           
                
        </mt-popup>

        <a class="ipc" href="http://www.beian.miit.gov.cn/">粤ICP备19160321号-1</a>
        <LbsNav propSelected="user"></LbsNav>
    </div>
</template>

<script>
import Vue from 'vue'

import { Collapse, CollapseItem } from 'vant'

import 'vant/lib/index.css'

import {getUserMsg,updateUserPic,getCheckList} from '@/api/getData'
import { async } from 'q'
import { Cell,Indicator,MessageBox } from 'mint-ui';
import LbsNav from '@/components/nav'
import {showError,showSuccess,compressImage,canvasToBlob} from '@/utils/common'
Vue.use(Collapse).use(CollapseItem)
export default {
  name: 'home',
  components: {Cell,LbsNav},
  data(){
    return{
    checkType:{
    1:{class:'check-complete',text:'已推广'},
    2:{class:'check-reject',text:'推广被拒'},
    3:{class:'check-wait',text:'推广审核中'},
    },
    checkListVisible:false,
    activeNames: ['0'],
    checkList:[],
    userPic:require('@/assets/defaultPic.png'),
    closePic:require('@/assets/close.png'),
    emptyPic: require('@/assets/emptyPic.png'),
    userName:'用户名',
    isLogin:false,
    token:this.$store.state.token,
    reloadFlag:false
    }
  },
  created() {
   
  },
  mounted () {
      if(this.token !== ''){
          this.handleGetUserMsg()
      }
  },
  methods:{
    cancelCheckList(){
        this.checkListVisible = false
    },
    showCheck(){
        if(this.isLogin){
            this.handleGetCheckList()
        }else{
            showError('请先登录！')
        }
    },
    
    handleLogon(){
        MessageBox.confirm('确定退出登录吗?').then(action => {
            if(action == 'confirm'){
                this.$store.commit('del_token')
                this.$store.commit('del_userInfo')

                this.$router.push({path:'/login'})
            }
        });
    },
    handleLogin(){
        this.$router.push({path:'/login'})
    },
    uploadFile(){
        if(this.isLogin){
            this.$refs.uploadFile.dispatchEvent(new MouseEvent('click')) 
        }else{
            showError('请先登录！')
        }
    },
    getFile(e){
        let that = this
        let beforeFile = e.currentTarget.files[0]
        compressImage(beforeFile , 100, 100, 0.95).then(canvasToBlob).then((afterFile) => {
            if(afterFile.size >= (1024*1024*3)){
                showError('图片太大了！')
            }else{
                this.handleUpdateUserPic(afterFile)
            }

        })  
    },
    async handleGetCheckList(){
        Indicator.open();
        try {
            let res = await getCheckList()
            if(res.status === 200){
                this.checkList = [...res.result]
                showSuccess('')
                this.checkListVisible = true
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
            let res = await getUserMsg()
            if(res.status === 200){
                this.userName = res.userName
                this.userPic = res.headImage
                this.isLogin = true
                showSuccess('')
                if(this.reloadFlag){
                    window.location.reload()
                }
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },
    async handleUpdateUserPic(file){
        Indicator.open();
        try {
            let res = await updateUserPic(file)
            if(res.status === 200){
                this.userPic = res.iconUrl
                // this.handleGetUserMsg()
                let obj = this.$store.state.userInfo
                obj.headImage = res.iconUrl
                this.$store.commit('set_userInfo', {...obj})
                sessionStorage.setItem('userInfo',JSON.stringify({...obj}));

                showSuccess('成功更换！')
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },

  },
  beforeRouteEnter (to, from, next) {
    if(from.name == 'login'){
        next(vm=>(vm.reloadFlag = true))
    }else{
        next(vm=>(vm.reloadFlag = false))
    }
  }

}
</script>
<style>
    .check-complete{
    color: #b3e19d !important;
}
.check-reject{
    color: #fab6b6;
}
.check-wait{
    color: #c8c9cc;
}

</style>
<style scoped>
.user-user{
    display: flex;
    min-height: 10rem;
    align-items: center;
    justify-content: center;
    flex-flow: column;
}
 .user-user span{
    margin:3px 0 5px;
    color: #bcb5b5;
}
.user-userPic{
    cursor: pointer;
    border-radius: 50%;
    height: 5rem;
    width: 5rem;
    margin-top: 10px;
    box-shadow: 2px 3px 8px #888888;
}

.button-div{
    width: 100%;
    padding: 0 12px;
}
.button-div button{
    width: 100%;
    margin-top: 15px;
}
.checkList{
    height: calc(100% - 50px);
    overflow-y: auto;
    margin-top: 50px;
}
.checkList-close{
    position: fixed;
    top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid#cccbcb;
    width: 100%;
}
.checkList-close>img{
    margin-left: 10px;
    width: 25px;
    height: 25px;
}

.checkList-content{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
}
.ipc{
        text-align: center;
    width: 100%;
    background-color: #d9d9d92e;
    position: fixed;
    bottom: 55px;
    left: 50%;
    transform: translate(-50%, 0);
    color: unset;
}
</style>