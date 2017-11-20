<!-- 某个仓库nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">库房商品</el-menu-item>
      <el-menu-item index="2">未完成申请</el-menu-item>
      <el-menu-item index="3">历史申请入库</el-menu-item>
      <el-menu-item index="4">进货记录</el-menu-item>
      <el-menu-item index="5">邮费记录</el-menu-item>
      <el-menu-item index="6">待发货</el-menu-item>
      <el-menu-item index="7">已发货</el-menu-item>
      <el-menu-item index="8">批量发货</el-menu-item>
    </el-menu>
    <div class="warehouse_content">
      <template v-if="activeIndex == 1"><CommodityInfo :warehouse_name="query.name" :warehouse_id="query.id"></CommodityInfo></template>
      <template v-if="activeIndex == 2"><Warehouse :warehouse_name="query.name" :warehouse_id="query.id"></Warehouse></template>
      <template v-if="activeIndex == 3"><FinishWarehouse :warehouse_name="query.name" :warehouse_id="query.id"></FinishWarehouse></template>
      <template v-if="activeIndex == 4"><Detail :warehouse_name="query.name" :warehouse_id="query.id"></Detail></template>
      <template v-if="activeIndex == 5"><Postage :warehouse_name="query.name" :warehouse_id="query.id"></Postage></template>
      <template v-if="activeIndex == 6"><Untreated :warehouse_name="query.name" :warehouse_id="query.id"></Untreated></template>
      <template v-if="activeIndex == 7"><Delivered :warehouse_name="query.name" :warehouse_id="query.id"></Delivered></template>
      <template v-if="activeIndex == 8"><BatchDelivery :warehouse_name="query.name" :warehouse_id="query.id"></BatchDelivery></template>
    </div>
  </div>
</template>
<script>
  import CommodityInfo from './warehouse/commodity_info';
  import Warehouse from './warehouse/warehouse';
  import FinishWarehouse from './warehouse/finish_warehouse';
  import Detail from './warehouse/details';
  import Postage from './warehouse/postage';
  import Untreated from './warehouse/untreated';
  import Delivered from './warehouse/delivered';
  import BatchDelivery from './warehouse/batch_delivery';
  import { addNav } from '@/utils/index';

  export default {
    components: {
      CommodityInfo,
      Warehouse,
      FinishWarehouse,
      Detail,
      Postage,
      Untreated,
      Delivered,
      BatchDelivery
    },
    data() {
      return {
        activeIndex: '1',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id,
        }
      }
    },
    created() {
      addNav(this, this.$route);
    },
    methods: {
      // 切换nav
      select(key) {
        this.activeIndex = key;
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .warehouse_content{
    padding: 20px;
  }
</style>

