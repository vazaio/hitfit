<template>
    <div id="box" class="flexStyle flexColumn">
        <div id="graph_1" class="boxBorderBot">
            <div id="loading_1" class="flexStyle flexColumn">
                <img src="../assets/loading.svg" alt="">
            </div>
            <div>
                <p>Сердечный ритм</p>
                <select name="time" id="time_1" v-model="chartTimeHeart">
                    <option value="1">За последний час</option>
                    <option value="12">За последние 12 часов</option>
                    <option value="1d">За последние сутки</option>
                    <option value="7d">За последнюю неделю</option>
                </select>
            </div>
            <Chart
                :chartData="heartChartData"
                :options="heartChartOptions"
            />
        </div>
        <br>
        <div id="graph_2">
            <div id="loading_2" class="flexStyle flexColumn">
                <img src="../assets/loading.svg" alt="">
            </div>
            <div>
                <p>Пройденный путь</p>
                <select name="time" id="time_2" v-model="chartTimeSteps">
                    <option value="1">За последний час</option>
                    <option value="12">За последние 12 часов</option>
                    <option value="1d">За последние сутки</option>
                    <option value="7d">За последнюю неделю</option>
                </select>
            </div>
            <Chart
                :chartData="stepsChartData"
                :options="stepsChartOptions"
            />
        </div>
    </div>
</template>

<script>
import Chart from './Chart'

export default {
    data() {
        return {
            heartChart:{},
            stepsChart:{},
            heartChartOptions:{
                borderColor: '#ff3f3f',
                backgroundColor: 'rgba(255, 63, 63, 0.5)'
            },
            stepsChartOptions: {
                borderColor: '#4286f4',
                backgroundColor: 'rgb(66, 134, 244, 0.5)',
            },
            chartTimeHeart:'1',
            chartTimeSteps:'1',
            heartData:'',
            heartDate:'',
            stepsData:'',
            stepsDate:'',    
        }
    },
    components: {
        Chart
    },
    created() {
        this.heartData=this.parseFunc(localStorage.getItem('heartData'), '|')
        this.heartDate=this.parseFunc(localStorage.getItem('heartDate'), '|')
        this.stepsData=this.parseFunc(localStorage.getItem('stepsData'), '|')
        this.stepsDate=this.parseFunc(localStorage.getItem('stepsDate'), '|')
    },
    methods: {
        hideLoader(num) {//hides pre loader(svg file)
            return document.querySelector(num).style.display='none'
        },
        parseFunc(data, by) {
            return data.split(by)
        },
        selectTime(_date, interval) {//returns the index of the element from which to start the countdown
            let date=[..._date]
            
            date.pop()
                        
            function prepareDate(str) {
                let arr=this.parseFunc(str, ' '),
                    date=arr.map((el) => {
                    return parseInt(el)
                })
            
                if(date[3]===undefined) {
                    date[3]=0
                    if(date[2]===undefined) date[2]=12
                }

                date[0]--

                let result=new Date(2018, date[0], date[1], date[2], date[3])

                return result.getTime()
            }

            let now=(new Date).getTime(),
                i=date.length,
                past, comparedDate 
            
            switch(interval) {
                case '1':
                    past=now-3.6*Math.pow(10, 6)    
                break

                case '12':
                    past=now-43.2*Math.pow(10, 6)
                break

                case '1d':
                    past=now-86.4*Math.pow(10, 6)
                break

                case '7d':
                    past=now-604.8*Math.pow(10, 6)
                break
            }

            while(true) {
                i--
                comparedDate=prepareDate.call(this, date[i])
                
                if(comparedDate===past) break
                
                if(comparedDate<past) {
                    i++
                    break
                }

                if(i===0) break    
            }
    
            return i
        },
        chartDataReady(_date, _data, chartTime, mod) {//creates an array of data for a graph
            let interval=this.selectTime(_date, chartTime),
                date=[],
                data=[],
                dateMapping,
                result={
                    labels: [],
                    datasets: [{
                        label: (mod==='heart' ? 'Показания пульсометра' : 'Показания педометра'),
                        data: []
                    }]
                }
            
            date=_date.slice(interval, _date.length-1)
            data=_data.slice(interval, _data.length-1)

            date=date.map((el) => {
                dateMapping=this.parseFunc(el, ' ')
                
                if (dateMapping[3]===undefined) {
                    dateMapping[3]='00'
                    if(dateMapping[2]===undefined) dateMapping[2]='12'
                }
                
                for(const [i, el] of dateMapping.entries()) {
                    if(el.length===1) dateMapping[i]=`0${el}`
                }

                switch(chartTime) {
                    case '1':
                        return `${dateMapping[2]}:${dateMapping[3]}`
                    break
                    
                    case '12':
                    case '1d':
                        return `${dateMapping[1]}-${dateMapping[2]}ч.` 
                    break

                    case '7d':
                        return `${dateMapping[0]}.${dateMapping[1]}` 
                    break
                }
            })

            data=data.map((el) => {
                return parseInt(el)
            })
            
            for(let i=0; i<=date.length-1; i++) {
                result.labels.push(date[i])
                result.datasets[0].data.push(data[i])
            }

            return result
        },
        
    },
    computed: {
        stepsChartData() {
            return this.chartDataReady(this.stepsDate, this.stepsData, this.chartTimeSteps, 'steps')
        },
        heartChartData() {
            return this.chartDataReady(this.heartDate, this.heartData, this.chartTimeHeart, 'heart')
        }
    }
}
</script>

<style scoped>
#box {
    position: absolute;
    overflow: hidden;
    overscroll-behavior-y: contain;
    z-index: 1;
    height: 100%;
    width: 100%;
    background-color: #fafafa; 
}
#graph_1, #graph_2 {
    display: inherit;
    -webkit-box-orient: inherit;
    -webkit-box-direction: inherit;
        -ms-flex-direction: inherit;
            flex-direction: inherit;
    width:100%;
    height: 45%;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}
#heartGraphCont, #stepsGraphCont {
    position: relative;
    height: 100% !important;
    width: 100% !important;
}
#graph_1 p, #graph_2 p {
    color:#66587A;
    font-size: 18px;
    -webkit-transform: translateX(20px);
        -ms-transform: translateX(20px);
            transform: translateX(20px);
    margin-bottom: 8px;
}
#time_1, #time_2 {
    display: block;
    -webkit-transform: translateX(20px);
        -ms-transform: translateX(20px);
            transform: translateX(20px);
    font-size: 12px;
    color: #66587A;
}
#loading_1, #loading_2 {
    display: none;
    height: 35vh;
    width: 100%;
    background-color: #fafafa;
    position: absolute;
    z-index: 100;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    border: 1px solid rgba(0,0,0,0.2);
}
#loading_1 img, #loading_2 img {
    height: 20%;
    -webkit-animation: loadingAnim 1s infinite linear;
            animation: loadingAnim 1s infinite linear;
}
@-webkit-keyframes loadingAnim {
    from {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg)
    }
    to {
        -webkit-transform: rotate(359deg);
                transform: rotate(359deg)
    }
}
@keyframes loadingAnim {
    from {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg)
    }
    to {
        -webkit-transform: rotate(359deg);
                transform: rotate(359deg)
    }
}
</style>
