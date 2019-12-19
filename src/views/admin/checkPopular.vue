<template>
    <div class="detail-container">
        <h2 style="padding: 10px;">推广审核</h2>
        <div class="table-detail">
            <el-table
                v-loading="loading"
                stripe
                :data="tableData"
                style="width: 98%">
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
                    align='center'
                    label="标题"
                    width="180"> 
                </el-table-column>

                <el-table-column
                label="内容"
                align='center'
                width="250">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{ scope.row.content }}</p>
                        <div slot="reference" class="name-wrapper">
                            <p class="table-overhidden-p"><img class="table-overhidden-pic" :src="clickPic" alt="">{{ scope.row.content }}</p>
                        </div>
                    </el-popover>
                </template>
                </el-table-column>
                <el-table-column align='center' label="操作">
                <template slot-scope="scope">
                    <el-button
                    v-if="scope.row.status == 3"
                    size="mini"
                    type="primary"
                    @click="handleCheckPass(scope.$index, scope.row)">通过</el-button>

                    <el-button
                    v-if="scope.row.status == 3"
                    size="mini"
                    type="danger"
                    @click="handleCheckReject(scope.$index, scope.row)">拒绝</el-button>

                    <el-button
                    v-if="scope.row.status == 1"
                    disabled
                    size="mini"
                    type="success">已通过</el-button>

                     <el-button
                    v-if="scope.row.status == 2"
                    disabled
                    size="mini"
                    type="danger">已拒绝</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
    </div> 
</template>

<script>
import {getAllUserCheckList,markCheck} from '@/api/getData'
export default {
  name: 'CheckPopular',
  data(){
    return{
        loading:true,
        clickPic: require('@/assets/clickPic.png'),
        userPic:require('@/assets/defaultPic.png'),
        tableData: []
    }
  },
  created(){
  },
  mounted(){
      this.handleGetAllUserCheckList()
  },
  methods:{
      async handleGetAllUserCheckList(){
        this.loading = true
        try {
            let res = await getAllUserCheckList()
            if(res.status === 200){
                this.tableData = [...res.result]
                this.loading = false
            }else{
                this.$message.error(res.msg||res.error);
                this.loading = false
            }
        } catch (error) {
            this.$message.error('网络错误，请稍后重试！');
            this.loading = false
        }
    },

    async handleMarkCheck(index,markId,status){
        try {
            let res = await markCheck(markId,status)
            if(res.status === 200){
                if(status == 1){
                  this.$message({
                    type: 'success',
                    message: '通过成功!'
                  });
                  this.tableData[index] && (this.tableData[index]['status'] = 1)
                }
                if(status == 2){
                  this.$message({
                    type: 'success',
                    message: '拒绝成功!'
                  });
                  this.tableData[index] && (this.tableData[index]['status'] = 2)
                }
            }else{
               this.$message.error(res.msg||res.error);
            }
        } catch (error) {
            this.$message.error('网络错误，请稍后重试！');
        }
    },

    handleCheckPass(index, row) {
        this.$confirm('确认通过该推广信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.handleMarkCheck(index,row.markId,'1')
        }).catch(() => {        
        });
    },

    handleCheckReject(index, row) {
        console.log(index, row);
        this.$confirm('确认拒绝该推广信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.handleMarkCheck(index,row.markId,'2')
        }).catch(() => {        
        });
    }
  }
}
</script>
<style  scoped>
.el-popper{
    max-width: 200px !important;
}
.table-overhidden-pic{
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin-right: 5px;

}
.table-overhidden-p{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    background-color: aliceblue;
    border-radius: 5px;
    padding: 0 5px;
}

.table-user-img{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    vertical-align: middle;
}

.table-detail{
    overflow-y: auto;
    height: calc(100vh - 130px);
}

</style>