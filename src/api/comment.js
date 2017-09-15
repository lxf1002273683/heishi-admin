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
