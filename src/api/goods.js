import fetch from '@/utils/fetch';

// 商品分类
export function categories_list() {
  // 分类未分页
  return fetch({
    url: '/warehouse/api/v1/categories',
    method: 'get'
  });
}

export function add_categories(form) {
  return fetch({
    url: '/warehouse/api/v1/categories',
    method: 'post',
    data: form
  });
}

export function update_categories(id, form) {
  return fetch({
    url: '/warehouse/api/v1/categories/' + id,
    method: 'post',
    data: form
  });
}

export function delete_categories(id) {
  return fetch({
    url: '/warehouse/api/v1/categories',
    method: 'delete',
    data: {
      ids: id
    }
  });
}

// 店铺
export function shops_list() {
  return fetch({
    url: '/warehouse/api/v1/shops',
    method: 'get',
    params: {
      size: 100     // 默认设置取100条数据
    }
  });
}

export function add_shops(form) {
  return fetch({
    url: '/warehouse/api/v1/shops',
    method: 'post',
    data: form
  });
}

export function update_shops(id, form) {
  return fetch({
    url: '/warehouse/api/v1/shops/' + id,
    method: 'post',
    data: form
  });
}

// SPU
export function spus_list(form) {
  return fetch({
    url: '/warehouse/api/v1/spus',
    method: 'get',
    params: form
  });
}

export function add_spus(form) {
  return fetch({
    url: '/warehouse/api/v1/spus',
    method: 'post',
    data: form
  });
}
export function update_spus(id, form) {
  return fetch({
    url: '/warehouse/api/v1/spus/' + id,
    method: 'post',
    data: form
  });
}
// SKU
export function skus_list(form) {
  return fetch({
    url: '/warehouse/api/v1/skus',
    method: 'get',
    params: form
  });
}

export function add_skus(form) {
  return fetch({
    url: '/warehouse/api/v1/skus',
    method: 'post',
    data: form
  });
}

export function update_skus(id, form) {
  return fetch({
    url: '/warehouse/api/v1/skus/' + id,
    method: 'post',
    data: form
  });
}
// 查询某个sku对应的所有批次
export function sku_batches(form) {
  return fetch({
    url: '/warehouse/api/v1/batches',
    method: 'get',
    params: form
  });
}
// 申请入库
export function add_request(form) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/request',
    method: 'post',
    data: form,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
// 入库申请列表
export function request_list(form) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/requests',
    method: 'get',
    params: form
  });
}

// 删除入库申请
export function delete_requests(id) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/request/' + id,
    method: 'delete'
  });
}

// 查看具体的入库详情
export function request_info(id) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/batch/' + id,
    method: 'get'
  });
}

// 修正某一会计审核未通过的入库申请子批次
export function update_requset(id, form) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/batch/' + id + '/update',
    method: 'post',
    data: form
  });
}

// 重新将未通过会计审核的入库申请置为待审核状态
export function resubmit_requset(id) {
  return fetch({
    url: '/warehouse/api/v1/warehousing/request/' + id + '/resubmit',
    method: 'post'
  });
}

// 批量将若干SKU注册到若干仓库中
export function skus_warehouses(form) {
  return fetch({
    url: '/warehouse/api/v1/warehouses/skus',
    method: 'post',
    data: form
  });
}

// 批量将若干SKU注册到若干仓库中
export function spus_warehouses(form) {
  return fetch({
    url: '/warehouse/api/v1/warehouses/spus',
    method: 'post',
    data: form
  });
}

// 查询某个仓库所有注册过的sku
export function skus_warehouses_list(form) {
  return fetch({
    url: '/warehouse/api/v1/warehouse/skus',
    method: 'get',
    params: form
  });
}

// 递归添加数据到树控件中
export function classify(data) {
  let arr = []
  for (let i in data) {
    let obj = {}
    obj.id = data[i].id;
    obj.label = data[i].name;
    obj.code = data[i].code;
    if (data[i].children) {
      obj.children = classify(data[i].children);
      arr.push(obj);
    } else {
      arr.push(obj);
    }
  }
  return arr;
}

// 递归，变换数据格式添加到选择器
export function classify_cascader(data) {
  let arr = []
  for (let i in data) {
    let obj = {}
    obj.value = data[i].id;
    obj.label = data[i].name;
    if (data[i].children) {
      obj.children = classify_cascader(data[i].children);
      arr.push(obj);
    } else {
      arr.push(obj);
    }
  }
  return arr;
}
// 递归添加数据到树控件中
// export function classify(data) {
//   let arr = []
//   for(let i in data){
//     let obj = {}
//     obj['id'] = data[i]['id'];
//     obj['label'] = data[i]['name'];
//     obj['code'] = data[i]['code'];
//     if(data[i]['children']){
//       obj['children'] = classify(data[i]['children']);
//       arr.push(obj);
//     }else{
//       arr.push(obj);
//     }
//   }
//   return arr;
// }

// 递归，变换数据格式添加到选择器
// export function classify_cascader(data) {
//   let arr = []
//   for(let i in data){
//     let obj = {}
//     obj['value'] = data[i]['id'];
//     obj['label'] = data[i]['name'];
//     if(data[i]['children']){
//       obj['children'] = classify_cascader(data[i]['children']);
//       arr.push(obj);
//     }else{
//       arr.push(obj);
//     }
//   }
//   return arr;
// }


