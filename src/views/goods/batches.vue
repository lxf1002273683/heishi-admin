<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">批次列表</el-menu-item>
      <router-link to="/goods/add_batches">
        <el-menu-item index="2">创建批次</el-menu-item>
      </router-link>
    </el-menu>
    <div class="spus_list">
      <el-table :data="tableData" style="width: 100%" stripe border >
        <el-table-column prop="category_id" label="分类ID" width="120">
        </el-table-column>
        <el-table-column prop="shop_id" label="店铺ID">
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="short_name" label="简称">
        </el-table-column>
        <el-table-column prop="brand_name" label="品牌名称">
        </el-table-column>
        <el-table-column prop="image" label="图片" min-width="120">
          <template scope="scope">
            <img :src="scope.row.image">
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述">
        </el-table-column>
        <el-table-column prop="memo" label="备注">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { spus_list } from '@/api/goods';

  export default {
    data() {
      return {
        activeIndex: '1',
        tableData: []
      }
    },
    created() {
      // 获取现有的分类
      this.getSpus();
    },
    methods: {
      getSpus() {
        const that = this;
        spus_list().then((res) => {
          that.tableData = res.result;
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .spus_list{
    padding: 20px;
    img{
      width: 100%;
      min-width: 120px;
      height: 120px;
    }
  }
</style>

