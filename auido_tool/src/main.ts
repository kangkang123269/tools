// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import copyDirective from './directives/copy'

const app = createApp(App)

app.directive('copy', copyDirective)

app.use(ElementPlus)
app.mount('#app')