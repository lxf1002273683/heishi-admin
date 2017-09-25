<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">SKU列表</el-menu-item>
      <!-- <router-link to="/goods/add_skus">
        <el-menu-item index="2">创建SKU</el-menu-item>
      </router-link> -->
    </el-menu>
    <div class="skus_list">
      <div class="search">
        <el-input placeholder="请输入查询的商品名称" v-model="searchInputSpu" class="searchInput" @change="selectSku">
        </el-input>
      </div>
      <el-button type="primary" class="add_warehouse" @click="add_warehouse">添至库房</el-button>
      <el-table :data="tableData" style="width: 100%" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45">
        </el-table-column>
        <el-table-column prop="spu_name" label="商品名称" width="120">
        </el-table-column>
        <el-table-column prop="type" label="款式名称">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.type}}</span>
            <el-input v-model="scope.row.type" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.desc}}</span>
            <el-input v-model="scope.row.desc" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.price}}</span>
            <el-input v-model="scope.row.price" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="库存">
        </el-table-column>
        <el-table-column label="已注册仓库">
          <template scope="scope">
            <el-tag v-for="item in scope.row.warehouses" :key="item.name" type="primary">{{item.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-input v-model="scope.row.id" type="hidden" class="hiddenbox"></el-input>
            <el-button size="small" type="primary" @click="compileModule(scope.$index)" class="queryRequest">
              <span v-if="inputstatus != scope.$index">编辑SkU</span>
              <span v-else="inputstatus != scope.$index">确认修改</span>
            </el-button>
            <el-button size="small" @click="queryRequest(scope.row.id)" class="queryRequest">进货历史</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="添至库房" :visible.sync="dialogWarehouseStatus" size="tiny">
      <template>
        <el-checkbox-group v-model="checkList">
          <template v-for="item in warehouseList">
            <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
          </template>
        </el-checkbox-group>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogWarehouseStatus = false">取 消</el-button>
        <el-button type="primary" @click="addWarehouse">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="进货历史" :visible.sync="dialogQueryRequestStatus" top="5%" size="large">
      <el-table :data="queryRequestList" style="width: 100%" stripe border >
        <el-table-column prop="sku_id" label="商品名称（spu_id）" width="120">
          <!-- <template scope="scope">
            <span>{{scope.row.sku.spu_name}}/{{scope.row.sku.type}}</span>
          </template> -->
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
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
  import { skus_list, update_skus, skus_warehouses, sku_batches } from '@/api/goods';
  import { warehouse_list } from '@/api/warehouse';

  export default {
    data() {
      return {
        activeIndex: '1',
        tableData: [],
        totalPages: 0,
        searchInputSpu: '',
        inputstatus: null,
        multipleSelection: [],       // 存放选中的sku
        dialogWarehouseStatus: false,
        dialogQueryRequestStatus: false,
        checkList: [],
        warehouseList: [],
        queryRequestList: [],
        currentpage: 0
      }
    },
    created() {
      // 获取现有的分类
      this.initSkusList();
      // 初始化仓库列表
      this.getWarehouses();
    },
    methods: {
      //  分页
      handleCurrentChange(val) {
        this.currentpage = val
        const obj = {
          page: this.currentpage,
          spu_name: this.searchInputSpu
        }
        this.initSkusList(obj);
      },
      // SPU查询
      selectSku() {
        const obj = {
          spu_name: this.searchInputSpu
        }
        this.initSkusList(obj);
      },
      // 修改SKU部分信息
      compileModule(index) {
        var that = this;
        if(that.inputstatus !== null){
          const inputstatus = that.inputstatus;
          const id = that.tableData[inputstatus]['id'];
          const obj = {
            type: that.tableData[inputstatus]['type'],
            desc: that.tableData[inputstatus]['desc'],
            price: that.tableData[inputstatus]['price']
          }
          update_skus(id, obj).then(()=>{
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            that.inputstatus = null;
          }).catch(function(err){
            that.$message({
              message: '修改失败',
              type: 'error'
            });
            that.inputstatus = null;
          })
        }else{
          that.inputstatus = index;
        }
      },
      // 点击 添至库房 进行仓库选择
      add_warehouse() {
        if(this.multipleSelection.length){
          this.dialogWarehouseStatus = true;
        }else{
          this.$message({
            message: '请先选择要添加的SKU',
            type: 'error'
          });
        }
      },
      // 表格选择变化监听复制
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 初始化仓库列表
      getWarehouses() {
        const that = this;
        warehouse_list().then((res) => {
          that.warehouseList = res.data;
        })
      },
      // 批量添加sku到仓库
      addWarehouse() {
        const warehouse_ids = this.checkList;
        const sku_ids = [];
        const that = this;
        $.each(this.multipleSelection, function(i, item){
          sku_ids.push(item.id);
        })
        const obj = {
          warehouse_id: warehouse_ids.toString(),
          sku_id: sku_ids.toString()
        }
        skus_warehouses(obj).then((res) => {
          that.$message({
            message: '添加成功',
            type: 'success'
          });
          that.dialogWarehouseStatus = false;
          const obj = {
            page: that.currentpage,
            spu_name: that.searchInputSpu
          }
          that.initSkusList(obj);
        })
      },
      // 打开进货历史模态框
      queryRequest(id) {
        const that = this;
        const obj = {
          sku_id: id,
          size: 50
        }
        that.dialogQueryRequestStatus = true;
        sku_batches(obj).then((res) => {
          that.queryRequestList = res.result;
        })
      },
      // 获取sku方法
      initSkusList(obj) {
        const that = this;
        const params = {
          size: 10
        };
        if(obj){
          $.extend(params, obj)
        }
        skus_list(params).then((res) => {
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
    position: relative;
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    .search{
      text-align: center;
      .searchInput{
        width: 240px;
        padding: 0 0 20px ;
      }
    }
    .hiddenbox{
      display: none;
    }
    .el-tag--primary{
      margin: 3px;
    }
    .add_warehouse{
      /*margin: 10px;*/
      position: absolute;
      top: 20px;
    }
    .queryRequest{
      margin: 3px 0;
    }
  }
</style>

