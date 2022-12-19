import Vue from 'vue'
import VueRouter from 'vue-router'
import Recipes from '../components/Recipes.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/recipes',
    name: 'Recipes',
    component: Recipes
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/recipes' 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
