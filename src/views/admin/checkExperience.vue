<template>
    <div class="detail-container">
        <h2 style="padding: 10px;">心得管理</h2>
        <span style="color:#909399;padding:0 10px 0">请选择用户:</span>
        <el-select v-model="selectUser" placeholder="选择用户" filterable   @change="changeSelectUser">
            <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId">
             <span style="float: left"><img class="table-user-img" :src="item.headImage == null ? userPic : item.headImage" alt="头像"></span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
            </el-option>
        </el-select>
        <div class="table-detail">
            <el-table
                v-loading="loading"
                header-align="center"
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
                label="标题"
                prop="title"
                align='center'
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

                <el-table-column
                label="赞同数量"
                align='center'
                width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.likeNum | likeNum}}</span>
                </template>
                </el-table-column>

                <el-table-column
                label="反对数量"
                align='center'
                width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.nuLikeNum | likeNum}}</span>
                </template>
                </el-table-column>

                <el-table-column align='center' label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="danger"
                        @click="deleteExperience(scope.$index, scope.row.commId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div> 
</template>
<script>
import {findExperienceList,deleteByType} from '@/api/getData'
export default {
  name: 'checkExperience',
  props:{userList:Array},
  data(){
    return{
        loading:true,
        clickPic: require('@/assets/clickPic.png'),
        userPic:require('@/assets/defaultPic.png'),
        tableData: [],
        selectUser:this.userList[0].userId
    }
  },
  created(){
      let selectId = this.userList[0] && (this.userList[0].userId)
      this.handleFindExperienceList(selectId)
  },
  mounted(){
  },
  filters:{
      likeNum:function(value){
        if (!value) return '0'
        let intPart = Number(value).toFixed(0) // 获取整数部分
        let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
        return intPartFormat
      }
  },
  methods:{
    async handleFindExperienceList(selectId){
        this.loading = true
        try {
            let res = await findExperienceList(selectId)
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

    async handleDeleteExperience(index,commId,type){
        try {
            let res = await deleteByType(commId,type)
            if(res.status === 200){
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                this.tableData[index] && (this.tableData.splice(index,1))
            }else{
               this.$message.error(res.msg||res.error);
            }
        } catch (error) {
            this.$message.error('网络错误，请稍后重试！');
        }
    },

    deleteExperience(index, commId) {
        this.$confirm('确定删除该心得吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.handleDeleteExperience(index,commId,'comm')
        }).catch(() => {        
        });
    },
    changeSelectUser(userId){

        this.handleFindExperienceList(userId)
    }
  }
}
</script>
<style scoped>
.table-overhidden-pic{
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin-right: 5px;
}

.table-overhidden-p{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
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
    height: calc(100vh - 170px);
}
</style>