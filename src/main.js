import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Home from './components/Home'
import About from './components/About'
import Profile from './components/Profile'

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{
			name: 'home',
			path: '/',
            component: Home
		},
		{
			name: 'about',
			path: '/about',
			component: About
		},
        {
			name: 'profile',
			path: '/profile',
			component: Profile
        }
	],
	mode: 'history'
})

new Vue({
	el: '#app',
	render: h=>h(App),
	router
})
