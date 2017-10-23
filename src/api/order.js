import fetch from '@/utils/fetch';
// params是添加到url的请求字符串中的，用于get请求
// data是添加到请求体（body）中的， 用于post请求

// 获取订单
export function order_list(form) {
  return fetch({
    url: '/warehouse/api/v1/orders',
    method: 'get',
    params: form
  });
}

// 查询订单收货地址信息
export function address_info(sn) {
  return fetch({
    url: '/warehouse/api/v1/orders/' + sn + '/address',
    method: 'get'
  })
}

// 卖家置订单发货
export function deliver(sn, form) {
  return fetch({
    url: '/warehouse/api/v1/orders/' + sn + '/deliver',
    method: 'post',
    data: form
  })
}

// 查询订单物流信息
export function express_info(sn) {
  return fetch({
    url: '/warehouse/api/v1/orders/' + sn + '/express',
    method: 'get'
  })
}

// 卖家处理退款申请
export function process_refund_order(id, form) {
  return fetch({
    url: '/warehouse/api/v1/refunds/' + id + '/process',
    method: 'post',
    data: form
  })
}

// 订单号搜索
export function order_number_search(n, that) {
  if (n === 0 && that.order_num !== '') {
    return false;
  }
  const obj = {
    order_number: that.order_num,
    status: that.selectInput
  }
  that.initOrderList(obj);
}

// 订单号搜索
export function name_tel_search(n, that) {
  if (n === 0 && that.keyword !== '') {
    return false;
  }
  const obj = {
    keyword: that.keyword,
    status: that.selectInput
  }
  that.initOrderList(obj);
}
