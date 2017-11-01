<!-- spu列表 -->
<template>
  <div class="app-container">
    <div class="skus_list">
      <el-table :data="tableData" style="width: 100%" stripe border>
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
            <el-tag v-for="item in scope.row.warehouses" :key="item.name" type="primary" >{{item.name}}</el-tag>
            <el-checkbox-group v-model="checkList" v-if="inputstatus == scope.$index">
              <el-checkbox v-for="warehouse in warehouseList" :label="warehouse.id" :key="warehouse.id" v-if="!warehouse.web_status">{{warehouse.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-input v-model="scope.row.id" type="hidden" class="hiddenbox"></el-input>
            <el-button size="small" @click="compileModule(scope.$index,scope.row.warehouses)" class="queryRequest">
              <span v-if="inputstatus != scope.$index">编辑SkU</span>
              <span v-else="inputstatus != scope.$index">确认修改</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { skus_list, update_skus, sku_batches, skus_warehouses } from '@/api/goods';
  import { warehouse_list } from '@/api/warehouse';

  export default {
    props: ['sku_id', 'status'],
    data() {
      return {
        tableData: [],
        inputstatus: null,
        warehouseList: [],
        checkList: []
      }
    },
    watch: {
      status(val) {
        this.inputstatus = null;
        this.initSkusList();
      }
    },
    created() {
      this.initSkusList();
    },
    methods: {
      // 修改SKU部分信息
      compileModule(index, warehouses) {
        var that = this;
        if(that.inputstatus !== null){
          const inputstatus = that.inputstatus;
          const id = that.tableData[inputstatus]['id'];
          const obj = {
            type: that.tableData[inputstatus]['type'],
            desc: that.tableData[inputstatus]['desc'],
            price: that.tableData[inputstatus]['price']
          }
          // 修改sku信息
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
          // 添加库房
          that.addWarehouse(id, index);
        }else{
          that.inputstatus = index;
          this.warehouses(warehouses);
        }
      },
      // 获取sku方法
      initSkusList() {
        const that = this;
        const params = {
          size: 20,
          spu_id: this.sku_id
        };
        skus_list(params).then((res) => {
          that.tableData = res.result;
          // 重置totalPages 计算是否有分页
          that.totalPages = res.totalPages*10;
        })
      },
      // 区分未添加的仓库
      warehouses(warehouses) {
        const that = this;
        warehouse_list().then((res) => {
          res.data.forEach((item, index) => {
            warehouses.forEach((n, i) => {
              if(n.id == item.id){
                item['web_status'] = true;
              }
            })
          })
          that.warehouseList = res.data;
        })
      },
      // 将若干SKU注册到若干仓库中
      addWarehouse(sku_ids, index) {
        const that = this;
        const obj = {
          warehouse_id: this.checkList.toString(),
          sku_id: sku_ids.toString()
        }
        skus_warehouses(obj).then((res) => {
          that.warehouseList.forEach((item, x) => {
            that.checkList.forEach((n, i) => {
              if(item.id == n){
                that.tableData[index]['warehouses'].push(item);
              }
            })
          })
          that.checkList = [];
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

