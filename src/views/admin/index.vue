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
                :default-active="test"
                :default-openeds='["2","3"]'
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">
                <el-menu-item index="1">
                    <i class="el-icon-s-operation"></i>
                    <span slot="title">推广审核</span>
                </el-menu-item>

                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">数据管理</span>
                    </template>
                    <el-menu-item-group>

                    <el-menu-item index="2-1">标注管理</el-menu-item>
                    <el-menu-item index="2-2">心得管理</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                            
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-s-data"></i>
                        <span slot="title">数据统计</span>
                    </template>
                    <el-menu-item index="3-1">标注统计</el-menu-item>
                    <el-menu-item index="3-2">心得统计</el-menu-item>
                    <el-menu-item index="3-3">推广统计</el-menu-item>
                </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
        <div class="component-detail">
            <!-- 推广审核 -->
           <CheckPopular></CheckPopular>
        </div>
      </div>
    </div>
    
</template>

<script>

// import Vue from 'vue'
// import Element from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(Element, { size: 'small', zIndex: 3000 });
import {getUserList} from '@/api/getData'
import CheckPopular from '@/views/admin/checkPopular'
// import LbsNav from '@/components/nav'
// import Experience from '@/views/experience'
export default {
  name: 'Index',
  components: {CheckPopular},

  data(){
    return{
        isCollapse:false,
        test: '2'
    }
  },
  mounted(){
    //   this.handleGetAllUser()
  },
  methods:{
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      async handleGetAllUser(){
        try {
            let res = await getUserList()
            if(res.status === 200){
                // this.checkList = [...res.result]
                // showSuccess('')
                // this.checkListVisible = true
            }else{
                // showError(res.msg||res.error)
            }
        } catch (error) {
            // showError('网络错误，请稍后重试！')
        }
    },
  },

}
</script>

<style scoped>
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