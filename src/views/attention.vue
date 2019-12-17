<!-- attention -->
<template>
    <div>
        <mt-navbar v-model="selected">
            <mt-tab-item id="markList">标注关注</mt-tab-item>
            <mt-tab-item id="commList">心得关注</mt-tab-item>
        </mt-navbar>    
        <!-- tab-container -->
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="markList">
                <div v-if="markList.length > 0">
                    <PopularMsg :markList=markList></PopularMsg>
                </div>
                <div v-else class="empty-div">
                    <p><img :src="emptyPic" alt=""></p>
                    <p>暂无关注标注</p>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="commList">
                <div v-if="commList.length > 0">
                    <Experience :commList=commList v-if="selected == 'commList'"></Experience>
                </div>
                <div v-else class="empty-div">
                    <p><img :src="emptyPic" alt=""></p>
                    <p>暂无关注心得</p>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
        <LbsNav propSelected="attention"></LbsNav>
    </div>  
</template>

<script>
import {getAttentionMsgList} from '@/api/getData'
import { Navbar, TabItem, Indicator } from 'mint-ui'
import LbsNav from '@/components/nav'
import PopularMsg from '@/views/popularMsg'
import Experience from '@/views/experience'
import {showError,showSuccess,compressImage,canvasToBlob} from '@/utils/common'
export default {
    name: 'attention',
    components: {LbsNav,TabItem,PopularMsg,Experience},
    data(){
        return{
            token:'',
            selected:'markList',
            commList:[],
            markList:[],
            emptyPic: require('@/assets/emptyPic.png')
        }
    },
    created(){
        this.token = this.$store.state.token || ''
        if(this.token != ''){
            this.handleGetAttentionMsgList()
        }
    },
    mounted(){
        
    },
    methods:{
        //获取关注列表
        async handleGetAttentionMsgList(){
            Indicator.open();
            try {
                let res = await getAttentionMsgList()
                if(res.status === 200){
                    showSuccess('')
                    this.commList = res.result && res.result.commList
                    this.markList = res.result && res.result.markList
                }else{
                    showError(res.msg||res.error)
                }
            } catch (error) {
                showError('网络错误，请稍后重试！')
            }
        }
    },
}
</script>