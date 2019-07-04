<template>
    <div style="margin-top: 20px">
        <IEcharts @ready="onChartReady" :option="chartOptions"></IEcharts>
    </div>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/lite.js'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'

export default {
    props: [
        'data'
    ],
    components: {
        IEcharts
    },
    data() {
        return {
            chart: false,
            chartOptions: {
                legend: {
                    orient: 'vertical',
                    left: 10,
                    top: 20,
                    bottom: 20,
                    data: [],
                    selected: {
                        "脈拍(bpm)": false,
                        "体温(℃)": false,
                        "SPO2(%)": false,
                        "体重(kg)": false,
                        "腹囲(cm)": false,
                        "身長(cm)": false,
                        "頭囲(cm)": false,
                        "胸囲(cm)": false
                    }
                },
                color:[
                    "#009688",
                    "#00695c",
                    "#607d8b",
                    "#424242",
                    "#004d40",
                    "#90caf9",
                    "#353c44",
                    "#512da8",
                    "#ff5349",
                    "#29ab87",
                    "#5f0f0f"
                ],
                tooltip: {
                    backgroundColor:"rgba(245, 245, 245, 0.8)",
                    borderColor:"#ccc",
                    borderWidth:1,
                    enterable:true,
                    padding:10,
                    textStyle: {
                        color:"#000"
                    }                
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: {type: ['line', 'bar'], title: {line: 'ライン', bar: 'バー'}},
                        saveAsImage: {show: true, title: '保存'}
                    }
                },
                axisPointer:{
                    type:"shadow"
                },
                xAxis: [{
                    type: 'category',
                    splitLine: {show: false},
                    data: []
                }],
                grid:{
                    left: '140px',
                    right: '10px',
                    bottom: '0',
                    top: '30px',
                    containLabel: true
                },
                yAxis:[
                    {
                    min: 0,
                    max:"dataMax"
                    }
                ],
                series:[]
            }
        }
    },
    computed: {
        measures() {
            return Object.values(this.data.measures)
        }
    },
    methods: {
        onChartReady(instance) {
            this.chart = instance
            let reverseDates = JSON.parse(JSON.stringify(this.data.dates))
            this.chartOptions.xAxis[0].data = reverseDates.reverse()
            let seriesArray = []
            this.measures.forEach(element => {
                this.chartOptions.legend.data.push(element.name)
                var seriesDataTemplate = {
                    connectNulls: true,
                    name: element.name,
                    data: [],
                    catID: element.vitalID,
                    type:"line",
                    lineStyle:{
                        normal:{
                            width:3,
                            shadowColor:"rgba(0,0,0,0.4)",
                            shadowBlur:10,
                            shadowOffsetY:10
                        }
                    }
                }
                this.data.dates.forEach(date => {
                    seriesDataTemplate.data.push(null)
                })
                Object.keys(element).forEach(item => {
                    if (item !== 'name' && item !== 'vitalID') {
                        let index = reverseDates.findIndex(search => search === item)
                        seriesDataTemplate.data[index] = element[item]
                    }
                })
                seriesArray.push(seriesDataTemplate)
            })
            this.chartOptions.series = seriesArray
            this.chart.setOption(this.chartOptions, true)
        }
    }
}
</script>

<style>

</style>
