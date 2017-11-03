<!-- 某个仓库nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">入库申请列表</el-menu-item>
      <el-menu-item index="2">增加邮费列表</el-menu-item>
    </el-menu>
    <div class="finance_content">
      <keep-alive>
      <template v-if="activeIndex == 1"><RequestList :warehouse_name="query.name" :warehouse_id="query.id"></RequestList></template>
      <template v-if="activeIndex == 2"><PostageList :warehouse_name="query.name" :warehouse_id="query.id"></PostageList></template>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import RequestList from './finances/request_list';
  import PostageList from './finances/postage_list';
  import { addNav } from '@/utils/index';

  export default {
    components: {
      RequestList,
      PostageList
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
  .finance_content{
    padding: 20px;
  }
</style>

