<template>
  <div class="app-container">
    <div class="delivered_list">
      <div class="search">
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
        <el-table-column label="商品">
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
        <el-table-column label="退款状态">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods">
              <span class="status1" v-if="item.process_status == 1 && item.tag == 2">已拒绝</span>
              <span class="status1" v-if="item.process_status == 2 && item.tag == 2">已拒绝</span>
              <span class="status2" v-if="item.process_status == 26" @click="refund_info(scope.row.order_number,item.process_status)">完成退款</span>
              <span class="status3" v-if="item.process_status == 1 && item.tag == 0">未退款</span>
              <span class="status3" v-if="item.process_status == 2 && item.tag == 0">未退款</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="postage" label="邮费" min-width="50"></el-table-column>
        <el-table-column prop="total_fee" label="总价" min-width="50"></el-table-column>
        <el-table-column prop="attach" label="备注" min-width="50"></el-table-column>
        <el-table-column prop="create_time" label="时间" ></el-table-column>
        <el-table-column label="状态" width="80">
          <template scope="scope">
            <span v-if="scope.row.process_status == 1" class="untreated_status1">未收货</span>
            <span v-if="scope.row.process_status == 2" class="untreated_status2">已收货</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105">
          <template scope="scope">
            <el-button size="small" @click="expressInfo(scope.row.order_number)">收货地址</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'></el-pagination>
    </div>
    <el-dialog title="收货地址" :visible.sync="dialogStatus" top="5%" class="orders_list" size="small" @close="dialogClose">
      <div class="dialog">
        <p class="title">{{express.msg}}</p>
        <p>快递: {{express.expTextName}}</p>
        <p>单号: {{express.mailNo}}</p>
        <p>电话: {{express.tel}}</p>
        <div v-if="activeNum">
          <el-steps :space="200" :active="activeNum" direction="vertical" space="80px">
            <template v-for="item in express.data">
              <el-step :title="item.time" :description="item.context"></el-step>
            </template>
          </el-steps>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { order_list, order_number_search, name_tel_search, express_info } from '@/api/order';

  export default {
    props: ['user_name', 'user_id', 'hs_id'],
    data() {
      return {
        tableData: [],
        listLoading: false,
        totalPages: 0,
        keyword: '',
        order_num: '',
        dialogStatus: false,
        express: {},
        activeNum: 0
      }
    },
    created() {
      this.initOrderList();
    },
    methods: {
      initOrderList(obj) {
        const that = this;
        // 初始化用户每页20
        const params = {
          size: 20,
          uid: this.hs_id,
          role: 4,
          status: 6
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
        obj.keyword = this.keyword;
        obj.order_number = this.order_num;
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
      // 打开退款纠纷查询当前订单退款详情
      refund_info(order_number, status) {
        this.$emit('activeIndexChange', order_number, 4, status);
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
      // dialog关闭
      dialogClose() {
        this.express = {};
        this.activeNum = 0;
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .delivered_list{
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
    .status2{
      color: #99A9BF;
      text-decoration: underline;
      cursor: pointer;
    }
    .status1{
      color: #F7BA2A;
    }
    .untreated_status1{
      color: #F7BA2A;
    }
    .untreated_status2{
      color: #99A9BF;
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
  .dialog{
    padding: 0 110px;
    .title{
      color: #FF4949;
    }
  }
</style>
