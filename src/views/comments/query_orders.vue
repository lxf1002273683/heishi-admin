<template>
  <div>
    <el-table :data="ordersList" style="width: 100%" border class="orders_table">
      <el-table-column prop="consignee_name" label="买家姓名" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话" width="130"></el-table-column>
      <el-table-column prop="order_number" label="订单号" width="230"></el-table-column>
      <el-table-column label="商品">
        <template scope="scope">
          <div class="content-rowspan" >
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">{{ item.object_title }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="款式">
        <template scope="scope">
          <div class="content-rowspan" >
            <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">{{ item.goods_type_desc }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="时间" width="170"></el-table-column>
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
          uid2: this.from_uid,
          uid: this.to_uid,
          role: 4
        }
        orders_list(obj).then((res) => {
          that.ordersList = res.orders;
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .orders_table{
    .oddRow{
      color: #13CE66;
    }
    .eveRow{
      color: #20A0FF;
    }
    .content-rowspan{
      width: 100%;
    }
    .content-rowspan div {
      padding: 0 18px;
      line-height: 28px;
      min-height: 28px;
      border-bottom: 1px solid #ECEDEE;
      right: -18px;
      margin-left: -36px;
      position: relative;
    }
    .content-rowspan div:last-child {
      border-bottom: 0;
    }
  }
</style>
