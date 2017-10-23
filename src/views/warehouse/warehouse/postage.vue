<template>
  <div class="app-container">
    <div class="postage">
      <div class="search">
        <span class="search_title">批次号查询：</span>
        <el-input v-model="batchOptions" placeholder="请输入查询的子批次ID" class="searchInput" @change="searchInput"></el-input>
      </div>
      <el-table :data="postageList" style="width: 100%" border :row-class-name="tableRowClassName" v-loading.body="listLoading" element-loading-text="拼命加载中">
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
        <el-table-column prop="" label="状态">
          <template scope="scope">
            <span v-if="scope.row.status == -2">审核失败</span>
            <span v-if="scope.row.status == 1">已通过</span>
            <span v-if="scope.row.status == 0">待审核</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 20" :page-size="20" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { payments_list } from '@/api/warehouse';

  export default {
    // 仓库id name
    props: ['warehouse_name', 'warehouse_id'],
    data() {
      return {
        batchOptions: '',       // batch_id
        totalPages: 0,
        postageList: [],
        listLoading: true
      }
    },
    created() {
      // 默认查询全部
      this.initPostageQuery();
    },
    methods: {
      // 查询接口配置
      initPostageQuery(obj) {
        const that = this;
        const params = {
          status_filter: '0,1,-2',
        };
        if(obj){
          $.extend(params, obj)
        }
        that.listLoading = true;
        payments_list(params).then((res) => {
          that.postageList = res.data;
          that.totalPages = res.total;
          that.listLoading = false;
        })
      },
      // 分页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        this.initPostageQuery(obj);
      },
      // 商品详情查询
      queryRequest(id) {
        const that = this;
        that.dialogStatus = true;
        request_info(id).then((res) => {
          that.batchDetails = res;
        })
      },
      // 动态配置行状态
      tableRowClassName(row, index) {
        if (row.status === 1) {
          return 'success-row';
        } else if (row.status === -2) {
          return 'danger-row';
        }
        return '';
      },
      // 批次搜索
      searchInput(val) {
        const obj = {
          batch_id: this.batchOptions
        }
        this.initPostageQuery(obj);
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .postage{
    .search{
      .search_title{
        font-size: 14px;
        color: #1f2d3d;
      }
      .searchInput{
        width: 240px;
        padding: 0 20px 20px 0;
      }
    }
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    .el-table .success-row {
      background: #c9e5f5;
    }

    .el-table .danger-row {
      background: #f77b7b;
      color: white;
    }
  }
</style>

