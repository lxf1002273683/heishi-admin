<!-- 某个仓库nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">库房商品</el-menu-item>
      <el-menu-item index="2">入库申请</el-menu-item>
      <el-menu-item index="3">入库历史</el-menu-item>
      <el-menu-item index="4">出入库记录</el-menu-item>
    </el-menu>
    <div class="warehouse_content">
      <template v-if="activeIndex == 1"><CommodityInfo :warehouse_name="query.name" :warehouse_id="query.id"></CommodityInfo></template>
      <template v-if="activeIndex == 2"><Warehouse :warehouse_name="query.name" :warehouse_id="query.id"></Warehouse></template>
      <template v-if="activeIndex == 3"><FinishWarehouse :warehouse_name="query.name" :warehouse_id="query.id"></FinishWarehouse></template>
      <template v-if="activeIndex == 4"><Detail :warehouse_name="query.name" :warehouse_id="query.id"></Detail></template>
    </div>
  </div>
</template>
<script>
  import CommodityInfo from './warehouse/commodity_info';
  import Warehouse from './warehouse/warehouse';
  import FinishWarehouse from './warehouse/finish_warehouse';
  import Detail from './warehouse/details';

  export default {
    components: {
      CommodityInfo,
      Warehouse,
      FinishWarehouse,
      Detail
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

