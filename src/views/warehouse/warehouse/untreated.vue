<!-- 待操作入库申请 -->
<template>
  <div class="app-container">
    <div class="order_list">
        <span>订单搜索，某个仓库下excel批量发货</span>
      <div class="search">
        <span class="title">姓名/电话:</span>
        <el-input class="search_inp" placeholder="请输入买家名或电话">
          <el-button slot="append" icon="search"></el-button>
        </el-input>
        <span class="title">SPU:</span>
        <el-input class="search_inp" placeholder="请输入SPU名称" >
          <el-button slot="append" icon="search"></el-button>
        </el-input>
        <div class="excel">
          <el-button type="primary" class="btn">Excel发货</el-button>
          <input type="file" @change="upExcel" accept="text/xml,application/xml">
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border v-loading.body="listLoading" v-if="!excelData">
        <el-table-column prop="receiver_name" label="买家名称" width="100"></el-table-column>
        <el-table-column prop="receiver_telphone" label="联系电话" width="115"></el-table-column>
        <el-table-column label="地址">
          <template scope="scope">
            <span>
              {{scope.row.receiver_address_province}}{{scope.row.receiver_address_city}}{{scope.row.receiver_address_district}}{{scope.row.receiver_address_description}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" width="220">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.subinvoices">{{item.order_number}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文章/类型">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.subinvoices">{{item.object_title}} / {{item.object_type_desc}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="SKU">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.subinvoices">{{item.sku_id}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="60">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.subinvoices">{{item.quantity}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="快递" min-width="200">
          <template scope="scope">
            <el-input placeholder="请输入快递公司" v-model="scope.row.express_name" size="small">
              <template slot="prepend">快递公司</template>
            </el-input>
            <el-input placeholder="请输入快递单号" v-model="scope.row.express_sn" size="small">
              <template slot="prepend">快递单号</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="64">
          <template scope="scope">
            <el-button size="small" class="btn">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- excel table -->
      <el-table :data="excelData" style="width: 100%" stripe border v-if="excelData">
        <el-table-column prop="收货人" label="收货人"></el-table-column>
        <el-table-column prop="收货电话" label="收货电话"></el-table-column>
        <el-table-column prop="省" label="省"></el-table-column>
        <el-table-column prop="市" label="市"></el-table-column>
        <el-table-column prop="区" label="区"></el-table-column>
        <el-table-column prop="详细地址" label="详细地址"></el-table-column>
        <el-table-column prop="邮编" label="邮编"></el-table-column>
        <el-table-column prop="商品名称" label="商品名称"></el-table-column>
        <el-table-column prop="数量" label="数量"></el-table-column>
        <el-table-column prop="备注" label="备注"></el-table-column>
        <el-table-column prop="订单号" label="订单号"></el-table-column>
        <el-table-column prop="快递单号" label="快递单号"></el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { orders_list } from '@/api/warehouse';

  export default {
    // 仓库id name
    props: ['warehouse_name', 'warehouse_id'],
    data() {
      return {
        tableData: [],
        totalPages: 0,
        listLoading: false,
        excelData: []
      }
    },
    created() {
      this.initOrderList();
    },
    methods: {
      initOrderList(obj) {
        const that = this;
        const params = {};
        if(obj){
          Object.assign(params, obj)
        }
        that.listLoading = true;
        orders_list(this.warehouse_id, params).then((res) => {
          that.tableData = res.data;
          that.totalPages = res.total;
          that.listLoading = false;
        })
      },
      handleCurrentChange() {

      },
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
            that.excelData = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]]);
        };
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
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    .content-rowspan div {
      padding: 0 18px;
      line-height: 28px;
      min-height: 28px;
      border-bottom: 1px solid #ECEDEE;
      right: -18px;
      margin-left: -36px;
      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .content-rowspan div:last-child {
      border-bottom: 0;
    }
    .search{
      padding: 10px;
      &:after{
        content: '';
        display: block;
        clear: both;
      }
      .title{
        float: left;
        line-height: 36px;
        font-size: 14px;
        cursor: default;
      }
      .search_inp{
        width: 280px;
        float: left;
        margin: 0 20px;
      }
      .excel{
        height: 36px;
        display: inline-block;
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
    }
  }
</style>

