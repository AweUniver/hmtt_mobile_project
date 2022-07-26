import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEditor from '@/views/User/UserEdit'
// import Chat from '@/views/Chat'
import { getToken } from '@/utils/token.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 默认显示layout下的首页
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName:"Login" */ '@/views/Login')
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName:"Layout" */ '@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName:"Home" */ '@/views/Home'),
        meta: {
          scrollT: 0// 保存首页离开时滚动条位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName:"User" */ '@/views/User')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName:"Search" */ '@/views/Search')
  },
  {
    // 搜索结果页
    path: '/search_result/:kw',
    component: () =>
      import(/* webpackChunkName:"SearchResult" */ '@/views/Search/SearchResult.vue')
  },
  {
    // 文章详情页
    path: '/detail',
    component: () =>
      import(/* webpackChunkName:"ArticleDetail" */ '@/views/ArticleDetail')
  },
  // 用户编辑页面
  {
    path: '/user_editor',
    component: () =>
      import(/* webpackChunkName:"UserEdit" */ '@/views/User/UserEdit')
  },
  // 小思同学
  {
    path: '/chat',
    component: () => import(/* webpackChunkName:"Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})
// 路由-全局前置首位
router.beforeEach((to, from, next) => {
  if (getToken()?.length > 0 && to.path === '/login') {
    // next(false)
    next('/layout/home')
  } else {
    next()
  }
})
export default router
