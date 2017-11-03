<template>
  <div class="postage_list">
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
</template>

<script>
  import { request_list, pass_request, payments_list, pass_payments } from '@/api/finance';
  export default {
    data() {
      return {
        postageList: [],
        totalPostagePages: 0,
        listLoadingPostage: true
      }
    },
    created() {
      this.initPostageList();
    },
    methods: {
      // 获取待审核邮费列表
      initPostageList(obj) {
        const that = this;
        const params = {
          status_filter: '0',
        };
        if(obj){
          Object.assign(params, obj)
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
        that.$confirm('是否确认此邮费申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = {};
          obj.is_pass = 1;
          obj['id'] = batch_number;
          that.passPayments(obj);
        }).catch(() => {});
      },
      // 拒绝
      repulse_requests(batch_number, index) {
        const that = this;
        that.$confirm('是否拒绝此邮费申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = {};
          obj.is_pass = 0;
          obj['id'] = batch_number;
          that.passPayments(obj);
        }).catch(() => {});
      },
      // 邮费申请分页
      postageChange(val) {
        const obj = {
          page: val
        }
        this.initPostageList(obj);
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
  .postage_list{
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
