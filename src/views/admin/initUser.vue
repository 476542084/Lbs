<template>
    <div class="detail-container">
        <h2 style="padding: 10px;">用户列表</h2>
        <div class="table-detail">

            <el-table
                stripe
                :data="userList"
                style="width: 98%">

                <el-table-column
                    property="userId"
                    label="ID"
                    width="180"> 
                </el-table-column>

                <el-table-column
                label="用户"
                width="180">
                <template slot-scope="scope">
                    <img class="table-user-img" :src="scope.row.headImage == null ? userPic : scope.row.headImage" alt="头像">
                    <span style="margin-left: 10px">{{ scope.row.userName }}</span>
                </template>
                </el-table-column>
            </el-table>
           
        </div>
    </div> 
</template>
<script>
export default {
  name: 'InitUser',
  props:{userList:Array},
  data(){
    return{
        userPic:require('@/assets/defaultPic.png'),
        tableData:[]
    }
  },
  created(){
  },
  mounted(){
  },
  methods:{
      
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
    /* text-align: center; */
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