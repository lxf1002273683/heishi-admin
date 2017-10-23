<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">入库申请列表</el-menu-item>
      <el-menu-item index="2">增加邮费列表</el-menu-item>
    </el-menu>
    <div class="request_list" v-if="activeIndex == 1">
      <el-collapse v-model="activeNames" v-loading.body="listLoadingRequest" element-loading-text="拼命加载中">
        <template v-for="(item, index) in tableData">
          <el-collapse-item :title="item.batch_number" :name="item.id">
            <template slot="title">
              <span>{{item.batch_number}}</span>
              <span class="user">申请人:{{item.requester.account}}</span>
              <el-button class="pass" type="primary" size="small" @click.stop="pass_requests(item.batch_number,index)">确认申请</el-button>
              <el-button class="pass" type="warning" size="small" @click.stop="repulse_requests(item.batch_number,index)">拒绝申请</el-button>
            </template>
            <el-table :data="item.batches" style="width: 100%" stripe border >
              <el-table-column prop="warehouse.name" label="仓库"></el-table-column>
              <el-table-column prop="sku.spu_name" label="商品名称"></el-table-column>
              <el-table-column prop="sku.type" label="款式"></el-table-column>
              <el-table-column prop="purchasing_price" label="商品进价">
              </el-table-column>
              <el-table-column prop="quantity" label="进货数量">
              </el-table-column>
              <el-table-column prop="estimated_arrival_time" label="预计到库时间">
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </template>
      </el-collapse>
      <el-pagination v-if="totalPages > 20" :page-size="20" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <div class="postage_list" v-if="activeIndex == 2">
      <el-table :data="postageList" style="width: 100%" stripe border v-loading.body="listLoadingPostage" element-loading-text="拼命加载中">
        <el-table-column prop="batch_id" label="子批次ID" width='95'></el-table-column>
        <el-table-column prop="user_name" label="申请用户"></el-table-column>
        <el-table-column prop="batch_number" label="批次号"></el-table-column>
        <el-table-column prop="warehouse_name" label="仓库"></el-table-column>
        <el-table-column prop="sku_name" label="商品名称"></el-table-column>
        <el-table-column prop="sku_type" label="款式"></el-table-column>
        <el-table-column prop="price" label="邮费金额/数量">
          <template scope="scope">
            <span>{{scope.row.price}} / {{scope.row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注"></el-table-column>
        <el-table-column prop="updated_at" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button class="pass" type="warning" size="small" @click.stop="repulse_requests(scope.row.id,scope.$index)">拒绝申请</el-button>
            <el-button class="pass" type="primary" size="small" @click.stop="pass_requests(scope.row.id,scope.$index)">确认申请</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPostagePages > 20" :page-size="20" layout="prev, pager, next" :total="totalPostagePages" @current-change="postageChange" class='pagination'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { request_list, pass_request, payments_list, pass_payments } from '@/api/finance';
  export default {
    data() {
      return {
        activeIndex: '1',
        activeNames: '1',
        tableData: [],
        postageList: [],
        totalPages: 0,
        totalPostagePages: 0,
        listLoadingRequest: true,
        listLoadingPostage: true
      }
    },
    created() {
      // 获取当前用户评论列表
      this.initRequestList();
      this.initPostageList();
    },
    methods: {
      // 获取待审核入库申请列表
      initRequestList(obj) {
        const that = this;
        const params = {
          filter: '0',
          page_size: 20
        };
        if(obj){
          $.extend(params, obj)
        }
        that.listLoadingRequest = true;
        request_list(params).then((res) => {
          that.tableData = res.data;
          that.totalPages = res.total;
          that.listLoadingRequest = false;
        })
      },
      // 获取待审核邮费列表
      initPostageList(obj) {
        const that = this;
        const params = {
          status_filter: '0',
        };
        if(obj){
          $.extend(params, obj)
        }
        that.listLoadingPostage = true;
        payments_list(params).then((res) => {
          that.postageList = res.data;
          that.totalPostagePages = res.total;
          that.listLoadingPostage = false;
        })
      },
      // 同意
      pass_requests(batch_number, index) {
        const that = this;
        that.$confirm('是否确认此入库申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = {};
          obj.is_pass = 1;
          if(that.activeIndex == 2){
            obj['id'] = batch_number;
            that.passPayments(obj);
          }else {
            obj['batch_number'] = batch_number;
            that.passRequest(obj);
          }
        }).catch(() => {});
      },
      // 拒绝
      repulse_requests(batch_number, index) {
        const that = this;
        that.$confirm('是否拒绝此入库申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = {};
          obj.is_pass = 0;
          if(that.activeIndex == 2){
            obj['id'] = batch_number;
            that.passPayments(obj);
          }else {
            obj['batch_number'] = batch_number;
            that.passRequest(obj);
          }
        }).catch(() => {});
      },
      // nav 切换
      select(key) {
        this.activeIndex = key;
      },
      // 入库申请分页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        this.initRequestList(obj);
      },
      // 邮费申请分页
      postageChange(val) {
        const obj = {
          page: val
        }
        this.initPostageList(obj);
      },
      // 同意，拒绝入库申请
      passRequest(obj) {
        const that = this;
        pass_request(obj).then((res) => {
          that.$message({
            type: 'success',
            message: '操作成功'
          });
          that.tableData.splice(obj.index, 1);
        },(error) => {
          that.$message({
            type: 'error',
            message: error.message
          });
        })
      },
      // 同意，拒绝邮费申请
      passPayments(obj) {
        const that = this;
        pass_payments(obj).then((res) => {
          that.$message({
            type: 'success',
            message: '操作成功'
          });
          that.postageList.splice(obj.index, 1);
        },(error) => {
          that.$message({
            type: 'error',
            message: error.message
          });
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .request_list{
    padding: 20px;
    .user{
      margin-left: 20px;
    }
    .pass{
      float: right;
      margin: 7px 12px 0 0;
    }
  }
  .postage_list{
    padding: 20px;
    .el-button{
      margin: 3px 0;
    }
  }
  .el-badge{
    line-height: 20px;
    height: 20px;
  }
  .pagination{
    text-align: center;
    padding: 20px 0;
  }
</style>
