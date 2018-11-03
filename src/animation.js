import anime from 'animejs'
export function plus(target) {
    let plusTimeline=anime.timeline({
        targets: target,
        duration: 500,
        rotate:['0turn', '20turn'],
        scale:[
            {value:1, duration:0},
            {value:'*=.7', duration:250},
            {value:1, duration:250}
        ],
        autoplay:false,
        easing: 'easeInOutQuint'
    })
    return plusTimeline
}

export function log(target) {
    let logTimeline={
        targets: target,
        duration:600,
        translateY:'-=3vh',
        autoplay:true,
        easing: 'easeInOutQuint'
    }
    return logTimeline
}

export function logProgress(target, value) {
    return {
        targets: target,
        value: value,
        round: 1
    }
}

export function stab(target,to) {
    target.style.transition='.2s'
    target.style.transform=`translateX(${to}px)`
    setTimeout(()=> {
        target.style.transition='0s'
    }, 200)
}

export function shoes(target,way) {
    let a=way/10,
        b=a/4,
        wind=document.querySelector('#shoesWind'),
        changed=false
    return {
        targets:target,
        rotate:[
            {value:'-80deg', duration:0, delay:0},
            {value:'-60deg', duration:a, delay:0},
            {value:'-30deg', duration:b, delay:0},
            {value:'-0deg', duration:b, delay:0},
            {value:'-0deg', duration:0, delay:0}
        ],
        bottom:[
            {value:'40%', duration:0, delay:0},
            {value:'-8%', duration:a, delay:0},
            {value:'-8%', duration:b, delay:0},
            {value:'0%', duration:b, delay:0},
            {value:'40%', duration:a, delay:0}
        ],
        left:[
            {value:'-60%', duration:0, delay:0},
            {value:'25%', duration:a, delay:0},
            {value:'25%', duration:b, delay:0},
            {value:'25%', duration:b, delay:0},
            {value:'100%', duration:a, delay:0}
        ],
        update: anim => {
            if(anim.progress>=65 && changed===false) {        
                wind.style.opacity='1'
                changed=true
            }
            if(anim.progress===100 && changed===true) {        
                wind.style.opacity='0'
                changed=false
            }
        },
        autoplay:false,
        loop:true,
        easing: [.62,.61,.73,.75]
    }
}

export function heart(target,rate) {
    let x=60*1000/(1.7*rate);
    return {
        targets:target,
        scale:[
            {value:1, duration:1*x},
            {value:1.1, duration:.5*x},
            {value:1, duration:.2*x}
        ],
        loop:true,
        autoplay:false
    }
}
