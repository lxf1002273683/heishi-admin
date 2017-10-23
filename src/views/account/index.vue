<template>
  <div class="app-container">
    <div class="account_box">
      <div class="make">
        <span class="title">我在黑市捞了：</span>
        <span class="price">1000</span>
      </div>
      <div class="frozen_amount">
        <span class="title">冻结余额：</span>
        <span class="price">666</span>
      </div>
      <div class="can_amount">
        <span class="title">可提现余额：</span>
        <span class="price">666</span>
      </div>
      <el-table :data="tableData" :show-header="false" stripe style="width: 60%;min-width: 500px;"  v-loading.body="listLoading" element-loading-text="拼命加载中">
        <el-table-column prop="time" label="提现日期">
          <template scope="scope">
            <span v-if="scope.row.status == 1">{{scope.row.time}}<span class="time1">(已提现)</span></span>
            <span v-if="scope.row.status == 0">{{scope.row.time}}<span class="time2">(待批准)</span></span>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="90">
          <template scope="scope">
            <span v-if="scope.row.status == 1" class="price1">+{{scope.row.price}}</span>
            <span v-if="scope.row.status == 0" class="price2">+{{scope.row.price}}</span>
          </template>
        </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { get_user_info } from '@/api/admin';

  export default {
    data() {
      return {
        name: this.$route.query.name,
        userId: this.$route.query.id,
        hsId: '',
        listLoading: false,
        tableData: [{
          time: '2017-10-17 11:41:34 ',
          status: 1,
          price: 200
        },{
          time: '2017-10-17 11:41:34 ',
          status: 0,
          price: 200000
        },{
          time: '2017-10-17 11:41:34 ',
          status: 1,
          price: 200
        }]
      }
    },
    created() {
      const that = this;
      get_user_info(this.$route.query.id).then((res) => {
        that.hsId = res.hs_user_id;
      })
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .account_box{
    padding: 20px;
    .make,
    .can_amount,
    .frozen_amount{
      width: 300px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      .title{
        width: 200px;
        text-align: right;
      }
      .price{
        text-align: left;
      }
    }
    .make{
      font-size: 28px;
      color: #FF4949;
      .price{
        font-size: 24px;
        line-height: 37px;
      }
    }
    .frozen_amount{
      color: #20A0FF;
      font-size: 20px;
      .price{
        font-size: 18px;
        line-height: 26px;
      }
    }
    .can_amount{
      font-size: 20px;
      color: #13CE66;
      .price{
        font-size: 18px;
        line-height: 26px;
      }
    }
    .time1,
    .price1{
      color: #FF4949;
    }
  }
</style>

