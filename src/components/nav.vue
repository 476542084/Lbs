<template>
    <mt-tabbar v-model="selected">
        <mt-tab-item id="home" @click="handleRouter()">
            <img slot="icon" src="@/assets/index.png">
            主页
        </mt-tab-item>
        <mt-tab-item id="popular"  @click="handleRouter()">
            <img slot="icon" src="@/assets/popularIndex.png">
            推广
        </mt-tab-item>
        <mt-tab-item id="attenttion">
            <img slot="icon" src="@/assets/attentionIndex.png">
            关注
        </mt-tab-item>
        <mt-tab-item id="user">
            <img slot="icon" src="@/assets/userIndex.png">
            个人
        </mt-tab-item>
    </mt-tabbar>    
</template>

<script>
import { Tabbar, TabItem } from 'mint-ui';
export default {
  name: 'LbsNav',
  components: {Tabbar,TabItem},
  props:{propSelected:String},
  data(){
    return{
        selected: this.propSelected || 'home'
    }
  },
  methods:{
      handleRouter(){
          
         this.$router.push({path: '/login'});
      }
  },
  watch:{
      selected:{
          handler(newName, oldName) {
      　　// ...
       this.$router.push({path: `/${newName}`});
      console.log('newName',newName)
      console.log('oldName',oldName)
    　　    },
    // 　　immediate: true
      }
  }
}
</script>