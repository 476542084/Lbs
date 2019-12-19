<template>
    <div>
      <div class="index-header">
          <span>基于LBS的在线社交系统-后台管理</span>
          <div>
            <img  class="user-userPic" :src=userPic alt="头像">
            <el-dropdown style="    cursor: pointer; color:#fff">
              <span class="el-dropdown-link">
                退出登录<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          
      </div>
      <div v-loading="loading" class="index-container">
        <el-row >
            <el-col >
                <el-menu
                :collapse="isCollapse"
                :default-active="defaultActive"
                @select="handleSelect"
                :default-openeds='["dataManagement","dataView"]'
                class="el-menu-vertical-demo">
                <el-menu-item index="initUser">
                    <i class="el-icon-view"></i>
                    <span slot="title">用户列表</span>
                </el-menu-item>

                <el-menu-item index="checkPopular">
                    <i class="el-icon-tickets"></i>
                    <span slot="title">推广审核</span>
                </el-menu-item>

                <el-submenu index="dataManagement">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">数据管理</span>
                    </template>
                    <el-menu-item-group>
                      <el-menu-item index="checkMark">标注管理</el-menu-item>
                      <el-menu-item index="checkExperience">心得管理</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                            
                <el-submenu index="dataView">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">数据统计</span>
                    </template>
                    <el-menu-item index="markData">标注统计</el-menu-item>
                    <el-menu-item index="experienceData">心得统计</el-menu-item>
                    <el-menu-item index="popularData">推广统计</el-menu-item>
                </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
        <div class="component-detail">
            <!-- 初始页面 -->
           <InitUser v-if="selected == 'initUser'" :userList="userList"></InitUser>

            <!-- 推广审核 -->
            <CheckPopular v-if="selected == 'checkPopular'" ></CheckPopular>

            <!-- 标注管理 -->
            <CheckMark v-if="selected == 'checkMark'" :userList="userList" ></CheckMark>

            <!-- 心得管理 -->
            <CheckExperience v-if="selected == 'checkExperience'" :userList="userList" ></CheckExperience>

            <!-- 标注统计 -->
            <MarkData v-if="selected == 'markData'" ></MarkData>

            <!-- 心得统计 -->
            <ExperienceData v-if="selected == 'experienceData'" ></ExperienceData>

            <!-- 推广统计 -->
            <PopularData v-if="selected == 'popularData'" ></PopularData>

        </div>
      </div>
    </div>
</template>
<script>
import {getUserList} from '@/api/getData'
import CheckPopular from '@/views/admin/checkPopular'
import InitUser from '@/views/admin/initUser'
import CheckMark from '@/views/admin/checkMark'
import CheckExperience from '@/views/admin/checkExperience'
import MarkData from '@/views/admin/markData'
import ExperienceData from '@/views/admin/experienceData'
import PopularData from '@/views/admin/popularData'
export default {
  name: 'Index',
  components: {InitUser, CheckPopular, CheckMark, CheckExperience, MarkData, ExperienceData, PopularData},
  data(){
    return{
        userPic:require('@/assets/defaultPic.png'),
        isCollapse:false,
        defaultActive: 'initUser',
        selected:'initUser',
        userList:[],
        loading:true
    }
  },
  created(){
    if( sessionStorage.getItem('token') == '' || sessionStorage.getItem('token') == null){
      this.$message.error('请先登录！');
      this.$router.push({path:'/login'})
      return false
    }
  },
  mounted(){
      this.handleGetAllUser()
  },
  methods:{
      handleSelect(index){
          this.selected = index
      },
      logout(){
        this.$confirm('确定退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('del_token')
          this.$store.commit('del_userInfo')
          this.$router.push({path:'/login'})
        }).catch(() => {

        });

      },
      async handleGetAllUser(){
        try {
            let res = await getUserList()
            if(res.status === 200){
                this.userList = [...res.result]
                this.loading = false
            }else{
                this.$message.error(res.msg||res.error);
                this.loading = false
                if(res.msg == '权限不足，请联系管理员！'){
                  this.$router.push({path:'/login'})
                }
            }
        } catch (error) {
            this.$message.error('网络错误，请稍后重试！');
                      this.loading = false

        }
    },
  },
  beforeRouteEnter (to, from, next) {
    if( sessionStorage.getItem('token') == '' || sessionStorage.getItem('token') == null){
        alert('请先登录！')
        next({path:'/login'})
    }else{
        next()
    }
  }
}
</script>
<style scoped>
.el-row{
    min-width: 140px;
}
.el-submenu .el-menu-item{
    min-width:auto;
}

.el-menu{
    height: calc(100vh - 60px);

}
.index-header{
    line-height: 60px;
    height: 60px;
    width: 100%;
    padding: 0 25px;
    background-color: #89bf04;
    color: #fff;
    display: flex;
    justify-content: space-between;
}
.user-userPic{
    margin-right: 10px;
    vertical-align: middle;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    box-shadow: 2px 3px 8px #888888;
}
.index-container{
    display: flex;
    height: calc(100vh - 60px);
}
.component-detail{
    width: 100%;
    height: 100%;
    padding: 10px;
}
</style>