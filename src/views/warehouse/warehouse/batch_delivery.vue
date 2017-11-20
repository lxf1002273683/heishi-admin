<!-- 待操作入库申请 -->
<template>
  <div class="app-container">
    <div class="order_list">
      <div class="excel">
        <el-button type="primary" class="btn">Excel发货</el-button>
        <input type="file" @change="upExcel" accept="text/xml,application/xml" v-if="fileStatus">
        <span class="danger">快递公司 快递单号必填(多个订单的包裹，请填写一个快递单号)</span>
      </div>
      <div class="excelDate">
        <el-table :data="excelData" style="width: 100%" stripe border>
          <el-table-column prop="收货人" label="收货人"></el-table-column>
          <el-table-column prop="收货电话" label="收货电话"></el-table-column>
          <el-table-column prop="省" label="省"></el-table-column>
          <el-table-column prop="市" label="市"></el-table-column>
          <el-table-column prop="区" label="区"></el-table-column>
          <el-table-column prop="详细地址" label="详细地址"></el-table-column>
          <el-table-column prop="备注" label="备注"></el-table-column>
          <el-table-column prop="文章/类型" label="文章/类型"></el-table-column>
          <el-table-column prop="商品名称" label="商品名称"></el-table-column>
          <el-table-column prop="sku" label="sku"></el-table-column>
          <el-table-column prop="数量" label="数量"></el-table-column>
          <el-table-column prop="订单号" label="订单号"></el-table-column>
          <el-table-column prop="快递公司" label="快递公司"></el-table-column>
          <el-table-column prop="快递单号" label="快递单号"></el-table-column>
        </el-table>
        <div class="btns">
          <el-button type="primary" class="btn" @click="delivers">发货</el-button>
          <el-button class="btn" @click="cancelDeliver">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { orders_list, order_deliver, orders_deliver } from '@/api/warehouse';
  import { downloadExl_hk } from '@/utils/excel';

  export default {
    // 仓库id name
    props: ['warehouse_name', 'warehouse_id'],
    data() {
      return {
        excelData: null,
        fileStatus: true
      }
    },
    methods: {
      // 上传excel
      upExcel(e) {
        const that = this;
        // 存储转换的数据
        let data = null;
        // 获取上传的文件
        const fs = e.target.files[0];
        // 初始读取文件类
        const reader = new FileReader();
        // 将文件读取为ArrayBuffer
        reader.readAsArrayBuffer(fs);
        reader.onload = function(e) {
            const res = e.target.result;
            data = XLSX.read(btoa(fixdata(res)), {
              type: 'base64'
            });
            // 控制file 显示隐藏，来重置
            that.fileStatus = false;
            setTimeout(() => {
              that.fileStatus = true;
            },300)
            that.excelData = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]]);
        };
      },
      // 发货
      delivers() {
        const that = this;
        that.$confirm('核实快递信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const express = [];
          for (let i = 0; i < that.excelData.length; i++) {
            // 判断是否填写快递公司，快递单号
            if(!that.excelData[i]['快递公司'] || !that.excelData[i]['快递单号']){
              that.$message({
                type: 'error',
                message: '请填写快递公司，快递单号'
              })
              return false;
            }
            const obj = {
              order_number: that.excelData[i]['订单号'],
              express_number: that.excelData[i]['快递单号'],
              express_company: that.excelData[i]['快递公司']
            }
            express.push(obj);
          }
          const params = {
            invoices: express
          }
          orders_deliver(params).then(() => {
            that.$message({
              type: 'success',
              message: '发货成功'
            });
            that.tableData[index].status = 1;
          },(error) => {
            that.$message({
              type: 'error',
              message: error.message
            })
          })
        }).catch(() => {});
      },
      // 取消excel
      cancelDeliver() {
        this.excelData = null;
        this.fileStatus = true;
      }
    }
  };
  // 整理数据格式
  function fixdata(data) {
    let o = "",
        l = 0,
        w = 10240;
    for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .order_list{
    .danger{
      color: #FA5555;
      display: block;
      text-align: center;
    }
    .excel{
      height: 36px;
      margin: 0 10px 20px;
      position: relative;
      input,
      .btn{
        position: absolute;
        top: 0;
        left: 0;
      }
      input{
        width: 95px;
        height: 36px;
        opacity: 0;
        cursor: pointer;
      }
    }
    .excelDate{
      .btns{
        text-align: right;
        padding: 20px;
      }
    }
  }
</style>

