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
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="买家姓名:">
                <span>{{ props.row.consignee_name }}</span>
              </el-form-item>
              <el-form-item label="联系方式:">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="邮费:">
                <span>{{ props.row.postage }}</span>
              </el-form-item>
              <el-form-item label="总价:">
                <span>{{ props.row.total_fee }}</span>
              </el-form-item>
              <el-form-item label="收货地址:">
                <span>{{props.row.province}}{{props.row.city}}{{props.row.district}}{{props.row.detail}}</span>
              </el-form-item>
              <el-form-item label="邮编:">
                <span>{{props.row.postal_code}}</span>
              </el-form-item>
              <el-form-item label="备注:">
                <span>{{ props.row.attach }}</span>
              </el-form-item>
              <el-form-item label="时间:">
                <span>{{ props.row.create_time }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="consignee_name" label="买家姓名" min-width="100"></el-table-column>
        <el-table-column prop="order_number" label="订单号" ></el-table-column>
        <el-table-column label="商品" min-width="150">
          <template scope="scope">
            <div class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" :class="[(index % 2) == 1 ? 'eveRow': 'oddRow', item.class_status]">
                <el-tooltip effect="light" :content="item.order_number" placement="left">
                  <span>{{item.object_title}}</span>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="款式" min-width="110">
          <template scope="scope">
            <div class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" :class="[(index % 2) == 1 ? 'eveRow': 'oddRow', item.class_status]">{{ item.goods_type_desc }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="80">
          <template scope="scope">
            <div class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" :class="[(index % 2) == 1 ? 'eveRow': 'oddRow', item.class_status]">{{ item.counts }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="80">
          <template scope="scope">
            <div class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" :class="[(index % 2) == 1 ? 'eveRow': 'oddRow', item.class_status]">{{ item.price }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" width="100">
          <template scope="scope">
            <div class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" class="refund_status">
                <span class="status1" v-if="item.tag == 0">无</span>
                <span class="status2" v-if="item.tag == 2">已拒绝</span>
                <span class="status3" v-if="item.tag == 1 && item.process_status != 26" @click="refund_info(item.order_number,item.process_status)">同意退款</span>
                <span class="status3" v-if="item.process_status == 26" @click="refund_info(item.order_number,item.process_status)">完成退款</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template scope="scope">
            <span v-if="scope.row.process_status == 1" class="untreated_status1">未收货</span>
            <span v-if="scope.row.process_status == 2" class="untreated_status2">已收货</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105">
          <template scope="scope">
            <el-button size="small" @click="expressInfo(scope.row.order_number)">快递查询</el-button>
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
          status: 6,
          include_address: 1
        }
        if(obj){
          Object.assign(params, obj)
        }
        that.listLoading = true;
        order_list(params).then((res) => {
          res.orders.forEach((item, index) => {
            item.goods.forEach((n, i) => {
              // 增加子订单状态，方便添加class
              if(n.tag == 2)  n['class_status'] = 'status2';
              if(n.tag == 1)  n['class_status'] = 'status3';
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
    .oddRow,
    .eveRow{
      span{
        white-space: normal;
      }
    }
    .oddRow{
      color: #13CE66;
    }
    .eveRow{
      color: #20A0FF;
    }
    .status2{
      color: #F7BA2A;
    }
    .status3{
      color: #99A9BF;
    }
    .refund_status{
      .status3{
        cursor: pointer;
        text-decoration: underline;
      }
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
  }
  .dialog{
    padding: 0 110px;
    .title{
      color: #FF4949;
    }
  }
</style>
