import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import * as Db from './common/db.js'
import * as Api from './common/api.js'
import * as Common from './common/common.js'
import * as Socket from './common/socket.js'
import * as Audio from './common/audio.js'
import * as mySocket from './common/mysocket.js'
Vue.prototype.$api = Api;
Vue.prototype.$common = Common;
Vue.prototype.$db = Db;
Vue.prototype.$socket = Socket;
Vue.prototype.$audio = Audio;
Vue.prototype.$mysocket = mySocket;

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

//	按钮
import myButton from './colorui/components/my-button.vue';
Vue.component('myButton', myButton)

//	输入框
import myInput from './colorui/components/my-input.vue'; 
Vue.component('myInput', myInput)

//	提示消息
import myMessage from './colorui/components/my-message.vue';
Vue.component('myMessage', myMessage)

//	顶部条
import myBar from './colorui/components/my-bar.vue';
Vue.component('myBar',myBar)

//	自定义预览界面 
import preview from './colorui/components/my-preview.vue';
Vue.component('preview',preview)




import loadModal from './moyiui/components/load-modal.vue';
Vue.component('loadModal',loadModal)

import bottomMenu from './moyiui/components/bottom-menu.vue';
Vue.component('bottomMenu',bottomMenu)

import moreModal from './moyiui/components/more-modal.vue';
Vue.component('moreModal',moreModal)

import previewModal from './moyiui/components/preview-modal.vue'; 
Vue.component('previewModal',previewModal)

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

import store from '@/store';

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

const app = new Vue({
	store,
	...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js';
Vue.use(httpApi, app);

app.$mount()
