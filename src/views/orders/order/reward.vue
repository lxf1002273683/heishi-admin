<template>
  <div class="app-container">
    <div class="reward_list">
      <el-table :data="tableData" border stripe style="width: 100%;"  v-loading.body="listLoading" element-loading-text="拼命加载中">
        <el-table-column prop="buyer_name" label="买家" ></el-table-column>
        <el-table-column prop="order_number" label="订单号" ></el-table-column>
        <el-table-column prop="object_title" label="商品名称" ></el-table-column>
        <el-table-column prop="total_fee" label="金额" ></el-table-column>
        <el-table-column prop="create_time" label="创建时间" ></el-table-column>
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
          status: 4,
          reward: 1
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
        this.initOrderList(obj);
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .reward_list{
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
  }
</style>
