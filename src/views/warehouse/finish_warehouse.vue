<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <router-link :to="{ path: '/warehouse/commodityInfo'+query.id, query: { id: query.id, name: query.name }}">
        <el-menu-item index="1">库房商品</el-menu-item>
      </router-link>
      <router-link :to="{ path: '/warehouse/warehouse'+query.id, query: { id: query.id, name: query.name }}">
        <el-menu-item index="2">入库申请</el-menu-item>
      </router-link>
        <el-menu-item index="3">入库历史</el-menu-item>
    </el-menu>
    <div class="warehouse_list">
      <!-- <div class="search">
        <span class="search_title">SKU查询：</span>
        <el-select v-model="skuOptions" filterable clearable remote placeholder="请输入查询的SKU" :remote-method="remoteMethod" :loading="loading"  @change="selectChange" class="select_sku_id searchInput">
            <el-option v-for="item in skuItems" :key="item.value" :label="item.spu_name+'/'+item.type" :value="item.id">
              <span>{{ item.spu_name+'/'+item.type }}</span>
            </el-option>
          </el-select>
      </div> -->
      <el-collapse v-model="activeNames">
        <template v-for="item in tableData">
          <el-collapse-item :title="item.batch_number" :name="item.id">
            <el-table :data="item.batches" style="width: 100%" stripe border >
              <el-table-column label="SKU" width="120">
                <template scope="scope">
                  <span>{{scope.row.sku.spu_name}}/{{scope.row.sku.type}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="purchasing_price" label="商品进价">
              </el-table-column>
              <el-table-column prop="quantity" label="进货数量">
              </el-table-column>
              <el-table-column prop="presale_quantity" label="预售数量">
              </el-table-column>
              <el-table-column prop="estimated_arrival_time" label="预计到库时间">
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
  import { request_list } from '@/api/goods';

  export default {
    data() {
      return {
        activeIndex: '3',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id,
        },
        activeNames: '',
        tableData: [],
        totalPages: 0
      }
    },
    created() {
      this.initRequestList();
    },
    methods: {
      initRequestList(obj) {
        const that = this;
        const params = {
          warehouse_id: this.query.id,
          filter: 2
        }
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
  .warehouse_list{
    padding: 20px;
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
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
  }
</style>

