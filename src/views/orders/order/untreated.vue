<template>
  <div class="app-container">
    <div class="untreated_list">
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
        <el-table-column label="退款状态" width="100">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.goods">
              <span class="status1" v-if="item.process_status == 0 && item.tag == 0">无</span>
              <span class="status2" v-if="item.process_status == 0 && item.tag == 2">已拒绝</span>
              <span class="status3" v-if="item.process_status == 25" @click="refund_info(scope.row.order_number,item.process_status)">退款中</span>
              <span class="status4" v-if="item.process_status == 26" @click="refund_info(scope.row.order_number,item.process_status)">完成退款</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="postage" label="邮费" min-width="50"></el-table-column>
        <el-table-column prop="total_fee" label="总价" min-width="50"></el-table-column>
        <el-table-column prop="attach" label="备注"  min-width="50"></el-table-column>
        <el-table-column prop="create_time" label="时间" ></el-table-column>
        <el-table-column label="操作" width="105">
          <template scope="scope">
            <el-button size="small" class="btn" v-if="scope.row.child_status == 0" @click="openAddress(scope.row.order_number)">收货地址</el-button>
            <el-button size="small" class="btn" v-if="scope.row.child_status == 1" :disabled="true">收货地址</el-button>
            <span v-if="scope.row.child_status == 1" class="text">处理退款</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'></el-pagination>
    </div>
    <el-dialog title="收货地址" :visible.sync="dialogStatus" class="orders_list" size="small">
      <div class="dialog">
        <p>买家: {{address.name}}</p>
        <p>电话: {{address.phone}}</p>
        <p>地址: {{address.province}}{{address.city}}{{address.district}}{{address.detail}}</p>
        <p>邮编: {{address.postal_code}}</p>
        <el-form ref="addform" :model="addform" label-width="80px">
          <el-form-item label="物流公司">
            <el-input v-model="addform.express_name"></el-input>
          </el-form-item>
          <el-form-item label="物流单号">
            <el-input v-model="addform.express_sn"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">发货</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { order_list, order_number_search, name_tel_search, address_info, deliver } from '@/api/order';

  export default {
    props: ['user_name', 'user_id', 'hs_id'],
    data() {
      return {
        tableData: [],
        listLoading: true,
        totalPages: 0,
        dialogStatus: false,
        keyword: '',
        order_num: '',
        address: {},
        addform: {
          order_number: '',
          express_name: '',
          express_sn: ''
        }
      }
    },
    watch: {
      hs_id: function () {
        this.initOrderList();
      }
    },
    created() {
      if(this.hs_id){
        this.initOrderList();
      }
    },
    methods: {
      initOrderList(obj) {
        const that = this;
        // 初始化用户每页20
        const params = {
          size: 20,
          uid: this.hs_id,
          role: 4,
          status: 0
        }
        if(obj){
          $.extend(params, obj)
        }
        that.listLoading = true;
        order_list(params).then((res) => {
          // 添加退款状态 child_status
          $.each(res.orders, (index, item) => {
            item['child_status'] = 0;
            $.each(item.goods, (i, n) => {
              if(n.process_status == 25){
                item['child_status'] = 1;
                return false;
              }
            })
          })
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
      // 打开收货地址模态窗
      openAddress(orderNumber) {
        const that = this;
        address_info(orderNumber).then((res) => {
          that.addform.order_number = orderNumber;
          that.dialogStatus = true;
          that.address = res;
        },(error) => {
          that.$message({
            message: error.message,
            type: 'error'
          });
        })
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
      // 发货
      submit() {
        console.log(this.addform);
        // deliver().then(() => {

        // })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .untreated_list{
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
    .status2{
      color: #F7BA2A;
    }
    .status3{
      color: #FF4949;
      text-decoration: underline;
      cursor: pointer;
    }
    .status4{
      color: #99A9BF;
      cursor: pointer;
      text-decoration: underline;
    }
    .text{
      text-align: center;
      display: block;
      width: 100%;
      color: #aaa;
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
    width: 400px;
    margin: 0 auto;
  }
</style>
