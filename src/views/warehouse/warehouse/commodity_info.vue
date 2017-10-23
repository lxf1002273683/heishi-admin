<!-- 仓库商品列表 -->
<template>
  <div class="app-container">
    <div class="commodity_list">
      <div class="search">
        <span class="search_title">商品查询：</span>
        <el-input v-model="skuOptions" placeholder="请输入查询的商品名称" class="searchInput" @change="selectSku"></el-input>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border v-loading.body="listLoading" element-loading-text="拼命加载中">
        <el-table-column prop="spu_name" label="商品名称" width="120"></el-table-column>
        <el-table-column prop="type" label="款式"></el-table-column>
        <el-table-column prop="stock" label="库存"></el-table-column>
        <el-table-column prop="desc" label="备注"></el-table-column>
        <el-table-column label="进货查询" width="100">
          <template scope="scope">
            <el-button size="small" @click="queryRequest(scope.row.sku_id)">进货历史</el-button>
          </template>
        </el-table-column>
        <el-table-column label="删除" width="80">
          <template scope="scope">
            <el-button :plain="true" type="danger" size="small" @click="deleteSku(scope.row.sku_id,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" :page-size="20" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="进货历史" :visible.sync="dialogStatus" top="5%"  @close="dialogClose" size="large">
      <!-- 设置 activeNames :name="1"默认全部展开 -->
      <div class="noData" v-if="status != 0">暂时没有物品入库</div>
      <el-collapse v-model="activeNames" v-if="status == 0">
      <template v-for="item in requestsData">
        <el-collapse-item :title="item.batch_number" name="1">
          <template slot="title"> <!-- <span>{{item.memo}}</span> -->
            <span>{{item.batch_number}}</span>
            <span class="user">申请人：{{item.requester.account}}</span>
          </template>
          <el-table :data="item.batches" style="width: 100%" stripe border >
            <el-table-column prop="id" label="子批次ID" width="95"></el-table-column>
            <el-table-column prop="sku.spu_name" label="商品名称"></el-table-column>
            <el-table-column prop="sku.type" label="款式"></el-table-column>
            <el-table-column prop="purchasing_price" label="商品进价"></el-table-column>
            <el-table-column prop="quantity" label="进货数量"></el-table-column>
            <el-table-column prop="actual_quantity" label="入库数量"></el-table-column>
            <el-table-column prop="payments_sum" label="额外费用(邮费)"></el-table-column>
            <el-table-column prop="sale_priority" label="销售优先级"></el-table-column>
            <el-table-column prop="presale_quantity" label="预售数量"></el-table-column>
            <el-table-column prop="arrival_time" label="到货时间"></el-table-column>
            <el-table-column label="入库状态">
              <template scope="scope">
                <span v-if="scope.row.sale_status == 4" class="requestStatus1">已入库</span>
                <span v-if="scope.row.sale_status == 1 || scope.row.sale_status == 2" class="requestStatus2">待入库</span>
                <span v-if="scope.row.sale_status == 0" class="requestStatus2">待审核</span>
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
  import { get_skus, stocklogs, delete_skus } from '@/api/warehouse';
  import { request_list } from '@/api/goods';

  export default {
    // 仓库id name
    props: ['warehouse_name', 'warehouse_id'],
    data() {
      return {
        activeNames: '',
        tableData: [],
        totalPages: 0,
        requestsData: [],
        dialogStatus: false,
        activeNames: '1',
        status: 0,
        skuOptions: '',
        listLoading: true
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
        that.listLoading = true;
        get_skus(this.warehouse_id, params).then((res) => {
          that.tableData = res.data;
          that.totalPages = res.total;
          that.listLoading = false;
        })
      },
      // 查询sku对应的入库申请 
      queryRequest(id){
        const that = this;
        const obj = {
          warehouse_id: this.warehouse_id,
          filter: '0,1,2,3',
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
      },
      // 删除已注册sku
      deleteSku(id, index) {
        const that = this;
        const obj = {
          warehouse_id: this.warehouse_id,
          sku_id: id
        }
        that.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delete_skus(obj).then((res) => {
            that.$message({
              type: 'success',
              message: '操作成功'
            });
            that.tableData.splice(index, 1);
          },(error) => {
            that.$message({
              type: 'error',
              message: error.message
            });
          })
        }).catch(() => {});
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .commodity_list{
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
  .user{
    margin-left: 20px;
  }
</style>


