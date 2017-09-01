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

// 递归添加数据到树控件中
export function classify(data) {
  let arr = []
  for(let i in data){
    let obj = {}
    obj['id'] = data[i]['id'];
    obj['label'] = data[i]['name'];
    obj['code'] = data[i]['code'];
    if(data[i]['children']){
      obj['children'] = classify(data[i]['children']);
      arr.push(obj);
    }else{
      arr.push(obj);
    }
  }
  return arr;
}

// 递归，变换数据格式添加到选择器
export function classify_cascader(data) {
  let arr = []
  for(let i in data){
    let obj = {}
    obj['value'] = data[i]['id'];
    obj['label'] = data[i]['name'];
    if(data[i]['children']){
      obj['children'] = classify_cascader(data[i]['children']);
      arr.push(obj);
    }else{
      arr.push(obj);
    }
  }
  return arr;
}

