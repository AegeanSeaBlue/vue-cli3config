import '@babel/polyfill'
import App from './App.vue'

import {
    router,
    store
} from './router/index'

import axios from 'axios'
import VueAxios from 'vue-axios'
import {
    Upload, Switch
} from 'element-ui';


import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
//import 'vuetify/dist/vuetify.min.css'
import './assets/css/common.css'
import './assets/css/custom-theme.css'
import './assets/fonts/iconfont.css'

import 'element-ui/lib/theme-chalk/switch.css'


// Translation provided by Vuetify (javascript)
import zhCN from 'vuetify/es5/locale/zh-Hans'
import en from 'vuetify/es5/locale/en'


//校验组件
import './validator';
import i18n from './i18n/index'
import util from './util';


import API from './api';
import './filter.js';

//获取query里的字段
function queryString(item) {
    var svalue = location.href.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
    return svalue ? decodeURIComponent(svalue[1]) : '';
};

//获取需要的语言版本
var lang = queryString('lang') == 'zh-CN' ? 'zhCN' : 'en';


Vue.use(Upload);
Vue.use(Switch);


Vue.use(util);
Vue.use(API);


Vue.use(VueAxios, axios)

new Vue({
    el: '#app',
    router,
    i18n,
    store,
    vuetify: new Vuetify({
        lang: {
            locales: {
                zhCN,
                en
            },
            current: lang
        },
        theme: {
            primary: '#1b7cd7',
            success: '#09c2b7'
        },
        iconfont: 'mdi'
    }),
    render: h => h(App)
})


// http request 拦截器 注入token
axios.interceptors.request.use(
    config => {
        if (localStorage.JWT_TOKEN) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `${localStorage.JWT_TOKEN}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

//axios.defaults.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8';


// http response 拦截器
axios.interceptors.response.use(
    response => {
        var _status = response.data.status;

        /**
         * 必须显示return promise reject给后续错误处理流程
         * 或者return response给后续数据处理流程
         */
        switch (_status) {

            //权限有问题
            //   case -2:
            //     alert('You do not have permission');
            //     return Promise.reject('Unauthorized');
            //     break;

            //-3表示找不到对应的信息，404
            case -3:
                router.replace('/404')
                return Promise.reject('404');
                break;

            //身份认证有问题
            case -16:
                actions.AuthError();
                return Promise.reject('Authentication error');
                break;

            default:
                //其他默认交由下一步逻辑具体处理
                return response;
        }

    },
    error => {
        if (error.response) {
            console.log('axios:' + error.response.status);
        }
        return Promise.reject(error); // 返回接口返回的错误信息
    });


var actions = {
    //未授权后操作
    Unauthorized() {
        router.replace('/403');
    },
    //未登录
    Unlogin() {
        router.replace('/login');
    },
    //身份认证错误
    AuthError() {
        //清除token
        localStorage.removeItem('JWT_TOKEN');
        localStorage.removeItem('USER_NAME');
        localStorage.removeItem('USER_AVATAR');
        localStorage.removeItem('USER_ROLE_TYPE_ID');
        router.replace('/login');
    }

};
