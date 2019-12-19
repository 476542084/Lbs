<template>
    <div>
      <div class="index-header">
          <p>头部</p>
      </div>
      <div class="index-container">
        <el-row class="tac">
            <el-col >
                <el-menu
                :collapse="isCollapse"
                :default-active="defaultActive"
                @select="handleSelect"
                :default-openeds='["dataManagement","dataView"]'
                class="el-menu-vertical-demo">
                <el-menu-item index="initUser">
                    <i class="el-icon-s-operation"></i>
                    <span slot="title">用户列表</span>
                </el-menu-item>

                <el-menu-item index="checkPopular">
                    <i class="el-icon-s-operation"></i>
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
                        <i class="el-icon-s-data"></i>
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
        isCollapse:false,
        defaultActive: 'initUser',
        selected:'initUser',
        userList:[]
    }
  },
  mounted(){
      this.handleGetAllUser()
  },
  methods:{
      handleSelect(index){
          this.selected = index
      },

      async handleGetAllUser(){
        try {
            let res = await getUserList()
            if(res.status === 200){
                this.userList = [...res.result]
            }else{
                this.$message.error(res.msg||res.error);
            }
        } catch (error) {
            this.$message.error('网络错误，请稍后重试！');
        }
    },
  },
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