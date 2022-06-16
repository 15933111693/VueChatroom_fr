import { createRouter, createWebHistory } from 'vue-router'
import { get, clear } from '@/plugins/localstorage'
import store from '@/store'
import socket from '@/plugins/socket'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue')
  },
  {
    path: '/chatList',
    name: 'chatList',
    component: () => import('@/views/ChatListView.vue')
  },
  {
    path: '/chatRoom',
    name: 'charRoom',
    component: () => import('@/views/ChatRoomView.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/AccountView.vue')
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const authorizePath = ['/chatList', '/chatRoom', '/account']
const authorizePathSet = new Set([...authorizePath])

router.beforeEach(async (to, from, next) => {
  // 做token过期
  const curTime = new Date().getTime()
  const tokenTime = get('tokenTime') || Infinity
  const createTokenTime = get('createTokenTime') || Infinity
  if (createTokenTime + tokenTime <= curTime) {
    clear()
  }

  // 判断token
  const token = get('token') || null
  if (token === null && authorizePathSet.has(to.path)) {
    await next({ path: '/login' })
    return
  }

  // 设置user
  const user = get('user') || null
  if (store.state.isFirstToPage) {
    if (user !== null) {
      store.commit('user/userInit', user)
      await socket.createNewInstance(token)
    }
    store.commit('joinPage')
  }

  await next()
})

export default router
