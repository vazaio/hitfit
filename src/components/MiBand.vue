<template>
    <div id="box">
    <div id="mainApp">
        <div id="log" class="boxBorderBot">
            <div>
                <span class="logItem spanLogStyle" v-for="(el,index) in log" :key="index">{{el}}<br></span>
            </div>
            <section class="flexStyle">
                <input type="text" value="0" class="spanLogStyle">
                <span class="spanLogStyle">%</span>
            </section>
        </div>
        <div id="slider" class="flexStyle flexColumn">
            <div id="slides">
                <div id="slidesBox" class="flexStyle flexRow">
                    <div>
                        <div>
                            <section class="slideAnimBox flexStyle flexColumn">
                                <img src="../assets/shoes.svg" alt="shoes" id="shoes">
                                <img src="../assets/wind.svg" alt="wind" id="shoesWind">
                            </section>
                            <section class="slideInfo">
                                <p>Сегодня сделано <strong>{{values.pedometer.steps}}</strong> шагов</p>
                                <p>Это <strong>{{values.pedometer.distance}}</strong> метров</p>
                                <p>Сожжено <strong>{{values.pedometer.calories}}</strong> калорий</p>
                            </section>
                        </div>
                    </div>
                    <div>
                        <div>
                            <section class="slideAnimBox flexStyle flexColumn">
                                <img src="../assets/heart.svg" alt="heart" id="heart">
                            </section>
                            <section class="slideInfo flexStyle flexColumn">
                                <p>Сердечный ритм</p>
                                <h1>{{values.heartRate.heartRate}}</h1>
                                <p>RR интервалы: <strong>{{values.heartRate.rrIntervals}}</strong></p>
                            </section>
                        </div>
                    </div>
                    <div>
                        <div>
                            <section class="slideAnimBox flexStyle flexColumn">
                                <img src="../assets/flash.svg" alt="charging" 
                                    style="height:10%; position:absolute; left:70%; top:20%"
                                    v-if="values.battery.charging"    
                                >
                                <ul id="battery">
                                    <li></li>
                                    <li>
                                        <span id="batteryLevel"></span>
                                    </li>
                                </ul>
                            </section>
                            <section class="slideInfo">
                                <p>Уровень заряда батареи <strong>{{values.battery.level}} %</strong></p>
                                <p>Зарядное устройство {{values.battery.charging ? '' : 'не '}}подключено</p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <div id="slidesIcons" class="flexStyle flexRow">
                <div @click="slidesBtnHandler" id="firstSlide">
                    <img src="../assets/stepIcon.svg" class="icon iconScaled" alt="steps" style="height:48%">
                </div>
                <div @click="slidesBtnHandler" id="secondSlide">
                    <img src="../assets/heartIcon.svg" class="icon" alt="heart" style="height:60%">
                </div>
                <div @click="slidesBtnHandler" id="thirdSlide">
                    <img src="../assets/batteryIcon.svg" class="icon" alt="battery" style="height:48%">
                </div>
            </div>
        </div>
        <div id="reconnectBox" class="flexStyle flexColumn reconnectShow trans">
            <div  class="btn boxBorderTop boxBorderLef boxBorderRig boxBorderBot boxShadowBot">
                <span @click="onReconnect" id="getNewDevice">
                    Выполнить поиск нового устройства
                </span>
            </div>
            <div class="btn boxBorderTop boxBorderLef boxBorderRig boxBorderBot boxShadowBot">
                <span id="retrieveChars">
                    Переподключиться
                </span>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import * as utils from '../utils.js'
import devConfig from '../config.js'//17
import * as frames from '../animation.js'
import anime from 'animejs'
export default {
data() {
    return {
        log:['Ожидание'],//log
        logCounter:1,//uses to track count of written logs
        logUpdating:false,
        device: {},//inclusdes last added device
        values: {//includes values of battery heartrate and etc
            pedometer: {
                steps: '---',
                distance: '---',
                calories: '----'
            },
            heartRate: {
                heartRate: '--',
                rrIntervals: '----'
            },
            battery: {
                level: '--',
                charging: false
            }
        },
        progressCounter:1,//progress bar
        activeSlide:0,
        slideWidth:0,
        slidesIcons:{},//uses to scale slide icons in accordance with active slide
        slidesAnimationObjects:{
            pedometer:{},
            heartRate:{}
        }
    }
},
watch: {
    log: async function() {//update log at the top of app

        if(!this.logUpdating) {
            var logDiv=document.querySelector('#log').children[0],
            length=this.log.length
            
            this.logUpdating=true
    
            let toUpdate=new Array(this.log.length-this.logCounter)//this is done in order to use await in a synchronous function
            
            for (let i of toUpdate) {
                await anime(frames.log(logDiv)).finished
                this.logCounter++   
                        
            }

            this.logUpdating=false

            if(this.log.length!==length) {//it's not a crutch, it's an elegant prosthesis for a recursive function call xD
                this.log.unshift(this.log.shift())
            }

        }
        
        if(this.log.length>10 && !this.logUpdating) {//cuts array
            this.log[0]=this.log.pop()
            this.log.length=1
            this.logCounter=1
            logDiv.style.transform='translateY(0)'
        }
        
    },
    progressCounter: async function() {//translate to %
        let ler=Math.ceil((this.progressCounter/17)*100)
        await anime(frames.logProgress('input', ler)).finished
        return  
    }
},
created() {
    let heartData='62|68|65|88|',
        heartDate='11 2 10|11 2 11|11 2 12|11 2 15 5|',
        stepsData='4005|5005|2080|1000|',
        stepsDate='11 2 10|11 2 11|11 2 12|11 2 15 5|'
    
    if(!localStorage.getItem('heartData') && !localStorage.getItem('heartDate')) {
        localStorage.setItem('heartData', heartData)
        localStorage.setItem('heartDate', heartDate)
    }
    if(!localStorage.getItem('stepsData') && !localStorage.getItem('stepsDate')) {
        localStorage.setItem('stepsData', stepsData)
        localStorage.setItem('stepsDate', stepsDate)
    }

    if('bluetooth' in navigator) {
        this.$root.$on('getDevice', this.onGetDevice)
        this.$root.$on('getChars', this.onGetChars)
        this.$root.$on('reconnect', this.onReconnect)
    }
    else this.log.push('Нет соединения')
    
    this.slidesIcons=document.getElementsByClassName('icon')
    
    this.$on('slidePrev', async () => {
        this.activeSlide--
        this.stabilizer()
        this.addHoverClass(this.slidesIcons)
    })
    this.$on('slideNext', async () => {
        this.activeSlide++
        this.stabilizer()
        this.addHoverClass(this.slidesIcons)
    })
},
methods: {
    addHoverClass() {
        for(let el of this.slidesIcons) {   
            el.classList.remove('iconScaled')
        }
        this.slidesIcons[this.activeSlide].classList.add('iconScaled')
    },
    parseFunc(data, by) {
        return data.split(by)
    },
    compressor(store) {//compresses data in local storage
        let data=this.parseFunc(localStorage.getItem(`${store}Data`), '|'),
            date=this.parseFunc(localStorage.getItem(`${store}Date`), '|')

        data.pop() 
        date.pop()

        let now, prev, mod, compared,
            date_1=this.parseFunc(date[date.length-1], ' '),
            date_2=this.parseFunc(date[date.length-2], ' ')
        
        if(date_1[1]!==date_2[1]) {//days
            mod=1
        }
        
        if(date_1[0]!==date_2[0]) {//months
            mod=0
        }

        compared=this.parseFunc(date[date.length-2], ' ')[1+mod]
        
        now=date_1[0]+' '+date_1[1]
        prev=date_2[0]+' '+date_2[1]    
        
        if(now!==prev) {
            let sum=0, 
                i=date.length-2,
                toCompare,
                divider=0

            function changeData() {//writes mean value to array
                data.splice(i+1, divider, `${Math.floor(sum/divider)}`)
                date.splice(i+1, divider, `${prev}${mod==0 ? '' : ' ' + compared}`)
            }

            while(date[i].indexOf(prev)===0) {
                toCompare=this.parseFunc(date[i], ' ')[1+mod]
                
                if(compared!==toCompare) {
                    changeData()
                    
                    compared=toCompare
                    sum=parseInt(data[i])
                    divider=1
                }
                else {
                    sum+=parseInt(data[i])
                    divider++
                }
                if(i===0) break

                i--
            }

            changeData()

            localStorage.setItem(`${store}Data`, data.join('|').concat('|'))
            localStorage.setItem(`${store}Date`, date.join('|').concat('|'))
        }
        return
    },
    writeStorage(_data, mod) {//writes heart data or steps data to storage
        let str = new Date(),
            _date=`${str.getMonth()+1} ${str.getDate()} ${str.getHours()} ${str.getMinutes()}`,
            data, date

        data=localStorage.getItem(`${mod}Data`)
        date=localStorage.getItem(`${mod}Date`)
        
        data=data.concat(_data, '|')
        date=date.concat(_date, '|')

        localStorage.setItem(`${mod}Data`, data)
        localStorage.setItem(`${mod}Date`, date)

        return
    },
    slidesBtnHandler(e) {
        switch(e.target.id) {
            case 'firstSlide':
                this.activeSlide=0
            break
            case 'secondSlide':
                this.activeSlide=1
            break
            case 'thirdSlide':
                this.activeSlide=2
            break
        }
        this.addHoverClass()
        this.stabilizer()
    },
    stabilizer() {//smoothly moves slides
        this.animationPlayPause()//activates or dabbles animation
        let to = (-1)*this.activeSlide*this.slideWidth,
            target=document.querySelector('#slidesBox')
        anime(frames.stab(target, to))//smoth animation----
    },
    onReconnect(e) {
        if(e && e!=='hide') {//filters events from the app
            if(e.target.id==='getNewDevice') this.$root.$emit('getDevice')
            if(e.target.id==='retrieveChars') this.$root.$emit('getChars')
        }
        
        let box = document.querySelector('#reconnectBox')
        if(e==='hide') box.classList.remove('reconnectShow')//hides box if device was lost
        
        box.classList.toggle('reconnectShow')
    },
    onGetDevice: async function() {
        try {
            let myDevice=await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: [
                    0xfee0,//battery pedometer
                    0x180d,//heart rate
                    'battery_service',
                    'location_and_navigation',//pedometer
                    'heart_rate'
                ]
            })
            this.log.push('Найдено устройство')
            this.device=myDevice
            this.$root.$emit('getChars')
            document.querySelector('#retrieveChars')//actives button retrieveChars
            .addEventListener('click', this.onReconnect)
            this.progressCounter=0
        }
        catch(err) {this.log.push('Устройство недоступно')}
    },
    onGetChars: async function() {
        if(!this.device.name) return//ends the function if the device is not recognized
        else {
        this.progressCounter=3
        try {
            const server=await this.device.gatt.connect()
            this.progressCounter++
            
            await this.device.addEventListener('gattserverdisconnected', () => {
                this.log.push('Соединение разорвано')
                this.$root.$emit('lostDevice')
                document.querySelector('#retrieveChars')//disables button retrieveChars
                .removeEventListener('click', this.onReconnect)
            })
            this.progressCounter++
            
            this.log.push('Подключено')

            let service={}
            let char={}
            let readedData={}
            let config={}
            
            if(this.device.name.indexOf('MI Band')!==-1) config=devConfig.miband
            else config=devConfig.standart

            this.log.push('Получение данных')
            
            for(let key in config.services) {
                try {
                    service=await server.getPrimaryService(config.services[key])
                    this.progressCounter++
                    
                    char=await service.getCharacteristic(config.chars[key])
                    this.progressCounter++
                    
                    if(key!=='heartRate') readedData[key]=await char.readValue()
                    this.progressCounter++
                    
                    await char.startNotifications()
                    this.progressCounter++
                    
                    char.addEventListener(
                        'characteristicvaluechanged',
                        this.onCharChanged
                    )
                }
                catch(err) {
                    this.log.push('Сервис недоступен')
                    continue
                }
                
            }
            this.values.battery=utils.getBattery(readedData.battery)
            this.values.pedometer=utils.getPedometer(readedData.pedometer)
            
            this.writeStorage(this.values.pedometer.distance, 'steps')
            this.compressor('steps')

            this.$root.$emit('gotDevice')
            this.log.push('Готово')
            this.progressCounter=17//finally loaded
        }
        catch(err) {
            this.progressCounter=0
            this.log.push(`Ошибка соединения ${err}`)
        }
        }
    },
    onCharChanged(e) {
        let ev=e.target
        this.log.push('Обновление данных')
        
        if(ev.uuid.indexOf('0006')!==-1 || ev.uuid.indexOf('2a19')!==-1) {
            this.values.battery=utils.getBattery(ev.value)
            return
        }
        if(ev.uuid.indexOf('0007')!==-1 || ev.uuid.indexOf('2a6a')!==-1) {
            this.values.pedometer=utils.getPedometer(ev.value)

            this.writeStorage(this.values.pedometer.distance, 'steps')
            this.compressor('steps')

            return
        }
        if(ev.uuid.indexOf('2a37')!==-1) {
            this.values.heartRate=utils.getHeartRate(ev.value)

            this.writeStorage(this.values.heartRate.heartRate, 'heart')
            this.compressor('heart')

            return
        }
        
        this.log.push('Готово')
    },
    animationPlayPause() {//reload animation---crutch, anim is animation to reload        
        this.slidesAnimationObjects.heartRate.pause()
        this.slidesAnimationObjects.pedometer.pause()
        if(this.activeSlide===0) this.slidesAnimationObjects.pedometer.play()
        if(this.activeSlide===1) this.slidesAnimationObjects.heartRate.play()
    }
},
mounted() {
    //this.writeStorage(88, 'heart')
    //-----------------------------------anime steps---------------
    this.slidesAnimationObjects.heartRate=anime(frames.heart('#heart',60))
    this.slidesAnimationObjects.pedometer=anime(frames.shoes('#shoes',5000))  
    this.slidesAnimationObjects.pedometer.play()//starts animation at first slide
    //-------------------------------------------------------------
    
    const slidesBox=document.querySelector('#slidesBox')
    
    this.slideWidth=parseInt(getComputedStyle(slidesBox.children[0]).width)
    
    let sliderTouchStart,
        sliderFrom=0,
        sliderTo

    var time=0,//uses to calculate the speed
        timerInterval//its too
    
    slidesBox.addEventListener('touchstart', (e) => {
        sliderTouchStart=parseInt(e.changedTouches[0].pageX)

        let style = getComputedStyle(slidesBox)

        let matrix = new WebKitCSSMatrix(style.webkitTransform)
        
        sliderFrom=matrix.m41//just get translateX
        
        time=0

        timerInterval=setInterval(() => {//the larger this value, the slower the speed
            time++
        },10)

    })

    slidesBox.addEventListener('touchmove', (e) => {
        
        

        sliderTo=parseInt(e.changedTouches[0].pageX)-sliderTouchStart+sliderFrom//value on which it need to slide slides

    

        if(sliderTo>=50 || sliderTo<=(0-this.slideWidth*2-50)) return//prevents out of bounds
        

        slidesBox.style.transform=`translateX(${sliderTo}px)`//slider engine
        


    })

    slidesBox.addEventListener('touchend', (e) => {
        clearInterval(timerInterval)
        
        let move=sliderTo-sliderFrom,//calculates how much to move the block
            len=time/100//calcгlates speed
        
        if(len>0.5) len=0.5//constraints
        if(len<0.1) len=0.1
        
        


        if(Math.abs(move)>=this.slideWidth*len) {//starts the slide change depending on the speed
            if(sliderTo<0 && sliderTo>(0-this.slideWidth*2)) {
                if(move>0) this.$emit('slidePrev')
                if(move<0) this.$emit('slideNext')
            }
        }
        
        this.stabilizer()

    })
}
}
</script>

<style scoped>
    .slideAnimBox {
        width: 90%;
        height: 76%;
        position: relative;
        overflow: hidden;
    }
    #battery {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        height: 65%;
        width: 25%;
    }
    #battery li:nth-child(1) {
        display: block;
        width:30%;
        height:2%;
        border-top: 4px solid #66587a;
        border-left: 4px solid #66587a;
        border-right: 4px solid #66587a;
        border-radius: 10px;
    }
    #battery li:nth-child(2) {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-pack: end;
            -ms-flex-pack: end;
                justify-content: flex-end;
        width:100%;
        height:98%;
        border:4px solid #66587a;
        border-radius: 10px;
    }
    #batteryLevel {
        display: block;
        border-radius: 0px 0px 10px 10px;
        width:100%;
        height: 50%;
        background-color: #3DC648;
        -webkit-transition: 2s;
        -o-transition: 2s;
        transition: 2s;
    }
    #shoes {
        display: block;
        height: 60%;
        position: absolute;
    }
    #shoesWind {
        display:block;
        width: 30%;
        position: absolute;
        -webkit-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
                transform: rotate(180deg);
        bottom:10%;
        left:10%;
        opacity: 0;
    }
    #heart {
        display: block;
        height: 60%;
        position: absolute;
    } 
    .slideInfo {
        height: 24%;
        display: inherit;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-pack: inherit;
            -ms-flex-pack: inherit;
                justify-content: inherit;
    }
    .slideInfo p {
        margin: 4px;
        font-size: 16px;
    }
    #slider {
        width:100%;
        height: 100%;
    }
    #slides {
        width:100%;
        height: 60%;
        overflow: hidden;
    }
    #slidesBox {
        width:300%;
        height: 100%;
        -webkit-transition-timing-function: ease-out;
             -o-transition-timing-function: ease-out;
                transition-timing-function: ease-out;
    }
    #slidesBox div {
        width:100vw;
        height: 100%;
        display: inherit;
        -webkit-box-pack: inherit;
            -ms-flex-pack: inherit;
                justify-content: inherit;
        -webkit-box-align: inherit;
            -ms-flex-align: inherit;
                align-items: inherit;
    }
    #slidesBox div div{
        border-radius:12px;
        border: 1px solid rgba(0, 0, 0, 0.3);
        margin:2% 2vw 2% 2vw;
        width:96vw;
        height: 96%;
        display: inherit;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-pack: inherit;
            -ms-flex-pack: inherit;
                justify-content: inherit;
        -webkit-box-align: inherit;
            -ms-flex-align: inherit;
                align-items: inherit;
    }
    #slidesIcons {
        margin-top:15%;
        width:100%;
        height: 10%;
        border-top:1px solid rgba(0,0,0,0.3);
        border-bottom:1px solid rgba(0,0,0,0.3);
    }
    #slidesIcons div {
        width:25%;
        height: 100%;
        display: inherit;
        -webkit-box-orient: inherit;
        -webkit-box-direction: inherit;
            -ms-flex-direction: inherit;
                flex-direction: inherit;
        -webkit-box-align: inherit;
            -ms-flex-align: inherit;
                align-items: inherit;
        -webkit-box-pack: inherit;
            -ms-flex-pack: inherit;
                justify-content: inherit;
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .iconScaled {
        -webkit-transform: scale(1.4);
            -ms-transform: scale(1.4);
                transform: scale(1.4)    
    }
    #slidesIcons div img {
        display: inherit;
        -webkit-box-orient: inherit;
        -webkit-box-direction: inherit;
            -ms-flex-direction: inherit;
                flex-direction: inherit;
        -webkit-box-align: inherit;
            -ms-flex-align: inherit;
                align-items: inherit;
        -webkit-box-pack: inherit;
            -ms-flex-pack: inherit;
                justify-content: inherit;
        -webkit-transition: .2s;
        -o-transition: .2s;
        transition: .2s;
        z-index: -1;
    }
    #box {
        position: absolute;
        overscroll-behavior-y: contain;
        z-index: 0;
        width:100%;
        height:100%;
    }
    #mainApp {
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
        color:#66587a;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        width:100%;
        height: 100%;
    }
    #reconnectBox {
        display: block;
        position:fixed;
        bottom: 9.5vh;
        z-index: 20;
    }
    .reconnectShow {
        -webkit-transform: translateY(150%);
            -ms-transform: translateY(150%);
                transform: translateY(150%)
    }
    #reconnectBox .btn {
        margin:10px 0 10px 0;
    }
    #log {
        height: 3vh;
        font-size: 1.6vh;
        overflow-y: scroll;
        position: relative;
        top:0;
        width:100%;
        background-color: #DAF5D0;
        overflow: hidden;
    }
    #log div {
        overflow:hidden;
        width:100%;
        position: absolute;
    }
    #log section {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: absolute;
        right:0;
        width:10%;

    }
    #log section input {
        background: none;
        color:#66587a;
        border:none;
        display: block;
        font-size: 1.6vh;
        width:65%;
        text-align: center;
    }
    #log section span {
        display: block;
        text-align: center;
        width: 35%;
    }
    .logItem{
        display: block;
        width:100%;
        text-align: center;
    }
    .spanLogStyle {
        height: 2vh;
        padding-top:.5vh;
        padding-bottom: .5vh;
    }
</style>
