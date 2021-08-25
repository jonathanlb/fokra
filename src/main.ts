import { createApp } from 'vue'
import Equal from 'equal-vue'
import 'equal-vue/dist/style.css'
import App from './App.vue'
import './registerServiceWorker'

createApp(App)
	.use(Equal)
	.mount('#app');
