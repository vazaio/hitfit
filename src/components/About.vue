<template>
    <div id="box" class="flexStyle flexColumn">
        <h2>О приложении</h2>
        <img src="../assets/logo.svg" alt="logo" id="logo">
        <br>
        <p>HitFit служит для считывания данных с фитнес браслетов (преимущественно MI Band, Mi Band 2).</p>
        <br>
        <p>Приложение созданно с использованием Vue.js, Vue router, anime.js, chart.js</p>
        <br>
        <p>Для корректной работы приложения необхадимо наличие сервисов WebBluetooth, Service Worker</p>
    </div>
</template>

<script>
export default {
    
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
#logo {
    height: 10%;
}
p {
    width: 90%;
}
h2, p {
    color: #66587A;
}
</style>
