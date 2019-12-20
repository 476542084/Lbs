<template>
    <div class="detail-container">
        <h2 style="padding: 10px;">心得统计</h2>
        <div class="block">
            <span style="color:#909399;padding:0 10px 0">请选择时间:</span>
            <el-date-picker
            v-model="selectTime"
            @change="changeSelectTime"
            type="daterange"
            value-format="timestamp"
            align="center"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
            </el-date-picker>
        </div>

        <div v-loading="loading" class="echart-loading" ></div>

        <div v-if="Echartdata.length != 0"  class="echart-detail">
            <div id="main" style="width: 100%;height: 400px;"></div>
        </div>
        
        <div v-if="emptyShow" class="empty-div">
            <p><img :src="emptyPic" alt="空白"></p>
            <p>该时间段没有心得信息！</p>
        </div>

    </div> 
</template>

<script>
import echarts from 'echarts'
import {getCountData} from '@/api/getData'
export default {
  name: 'ExperienceData',
  data(){
    return{
        loading:true,
        emptyShow:false,
        emptyPic: require('@/assets/emptyPic.png'),
        charts:null,
        Echartdata:[],
        selectTime:[Date.now() - 30*24*60*60*1000,Date.now()],
        pickerOptions: {
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
            }, {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
            }, {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            }
            }]
        }
    }
  },
  created(){

  },
  mounted(){
    let start = (Date.now() - 30*24*60*60*1000) + ''
    let end = Date.now() + ''
    start = start.substring(0,start.length - 3)
    end = end.substring(0,end.length - 3)
    this.handleGetCountData(start,end)
  },
  methods:{
      changeSelectTime(date){
        let start = date[0] + ''
        let end = date[1] + ''
        start = start.substring(0,start.length - 3)
        end = end.substring(0,end.length - 3)
        this.handleGetCountData(start,end)
      },
      async handleGetCountData(start,end){
        this.loading = true
        try {
            let res = await getCountData(start,end,'0')
            if(res.status === 200){
                if(res.result && res.result.length == 0){
                    this.$nextTick(function(){
                        this.Echartdata = res.result
                        this.emptyShow = true
                    })
                }else{
                    this.Echartdata = res.result
                    this.$nextTick(function(){
                        this.draw(this.Echartdata)
                    })
                }
                this.loading = false
            }else{
                this.$message.error(res.msg||res.error)
                this.loading = false
                this.emptyShow = true
            }
        } catch (error) {
            this.$message.error('网络错误，请稍后重试！')
            this.loading = false
            this.emptyShow = true
        }
    },
    draw(data){
        this.charts = echarts.init(document.querySelector('#main'))
        let time = []
        let total = []
        data.map((item,index) => {
            time.push(item.time)
            total.push(item.total)
        })
        let option = {
             tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: time,
                name:'标注时间',
                axisTick: {
                alignWithLabel: true
            },
            },
            yAxis: {
                type: 'value',
                name:'数量(个)',
            },
            series: [{
                data: total,
                name:'心得数量',
                type: 'line',
                smooth: true
            }]
        };
        this.charts.setOption(option)
    }
  } 
}
</script>
<style  scoped>
.echart-detail{
    overflow-y: auto;
    height: calc(100vh - 200px);
}

.empty-div{
    height: auto; 
    width: auto;
    margin-top: 140px;
}
</style>