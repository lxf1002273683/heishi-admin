// 格式化数据
function formatJSON(orders) {
  const arr = [];
  orders.forEach((item, index) => {
    const obj = {
      "收货人": null, '收货电话': null, '省': null, '市': null, '区': null, '详细地址': null, '邮编': null,
      '商品名称': null, '数量': null, '备注': null, '款式': null, '订单号': null};
    obj['收货人'] = item.consignee_name;
    obj['收货电话'] = item.phone;
    obj['省'] = item.province;
    obj['市'] = item.city;
    obj['区'] = item.district;
    obj['详细地址'] = item.detail;
    obj['邮编'] = item.postal_code;
    if (item.goods.length === 1) {
      obj['商品名称'] = item.goods[0].object_title;
      obj['款式'] = item.goods[0].goods_type_desc;
      obj['数量'] = item.goods[0].counts;
      obj['备注'] = item.attach;
      obj['订单号'] = item.goods[0].order_number;
      arr.push(obj);
    } else {
      obj['商品名称'] = '购物车订单';
      obj['数量'] = item.counts;
      obj['备注'] = item.attach;
      obj['订单号'] = item.order_number;
      arr.push(obj);
      item.goods.forEach((n, i) => {
        // 退款状态中，退款完成的订单不导出
        if (n.process_status !== 25 && n.process_status !== 26) {
          const childObj = {
          '收货人': null, '收货电话': null, '省': null, '市': null, '区': null, '详细地址': null, '邮编': null,
          '商品名称': null, '数量': null, '备注': null, '款式': null, '订单号': null};
          childObj['商品名称'] = n.object_title;
          childObj['款式'] = n.goods_type_desc;
          childObj['数量'] = n.counts;
          childObj['订单号'] = n.order_number;
          arr.push(childObj);
        }
      })
    }
  })
  return arr;
}

function s2ab(s) {
  if (typeof ArrayBuffer !== 'undefined') {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } else {
    var buf = new Array(s.length);
    for (var i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}

function saveAs(obj, fileName) {
  var tmpa = document.createElement("a");
  tmpa.download = fileName || "下载";
  tmpa.href = URL.createObjectURL(obj);
  tmpa.click();
  setTimeout(function() {
    URL.revokeObjectURL(obj);
  }, 100);
}

export function downloadExl(orders, name) {
  const data = formatJSON(orders);
  const wopts = {
    bookType: 'xls',
    bookSST: false,
    type: 'binary'
  };
  const wb = {
    SheetNames: ['Sheet1'],
    Sheets: {},
    Props: {}
  };
  // 获取当前日期
  const date = new Date();
  const strDate = name + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  wb.Sheets.Sheet1 = XLSX.utils.json_to_sheet(data);
  saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], {
    type: 'application/octet-stream'
  }), strDate + '.xls');
}
