<template>
  <div>
    <el-table :data="ordersList" style="width: 100%" border class="orders_table">
      <el-table-column prop="consignee_name" label="买家姓名" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话" width="130"></el-table-column>
      <el-table-column prop="order_number" label="订单号" width="230"></el-table-column>
      <el-table-column label="商品 -- 款式">
        <template scope="scope">
          <div v-for="(item, index) in scope.row.goods" :class="(index % 2) == 1 ? 'eveRow': 'oddRow'">
            <span class="title">{{item.object_title}}</span>
            <span class="type">{{item.goods_type_desc}}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="款式">
        <template scope="scope">
          <p v-for="(item, index) in scope.row.goods">{{index + 1}}{{item.goods_type_desc}}</p>
        </template>
      </el-table-column> -->
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
          uid: this.from_uid,
          uid2: this.to_uid,
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 2px 8px;
      }
    }
    .oddRow{
      color: #13CE66;
    }
    .eveRow{
      color: #20A0FF;
    }

  }
</style>
