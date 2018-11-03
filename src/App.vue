<template>
    <div id="mainBox">
        <main>
            <mi-band></mi-band>
            <router-view>
            </router-view>
        </main>
        <footer style="display:flex; justify-content:space-around; align-items:center;" class="flexRow boxBorderTop">
            <router-link class="nav flexStyle flexColumn"
                :to="{name:'about'}"
                style="transform:translateX(16px);"
            > 
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="60%" height="60%" viewBox="0 0 128 128" enable-background="new 0 0 128 128" xml:space="preserve">
                    <g id="imfoSvg">
                        <g>
                            <path d="M64,0C28.656,0,0,28.656,0,64s28.656,64,64,64s64-28.656,64-64S99.344,0,64,0z M64,120C33.125,120,8,94.875,8,64    S33.125,8,64,8s56,25.125,56,56S94.875,120,64,120z M64,48c-4.414,0-8,3.586-8,8v40c0,4.414,3.586,8,8,8s8-3.586,8-8V56    C72,51.586,68.414,48,64,48z M64,24c-4.414,0-8,3.586-8,8s3.586,8,8,8s8-3.586,8-8S68.414,24,64,24z" fill="#66587a"/>
                        </g>
                    </g>
                </svg>
                
            </router-link>
            <router-link class="navHome flexStyle flexColumn"
                id="plusBox"
                :to="{name:'home'}"
            >
                <div style="height:100%; width:100%; position:absolute; top:0;"
                    >
                    <div id="plus" class="flexStyle">
                        <div  class="flexStyle boxBorder">
                            <img src="./assets/fitness-bracelet.svg" 
                                alt="home"
                                v-if="homeBtn"
                                >
                            <img src="./assets/plus.svg" 
                                alt="addDevice"
                                v-if="mainBtnState==='plus' && !homeBtn"
                                >
                            <img src="./assets/sync.svg" 
                                alt="gotSync"
                                v-if="mainBtnState==='got' && !homeBtn"
                                >
                        </div>
                    </div>
                </div> 
            </router-link>
            <router-link class="nav flexStyle flexColumn"
                :to="{name:'profile'}"
                style="transform:translateX(-16px);"
            >
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="60%" height="60%" viewBox="0 0 128 128" enable-background="new 0 0 128 128" xml:space="preserve">
                    <g id="userSvg">
                        <g>
                            <path d="M118.95,92.012c-3.778-3.777-10.1-7.074-20.066-12.059c-5.024-2.512-13.386-6.691-15.413-8.605    c8.489-10.434,13.416-22.219,13.416-32.535c0-7,0-15.711-3.918-23.48C89.437,8.336,81.544,0,64.002,0    C46.456,0,38.563,8.336,35.035,15.332c-3.923,7.77-3.923,16.48-3.923,23.48c0,10.32,4.923,22.102,13.417,32.535    c-2.032,1.918-10.393,6.098-15.417,8.605c-9.963,4.984-16.285,8.281-20.066,12.059c-8.369,8.375-9.002,22.426-9.045,25.16    c-0.043,2.852,1.059,5.609,3.067,7.648c2,2.031,4.743,3.18,7.595,3.18h106.669c2.86,0,5.596-1.148,7.6-3.18    c2.004-2.039,3.11-4.797,3.067-7.652C127.956,114.438,127.318,100.387,118.95,92.012z M119.235,119.203    c-0.508,0.512-1.184,0.797-1.903,0.797H10.663c-0.707,0-1.398-0.289-1.895-0.797c-0.496-0.504-0.777-1.199-0.77-1.91    c0.023-1.34,0.391-13.305,6.705-19.621c2.915-2.914,9.017-6.074,17.988-10.563c9.576-4.785,14.886-7.637,17.332-9.949l5.399-5.105    l-4.688-5.758c-7.384-9.07-11.623-19.09-11.623-27.484c0-6.473,0-13.805,3.063-19.875C45.842,11.68,53.179,8,64.002,8    c10.814,0,18.159,3.68,21.824,10.934c3.063,6.074,3.063,13.406,3.063,19.879c0,8.391-4.235,18.41-11.628,27.484l-4.688,5.762    l5.4,5.102c2.445,2.309,7.751,5.16,17.331,9.949c8.971,4.484,15.073,7.645,17.988,10.563c5.138,5.137,6.634,14.75,6.704,19.621    C120.009,118.004,119.731,118.699,119.235,119.203z" fill="#66587a"/>
                        </g>
                    </g>
                </svg>
            </router-link>
        </footer>
    </div>
</template>

<script>
import MiBand from './components/MiBand'
import anime from 'animejs'
import * as frames from './animation.js'//anime objects
export default {
components: {
    miBand: MiBand
},
data() {
    return {
        homeBtn:false,//what s the link
        onlyAddDevice:false,//manipulates home icon
        mainBtnState:'plus'
    }
},
watch: {
    $route() {//tracks href and changes home button icon according to route
        if(this.$route.name!=='home') this.homeBtn=true
    }
},
created() {
    this.$root.$on('gotDevice', () => this.mainBtnState='got')//changes main btn to synchronized
    this.$root.$on('lostDevice', () => {//changes main btn to plus 
        this.mainBtnState='plus'
        this.$root.$emit('reconnect', 'hide')//true is for hiding reconnect box if it was showed
    })
},
mounted() {
    let plusBox=document.querySelector('#plusBox'),
        plusBtn=document.querySelector('#plus').children[0],
        plusBtnTimeline=frames.plus(plusBtn).add({//animate plus button with anime.js
            update: anim => {
                if(anim.progress>=50 && changed===false && this.homeBtn) {        
                    this.homeBtn=!this.homeBtn
                    changed=true
                } 
            }
        }),
        changed=false

    plusBox.addEventListener('click', async() => {//home icon click monitoring
        changed=false
        if(!this.homeBtn) {
            if(this.mainBtnState==='plus') this.$root.$emit('getDevice')
            else this.$root.$emit('reconnect')
        }
        
        plusBtnTimeline.restart()//actually here is plusBtn animation starts
    })
}
}
</script>

<style scoped>
#mainBox {
    width:100vw;
    height:100vh;
    background-color: #fafafa;
    overscroll-behavior-y: contain
}
main {
    width:100%;
    height: 92%;
    position: relative;
    overflow: hidden;
    overscroll-behavior-y: contain
}
footer {
    width:100%;
    height:8%;
    max-height: 52px;
    background-color: #DAF5D0;
    position: fixed;
    bottom: 0;
    z-index: 10;
}
.nav, .navHome {
    width: 20%;
    height: 100%;
    color: #66587A;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

}
.nav svg, .navHome svg {
    display: block;
    -webkit-transition: .5s;
    -o-transition: .5s;
    transition: .5s;
}
.nav svg {
    height: 55%;
}
.navHome svg {
    height: 70%;
}
.nav:hover  path {
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    fill:black;
}
.nav span {
    display: block;
}
.nav:active, .nav:focus {
    background:none;
    outline: none;
    border: none;
}

#plusBox {
    position:relative;
    height:170%;
}
#plus {
    background-color: #fafafa;
    height: 15vw;
    width:15vw;
    margin-left: 2.5vw;
    border-radius: 50%;
}
#plus div {
    height: 85%;
    width: 85%;
    border-radius: 50%;
    background-color:#3DC648;
    color:#DAF5D0;
    font-size: 50px;
}
#plus div img {
    display: block;
    width:65%;
}
/*
#f8b5a5
rgba(255, 255, 255, 0.9)
#DEFFEB
#66587A
*/
</style>

<style>/*global styles*/
.btn {
    display: block;
    border-radius: 100px; 
    background-color: #DAF5D0;
}
.btn span {
    padding:4px;
    color:#66587A;
    text-align:center;
    display: block;
    font-size:10px;
}
.flexStyle {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
.flexRow {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
        -ms-flex-direction: row;
            flex-direction: row;
}
.flexColumn {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
}
.txtHeader {
    color:#66587A;
    font-size:10vh;
}
.txtDescription {
    color:#66587A;
    font-size:4vh;
}
.beforeAppear {
    right:-20%;
    opacity:0;
}
.appear {
    right:0;
    opacity: 1;
}
.trans {
    -webkit-transition:.3s ease-in-out;
    -o-transition:.3s ease-in-out;
    transition:.3s ease-in-out;
}
.boxShadowBot {
    -webkit-box-shadow: 0px 2px 4px rgba(97,83,117,0.7);
            box-shadow: 0px 2px 4px rgba(97,83,117,0.7)
}
.boxShadowTop {
    -webkit-box-shadow: 0px -2px 4px rgba(97,83,117,0.7);
            box-shadow: 0px -2px 4px rgba(97,83,117,0.7)
}
.boxBorder{
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    border:1px solid rgba(0,0,0,0.3);
}
.boxBorderTop {
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    border-top:1px solid rgba(0,0,0,0.3);
}
.boxBorderBot {
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    border-bottom:1px solid rgba(0,0,0,0.3);
}
.boxBorderLef {
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    border-left:1px solid rgba(0,0,0,0.3);
}
.boxBorderRig {
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    border-right:1px solid rgba(0,0,0,0.3);
}
</style>
