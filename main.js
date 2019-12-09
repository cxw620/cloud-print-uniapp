import Vue from 'vue'
import App from './App'
import ConfirmModal from "@/components/confirmModal/confirmModal"
import ToastModal from "@/components/toastModal/toastModal"
import {
	showMessage
} from '@/common/js/utils.js'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.component('confirm-modal', ConfirmModal);
Vue.component('toast-modal', ToastModal);
Vue.prototype.showMessage = showMessage;

const app = new Vue({
	...App
})
app.$mount()
