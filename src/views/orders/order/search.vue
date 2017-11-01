<template>
  <div class="app-container">
    <div class="search_list">
      <div class="search">
        <span class="title">姓名/电话:</span>
        <el-input class="search_inp" placeholder="请输入买家名或电话" v-model="keyword">
          <el-button slot="append" icon="search" @click="searchChange"></el-button>
        </el-input>
      </div>
      <el-table :data="tableData" border stripe style="width: 100%;"  v-loading.body="listLoading" element-loading-text="拼命加载中">
        <el-table-column prop="consignee_name" label="买家姓名" ></el-table-column>
        <el-table-column prop="phone" label="电话" ></el-table-column>
        <el-table-column prop="order_number" label="订单号" ></el-table-column>
        <el-table-column label="商品">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
              <span>{{item.object_title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="款式">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
              <span>{{item.goods_type_desc}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
              <span>{{item.counts}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
              <span>{{item.price}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="postage" label="邮费"></el-table-column>
        <el-table-column prop="total_fee" label="总价"></el-table-column>
        <el-table-column prop="attach" label="备注"  width="160"></el-table-column>
        <el-table-column prop="create_time" label="时间"></el-table-column>
        <el-table-column prop="create_time" label="状态" width="70">
          <template scope="scope">
            <span v-if="scope.row.process_status == 0">未发货</span>
            <span v-if="scope.row.process_status == 1">已发货</span>
            <span v-if="scope.row.process_status == 2">收货</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105">
          <template scope="scope">
            <el-button size="small">收货地址</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'></el-pagination>
    </div>
  </div>
</template>

<script>
  import { order_list } from '@/api/order';

  export default {
    props: ['user_name', 'user_id', 'hs_id'],
    data() {
      return {
        tableData: [],
        listLoading: false,
        totalPages: 0,
        keyword: ''
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
          Object.assign(params, obj)
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
        // 搜索字段
        if(this.keyword){
          obj.status = 4;
          obj.keyword = this.keyword;
        }
        this.initOrderList(obj);
      },
      // 搜索
      searchChange() {
        const obj = {
          status: 4,
          keyword: this.keyword
        }
        this.initOrderList(obj);
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .search_list{
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
      .title{
        float: left;
        line-height: 36px;
        font-size: 14px;
      }
      .search_inp{
        width: 280px;
        float: left;
        margin-left: 20px;
      }
    }
  }
</style>
