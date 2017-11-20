<!-- 待操作入库申请 -->
<template>
  <div class="app-container">
    <div class="order_list">
      <div class="search">
        <span class="title">姓名:</span>
        <el-input class="search_inp" placeholder="请输入买家名" v-model="customer_name" @change="empty"></el-input>
        <span class="title">电话:</span>
        <el-input class="search_inp" placeholder="请输入电话" v-model="customer_telphone" @change="empty">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border v-loading.body="listLoading">
        <el-table-column prop="seller_nickname" label="卖家" ></el-table-column>
        <el-table-column prop="receiver_name" label="买家名称" ></el-table-column>
        <el-table-column prop="receiver_telphone" label="联系电话"></el-table-column>
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
        <el-table-column label="文章">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.subinvoices">{{item.object_title}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.subinvoices">{{item.object_type_desc}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="SKU" min-width="180">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.subinvoices">{{item.sku.spu.name}} / {{item.sku.type}}</div>
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
        <el-table-column prop="memo" label="备注"></el-table-column>
        <el-table-column label="操作" width="90">
          <template scope="scope">
            <el-button size="small" class="btn" @click="expressInfo(scope.row.subinvoices[0].order_number)">快递信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="收货地址" :visible.sync="dialogStatus" top="5%" class="orders_list" size="small" @close="dialogClose">
      <Express :express="express" :activeNum="activeNum"></Express>
    </el-dialog>
  </div>
</template>
<script>
  import { orders_list, order_deliver, orders_deliver } from '@/api/warehouse';
  import { express_info } from '@/api/order';
  import Express from '@/components/ExpressCheck/index';

  export default {
    // 仓库id name
    props: ['warehouse_name', 'warehouse_id'],
    components: {
      Express
    },
    data() {
      return {
        tableData: [],
        totalPages: 0,
        listLoading: false,
        customer_name: null,
        customer_telphone: null,
        express: null,
        dialogStatus: false,
        activeNum: 0
      }
    },
    created() {
      this.initOrderList();
    },
    methods: {
      // 订单列表
      initOrderList(obj) {
        const that = this;
        const params = {
          page_size: 10,
          delivered: 1
        };
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
      // 分页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        obj.customer_name = this.customer_name;
        obj.customer_telphone = this.customer_telphone;
        this.initOrderList(obj);
      },
      // 搜索
      search() {
        const obj = {};
        obj.customer_name = this.customer_name;
        obj.customer_telphone = this.customer_telphone;
        this.initOrderList(obj);
      },
      // 搜索条件为空
      empty() {
        if(!this.customer_name && !this.customer_telphone){
          this.initOrderList();
        }
      },
      //查询收货地址
      expressInfo(orderNumber) {
        const that = this;
        express_info(orderNumber).then((res) => {
          that.dialogStatus = true;
          that.express = res;
          that.activeNum = res.dataSize;
        },(error) => {
          that.$message({
            message: error.message,
            type: 'error'
          });
        })
      },
      dialogClose() {
        this.express = {};
        this.activeNum = 0;
      }
    }
  };
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
    }
  }
</style>

