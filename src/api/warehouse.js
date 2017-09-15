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

// 提交入库申请
export function pass_request(id, form) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/batch/' + id,
    method: 'post',
    data: form
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



