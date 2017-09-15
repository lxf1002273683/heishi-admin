<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">库房商品</el-menu-item>
      <router-link :to="{ path: '/warehouse/warehouse'+query.id, query: { id: query.id, name: query.name }}">
        <el-menu-item index="2">入库申请</el-menu-item>
      </router-link>
      <router-link :to="{ path: '/warehouse/finishWarehouse'+query.id, query: { id: query.id, name: query.name }}">
        <el-menu-item index="2">入库历史</el-menu-item>
      </router-link>
    </el-menu>
    <div class="commodity_list">
      <div class="search">
        <span class="search_title">SKU查询：</span>
        <el-input v-model="skuOptions" placeholder="请输入内容" class="searchInput" @change="selectSku"></el-input>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border >
        <el-table-column prop="spu_name" label="SKU" width="120"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="desc" label="备注"></el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button type="primary" size="small" @click="queryRequest(scope.row.sku_id)">进货历史</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" :page-size="20" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="进货历史" :visible.sync="dialogStatus" top="5%"  @close="dialogClose">
      <!-- 设置 activeNames :name="1"默认全部展开 -->
      <div class="noData" v-if="status != 0">暂时没有物品入库</div>
      <el-collapse v-model="activeNames" v-if="status == 0">
      <template v-for="item in requestsData">
        <el-collapse-item :title="item.batch_number" name="1">
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
            <el-table-column prop="sale_priority" label="销售优先级">
            </el-table-column>
            <el-table-column prop="presale_quantity" label="预售数量">
            </el-table-column>
            <el-table-column label="入库状态">
                <template scope="scope">
                  <span v-if="scope.row.sale_status == 1" class="requestStatus1">已入库</span>
                  <span v-if="scope.row.sale_status != 1" class="requestStatus2">待入库</span>
                </template>
              </el-table-column>
          </el-table>
        </el-collapse-item>
      </template>
      </el-collapse>
    </el-dialog>
  </div>
</template>
<script>
  import { get_skus } from '@/api/warehouse';
  import { request_list } from '@/api/goods';

  export default {
    data() {
      return {
        activeIndex: '1',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id,
        },
        activeNames: '',
        tableData: [],
        totalPages: 0,
        requestsData: [],
        dialogStatus: false,
        activeNames: '1',
        status: 0,
        skuOptions: ''
      }
    },
    created() {
      this.initRequestList();
    },
    methods: {
      initRequestList(obj) {
        const that = this;
        const params = {};
        if(obj){
          $.extend(params, obj)
        }
        get_skus(this.query.id, params).then((res) => {
          that.tableData = res.data;
          that.totalPages = res.total;
        })
      },
      // 查询sku对应的入库申请 
      queryRequest(id){
        const that = this;
        const obj = {
          warehouse_id: this.query.id,
          filter: '0,1,2',
          size: 50,
          sku_id: id
        }
        that.dialogStatus = true;
        that.status = 0;
        request_list(obj).then((res) => {
          if(res.data.length){
            that.requestsData = res.data;
          }else{
            that.status = 1;
          }
        })
      },
      // 关闭模态框 初始参数
      dialogClose() {
        this.requestsData = [];
      },
      // 分页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        this.initRequestList(obj);
      },
      // 搜索sku
      selectSku() {
        const obj = {
          keywords: this.skuOptions
        }
        this.initRequestList(obj);
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .commodity_list{
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
  .noData{
    text-align: center;
  }
  .requestStatus1{
    color: #20a0ff;
  }
  .requestStatus2{
    color: #ff4949;
  }
</style>


