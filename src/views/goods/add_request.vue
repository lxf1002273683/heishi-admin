<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <router-link to="/goods/request">
        <el-menu-item index="1">入库申请</el-menu-item>
      </router-link>
      <el-menu-item index="2">申请入库</el-menu-item>
    </el-menu>
    <div class="goodsAddForm">
      <el-form label-width="80px" :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="仓库" prop="warehouse_id">
          <el-select v-model="warehouseOptions" filterable placeholder="请选择" class="warehouse_lists" @change="warehouseIdChange">
            <el-option v-for="item in warehouse_lists" :key="item.value" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="sku_id">
          <el-select v-model="skuOptions" clearable filterable remote placeholder="请输入商品名称查询" :remote-method="remoteMethod" :loading="loading"  @change="selectChange" class="select_sku_id">
            <el-option v-for="item in skuItems" :label="item.spu_name+'/'+item.type" :key="item.value" :value="item.sku_id">
              <span>{{ item.spu_name+'/'+item.type }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品总价" prop="purchasing_price">
          <el-input v-model.number="addForm.purchasing_price"></el-input>
          <span>海外进货，后期邮费可在入库后添加</span>
        </el-form-item>
        <el-form-item label="进货数量" prop="quantity">
          <el-input v-model.number="addForm.quantity"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="specification">
          <el-input v-model="addForm.specification"></el-input>
        </el-form-item>
        <el-form-item label="进货渠道" prop="purchasing_channel">
          <el-input v-model="addForm.purchasing_channel"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="addForm.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="产地" prop="origin">
          <el-input v-model="addForm.origin"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input v-model="addForm.color"></el-input>
        </el-form-item>
        <el-form-item label="尺寸" prop="size">
          <el-input v-model="addForm.size"></el-input>
        </el-form-item>
        <el-form-item label="毛重" prop="weight">
          <el-input v-model="addForm.weight"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="sale_priority">
          <el-input v-model="addForm.sale_priority"></el-input>
        </el-form-item>
        <el-form-item label="预计到库时间" prop="estimated_arrival_time">
          <el-date-picker v-model="addForm.estimated_arrival_time" align="right" format="yyyy-MM-dd" type="date" placeholder="选择日期" @change='pickerChange'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addRequestList">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="addTable" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="addTable">
              <el-form-item label="商品名称: "><span>{{ props.row.sku_name }}</span></el-form-item>
              <el-form-item label="仓库："><span>{{ props.row.warehouse_name }}</span></el-form-item>
              <el-form-item label="商品总价："><span>{{ props.row.purchasing_price }}</span></el-form-item>
              <el-form-item label="进货数量："><span>{{ props.row.quantity }}</span></el-form-item>
              <el-form-item label="商品规格"><span>{{ props.row.specification }}</span></el-form-item>
              <el-form-item label="进货渠道"><span>{{ props.row.purchasing_channel }}</span></el-form-item>
              <el-form-item label="生产厂家"><span>{{ props.row.manufacturer }}</span></el-form-item>
              <el-form-item label="产地"><span>{{ props.row.origin }}</span></el-form-item>
              <el-form-item label="颜色"><span>{{ props.row.color }}</span></el-form-item>
              <el-form-item label="尺寸"><span>{{ props.row.size }}</span></el-form-item>
              <el-form-item label="毛重"><span>{{ props.row.weight }}</span></el-form-item>
              <el-form-item label="优先级"><span>{{ props.row.sale_priority }}</span></el-form-item>
              <el-form-item label="预计到库时间"><span>{{ props.row.estimated_arrival_time }}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="sku_name" label="商品名称" width="120"></el-table-column>
        <el-table-column prop="warehouse_name" label="仓库"></el-table-column>
        <el-table-column prop="purchasing_price" label="商品总价"></el-table-column>
        <el-table-column prop="quantity" label="进货数量"></el-table-column>
        <el-table-column label="操作" width="70">
          <template scope="scope">
            <el-button size="small" @click="deleteItem(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="memo">
        <span class="memo_title">备注</span>
        <el-input v-model="memo" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary" @click="addRequest" class="add_request">提交入库</el-button>
    </div>
  </div>
</template>

<script>
  import { add_request, skus_warehouses_list, skus_list } from "@/api/goods";
  import { warehouse_list } from "@/api/warehouse";
  export default {
    data() {
      return {
        activeIndex: '2',
        // sku远程获取列表
        skuOptions: '',
        skuItems: [],
        loading: false,
        // 仓库列表
        warehouse_lists: [],
        warehouseOptions: '',
        addForm: {
          sku_id: '',
          warehouse_id: '',
          purchasing_price: '',
          quantity: '',
          specification: '',
          purchasing_channel: '',
          manufacturer: '',
          origin: '',
          color: '',
          size: '',
          weight: '',
          sale_priority: 0,
          estimated_arrival_time: ''
        },
        rules: {
          sku_id: { required: true, message: '请选择SKU', trigger: 'blur' },
          warehouse_id: { required: true, message: '请选择仓库' },
          purchasing_price: [{ required: true, message: '请填写商品进价'},{ type: 'number', message: '必须为数字值'}],
          quantity: [{ required: true, message: '请填写商品数量'},{ type: 'number', message: '必须为数字值'}]
        },
        // 实际提交的数据
        addTable:[],
        memo: ''
      }
    },
    created() {
      // 初始化仓库
      const that = this;
      warehouse_list().then((res) => {
        that.warehouse_lists = res.data;
        // 选择默认仓库
        that.warehouseOptions = 3;
      })
    },
    methods: {
      // 将创建的入库申请添加到列表
      addRequestList() {
        const that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            const obj = {
              sku_name: $('.select_sku_id').find('.el-input__inner').val(), // 使用jq获取val值
              warehouse_name: $('.warehouse_lists').find('.el-input__inner').val()
            };
            $.extend(obj, that.addForm);
            that.addTable.push(obj);
            that.$refs.addForm.resetFields();
            that.skuOptions = '';
            // 重置参数后，初始化仓库id
            that.addForm.warehouse_id = that.warehouseOptions;
          } else {
            return false;
          }
        });
      },
      // 将列表提交
      addRequest() {
        const that = this;
        const obj = {
          memo: this.memo,
          batches: this.addTable
        }
        const addTable = JSON.stringify(obj);
        add_request(obj).then(() => {
          that.$message({
            message: '创建成功',
            type: 'success'
          });
          that.addTable = [];
          that.memo = '';
        },() => {
          that.$message({
            message: '创建失败',
            type: 'error'
          });
        })
      },
      // 搜索sku
      remoteMethod(query) {
        const that = this;
        const obj = {
          warehouse_id: this.warehouseOptions,
          keywords: query
        }
        if(query){
          skus_warehouses_list(obj).then((res) => {
            that.skuItems = res;
          })
        }
      },
      // sku选择
      selectChange(value) {
        if(value){
          this.addForm.sku_id = value.toString();
        }else{
          this.addForm.sku_id = '';
        }
      },
      // 仓库选择
      warehouseIdChange(value) {
        if(value){
          this.addForm.warehouse_id = value.toString();
        }
      },
      // 时间选择
      pickerChange(value){
        if(value){
          this.addForm.estimated_arrival_time = value;
        }else{
          this.addForm.estimated_arrival_time = '';
        }
      },
      // 删除待提交列表中的入库申请
      deleteItem(index) {
        this.addTable.splice(index, 1);
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .goodsAddForm{
    padding: 20px;
    .el-input{
      width: 240px;
    }
    .memo{
      display: block;
      margin: 20px 0;
      .memo_title{
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #48576a;
        line-height: 1;
        padding: 11px 12px 11px 0;
        box-sizing: border-box;
        width: 80px;
      }
    }
    .select_sku_id,
    .warehouse_lists{
      width: 240px;
    }
    .add_request{
      margin: 10px 80px;
    }
    .addTable {
      font-size: 0;
    }
    .addTable label {
      width: 90px;
      color: #99a9bf;
    }
    .addTable .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 33%;
    }
  }
</style>
