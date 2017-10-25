import fetch from '@/utils/fetch';

// 创建文章
export function add_article(form) {
  return fetch({
    url: '/warehouse/api/v1/posts',
    method: 'post',
    data: form
  });
}

// 查询文章
export function article_list(form) {
  return fetch({
    url: '/warehouse/api/v1/posts',
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

// 修改商品库存
export function update_type(id, skuList) {
  return fetch({
    url: '/warehouse/api/v1/posts/' + id,
    method: 'post',
    data: {
      skus: skuList
    }
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

