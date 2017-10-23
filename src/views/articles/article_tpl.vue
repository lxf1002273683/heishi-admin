<!-- 文章nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">商品列表</el-menu-item>
      <el-menu-item index="2">发布商品</el-menu-item>
    </el-menu>
    <div class="article_content">
      <template v-if="activeIndex == 1"><ArticleList :user_name="query.name" :user_id="query.id"></ArticleList></template>
      <template v-if="activeIndex == 2"><Release :user_name="query.name" :user_id="query.id"></Release></template>
    </div>
  </div>
</template>

<script>
  import ArticleList from './article/article_list';
  import Release from './article/release';

  export default {
    components: {
      ArticleList,
      Release
    },
    data() {
      return {
        activeIndex: '1',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id
        }
      }
    },
    methods: {
      // 切换nav
      select(key) {
        this.activeIndex = key;
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .article_content{
    padding: 20px;
  }
</style>