<!-- 入库申请列表 -->
<template>
  <div class="app-container">
    <div class="request_list">
      <div class="search">
        <!-- <span class="search_title">批次查询</span>
        <el-input placeholder="请输入查询的批次号" v-model="searchInputCategory" class="searchInput">
          <el-button slot="append" icon="search" v-on:click="handleIconClickBatch"></el-button>
        </el-input> -->
        <span class="search_title">商品查询：</span>
        <el-select v-model="skuOptions" filterable clearable remote placeholder="请输入查询的商品名称" :remote-method="remoteMethod" :loading="loadingSelect"  @change="selectChange" class="select_sku_id searchInput">
            <el-option v-for="item in skuItems" :key="item.value" :label="item.spu_name+'/'+item.type" :value="item.id">
              <span>{{ item.spu_name+'/'+item.type }}</span>
            </el-option>
          </el-select>
      </div>
      <el-collapse v-model="activeNames" accordion v-loading.body="listLoading" element-loading-text="拼命加载中">
        <template v-for="(item, index) in tableData">
          <el-collapse-item :title="item.batch_number" :name="item.id" v-if="item.batches.length != 0">
            <template slot="title">
              <span>{{item.batch_number}}</span>
              <span class="user">申请人 ：{{item.requester.account}}</span>
              <el-button v-if="item.status == 0" class="delete" size="small"  type="danger" @click.stop="deleteRequest(item.id,index)">删除申请</el-button>
              <span v-if="item.status == 1" class="status1">等待入库</span>
              <span v-if="item.status == 2" class="status1">部分入库</span>
              <span v-if="item.status == 3" class="status2" >完成入库</span>
              <el-button v-if="item.status == -2" class="delete" size="small"  type="warning" @click.stop="resubmitRequest(item.id,index)">重新提交</el-button>
              <span v-if="item.status == -2" class="status3" >申请被驳回，请修改后再次提交</span>
            </template>
            <el-table :data="item.batches" style="width: 100%" stripe border >
              <el-table-column prop="sku.spu_name" label="商品名称"></el-table-column>
              <el-table-column prop="sku.type" label="款式"></el-table-column>
              <el-table-column prop="warehouse.name" label="仓库"></el-table-column>
              <el-table-column prop="purchasing_price" label="商品总价"></el-table-column>
              <el-table-column prop="quantity" label="进货数量"></el-table-column>
              <el-table-column prop="presale_quantity" label="预售数量"></el-table-column>
              <el-table-column prop="actual_quantity" label="库存"></el-table-column>
              <el-table-column prop="sale_priority" label="销售优先级"></el-table-column>
              <el-table-column prop="estimated_arrival_time" label="预计到库时间"></el-table-column>
              <el-table-column label="备注">
                <template scope="scope">
                  <span>{{item.memo}}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template scope="scope">
                  <el-button v-if="item.status == -2" size="small"  type="warning" @click.stop="updateRequest(scope.row.id,scope.$index,index)">修改申请</el-button>
                  <span v-if="scope.row.sale_status == 0 && item.status != -2">待审核</span>
                  <span v-if="scope.row.sale_status == 1 && item.status != -2">等待入库</span>
                  <span v-if="scope.row.sale_status == 2">部分入库</span>
                  <span v-if="scope.row.sale_status == 3">预售中</span>
                  <span v-if="scope.row.sale_status == 4">完成入库</span>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </template>
      </el-collapse>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="入库申请" :visible.sync="dialogStatus" top="5%">
      <div>
        <el-form label-width="80px" :model="addForm" ref="addForm" class="addForm" :rules="rules">
          <el-form-item label="仓库">
            <el-input v-model="addForm.warehouse.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="sku_id">
            <el-select v-model="warehouseskuOptions" clearable filterable remote placeholder="请输入商品名称查询" :remote-method="remoteMethodSku" :loading="loading"  @change="warehouseSelectChange" class="select_sku_id">
              <el-option v-for="item in warehouseSkuItems" :label="item.spu_name+'/'+item.type" :key="item.value" :value="item.sku_id">
                <span>{{ item.spu_name+'/'+item.type }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品进价" prop="purchasing_price">
            <el-input v-model="addForm.purchasing_price"></el-input>
          </el-form-item>
          <el-form-item label="进货数量" prop="quantity">
            <el-input v-model.number="addForm.quantity"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { request_list, skus_list, delete_requests, skus_warehouses_list, request_info, update_requset, resubmit_requset } from '@/api/goods';
  import { warehouse_list } from "@/api/warehouse";

  export default {
    data() {
      return {
        tableData: [],
        activeNames: '',
        searchInputCategory: '',
        skuOptions: '',
        loadingSelect: false,
        skuItems: [],
        totalPages: 0,
        dialogStatus: false,
        addForm: {
          index: 0,
          parent_index: 0,
          sku_id: '',
          warehouse: {
            name: ''
          },
          purchasing_price: '',
          quantity: ''
        },
        rules: {
          sku_id: { required: true, message: '请选择SKU', trigger: 'blur' },
          purchasing_price: [{ required: true, message: '请填写商品进价'}],
          quantity: [{ required: true, message: '请填写商品数量'},{ type: 'number', message: '必须为数字值'}]
        },
        warehouseSkuItems: [],
        warehouseOptions: '',
        warehouseskuOptions: '',
        loading: false,
        listLoading: true
      }
    },
    created() {
      this.initRequestList();
    },
    methods: {
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
        const params = {
          filter: '-2,0,1,2'
        };
        if(obj){
          Object.assign(params, obj)
        }
        that.listLoading = true;
        request_list(params).then((res) => {
          that.tableData = res.data;
          that.totalPages = res.total;
          that.listLoading = false;
        })
      },
      // 删除入库申请
      deleteRequest(id, index) {
        const that = this;
        that.$confirm('是否确认此入库申请没有问题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delete_requests(id).then((res) => {
            that.$message({
              message: '删除成功',
              type: 'success'
            });
            that.tableData.splice(index, 1);
          },(error) => {
            that.$message({
              message: error.message,
              type: 'error'
            });
          })
        }).catch(() => {});
      },
      // 修改单个批次信息
      updateRequest(id, index, parent_index) {
        this.dialogStatus = true;
        const that = this;
        request_info(id).then((res) => {
          that.addForm = res;
          that.addForm.index = index;
          that.addForm.parent_index = parent_index;
          that.warehouseOptions = res.warehouse.id;
          // 初始化商品名称 列表
          const obj = res.sku;
          obj.sku_id = res.sku.id;
          that.warehouseSkuItems.push(obj);
          that.warehouseskuOptions = res.sku.id;
          that.addForm.warehouse_id = res.warehouse.id;
        })
      },
      // 重新提交入库申请
      resubmitRequest(id, index) {
        const that = this;
        that.$confirm('是否确定此入库申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resubmit_requset(id).then((res) => {
            that.$message({
              message: res,
              type: 'success'
            });
            that.tableData[index].status = 0;
          },(error) => {
            that.$message({
              message: error.message,
              type: 'error'
            });
          })
        }).catch(() => {});
      },
      // 搜索关联仓库的sku
      remoteMethodSku(query) {
        const that = this;
        const obj = {
          warehouse_id: this.warehouseOptions,
          keywords: query
        }
        if(query){
          skus_warehouses_list(obj).then((res) => {
            that.warehouseSkuItems = res;
          })
        }
      },
      // sku选择
      warehouseSelectChange(value) {
        if(value){
          this.addForm.sku_id = value.toString();
        }else{
          this.addForm.sku_id = '';
        }
      },
      // 提交修改
      submit() {
        const that = this;
        const obj = {
          quantity: this.addForm.quantity,
          sku_id: this.addForm.sku_id,
          price: this.addForm.purchasing_price
        }
        update_requset(that.addForm.id, obj).then((res) => {
          that.$message({
            message: res,
            type: 'success'
          });
          that.dialogStatus = false;
          that.tableData[that.addForm.parent_index]['batches'][that.addForm.index]['quantity'] = that.addForm.quantity;
          that.tableData[that.addForm.parent_index]['batches'][that.addForm.index]['purchasing_price'] = that.addForm.purchasing_price;
          that.$refs.addForm.resetFields();
        },(error) => {
          that.$message({
            message: error.message,
            type: 'error'
          });
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .request_list{
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
    .user{
      margin-left: 20px;
    }
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    .status1,
    .status2,
    .status3,
    .delete{
      float: right;
      margin-right: 20px;
    }
    .delete{
      margin-top: 8px;
      margin-right: 12px;
    }
    .status2{
      color: #13CE66;
    }
    .status1{
      color: #F7BA2A;
    }
    .status3{
      color: #F7BA2A;
    }
  }
  .addForm{
    width: 320px;
    margin: 0 auto;
    .el-input{
      width: 217px;
    }
  }
</style>

