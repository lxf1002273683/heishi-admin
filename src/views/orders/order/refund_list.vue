<template>
  <div class="app-container">
    <div class="refund_list">
      <div class="search">
        <el-select v-model="selectInput" placeholder="请选择" class="searchInput" @change="selectChange">
          <el-option label="退款中" value="2"></el-option>
          <el-option label="完成退款" value="3"></el-option>
        </el-select>
        <span class="title">姓名/电话:</span>
        <el-input class="search_inp" placeholder="请输入买家名或电话" v-model="keyword" @change="searchKeyChange(0)">
          <el-button slot="append" icon="search" @click="searchKeyChange"></el-button>
        </el-input>
        <span class="title">订单号:</span>
        <el-input class="search_inp" placeholder="请输入订单号" v-model="order_num" @change="searchOrderNumChange(0)">
          <el-button slot="append" icon="search" @click="searchOrderNumChange"></el-button>
        </el-input>
      </div>
      <el-table :data="tableData" border stripe style="width: 100%;"  v-loading.body="listLoading" element-loading-text="拼命加载中">
        <el-table-column prop="consignee_name" label="买家姓名" ></el-table-column>
        <el-table-column prop="phone" label="电话" ></el-table-column>
        <el-table-column prop="order_number" label="订单号" ></el-table-column>
        <el-table-column label="商品名称">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
                <span>{{item.object_title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="款式" min-width="50">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
              <span>{{item.goods_type_desc}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="50">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
              <span>{{item.counts}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="50">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
              <span>{{item.price}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="postage" label="邮费"></el-table-column>
        <el-table-column prop="total_fee" label="总价"></el-table-column>
        <el-table-column prop="create_time" label="时间" ></el-table-column>
        <el-table-column label="操作" width="105">
          <template scope="scope">
            <el-button size="small" class="btn" v-if="scope.row.process_status == 25">同意退款</el-button>
            <el-button size="small" class="btn" v-if="scope.row.process_status == 25">拒绝退款</el-button>
            <span v-if="scope.row.process_status == 26" class="status1">完成退款</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'></el-pagination>
    </div>
  </div>
</template>
<!-- HS20170913165725LNBOVT "2017-09-13 16:57:25"
 -->
<script>
  import { order_list, order_number_search, name_tel_search } from '@/api/order';

  export default {
    props: ['user_name', 'user_id', 'hs_id', 'order_number', 'status'],
    data() {
      return {
        tableData: [],
        listLoading: false,
        totalPages: 0,
        keyword: null,
        selectInput: '2',
        order_num: ''
      }
    },
    created() {
      const obj = {};
      if(this.order_number){
        console.log(this.status);
        this.selectInput = this.status.toString();
        // 获取父级传来的订单号，直接查询
        this.order_num = this.order_number;
        this.searchOrderNumChange();
        // 重置 order_number
        this.$emit('resetOrderNumber');
      }else{
        obj.status = 2;
        this.initOrderList(obj);
      }
    },
    methods: {
      initOrderList(obj) {
        const that = this;
        // 初始化用户每页20
        const params = {
          size: 20,
          uid: this.hs_id,
          role: 4
        }
        if(obj){
          $.extend(params, obj)
        }
        that.listLoading = true;
        order_list(params).then((res) => {
          that.tableData = res.orders;
          that.totalPages = res.totalPages*10;
          that.listLoading = false;
        })
      },
      // 分页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        obj.status = this.selectInput
        // 搜索字段
        obj.keyword = this.keyword
        this.initOrderList(obj);
      },
      // 买家名，电话搜索
      searchKeyChange(num) {
        name_tel_search(num, this)
      },
      // 订单号搜索
      searchOrderNumChange(num) {
        order_number_search(num, this);
      },
      // 筛选 
      selectChange() {
        const obj = {
          status: this.selectInput
        }
        this.initOrderList(obj);
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .refund_list{
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    p{
      line-height: 30px;
      margin: 0;
    }
    .eveRow,
    .oddRow{
      float: flex;
      display: flex;
      justify-content: space-between;
      span{
        display: block;
        margin: 2px 8px;
      }
    }
    .oddRow{
      color: #13CE66;
    }
    .eveRow{
      color: #20A0FF;
    }
    .btn{
      margin: 5px auto;
    }
    .status1{
      color: #13CE66;
    }
    .search{
      padding: 10px;
      &:after{
        content: '';
        display: block;
        clear: both;
      }
      .searchInput{
        float: left;
        margin-right: 20px;
      }
      .title{
        float: left;
        line-height: 36px;
        font-size: 14px;
      }
      .search_inp{
        width: 280px;
        float: left;
        margin: 0 20px;
      }
    }
  }
</style>
