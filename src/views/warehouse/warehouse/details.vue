<template>
  <div class="app-container">
    <div class="details">
      <div class="search">
        <!-- <span class="search_title">商品查询：</span> -->
        <el-select v-model="selectInput" placeholder="请选择" class="searchInput">
          <el-option label="全部记录" value="0"></el-option>
          <el-option label="入库记录" value="1"></el-option>
          <el-option label="出库记录" value="-1"></el-option>
        </el-select>
        <!-- <el-input v-model="skuOptions" placeholder="请输入查询的商品名称" class="searchInput"></el-input> -->
        <el-input v-model="batchOptions" placeholder="请输入查询的子批次号ID" class="searchInput"></el-input>
        <el-button v-on:click="handleIconClick" type="primary">搜索</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border v-loading.body="listLoading" element-loading-text="拼命加载中">
        <el-table-column prop="batch_id" label="子批次ID" width="95"></el-table-column>
        <el-table-column prop="sku.spu.name" label="商品名称" width="120"></el-table-column>
        <el-table-column prop="sku.type" label="款式"></el-table-column>
        <el-table-column prop="user.account" label="操作用户"></el-table-column>
        <el-table-column label="库存变化">
          <template scope="scope">
            <span v-if="scope.row.increment_quantity > 0" style="color: #20a0ff;">+{{scope.row.increment_quantity}}</span>
            <span v-if="scope.row.increment_quantity < 0" style="color: red;">{{scope.row.increment_quantity}}</span>
            <span v-if="scope.row.memo == 'accountant_checked: passed'" style="color: #13ce66;">通过审核</span>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注"></el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button type="primary" size="small" @click="queryRequest(scope.row.batch_id)">商品详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 20" :page-size="20" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="入库详情" :visible.sync="dialogStatus" top="5%">
      <div>
        <el-form label-width="80px" class="addForm" v-if="batchDetails.id">
          <el-form-item label="申请人">{{batchDetails.requester.account}}</el-form-item>
          <el-form-item label="商品名称">{{batchDetails.sku.spu_name}}</el-form-item>
          <el-form-item label="商品类型" >{{batchDetails.sku.type}}</el-form-item>
          <el-form-item label="商品进价" >{{batchDetails.purchasing_price}}</el-form-item>
          <el-form-item label="进货数量" >{{batchDetails.quantity}}</el-form-item>
          <el-form-item label="进货渠道" >{{batchDetails.purchasing_channel}}</el-form-item>
          <el-form-item label="商品规格" >{{batchDetails.specification}}</el-form-item>
          <el-form-item label="生产厂家" >{{batchDetails.manufacturer}}</el-form-item>
          <el-form-item label="产地" >{{batchDetails.origin}}</el-form-item>
          <el-form-item label="颜色" >{{batchDetails.color}}</el-form-item>
          <el-form-item label="尺寸" >{{batchDetails.size}}</el-form-item>
          <el-form-item label="毛重" >{{batchDetails.weight}}</el-form-item>
          <el-form-item label="优先级" >{{batchDetails.sale_priority}}</el-form-item>
          <el-form-item label="入库数量" >{{batchDetails.actual_quantity}}</el-form-item>
          <el-form-item label="保质期" >{{batchDetails.shelf_life}}</el-form-item>
          <el-form-item label="入库时间" >{{batchDetails.arrival_time}}</el-form-item>
          <el-form-item label="申请人备注" >{{batchDetails.request_memo}}</el-form-item>
          <el-form-item label="确认人备注" >{{batchDetails.memo}}</el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { get_skus, stocklogs } from '@/api/warehouse';
  import { request_info } from '@/api/goods';

  export default {
    // 仓库id name
    props: ['warehouse_name', 'warehouse_id'],
    data() {
      return {
        selectInput: '0',       // type
        skuOptions: '',         // sku_id
        batchOptions: '',       // batch_id
        totalPages: 0,
        tableData: [],
        dialogStatus: false,
        batchDetails: {
          id: null
        },
        listLoading: true
      }
    },
    created() {
      // 默认查询全部
      this.initdetailQuery();
    },
    methods: {
      // 搜索按钮
      handleIconClick() {
        this.initdetailQuery();
      },
      // 查询接口配置
      initdetailQuery(obj) {
        const that = this;
        const params = {
          warehouse_id: this.warehouse_id,
          type: this.selectInput,
          batch_id: this.batchOptions,
          sku_id: this.skuOptions
        };
        if(obj){
          $.extend(params, obj)
        }
        that.listLoading = true;
        stocklogs(params).then((res) => {
          that.totalPages = res.total;
          that.tableData = res.data;
          that.listLoading = false;
        })
      },
      // 分页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        this.initdetailQuery(obj);
      },
      // 商品详情查询
      queryRequest(id) {
        const that = this;
        that.dialogStatus = true;
        request_info(id).then((res) => {
          that.batchDetails = res;
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .details{
    .search{
      .searchInput{
        width: 240px;
        padding-bottom: 20px;
        float: left;
      }
    }
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
  }
  .el-form-item{
    margin: 0;
  }
</style>

