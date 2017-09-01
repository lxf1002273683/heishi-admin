<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">SKU列表</el-menu-item>
      <router-link to="/goods/add_skus">
        <el-menu-item index="2">创建SKU</el-menu-item>
      </router-link>
    </el-menu>
    <div class="skus_list">
      <div class="search">
        <el-input placeholder="请输入查询的SPU" v-model="searchInputSpu" class="searchInput">
          <el-button slot="append" icon="search" v-on:click="handleIconClick"></el-button>
        </el-input>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border >
        <el-table-column prop="spu_name" label="SPU" width="120">
        </el-table-column>
        <el-table-column prop="type" label="款式名称">
        </el-table-column>
        <el-table-column prop="desc" label="描述">
        </el-table-column>
        <el-table-column prop="price" label="价格">
        </el-table-column>
        <el-table-column prop="stock" label="库存">
        </el-table-column>
        <el-table-column label="操作" width="70">
          <template scope="scope">
            <el-input v-model="scope.row.id" type="hidden" class="hiddenbox"></el-input>
            <el-button size="small" @click="compileModule(scope.$index)">
              <span v-if="inputstatus != scope.$index">编辑</span>
              <span v-else="inputstatus != scope.$index">确认</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { skus_list } from '@/api/goods';

  export default {
    data() {
      return {
        activeIndex: '1',
        tableData: [],
        totalPages: 0,
        searchInputSpu: '',
        inputstatus: null
      }
    },
    created() {
      // 获取现有的分类
      this.getSkus();
    },
    methods: {
      getSkus() {
        const that = this;
        skus_list().then((res) => {
          that.tableData = res.result;
          that.totalPages = res.totalPages*10;
        })
      },
      handleCurrentChange(val) {
        const that = this
        const obj = {
          page: val,
          spu_name: this.searchInputSpu
        }
        skus_list(obj).then((res) => {
          that.tableData = res.result;
        })
      },
      handleIconClick(){
        const that = this
        const obj = {
          spu_name: this.searchInputSpu
        }
        skus_list(obj).then((res) => {
          that.tableData = res.result;
          // 重置totalPages 计算是否有分页
          that.totalPages = res.totalPages*10;
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .skus_list{
    padding: 20px;
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    .search{
      .searchInput{
        float: left;
        width: 240px;
        padding: 0 0 20px ;
      }
    }
  }
</style>

