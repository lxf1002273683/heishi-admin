import fetch from '@/utils/fetch';

// 获取卖家所有评论
export function comment_list(form) {
  return fetch({
    url: '/warehouse/api/v1/comments',
    method: 'get',
    params: form
  });
}

// 获取卖家与某个买家之间的历史评论
export function history_comment(id) {
  return fetch({
    url: '/warehouse/api/v1/comments/' + id + '/thread',
    method: 'get'
  });
}

// 回复评论
export function reply_comment(id, form) {
  return fetch({
    url: '/warehouse/api/v1/comments/' + id + '/reply',
    method: 'post',
    data: form
  });
}

// 删除评论
export function delete_comment(id) {
  return fetch({
    url: '/warehouse/api/v1/comments/' + id,
    method: 'delete'
  });
}

// 批量置评价已读
export function read_comment(form) {
  return fetch({
    url: '/warehouse/api/v1/comments/read',
    method: 'post',
    data: form
  });
}

// 注册快捷短语
export function add_quickphrases(form) {
  return fetch({
    url: '/warehouse/api/v1/quickphrases',
    method: 'post',
    data: form
  });
}
// 查询快捷短语
export function quickphrases_query(form) {
  return fetch({
    url: '/warehouse/api/v1/quickphrases',
    method: 'get',
    data: form
  });
}
// 删除快捷短语
export function delete_quickphrases(form) {
  return fetch({
    url: '/warehouse/api/v1/quickphrases',
    method: 'delete',
    data: form
  });
}

// 查询订单列表
export function orders_list(form) {
  return fetch({
    url: '/warehouse/api/v1/orders',
    method: 'get',
    params: form
  });
}

// 查询商品
export function query_goods(id) {
  return fetch({
    url: '/warehouse/api/v1/posts/' + id,
    method: 'get'
  });
}

