<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <router-link :to="{ path: '/articles/articles/' + query.name, query: { id: query.id, name: query.name }}">
        <el-menu-item index="1">商品列表</el-menu-item>
      </router-link>
      <el-menu-item index="2">发布商品</el-menu-item>
    </el-menu>
    id为{{query.id}}, {{query.name}} 的发布商品
  </div>
</template>

<script>
  import { spus_list, update_spus } from '@/api/goods';
  import { getToken } from '@/utils/auth';

  export default {
    data() {
      return {
        activeIndex: '2',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id
        }
      }
    },
    created() {
      // 获取现有的分类
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
