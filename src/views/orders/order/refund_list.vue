<template>
  <div class="app-container">
    <div class="refund_list">
      <div class="search">
        <el-select v-model="selectInput" placeholder="请选择" class="searchInput" @change="selectChange">
          <el-option label="全部退款" value="5"></el-option>
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
      <el-table :data="tableData" border style="width: 100%;"  v-loading.body="listLoading" element-loading-text="拼命加载中" :row-class-name="tableRowClassName">
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
                <span v-if="props.row.goods" class="content-rowspan" >
                  <span>{{props.row.total_fee}}</span>
                </span>
                <span v-if="!props.row.goods">
                  {{props.row.total_fee + props.row.postage}}
                </span>
              </el-form-item>
              <!-- <el-form-item label="订单类型:">
                <span v-if="props.row.type == 1">正常订单</span>
                <span v-if="props.row.type != 1">购物车订单</span>
              </el-form-item> -->
              <el-form-item label="时间:">
                <span>{{ props.row.create_time }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="order_number" label="订单号" ></el-table-column>
        <el-table-column label="商品名称" min-width="150">
          <template scope="scope">
            <div class="content-rowspan" >
              <div v-if="scope.row.goods" v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
                <span class="title">{{item.object_title}}</span>
              </div>
            </div>
            <div v-if="!scope.row.goods">
              <span>{{scope.row.object_title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="款式" min-width="110">
          <template scope="scope">
            <div v-if="scope.row.goods" class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">{{item.goods_type_desc}}</div>
            </div>
            <div v-if="!scope.row.goods">
              {{scope.row.goods_type_desc}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="80">
          <template scope="scope">
            <div v-if="scope.row.goods" class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">{{item.counts}}</div>
            </div>
            <div v-if="!scope.row.goods">
              {{scope.row.counts}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="80">
          <template scope="scope">
            <div v-if="scope.row.goods" class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">{{item.price}}</div>
            </div>
            <div v-if="!scope.row.goods">
              {{scope.row.price}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="逾期时间(到期自动退款)" min-width="80">
          <template scope="scope">
            <div v-if="scope.row.goods" class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
                <div class="overdue_time" v-if="item.tag != 2 && item.tag != 1">{{item.overdue_time}}</div>
                <div v-else>无</div>
              </div>
            </div>
            <div v-if="!scope.row.goods">
              <div class="overdue_time" v-if="scope.row.tag != 2 && scope.row.tag != 1">{{scope.row.overdue_time}}</div>
              <div v-else>无</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105">
          <template scope="scope">
            <div v-if="scope.row.goods" class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" >
                <el-button size="small" class="btn" @click="openDialog(item.order_number,scope.$index,index)" v-if="item.process_status == 25 && item.tag == 0">退款</el-button>
                <span v-if="item.process_status == 0 && item.tag == 0">未退款</span>
                <span v-if="item.tag == 2">拒绝退款</span>
                <span v-if="item.tag == 1 && item.process_status != 26">同意退款</span>
                <span v-if="item.process_status == 26">完成退款</span>
              </div>
            </div>
            <div v-if="!scope.row.goods">
              <el-button size="small" class="btn" @click="openDialog(scope.row.order_number,scope.$index)" v-if="scope.row.process_status == 25 && scope.row.tag == 0">退款</el-button>
              <span v-if="scope.row.tag == 2">拒绝退款</span>
              <span v-if="scope.row.tag == 1 && scope.row.process_status != 26">同意退款</span>
              <span v-if="scope.row.process_status == 26">完成退款</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'></el-pagination>
    </div>
    <el-dialog title="收货地址" :visible.sync="dialogStatus" top="40%" class="orders_list" size="tiny">
      <div class="dialog">
        <div class="content">
          <i class="el-icon-information"></i>
          <span>操作前，请核实退款信息</span>
        </div>
        <el-button size="small" class="btn" type="primary" @click="order_refund(1)">同意退款</el-button>
        <el-button size="small" class="btn" type="danger" @click="order_refund(0)">拒绝退款</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { order_list, order_number_search, name_tel_search, process_refund_order } from '@/api/order';
  import { parseTime } from '@/utils/index';

  export default {
    props: ['user_name', 'user_id', 'hs_id', 'order_number'],
    data() {
      return {
        tableData: [],
        listLoading: false,
        totalPages: 0,
        keyword: null,
        selectInput: '5',
        order_num: '',
        dialogStatus: false,
        refund_order_number: '',
        tableDataIndex: 0,
        goodsIndex: 0
      }
    },
    created() {
      const obj = {};
      if(this.order_number){
        // 获取父级传来的订单号，直接查询
        this.order_num = this.order_number;
        this.searchOrderNumChange();
        // 重置 order_number
        this.$emit('resetOrderNumber');
      }else{
        obj.status = 5;
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
          // 遍历 增加逾期时间
          $.each(res.orders, (index, item) => {
            if(item['goods']){
              $.each(item.goods, (i, n) => {
                const timestamp = new Date(n.refund_apply_time).getTime() + 86400000*2;
                n['overdue_time'] = parseTime(timestamp);
              })
            }else{
              const timestamp = new Date(item.refund_apply_time).getTime() + 86400000*2;
              item['overdue_time'] = parseTime(timestamp);
            }
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
          status: this.selectInput,
          page: 1
        }
        this.initOrderList(obj);
      },
      // 打开dialog
      openDialog(number, index, goodsIndex) {
        this.refund_order_number = number;
        this.tableDataIndex = index;
        this.goodsIndex = goodsIndex;
        this.dialogStatus = true;
      },
      // 退款
      order_refund(num) {
        const that = this;
        const obj = {
          action: num
        }
        process_refund_order(that.refund_order_number, obj).then((res) => {
          that.$message({
            message: '操作成功',
            type: 'success'
          });
          if(num == 0){
            that.tableData.splice(that.tableDataIndex, 1);
          }else if(that.selectInput == 5){
            that.tableData[that.tableDataIndex]['tag'] = 1;
          }else if(that.selectInput == 2 || that.selectInput == 3){
            that.tableData[that.tableDataIndex]['goods'][that.goodsIndex]['tag'] = 1;
          }
          that.dialogStatus = false;
        },(error) => {
          that.$message({
            message: error.message,
            type: 'error'
          });
        })
      },
      // class添加
      tableRowClassName(row, index) {
        // 如果不是全部，则直接返回空
        if(this.selectInput != 5) return '';
        if(row.tag == 1 && row.process_status == 25){
          return 'info-row';
        }else if(row.process_status == 26){
          return 'success-row';
        }
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
    .btn{
      margin: 5px auto;
      color: black;
    }
    .oddRow{
      color: #13CE66;
    }
    .eveRow{
      color: #20A0FF;
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
      .title{
        white-space: normal;
      }
    }
    .content-rowspan div:last-child {
      border-bottom: 0;
    }
    .overdue_time {
      color: #FA5555;
      font-weight: 700;
    }
  }
  .dialog{
    &:after{
      content: '';
      display: block;
      clear: both;
    }
    .content{
      font-size: 16px;
      padding-bottom: 20px;
      i{
        font-size: 24px;
        vertical-align: middle;
        background-color: white;
        color: #f7ba2a;
      }
    }
    button{
      float: right;
      margin: 0 5px;
    }
  }
</style>
