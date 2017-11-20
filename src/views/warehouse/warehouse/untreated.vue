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
        <div class="excel">
          <el-button type="primary" @click="educeExcel" class="excel">导出Excel</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border v-loading.body="listLoading" v-if="!excelData">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="卖家:">
                <span>{{ props.row.seller_nickname }}</span>
              </el-form-item>
              <el-form-item label="地址:">
                <span>
                  {{props.row.receiver_address_province}}{{props.row.receiver_address_city}}{{props.row.receiver_address_district}}{{props.row.receiver_address_description}}
                </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="receiver_name" label="买家名称" ></el-table-column>
        <el-table-column prop="receiver_telphone" label="联系电话"></el-table-column>
        <el-table-column label="订单号" width="220">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.subinvoices">{{item.order_number}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文章" min-width="120">
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
            <el-button size="small" class="btn" @click="deliver(scope.$index)" v-if="scope.row.status == 0">发货</el-button>
            <span v-if="scope.row.status == 1">已发货</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- excel table -->
      <div v-if="excelData" class="excelDate">
        <el-table :data="excelData" style="width: 100%" stripe border>
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
        <div class="btns">
          <el-button type="primary" class="btn" @click="delivers">发货</el-button>
          <el-button class="btn" @click="cancelDeliver">取消</el-button>
        </div>
      </div>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
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
        tableData: [],
        totalPages: 0,
        listLoading: false,
        excelData: null,
        customer_name: null,
        customer_telphone: null
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
          delivered: 0
        };
        if(obj){
          Object.assign(params, obj)
        }
        that.listLoading = true;
        orders_list(this.warehouse_id, params).then((res) => {
          res.data.forEach((item, index) => {
            item.express_name = '';
            item.express_sn = '';
            item.status = 0;
          })
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
      // 发货
      deliver(index) {
        const that = this;
        let status = false;
        that.$confirm('核实快递信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const express = [];
          that.tableData[index].subinvoices.forEach((item, i) => {
            // 判断是否填写快递公司，快递单号
            if(!that.tableData[index].express_sn || !that.tableData[index].express_name){
              that.$message({
                type: 'error',
                message: '请填写快递公司，快递单号'
              })
              status = true;
            }
            const obj = {
              order_number: item.order_number,
              express_number: that.tableData[index].express_sn,
              express_company: that.tableData[index].express_name
            }
            express.push(obj);
          })
          if( status ){
            return false;
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
      // 导出excel
      educeExcel() {
        const that = this;
        const params = {
          all: 1,
          delivered: 0
        }
        orders_list(this.warehouse_id, params).then((res) => {
          downloadExl_hk(res.data, this.warehouse_name);
        })
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
      .excel{
        height: 36px;
        float: right;
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
    .excelDate{
      .btns{
        text-align: right;
        padding: 20px;
      }
    }
  }
</style>

