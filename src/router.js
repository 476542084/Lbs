import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Home = ()=> import('./views/Home.vue')
const About = ()=> import('./views/about.vue')

const router = new Router({
    //指定路由选中时的样式类名
    // linkActiveClass : 'active',
    mode: 'hash',
    base: process.env.BASE_URL,
    // hashbang: true,//将路径格式化为#！开头
    // history : true,//启动HTML5 history模式，可以使用pushState和replaceState来管理记录
    routes: [
        {
            path:'/',
            name:'home',
            component: Home 
        },
        {
            path:'/about',
            name:'about',
            component: About 
        }
    ]
})

export default router