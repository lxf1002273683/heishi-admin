<!-- 文章nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">未发货</el-menu-item>
      <el-menu-item index="2">已发货</el-menu-item>
      <el-menu-item index="3">打赏订单</el-menu-item>
      <!-- <el-menu-item index="4">订单查询</el-menu-item> -->
      <el-menu-item index="4">退款纠纷</el-menu-item>
    </el-menu>
    <div class="order_content">
      <template v-if="activeIndex == 1">
        <Untreated :user_name="query.name" :user_id="query.id" :hs_id="query.hsId" :hs_name="query.hs_name" @activeIndexChange="activeChange"></Untreated>
      </template>
      <template v-if="activeIndex == 2"><Delivered :user_name="query.name" :user_id="query.id" :hs_id="query.hsId" @activeIndexChange="activeChange"></Delivered></template>
      <template v-if="activeIndex == 3"><Reward :user_name="query.name" :user_id="query.id" :hs_id="query.hsId"></Reward></template>
      <!-- <template v-if="activeIndex == 4"><Search :user_name="query.name" :user_id="query.id" :hs_id="query.hsId"></Search></template> -->
      <template v-if="activeIndex == 4">
        <RefundList :user_name="query.name" :user_id="query.id" :hs_id="query.hsId" :order_number="order_number" @resetOrderNumber="resetOrderNum"></RefundList>
      </template>
    </div>
  </div>
</template>

<script>
  import Delivered from './order/delivered';
  import RefundList from './order/refund_list';
  import Untreated from './order/untreated';
  import Search from './order/search';
  import Reward from './order/reward';
  import { get_user_info } from '@/api/admin';

  export default {
    components: {
      Delivered,
      RefundList,
      Untreated,
      Search,
      Reward
    },
    data() {
      return {
        activeIndex: '1',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id,
          hsId: 0,
          hs_name: null,
        },
        order_number: ''
      }
    },
    created() {
      // 初始化黑市卖家ID
      const that = this;
      get_user_info(this.$route.query.id).then((res) => {
        that.query.hsId = res.hs_user_id;
        that.query.hs_name = res.account;
      })
    },
    methods: {
      // 切换nav
      select(key) {
        this.activeIndex = key;
      },
      // 模块切换
      activeChange(data, index, status) {
        // 打开 退款纠纷 进行订单查询
        this.activeIndex = index.toString();
        // 订单号
        this.order_number = data;
      },
      //重置 order_number 
      resetOrderNum(){
        this.order_number = '';
      },
      // 刷新当前页
      resetview(n) {
        this.activeIndex = 1;
        this.activeIndex = n;
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .order_content{
    padding: 20px;
  }
</style>