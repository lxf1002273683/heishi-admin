import fetch from '@/utils/fetch';
// 修改密码
export function update_password(from) {
  return fetch({
    url: '/warehouse/api/v1/password',
    method: 'post',
    data: from
  });
}

// 创建用户
export function add_users(from) {
  return fetch({
    url: '/warehouse/api/v1/users',
    method: 'post',
    data: from
  });
}

// 用户列表
export function users_list(from) {
  return fetch({
    url: '/warehouse/api/v1/users',
    method: 'get',
    params: from
  });
}

// 修改用户信息--假帐号，大卖家关联大帐号
export function relevanceUser_user(id, parentId) {
  return fetch({
    url: '/warehouse/api/v1/users/' + id,
    method: 'post',
    data: {
      parent_id: parentId
    }
  });
}

// 创建模块
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

// 更新模块名称
export function update_module(id, module) {
  return fetch({
    url: '/warehouse/api/v1/modules/' + id,
    method: 'post',
    data: {
      name: module
    }
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

