<template>
    <div class="detail-container">
        <h1>审核</h1>
        <div class="table-detail">
            <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>

            <!-- <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                label="用户"
                width="180">
                <template slot-scope="scope">
                    <img class="table-user-img" :src="scope.row.headImage == null ? userPic : scope.row.headImage" alt="头像">
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                </template>
                </el-table-column>

                <el-table-column
                    property="title"
                    label="标题"
                    width="180"> 
                </el-table-column>

                <el-table-column
                label="内容"
                width="180">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{ scope.row.content }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.content }}</el-tag>
                        </div>
                    </el-popover>
                </template>
                </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
            </el-table> -->
            <!-- <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="日期"
      width="180">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名"
      width="180">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.name }}</p>
          <p>住址: {{ scope.row.address }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table> -->
        </div>
    </div> 
</template>

<script>
// import Vue from 'vue'
// import Element from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(Element);
import {getAllUserCheckList} from '@/api/getData'

export default {
  name: 'CheckPopular',

  data(){
    return{
        userPic:require('@/assets/defaultPic.png'),
         tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
        // tableData:[{content:'sdasdas',title:'asds',name:'sdsdw',headImage:null}]
        // tableData: [{
        //   date: '2016-05-02',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '2016-05-04',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1517 弄'
        // }, {
        //   date: '2016-05-01',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1519 弄'
        // }, {
        //   date: '2016-05-03',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1516 弄'
        // }]
        // selected: this.propSelected || 'home'
    }
  },
  created(){
  },
  mounted(){
      this.handleGetAllUserCheckList()

  },
  methods:{
      async handleGetAllUserCheckList(){
        try {
            let res = await getAllUserCheckList()
            if(res.status === 200){
                // this.tableData = res.result
                console.log('tableData',this.tableData)
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
    handleEdit(index, row) {
        console.log(index, row);
    },
    handleDelete(index, row) {
        console.log(index, row);
    }
  }
}
</script>
<style  scoped>
.table-user-img{
    width: 15px;
    height: 15px;
    border-radius: 50%;
}
/* .table-detail{
    height: 600px;
    width: 900px;
} */
</style>