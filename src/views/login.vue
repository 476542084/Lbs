<!-- home -->
<template>
    <div>
        <!-- <div>
            <mt-header fixed title="基于lbs社交"></mt-header>
        </div> -->
        <div class="container">
            <p class="title">登录</p>
            <mt-field label="账号" placeholder="请输入账号"  v-model="userName"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
        </div>
        <div class="button-div">
            <mt-button type="primary" @click.native="handleLogin">登录</mt-button>
            <mt-button class="register" plain @click.native="handleRegister">注册</mt-button>
        </div>
        <LbsNav propSelected='user'></LbsNav>
    </div>
</template>

<script>

import {register,login} from '@/api/getData'
import { async } from 'q'
import { Field,Header,Indicator } from 'mint-ui';
import LbsNav from '@/components/nav'
import {showError,showSuccess} from '@/utils/common'
export default {
  name: 'home',
  components: {Field,LbsNav,Header},
  data(){
    return{
      userName:'',
      password:''
    }
  },
  created() {
   
  },
  mounted () {

  },
  methods:{
    async handleLogin(){
        if(this.userName.trim() == ''|| this.password.trim() == ''){
            showError('请填写完整!')
            return
        }
        Indicator.open();
        try {
            let res = await login(this.userName,this.password)
            if(res.status === 200){
                console.log('res',res)
                showSuccess('登录成功')
                this.$store.commit('set_token', res.token)
                sessionStorage.setItem('token',res.token);
                this.$store.commit('set_userInfo', res.user)
                sessionStorage.setItem('userInfo',JSON.stringify(res.user));
                this.$router.push({path:'/user'})
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },
     handleRegister(){
        this.$router.push({path:'/register'})
    }

  }
}
</script>

<style scoped>
.button-div{
    width: 100%;
    padding: 0 12px;
}
.button-div button{
    width: 100%;
    margin-top: 15px;
}
.container{
   padding-top: 4rem;
}
.title{
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1rem;
}
.register{
    border: 1px solid #26a2ff;
    color:  #26a2ff
}

</style>