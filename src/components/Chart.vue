<template>
<div id="chartCont">
    <canvas id="chart"></canvas>
</div>
</template>

<script>
import { Line } from 'chart.js'

export default {
data() {
    return {
        chart: {},
        ctx: {}
    }
},
props: ['chartData', 'options'],
methods: {
    createChart() {
        this.chartData.datasets[0]={...this.chartData.datasets[0], ...this.options}
    
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: this.chartData,
            options: {
                responsive: true, 
                maintainAspectRatio: false,
                legend: { labels: { fontColor: '#66587A' } },
                scales: { 
                    xAxes: [{ ticks: { fontColor: '#66587A', fontStyle: 'italic' } }], 
                    yAxes: [{ ticks: { fontColor: '#66587A', fontStyle: 'italic' } }]
                    },
                events: ['click']
            }
        })
    }
},
watch: {
    chartData() {
        this.chart.destroy()
        this.createChart()
    }
},
mounted() {
    this.ctx=this.$el.querySelector('#chart').getContext('2d')
    this.createChart()
}
}
</script>

<style scoped>
#chartCont {
    overscroll-behavior-y: contain;
    position: relative;
    height: 100% !important;
    width: 100% !important;
}
</style>


