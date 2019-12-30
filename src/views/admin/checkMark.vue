<template>
    <div class="detail-container">
        <h2 style="padding: 10px;">标注管理</h2>
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
                    label="地址"
                    width="250"> 
                    <template slot-scope="scope">
                        <!-- <div v-if="scope.row.showAddress == ''" @click="haneleGetAmapAddress(scope.row.lat,scope.row.lng,scope.$index)" style=" cursor: pointer;">
                           <img class="table-overhidden-pic" :src="clickPic" alt=""><span style="font-size:10px;">点击可查看具体地址</span>
                           <div>
                               <p>经度:{{ scope.row.lng }}</p>
                               <p>纬度:{{ scope.row.lat }}</p>
                           </div>
                        </div> -->
                        <div>{{scope.row.address == '[]' ? '[地址异常]' : scope.row.address}}</div>
                    </template>
                </el-table-column>

                <el-table-column align='center' label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="danger"
                        @click="deleteMark(scope.$index, scope.row.markId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div> 
</template>

<script>
import {findMarkList,getAmapAddress,deleteByType} from '@/api/getData'
export default {
  name: 'CheckMark',
  props:{userList:Array},
  data(){
    return{
        loading:true,
        clickPic: require('@/assets/clickPic.png'),
        userPic:require('@/assets/defaultPic.png'),
        tableData: [],
        selectUser:this.userList[2].userId
    }
  },
  created(){
      
  },
  mounted(){
      this.loading = true
      let selectId = this.userList[2] && (this.userList[2].userId)
      this.handleFindMarkList(selectId)
  },
  methods:{
      async handleFindMarkList(selectId){
        this.loading = true
        try {
            let res = await findMarkList(selectId)
            if(res.status === 200){
                let data = []
                 res.result.map((item) => {
                    item.showAddress = ''
                    data.push({...item})
                })
                this.tableData = data
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

    // async haneleGetAmapAddress(lat,lng,index){
    //     try {
    //         let res = await getAmapAddress(lat, lng)
    //         if(res.infocode == '10000'){
    //             this.tableData[index]['showAddress'] = res.regeocode.formatted_address
    //         }else{
    //             this.$message.error(res.msg||res.error);
    //         }
    //     } catch (error) {
    //          this.$message.error('网络错误，请稍后重试！');
    //     }

    // },

    async handleDeleteMark(index,markId,type){
        try {
            let res = await deleteByType(markId,type)
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
    deleteMark(index, markId) {
        this.$confirm('确定删除该标注吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.handleDeleteMark(index,markId,'mark')
        }).catch(() => {        
        });
    },
    changeSelectUser(userId){
        this.handleFindMarkList(userId)
    }
  }
}
</script>
<style  scoped>
.table-overhidden-pic{
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin-right: 5px;
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