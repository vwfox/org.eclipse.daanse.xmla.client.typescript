import Main from '../routes/main/Main.vue';
import Dashboard from '../routes/dashboard/Dashboard.vue';
import Editor from '../routes/editor/Editor.vue';
import K1 from '../components/K1/K1.vue';
import {createRouter,createWebHashHistory} from 'vue-router'
let routes: ({ path: string; component: any })[];


routes = [
    {path: '/', component: Main ,name:"designer"},
    {path: '/dashboard', component: Dashboard, name: "dashboard"},
    {path: '/editor', component: Editor, name: "editor"},
    {path: '/test2', component: K1, name: "test"},
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
});
