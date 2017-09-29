import fetch from '@/utils/fetch';
// params是添加到url的请求字符串中的，用于get请求
// data是添加到请求体（body）中的， 用于post请求

// 获取待审核的入库申请
export function request_list(form) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/requests',
    method: 'get',
    params: form
  });
}

// 入库申请审核接口
export function pass_request(form) {
  return fetch({
    url: '/warehouse/api/v1/accountant/request',
    method: 'post',
    data: form
  });
}

// 邮费列表
export function payments_list(form) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/payments',
    method: 'get',
    params: form
  });
}

// 邮费申请审核接口
export function pass_payments(form) {
  return fetch({
    url: '/warehouse/api/v1/accountant/payment',
    method: 'post',
    data: form
  });
}

