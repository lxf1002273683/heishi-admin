<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <router-link :to="{ path: '/warehouse/commodityInfo'+query.id, query: { id: query.id, name: query.name }}">
        <el-menu-item index="1">库房商品</el-menu-item>
      </router-link>
      <el-menu-item index="2">入库申请</el-menu-item>
      <router-link :to="{ path: '/warehouse/finishWarehouse'+query.id, query: { id: query.id, name: query.name }}">
        <el-menu-item index="3">入库历史</el-menu-item>
      </router-link>
    </el-menu>
    <div class="warehouse_list">
      <div class="search">
        <span class="search_title">SKU查询：</span>
        <el-select v-model="skuOptions" filterable clearable remote placeholder="请输入查询的SKU" :remote-method="remoteMethod" :loading="loading"  @change="selectChange" class="select_sku_id searchInput">
            <el-option v-for="item in skuItems" :key="item.value" :label="item.spu_name+'/'+item.type" :value="item.id">
              <span>{{ item.spu_name+'/'+item.type }}</span>
            </el-option>
          </el-select>
      </div>
      <el-collapse v-model="activeNames">
        <template v-for="(item, index) in tableData">
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
              <el-table-column prop="sale_priority" label="销售优先级">
              </el-table-column>
              <el-table-column prop="presale_quantity" label="预售数量">
              </el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <!-- 传入单个申请的id，进行具体信息查询 -->
                  <el-button v-if="scope.row.sale_status != 1" type="text" @click="dialogOpen(scope.row.id,scope.$index,index)">确认入库</el-button>
                  <el-button v-if="scope.row.sale_status != 1" type="text" @click="presellCommodity(scope.row.id,scope.$index,index)">预售商品</el-button>
                  <span v-if="scope.row.sale_status == 1">已入库</span>
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
          <el-form-item label="商品名称" prop="spu_name">
            <el-input v-model="addForm.spu_name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="商品类型" prop="type">
            <el-input v-model="addForm.type" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="商品进价" prop="purchasing_price">
            <el-input v-model="addForm.purchasing_price" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="进货数量" prop="quantity">
            <el-input v-model="addForm.quantity" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="进货渠道" prop="purchasing_channel">
            <el-input v-model="addForm.purchasing_channel"></el-input>
          </el-form-item>
          <el-form-item label="商品规格" prop="specification">
            <el-input v-model="addForm.specification"></el-input>
          </el-form-item>
          <el-form-item label="生产厂家" prop="manufacturer">
            <el-input v-model="addForm.manufacturer" placeholder="可不填写"></el-input>
          </el-form-item>
          <el-form-item label="产地" prop="origin">
            <el-input v-model="addForm.origin" placeholder="可不填写"></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="color">
            <el-input v-model="addForm.color" placeholder="可不填写"></el-input>
          </el-form-item>
          <el-form-item label="尺寸" prop="size">
            <el-input v-model="addForm.size" placeholder="可不填写"></el-input>
          </el-form-item>
          <el-form-item label="毛重" prop="weight">
            <el-input v-model="addForm.weight" placeholder="可不填写"></el-input>
          </el-form-item>
          <el-form-item label="优先级" prop="sale_priority">
            <el-input v-model="addForm.sale_priority"></el-input>
          </el-form-item>
          <el-form-item label="入库数量" prop="actual_quantity">
            <el-input v-model.number="addForm.actual_quantity" placeholder="残次品请不要入库"></el-input>
          </el-form-item>
          <el-form-item label="保质期" prop="shelf_life">
            <el-date-picker class="picker" v-model="addForm.shelf_life" align="right" format="yyyy-MM-dd" type="date" placeholder="可不填写" @change='expirationPickerChange'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="入库时间" prop="arrival_time">
            <el-date-picker class="picker" v-model="addForm.arrival_time" align="right" format="yyyy-MM-dd" type="date" placeholder="默认当前时间" @change='arrivalPickerChange'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请备注" prop="request_memo">
            <el-input v-model="addForm.request_memo" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input v-model="addForm.memo" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="破损原因，等其他信息记录"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="addRequest">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { request_list, skus_list, request_info } from '@/api/goods';
  import { update_scale, pass_request } from '@/api/warehouse';

  export default {
    data() {
      return {
        activeIndex: '2',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id,
        },
        addForm: {
          id: '',               // 单个批次id
          index: '',            // 当前批次索引
          parent_index: '',     // 当前入库申请索引
          spu_name: '',         // 商品名称
          type: '',             // 商品类型
          specification: '',    // 商品规格
          shelf_life: '',       // 保质期
          purchasing_price: '', // 商品进价
          quantity: '',         // 进货数量
          actual_quantity: '',  // 入库数量
          arrival_time: '',     // 入库时间
          origin: '',           // 产地
          color: '',            // 颜色
          size: '',             // 尺寸
          weight: '',           // 毛重
          manufacturer: '',     // 生成厂家
          memo: '',             // 备注
          request_memo: '',     // 申请人备注
          sale_priority: 0,     // 销售优先级
          purchasing_channel: ''// 进货渠道
        },
        rules: {
          actual_quantity: [{ required: true, message: '请填写商品进价'},{ type: 'number', message: '必须为数字值'}],
        },
        activeNames: '',
        tableData: [],
        // 分页
        totalPages: 0,
        skuOptions: '',
        loading: false,
        skuItems: [],
        // dialog显示状态
        dialogStatus: false
      }
    },
    created() {
      this.initRequestList();
    },
    methods: {
      // 打开模态框并且传入入库申请的id
      dialogOpen(id, index, parent_index) {
        const that = this;
        that.dialogStatus = true;
        request_info(id).then((res) => {
          that.addForm.id = id;
          that.addForm.index = index;
          that.addForm.parent_index = parent_index;
          that.addForm.spu_name = res.sku.spu_name;
          that.addForm.type = res.sku.type;
          that.addForm.purchasing_price = res.purchasing_price;
          that.addForm.quantity = res.quantity;
          that.addForm.sale_priority = res.sale_priority;
          that.addForm.request_memo = res.request_memo;
          that.addForm.specification = res.info.specification;
          that.addForm.origin = res.info.origin;
          that.addForm.manufacturer = res.info.manufacturer;
          that.addForm.color = res.info.color;
          that.addForm.size = res.info.size;
          that.addForm.weight = res.info.weight;
          that.addForm.purchasing_channel = res.info.purchasing_channel;
        })
      },
      // 保质期选择
      expirationPickerChange(value) {
        if(value){
          this.addForm.expiration_time = value;
        }else{
          this.addForm.expiration_time = '';
        }
      },
      // 入库时间选择
      arrivalPickerChange(value) {
        if(value){
          this.addForm.arrival_time = value;
        }else{
          this.addForm.arrival_time = '';
        }
      },
      // 翻页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        // 在翻页时判断是否存在搜索条件
        if(this.skuOptions){
          obj.sku_id = this.skuOptions
        }
        this.initRequestList(obj);
      },
      // 确认入库
      addRequest() {
        const that =this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            pass_request(that.addForm.id, that.addForm).then(() => {
              that.$message({
                message: '入库成功',
                type: 'success'
              });
              that.dialogStatus = false;
              that.$refs.addForm.resetFields();
              // 入库成功后将此条状态更改
              that.tableData[that.addForm.parent_index].batches[that.addForm.index].sale_status = 1;
            },(error) => {
              console.log(error);
            })
          } else {
            return false;
          }
        });
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
      // 初始化入库申请列表 默认带有仓库id
      initRequestList(obj) {
        const that = this;
        const params = {
          warehouse_id: this.query.id,
          filter: '0,1'
        }
        if(obj){
          $.extend(params, obj)
        }
        request_list(params).then((res) => {
          that.tableData = res.data;
          that.totalPages = res.total;
        })
      },
      // 预售商品
      presellCommodity(id, index, parent_index) {
        const that = this;
        this.$prompt('请输入预售数量', '预售商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9]+?/,
          inputErrorMessage: '格式不正确'
        }).then(({ value }) => {
          // 获取预售的数量
          update_scale(id, value).then((res) => {
            that.$message({
              type: 'success',
              message: res
            });
            // 叠加预售数量
            that.tableData[parent_index].batches[index].presale_quantity += parseInt(value);
          },(error) => {
            that.$message({
              type: 'error',
              message: '预售数量累计不能大于请求入库数量'
            });
          })
        }).catch(() => {});
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
    .hiddenbox{
      display: none;
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
    .el-button+.el-button {
      margin-left: 0;
    }
  }
  .addForm{
    .picker{
      width: 100%;
    }
  }
</style>

