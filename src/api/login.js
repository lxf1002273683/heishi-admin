import fetch from '@/utils/fetch';
// params是添加到url的请求字符串中的，用于get请求
// data是添加到请求体（body）中的， 用于post请求
export function login(account, password) {
  return fetch({
    url: '/warehouse/api/v1/login',
    method: 'post',
    data: {
      account,
      password
    }
  });
}

// 获取用户信息
export function getInfo() {
  return fetch({
    url: '/warehouse/api/v1/users/current',
    method: 'get'
  });
}

// 获取业务帐号对应帐号模块
export function getPrivileges(id) {
  return fetch({
    url: '/warehouse/api/v1/users/' + id + '/privileges',
    method: 'get'
  });
}

// 获取大帐号对应的大卖家，假帐号
export function getUserId(form) {
  return fetch({
    url: '/warehouse/api/v1/users',
    method: 'get',
    params: form
  });
}

// 暂时没用使用
export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  });
}



