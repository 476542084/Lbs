<!-- home -->
<template>
    <div class="user-container">
        <div class="user-user">
            <img  class="user-userPic" :src=userPic @click="uploadFile" alt="">
            <input type="file" style="display:none" ref="uploadFile" @change="getFile" accept="image/png,image/jpeg,image/jpg">
            <span>点击可更换头像</span>
        </div>
        
        <mt-cell title="用户名" :value="userName"></mt-cell>
        <div class="button-div">
            <mt-button v-if="token == ''" type="primary" @click.native="handleLogin">登录</mt-button>
            <mt-button v-else type="danger" @click.native="handleLogon">退出登录</mt-button>
        </div>
        
        <LbsNav propSelected="user"></LbsNav>
    </div>
</template>

<script>

import {getUserMsg,updateUserPic} from '@/api/getData'
import { async } from 'q'
import { Cell,Indicator,MessageBox } from 'mint-ui';
import LbsNav from '@/components/nav'
import {showError,showSuccess,compressImage,canvasToBlob} from '@/utils/common'
export default {
  name: 'home',
  components: {Cell,LbsNav},
  data(){
    return{
      userPic:require('@/assets/defaultPic.png'),
      userName:'测试',
      token:this.$store.state.token
    }
  },
  created() {
   
  },
  mounted () {
    //   if(this.$store.state.token !== ''){
    //       this.handleGetUserMsg()
    //   }
      //获取头像
    if(this.$store.state.userInfo.headImage && this.$store.state.userInfo.headImage !== null){
      this.userPic = this.$store.state.userInfo.headImage
    }
    this.$store.state.userInfo.name && (this.userName = this.$store.state.userInfo.name)

  },
  methods:{
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
        this.$refs.uploadFile.dispatchEvent(new MouseEvent('click')) 
    },
    getFile(e){
        let beforeFile = e.currentTarget.files[0]
        console.log('file',beforeFile)
        compressImage(beforeFile , 100, 100, 0.95).then(canvasToBlob).then((afterFile) => {
            this.handleUpdateUserPic(afterFile)
        })  
    },
    async handleGetUserMsg(){
        Indicator.open();
        try {
            let res = await getUserMsg()
            if(res.status === 200){
                this.userName = res.userName
                this.userPic = res.headImage
                showSuccess('')
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },
    async handleUpdateUserPic(file){
        console.log('file',file)
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

  }
}
</script>

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
</style>