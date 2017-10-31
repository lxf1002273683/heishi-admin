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
        <el-button type="primary" @click="educeExcel" class="excel">导出Excel</el-button>
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
        <el-table-column label="退款状态" min-width="100">
          <template scope="scope">
            <div class="content-rowspan" >
              <div v-for="(item, index) in scope.row.goods" class="refund_status">
                <span class="status1" v-if="item.process_status == 0 &&item.tag == 0">无</span>
                <span class="status2" v-if="item.tag == 2">已拒绝</span>
                <span class="status3" v-if="item.process_status == 25 && item.tag == 0" @click="refund_info(item.order_number,item.process_status)">退款中</span>
                <span class="status4" v-if="item.tag == 1 && item.process_status != 26" @click="refund_info(item.order_number,item.process_status)">同意退款</span>
                <span class="status4" v-if="item.process_status == 26" @click="refund_info(item.order_number,item.process_status)">完成退款</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货地址" min-width="200">
          <template scope="scope">
            <el-input placeholder="请输入快递公司" v-model="scope.row.express_name" size="small">
              <template slot="prepend">快递公司</template>
            </el-input>
            <el-input placeholder="请输入快递单号" v-model="scope.row.express_sn" size="small">
              <template slot="prepend">快递单号</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105">
          <template scope="scope">
            <el-button size="small" class="btn" v-if="scope.row.child_status == 0" @click="submit(scope.row.order_number,scope.$index)">发货</el-button>
            <el-button size="small" class="btn" v-if="scope.row.child_status == 1" :disabled="true">发货</el-button>
            <span v-if="scope.row.child_status == 1" class="text">处理退款</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'></el-pagination>
    </div>
  </div>
</template>
<script>
  import { order_list, order_number_search, name_tel_search, address_info, deliver } from '@/api/order';
  import { downloadExl } from '@/utils/excel';

  export default {
    props: ['user_name', 'user_id', 'hs_id', 'hs_name'],
    data() {
      return {
        tableData: [],
        listLoading: true,
        totalPages: 0,
        keyword: '',
        order_num: ''
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
          status: 0,
          include_address: 1
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
              if(n.process_status == 25 && n.tag == 0){
                item['child_status'] = 1;
                return false;
              }
              // 增加子订单状态，方便添加class
              if(n.tag == 2)  n['class_status'] = 'status2';
              if(n.process_status == 25 && n.tag == 0)  n['class_status'] = 'status3';
              if(n.tag == 1)  n['class_status'] = 'status4';
            })
            item['express_sn'] = null;
            item['express_name'] = null;
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
      // 发货
      submit(order_number, index) {
        const that = this;
        if(!this.tableData[index]['express_sn'] || !this.tableData[index]['express_name']){
          that.$message({
            message: '请输入快递公司，以及快递单号',
            type: 'error'
          });
          return false;
        }
        const obj = {
          express_sn: this.tableData[index]['express_sn'],
          express_name: this.tableData[index]['express_name']
        }
        that.$confirm('核实快递信息是否正确?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deliver(order_number, obj).then((res) => {
            that.tableData.splice(index, 1);
            that.$message({
              message: '发货成功',
              type: 'success'
            });
          },(error) => {
            that.$message({
              message: error.message,
              type: 'error'
            });
          })
        }).catch(() => {});
      },
      // 导出excel 默认查询500每页，后期增加查询全部条件
      educeExcel() {
        const that = this;
        const params = {
          size: 500,
          uid: this.hs_id,
          role: 4,
          status: 0,
          include_address: 1
        }
        order_list(params).then((res) => {
          downloadExl(res.orders, this.hs_name);
        })
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
    .excel{
      float: right;
    }
    p{
      line-height: 30px;
      margin: 0;
    }
    .eveRow,
    .oddRow{
      span{
        cursor: pointer;
        display: block;
        white-space: normal;
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
    }
    .status4{
      color: #99A9BF;
    }
    .refund_status{
      .status3,
      .status4{
        cursor: pointer;
        text-decoration: underline;
      }
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
    width: 400px;
    margin: 0 auto;
  }
</style>
