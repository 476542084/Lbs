<!-- home -->
<template>
    <div>
        <!-- <div>
            <mt-header fixed title="基于lbs社交"></mt-header>
        </div> -->
        <div class="container">
            <p class="title">注册</p>
            <mt-field label="账号" placeholder="请输入账号" :attr="{ maxlength: 11 }"  v-model="userName"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" :attr="{ maxlength: 16 }" type="password" v-model="password"></mt-field>
            <mt-field label="密码" placeholder="请再次输入密码" :attr="{ maxlength: 16 }" type="password" v-model="password2"></mt-field>
            <mt-field label="用户名" placeholder="请输入用户名"  :attr="{ maxlength: 10 }" v-model="name"></mt-field>

        </div>

        <div style="padding: 12px;">
            <SliderVerificationCode height="40px" sliderWidth="100px"  inactiveValue=false activeValue=true content="请滑动通过验证"  v-model="code"/>
        </div>

        <div class="button-div">
            <mt-button type="primary" @click.native="handleRegister">注册</mt-button>
            <mt-button class="register" @click.native="handleBack" plain>返回登录</mt-button>
        </div>
        <LbsNav propSelected='user'></LbsNav>
    </div>
</template>

<script>

import {register} from '@/api/getData'
import { async } from 'q'
import { Field,Header,Indicator} from 'mint-ui';
import {showError,showSuccess} from '@/utils/common'
import LbsNav from '@/components/nav'
export default {
  name: 'home',
  components: {Field,LbsNav,Header},
  data(){
    return{
      code:false,
      userName:'',
      password:'',
      password2:'',
      name:''
    }
  },
  created() {
   
  },
  mounted () {

  },
  methods:{
    async handleRegister(){
        if(this.userName.trim() == ''|| this.password.trim() == '' || this.name.trim() == ''){
            showError('请填写完整!')
            return
        }
        if(this.password.trim() !== this.password2.trim()){
            showError('两次密码不同！')
            return
        }
        if(this.code == false){
            showError('请滑动验证!')
            return
        }
        Indicator.open();
        try {
            let res = await register(this.name,this.password,this.userName)
            if(res.status === 200){
                showSuccess('注册成功')
                this.$router.push({path:'/login'})
            }else{
                showError(res.msg||res.error)
            }
        } catch (error) {
             showError('网络错误，请稍后重试！')
        }
    },
    handleBack(){
        this.$router.push({path:'/login'})
    },
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
   padding-top: 2rem;
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