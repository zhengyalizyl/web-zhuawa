import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/edit'
        },
        {
            path: '/edit',
            name: 'edit',
            component: () => import('./pages/edit.vue')
        },
        {
            path: '/preview',
            name: 'preview',
            component: () => import('./pages/preview.vue')
        }
    ]
})

export default router