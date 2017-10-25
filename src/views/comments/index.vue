<!-- 评论列表 -->
<template>
  <div class="app-container">
    <div class="comment_list">
      <div class="search">
        <el-select v-model="selectInput" placeholder="请选择" class="searchInput" @change="selectChange">
          <el-option label="全部评论" value=""></el-option>
          <el-option label="正常评论" value="1"></el-option>
          <el-option label="购买评论" value="2"></el-option>
          <el-option label="打赏评论" value="3"></el-option>
          <el-option label="删除评论" value="14"></el-option>
          <el-option label="图片评论" value="4"></el-option>
        </el-select>
      </div>
      <el-button type="primary" class="add_read" @click="add_read">标记已读</el-button>
      <el-table :data="tableData" style="width: 100%" stripe border @selection-change="handleSelectionChange" ref="multipleTable" v-loading.body="listLoading" element-loading-text="拼命加载中">
        <el-table-column type="selection" width="45">
        </el-table-column>
        <el-table-column label="标题">
          <template scope="scope">
            <span class="query_goods" @click="query_goods(scope.row.post_id)">
              <span class="new_comment" v-if="scope.row.status == 1">new</span>{{scope.row.post_title}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="买家">
          <template scope="scope">
            <span class="query_orders" @click="query_orders(scope.row.from_uid,scope.row.to_uid)">{{scope.row.from_nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容">
          <template scope="scope">
            <span v-if="scope.row.type == 1">{{scope.row.content}}</span>
            <span v-if="scope.row.type == 2" style="color:red">{{scope.row.content}}</span>
            <span v-if="scope.row.type == 3" style="color:blue">{{scope.row.content}}</span>
            <span v-if="scope.row.type == 14" style="color: #aaa">{{scope.row.content}} // 已删除</span>
            <span v-if="scope.row.type == 4">
              <img class="content_img" :src="scope.row.content + '@!320x320'">
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="时间">
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template scope="scope">
            <el-button type="text" @click="openDialog(scope.row.id,scope.$index)">会话记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <!-- 会话记录 -->
    <el-dialog title="会话记录" :visible.sync="dialogStatus" top="5%" @close="dialogClose" class="comment">
      <!-- 增加过渡效果 -->
      <el-collapse-transition>
        <div class="replyBox">
          <el-select v-model="replyInput" placeholder="请选择" class="searchInput">
            <el-option :label="'文字回复  '+replyUserName" value="1"></el-option>
            <el-option :label="'图片回复  '+replyUserName" value="2"></el-option>
          </el-select>
          <el-select v-model="quickphrasesInput" placeholder="请选择" class="searchInput" @change="phrasesChange" v-if="replyInput == 1">
            <template v-for="item in quickphrases_list">
              <el-option :label="item.content" :value="item.content"></el-option>
            </template>
          </el-select>
          <el-input  class="textarea" type="textarea" :rows="2" placeholder="请输入内容" v-model="replytextarea" v-if="replyInput == 1"></el-input>
          <el-upload class="upload" :headers="header" :action="action" list-type="picture-card" :on-success="handleSuccess" :show-file-list="false" v-if="replyInput == 2" :on-error="uploadError">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button type="primary" @click="replyUser" class="reply">回复</el-button>
        </div>
      </el-collapse-transition>
      <div class="comment_box">
        <template v-for="item in comment_list">
          <div v-if="seller_id == item.from_uid" class="comments_list seller_user">
            <span class="time"><b>{{item.created_at}}</b></span>
            <span v-if="item.type != 4" class="content">{{item.content}}</span>
            <span v-if="item.type == 4" class="content">
              <img class="content_img" :src="item.content + '@!320x320'">
            </span>
            <span class="user"><img :src="item.from_avatar + '/64'"></span>
          </div>
          <div v-if="seller_id != item.from_uid" class="comments_list buy_user">
            <span class="time"><b>{{item.created_at}}</b></span>
            <span class="user"><img :src="item.from_avatar + '/64'"></span>
            <span v-if="item.type != 4" class="content">{{item.content}}</span>
            <span v-if="item.type == 4" class="content">
              <img class="content_img" :src="item.content + '@!320x320'">
            </span>
          </div>
        </template>
      </div>
    </el-dialog>
    <!-- 历史订单 -->
    <el-dialog title="历史订单" :visible.sync="dialogStatusOrder" top="5%" class="orders_list" size="large">
      <OrdersList :from_uid="from_uid" :to_uid="to_uid"></OrdersList>
    </el-dialog>
    <!-- 商品详情 -->
    <el-dialog title="历史订单" :visible.sync="dialogStatusGoods" top="5%" class="orders_list" size="large">
      <Goods :goods_id="goods_id"></Goods>
    </el-dialog>
  </div>
</template>

<script>
  import { comment_list, history_comment, reply_comment, delete_comment, read_comment, quickphrases_query, query_goods } from '@/api/comment';
  import { getToken } from '@/utils/auth';
  import OrdersList from './query_orders';
  import Goods from './query_goods';
  export default {
    components: {
      OrdersList,
      Goods
    },
    // 仓库id name
    props: ['user_name', 'user_id'],
    data() {
      return {
        tableData: [],
        totalPages: 0,
        selectInput: '',               // 默认全部评论
        dialogStatus: false,
        comment_list: [],
        replyInput: '1',
        quickphrasesInput: null,
        quickphrases_list: [],
        replyUserName: '',
        replytextarea: '',
        replyid: '',
        read_comment: [],
        // 图片上传action
        action: this.$store.getters.hosts + '/warehouse/api/v1/images',
        // 图片上传headers设置
        header: {
          Authorization: getToken()
        },
        // 显示图片
        imageUrl: '',
        // 实际回复图片地址
        image: '',
        // 查询买家购买记录
        dialogStatusOrder: false,
        from_uid: 0,
        to_uid: 0,
        dialogStatusGoods: false,
        goods_id: 0,
        seller_id: 0,
        listLoading: true
      }
    },
    created() {
      const that = this;
      // 获取当前用户评论列表
      this.initCommentList();
      // 初始化短语列表
      quickphrases_query().then((res) => {
        that.quickphrases_list = res;
      })
    },
    methods: {
      initCommentList(obj) {
        const that = this;
        // 初始化用户每页20
        const params = {
          size: 20,
          receiver: this.user_id
        }
        if(obj){
          $.extend(params, obj)
        }
        that.listLoading = true;
        comment_list(params).then((res) => {
          that.tableData = res.result;
          that.totalPages = res.totalPages*10;
          // 获取黑市卖家id
          that.seller_id = res.result[0].to_uid;
          that.listLoading = false;
        })
      },
      //分页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        if(this.selectInput){
          obj.types = [this.selectInput]
        }
        this.initCommentList(obj);
      },
      // 评论类型选择器发生变化
      selectChange() {
        const obj = {};
        if(this.selectInput){
          obj.types = [this.selectInput]
        }
        this.initCommentList(obj);
      },
      // 打开模态框显示某个用户的历史会话 同时标记已读
      openDialog(id, index) {
        const that = this;
        this.dialogStatus = true;
        history_comment(id).then((res) => {
          that.comment_list = res;
          // 获取 买家向卖家的对话id
          $.each(res, (i, item) => {
            if(item.to_uid == that.seller_id){
              that.replyUserName = res[i]['from_nickname'];
              that.replyid = res[i]['id'];
              return false;
            }
          })
        })
        const obj = {
          ids: [id]
        }
        read_comment(obj).then((res) => {
          that.tableData[index].status = 0;
        })
      },
      // 展开回复
      addReplyUser(from_nickname, id) {
        this.replyUserName = from_nickname;
        this.replyid = id;
      },
      // 回复
      replyUser(){
        const that = this
        const obj = {};
        if(that.replytextarea && that.replyInput == 1){
          obj.content = that.replytextarea;
          obj.type = 1;
        }else if(that.image && that.replyInput == 2){
          obj.content = that.image;
          obj.type = 4;
        }else{
          return that.$message({
            message: '请输入回复内容',
            type: 'error'
          });
        }
        reply_comment(that.replyid, obj).then((res) => {
          that.$message({
            message: '回复成功',
            type: 'success'
          });
          that.replytextarea = "";
          that.imageUrl = '';
          that.image = '';
        })
      },
      // 关闭模态框回调
      dialogClose() {
        //重置状态
        this.replyUserName = '';
        this.replytextarea = '';
        this.replyid = '';
      },
      // 批量选择标记已读
      handleSelectionChange(val){
        this.read_comment = val;
      },
      // 批量标记
      add_read() {
        const that = this;
        if(this.read_comment.length){
          const obj = {
            ids: []
          }
          $.each(this.read_comment, (i, item) => {
            obj.ids.push(item.id);
          })
          read_comment(obj).then((res) => {
            that.$message({
              message: '标记成功',
              type: 'success'
            });
            $.each(that.read_comment, (i, item) => {
              item.status = 0;
            })
            that.$refs.multipleTable.clearSelection();
          })
        }else{
          that.$message({
            message: '请先选择要标记的评论',
            type: 'error'
          });
        }
      },
      // 打开订单列表，传入参数
      query_orders(from_uid, to_uid) {
        this.dialogStatusOrder = true;
        this.from_uid = from_uid;
        this.to_uid = to_uid;
      },
      // 短语选择器发生变化
      phrasesChange() {
        this.replytextarea = this.quickphrasesInput;
      },
      // 上传图片成功回调
      handleSuccess(res, file) {
        this.image = res.uri;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 查询商品
      query_goods(id) {
        this.dialogStatusGoods = true;
        this.goods_id = id;
      },
      // 图片上传失败
      uploadError(error) {
        this.$message({
          message: '上传失败,请重新登录尝试',
          type: 'error'
        });
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .comment_list{
    position: relative;
    .search{
      text-align: center;
      .searchInput{
        width: 240px;
        padding: 0 0 20px ;
      }
    }
    .add_read{
      position: absolute;
      top: 0;
    }
    .query_goods{
      cursor: pointer;
      .new_comment{
        color: red;
        font-size: 12px;
        padding: 0 4px;
      }
    }
    .query_goods:hover{
      color: #20a0ff;
    }
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    .query_orders:hover{
      color: #20a0ff;
    }
    .query_orders{
      cursor: pointer;
    }
    img{
      width: 120px;
      margin: 10px;
    }
  }
  .comment{
    .replyBox{
      padding: 10px 0;
      text-align: right;
      .searchInput{
        width: 100%;
      }
      .el-select{
        margin-bottom: 10px;
      }
    }
    .content_img{
      max-width: 120px;
      margin: 5px;
    }
    .comment_box{
      height: 500px;
      overflow-y: auto;
      border-radius: 4px;
      background-color: #f5f5f5;
    }
    .upload{
      text-align: left;
      img{
        width: 100%;
        display: block;
      }
    }
    .reply{
      margin-top: 10px;
    }
    .comments_list{
      line-height: 32px;
      margin: 5px 0;
      padding: 5px 5px;
      .content{
        display: inline-block;
        vertical-align: top;
        padding: 0 5px;
        border: 1px solid #ededed;
        border-radius: 4px;
        img{
          width: 100%;
        }
      }
      .time{
        display: block;
        text-align: center;
        b{
          font-size: 12px;
          padding: 3px;
          background-color: #dadada;
          color: white;
          border-radius: 2px;
        }
      }
      .user{
        img{
          width: 32px;
          border-radius: 3px;
        }
      }
    }
    .seller_user{
      text-align: right;
      .content{
        background-color: rgba(158, 234, 106, 0.8);
        border-color: rgba(158, 234, 106, 0.8);
      }
    }
  }
</style>
