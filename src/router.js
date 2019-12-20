import Vue from 'vue';
import Router from 'vue-router';
import {isMobile} from '@/utils/common'

Vue.use(Router);


//用户-移动端
const Home = ()=> import('./views/Home.vue')
const About = ()=> import('./views/about.vue')
const Login = ()=> import('./views/login.vue')
const User = ()=> import('./views/user.vue')
const Register = ()=> import('./views/register.vue')
const PopularMsg = ()=> import('./views/popularMsg.vue')
const Experience = ()=> import('./views/experience.vue')
const Attention = ()=> import('./views/attention.vue')

//管理员-PC端
const Index = ()=> import('./views/admin/index.vue')
const Login_PC = ()=> import('./views/admin/login.vue')

const routes_mobile = [
    {
        path: '*',
        redirect: '/user',
        component: User 
    },
    {
        path:'/home',
        name:'home',
        component: Home 
    },
    {
        path:'/about',
        name:'about',
        component: About 
    },
    {
        path:'/register',
        name:'register',
        component: Register 
    },
    {
        path:'/login',
        name:'login',
        component: Login 
    },
    {
        path: '/',
        redirect: '/user',
        component: User 
    },
    {
        path:'/user',
        name:'user',
        component: User 
    },
    {
        path:'/popularMsg',
        name:'popularMsg',
        component: PopularMsg 
    },
    {
        path:'/experience',
        name:'experience',
        component: Experience 
    },
    {
        path:'/attention',
        name:'attention',
        component: Attention 
    }
]

const routes_pc = [
    {
        path: '*',
        redirect: '/',
        component: Index 
    },
    {
        path:'/',
        name:'index',
        component: Index 
    },
    {
        path:'/login',
        name:'login',
        component: Login_PC 
    }
]

const router = new Router({
    //指定路由选中时的样式类名
    // linkActiveClass : 'active',
    mode: 'hash',
    base: process.env.BASE_URL,
    // hashbang: true,//将路径格式化为#！开头
    // history : true,//启动HTML5 history模式，可以使用pushState和replaceState来管理记录
    routes: routes_mobile
})

const router_pc = new Router({
    //指定路由选中时的样式类名
    // linkActiveClass : 'active',
    mode: 'hash',
    base: process.env.BASE_URL,
    // hashbang: true,//将路径格式化为#！开头
    // history : true,//启动HTML5 history模式，可以使用pushState和replaceState来管理记录
    routes: routes_pc
})


export default isMobile() ? router : router_pc