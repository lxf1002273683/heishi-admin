import fetch from '@/utils/fetch';
// 创建业务用户
export function add_users(from) {
  return fetch({
    url: '/warehouse/api/v1/users',
    method: 'post',
    data: from
  });
}

// 业务用户列表
export function users_list(form) {
  return fetch({
    url: '/warehouse/api/v1/users',
    method: 'get',
    params: form
  });
}

// 业务用权限配置
export function add_module(from) {
  return fetch({
    url: '/warehouse/api/v1/modules',
    method: 'post',
    data: from
  });
}

// 获取模块列表
export function modules_list() {
  return fetch({
    url: '/warehouse/api/v1/modules',
    method: 'get'
  });
}

// 给管理员创建的业务帐号配置权限
export function user_privilege(from) {
  return fetch({
    url: '/warehouse/api/v1/privileges',
    method: 'post',
    data: from
  });
}

