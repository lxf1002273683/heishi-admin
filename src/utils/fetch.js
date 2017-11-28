import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
import { getToken } from '@/utils/auth';


// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers.Authorization = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response.data;
    if (response.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 2 * 1000
      });
      // 错误配置待定
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        })
      }
      return Promise.reject();
    } else {
      return response.data;
    }
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        // token过期
        case 400:
          Message({
            message: '登录过期，请重新登录',
            type: 'error',
            duration: 1 * 1000
          });
          setTimeout(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload();
            });
          }, 1000)
          break;
        default:
          // Message({
          //   message: error.response.data.message,
          //   type: 'error',
          //   duration: 2 * 1000
          // });
          console.log(error.response.status);
          console.log(error.response.data);
          console.log(error.response.headers);
          break;
      }
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    return Promise.reject(error.response.data);
  }
)

export default service;
