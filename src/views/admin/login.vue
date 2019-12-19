<template>
  <div class="pc-login">
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">欢迎登录</h3>
      <el-form-item label="账号" prop="username" style=" color: #fff">
        <el-input type="text" placeholder="请输入账号" v-model="form.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login} from '@/api/getData'
  export default {
    name: "Login",
    data() {
      return {
        form: {
          username: '',
          password: ''
        },

        // 表单验证，需要在 el-form-item 元素中增加 prop 属性
        rules: {
          username: [
            {required: true, message: '账号不可为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不可为空', trigger: 'blur'}
          ]
        },


      }
    },
    methods: {
      onSubmit(formName) {
        // 为表单绑定验证功能
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleLogin()
          } else {
            return false;
          }
        });
      },
      async handleLogin(){
        try {
            let res = await login(this.form.username,this.form.password)
            if(res.status === 200){
                this.$store.commit('set_token', res.token)
                sessionStorage.setItem('token',res.token);
                this.$store.commit('set_userInfo', res.user)
                sessionStorage.setItem('userInfo',JSON.stringify(res.user));
                this.$router.push({path:'/'})
            }else{
                 this.$message.error(res.msg||res.error);
            }
        } catch (error) {
            this.$message.error('网络错误，请稍后重试！');
        }
    },
    }
  }
</script>
<style >
  .el-form-item__label{
     color: #fff ;
  }
</style>
<style scoped>
.pc-login{
    position: relative;
    height: 100vh;
    background-image: url('../../../src/assets/bodyBg.jpg');
    background-size:100%;
    background-repeat:no-repeat;
}
  .login-box {
    background: rgba(0,0,0,0.15);
    border: 1px solid #DCDFE6;
    width: 350px;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;

    top: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #fff;
  }
  .el-form-item__label{
     color: #fff !important;
  }
</style>