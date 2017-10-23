<template>
  <div class="app-container">
    <div class="warehouse_list">
      <div class="search">
        <span class="search_title">商品查询：</span>
        <el-select v-model="skuOptions" filterable clearable remote placeholder="请输入查询的商品名称" :remote-method="remoteMethod" :loading="loading"  @change="selectChange" class="select_sku_id searchInput">
            <el-option v-for="item in skuItems" :key="item.value" :label="item.spu_name+'/'+item.type" :value="item.id">
              <span>{{ item.spu_name+'/'+item.type }}</span>
            </el-option>
          </el-select>
      </div>
      <el-collapse v-model="activeNames" v-loading.body="listLoading" element-loading-text="拼命加载中">
        <template v-for="(item, index) in tableData">
          <el-collapse-item :name="item.id">
            <template slot="title">
              <span>{{item.batch_number}}</span>
              <span class="user">申请人 : {{item.requester.account}}</span>
              <span class="time">{{item.created_at}}</span>
            </template>
            <el-table :data="item.batches" style="width: 100%" stripe border >
              <el-table-column prop="id" label="子批次ID" width="95"></el-table-column>
              <el-table-column prop="sku.spu_name" label="商品名称"></el-table-column>
              <el-table-column prop="sku.type" label="款式"></el-table-column>
              <el-table-column prop="purchasing_price" label="商品进价"></el-table-column>
              <el-table-column prop="quantity" label="进货数量"></el-table-column>
              <el-table-column prop="actual_quantity" label="入库数量"></el-table-column>
              <el-table-column prop="payments_sum" label="额外费用(邮费)"></el-table-column>
              <el-table-column prop="presale_quantity" label="预售数量"></el-table-column>
              <el-table-column prop="checker.account" label="确认人"></el-table-column>
              <el-table-column prop="arrival_time" label="到库时间"></el-table-column>
              <el-table-column label="操作" width="110">
                <template scope="scope">
                <el-button size="small" @click="payment(scope.row.id)">增加邮费</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </template>
      </el-collapse>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="进货历史" :visible.sync="dialogStatus" top="5%" @close="dialogClose">
      <!-- 设置 activeNames :name="1"默认全部展开 -->
      <div>
        <el-form label-width="80px" :model="addForm" ref="addForm" class="addForm" :rules="rules">
          <el-form-item label="费用" prop="price">
            <el-input v-model.number="addForm.price"></el-input>
          </el-form-item>
          <el-form-item label="关联商品数" prop="quantity">
            <el-input v-model="addForm.quantity"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input v-model="addForm.memo"></el-input>
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
  import { request_list } from '@/api/goods';
  import { add_payment, get_skus } from '@/api/warehouse';

  export default {
    // 仓库id name
    props: ['warehouse_name', 'warehouse_id'],
    data() {
      return {
        activeNames: '',
        tableData: [],
        totalPages: 0,
        dialogStatus: false,
        skuOptions: '',
        loading: false,
        skuItems: [],
        addForm: {
          batch_id: 0,
          price: '',
          quantity: 0,
          memo: ''
        },
        rules: {
          price: [{ required: true, message: '请填写商品进价'},{ type: 'number', message: '必须为数字值'}]
        },
        listLoading: true
      }
    },
    created() {
      this.initRequestList();
    },
    methods: {
      initRequestList(obj) {
        const that = this;
        const params = {
          warehouse_id: this.warehouse_id,
          filter: '3'
        }
        if(obj){
          $.extend(params, obj)
        }
        that.listLoading = true;
        request_list(params).then((res) => {
          that.tableData = res.data;
          that.totalPages = res.total;
          that.listLoading = false;
        })
      },
      // 增加邮费
      payment(id) {
        this.addForm.batch_id = id;
        this.dialogStatus = true;
      },
      // 提交增加费用
      submit() {
        const that =this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            add_payment(that.addForm).then((res) => {
              that.$message({
                message: '添加成功,等待财务审核',
                type: 'success'
              });
              that.dialogStatus = false;
            },(error) => {
              that.$message({
                message: error.message,
                type: 'error'
              });
            })
          } else {
            return false;
          }
        });
      },
      // 模态框关闭时，清空addfrom数据
      dialogClose() {
        this.$refs.addForm.resetFields();
      },
      // 远程搜索sku
      remoteMethod(query) {
        const that = this;
        const obj = {
          keywords: query
        }
        get_skus(this.warehouse_id, obj).then((res) => {
          that.skuItems = res.data;
        })
      },
      // 选中sku进行入库申请搜索
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
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .warehouse_list{
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
    .user{
      margin-left: 20px;
    }
    .time{
      float: right;
      margin-right: 10px;
    }
  }
</style>

