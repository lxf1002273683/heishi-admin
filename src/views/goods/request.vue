<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">入库申请</el-menu-item>
      <router-link to="/goods/add_request">
        <el-menu-item index="2">申请入库</el-menu-item>
      </router-link>
    </el-menu>
    <div class="request_list">
      <div class="search">
        <!-- <span class="search_title">批次查询</span>
        <el-input placeholder="请输入查询的批次号" v-model="searchInputCategory" class="searchInput">
          <el-button slot="append" icon="search" v-on:click="handleIconClickBatch"></el-button>
        </el-input> -->
        <span class="search_title">商品查询：</span>
        <el-select v-model="skuOptions" filterable clearable remote placeholder="请输入查询的商品名称" :remote-method="remoteMethod" :loading="loading"  @change="selectChange" class="select_sku_id searchInput">
            <el-option v-for="item in skuItems" :key="item.value" :label="item.spu_name+'/'+item.type" :value="item.id">
              <span>{{ item.spu_name+'/'+item.type }}</span>
            </el-option>
          </el-select>
      </div>
      <el-collapse v-model="activeNames" accordion>
        <template v-for="item in tableData">
          <el-collapse-item :title="item.batch_number" :name="item.id" v-if="item.batches.length != 0">
            <el-table :data="item.batches" style="width: 100%" stripe border >
              <el-table-column prop="sku.spu_name" label="商品名称"></el-table-column>
              <el-table-column prop="sku.type" label="款式"></el-table-column>
              <el-table-column prop="warehouse.name" label="仓库"></el-table-column>
              <el-table-column prop="purchasing_price" label="商品总价"></el-table-column>
              <el-table-column prop="quantity" label="进货数量"></el-table-column>
              <el-table-column prop="sale_priority" label="销售优先级"></el-table-column>
              <el-table-column prop="estimated_arrival_time" label="预计到库时间"></el-table-column>
              <el-table-column label="备注" rowspan="3">
                <template scope="scope">
                  <span>{{item.memo}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </template>
      </el-collapse>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { request_list, skus_list } from '@/api/goods';

  export default {
    data() {
      return {
        activeIndex: '1',
        tableData: [],
        activeNames: '',
        searchInputCategory: '',
        skuOptions: '',
        loading: false,
        skuItems: [],
        totalPages: 0
      }
    },
    created() {
      this.initRequestList();
    },
    methods: {
      // 批次搜索
      // handleIconClickBatch() {
      //   console.log(1);
      // },
      // 拿到sku后，搜索对应的入库申请
      selectChange(value) {
        if(value){
          const that = this
          const obj = {
            sku_id: value
          }
          this.initRequestList(obj);
        }else{
          const obj = {};
          this.initRequestList();
        }
      },
      // 远程搜索sku
      remoteMethod(query) {
        const that = this;
        const obj = {
          spu_name: query
        }
        skus_list(obj).then((res) => {
          that.skuItems = res.result;
        })
      },
      // 翻页
      handleCurrentChange(val) {
        const that = this;
        const obj = {
          page: val
        }
        // 在翻页时判断是否存在搜索条件
        if(this.skuOptions){
          obj.sku_id = this.skuOptions
        }
        this.initRequestList(obj);
      },
      // 初始化入库申请列表 默认带有仓库id
      initRequestList(obj) {
        const that = this;
        const params = {};
        if(obj){
          $.extend(params, obj)
        }
        request_list(params).then((res) => {
          that.tableData = res.data;
          that.totalPages = res.total;
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .request_list{
    padding: 20px;
    .search{
      .search_title{
        font-size: 14px;
        color: #1f2d3d;
      }
      .searchInput{
        width: 240px;
        padding: 0 20px 20px 0;
      }
    }
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
  }
</style>

