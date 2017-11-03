import fetch from '@/utils/fetch';

// 仓库创建修改
export function add_warehouse(form) {
  return fetch({
    url: '/warehouse/api/v1/warehouse',
    method: 'post',
    data: form
  });
}

export function warehouse_list() {
  return fetch({
    url: '/warehouse/api/v1/warehouses',
    method: 'get'
  });
}

export function update_warehouse(id, form) {
  return fetch({
    url: '/warehouse/api/v1/warehouse/' + id,
    method: 'post',
    data: form
  });
}
// 单个入库申请查询
export function get_request(id) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/request/' + id,
    method: 'get'
  });
}

// 分批入库
export function part_request(id, form) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/batch/' + id,
    method: 'post',
    data: form
  });
}

// 完成入库
export function pass_request(id) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/batch/' + id + '/finish',
    method: 'post'
  });
}

// 更新预售数量
export function update_scale(id, num) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/batch/' + id + '/presale',
    method: 'post',
    data: {
      presale_quantity: num
    }
  });
}

// 获取注册在次仓库的商品列表
export function get_skus(id, form) {
  return fetch({
    url: '/warehouse/api/v1/warehouse/' + id + '/skus',
    method: 'get',
    params: form
  });
}

// 查询出入库记录
export function stocklogs(form) {
  return fetch({
    url: '/warehouse/api/v1/stocklogs',
    method: 'get',
    params: form
  });
}

// 创建单个费用
export function add_payment(form) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/payment',
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

// 删除已注册在仓库的sku
export function delete_skus(form) {
  return fetch({
    url: '/warehouse/api/v1/warehouses/skus',
    method: 'delete',
    params: form
  });
}

// 获取黑市推过来的订单
export function orders_list(warehouse_id, form) {
  return fetch({
    url: '/warehouse/api/v1/warehouse/' + warehouse_id + '/invoices',
    method: 'get',
    params: form
  });
}


