<template>
  <div>
    <el-table :data="ordersList" style="width: 100%" border class="orders_table">
      <el-table-column prop="consignee_name" label="买家姓名" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话" width="150"></el-table-column>
      <el-table-column prop="order_number" label="订单号" width="240"></el-table-column>
      <el-table-column label="商品">
        <template scope="scope">
          <p v-for="item in scope.row.goods">{{item.object_title}}</p>
        </template>
      </el-table-column>
      <el-table-column label="款式">
        <template scope="scope">
          <p v-for="item in scope.row.goods">{{item.goods_type_desc}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { orders_list } from '@/api/comment';

  export default {
    props: ['from_uid', 'to_uid'],
    data() {
      return {
        ordersList: []
      }
    },
    watch: {
      from_uid() {
        this.initOrdersList();
      }
    },
    created() {
      this.initOrdersList();
    },
    methods: {
      initOrdersList() {
        const that = this;
        const obj = {
          status: 4,
          uid: this.from_uid,
          uid2: this.to_uid,
          role: 4
        }
        console.log(obj)
        orders_list(obj).then((res) => {
          that.ordersList = res.orders;
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .orders_table{
    p{
      line-height: 30px;
      margin: 0;
    }
  }
</style>
