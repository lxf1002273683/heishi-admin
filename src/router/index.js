import Vue from 'vue';
import Router from 'vue-router';


// 通过dev build 返回不同的页面路径
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');

/* error page */
const Err404 = _import('404');

/* 管理配置 -- 用户管理 */
const user = _import('admin/index');
const UsersTpl = _import('admin/users_tpl');

/* 管理配置 -- 模块列表 */
const ModulesTpl = _import('admin/modules_tpl');

/* 管理配置 -- 登录日志 */
const Logins = _import('admin/logins');

/* 管理配置 -- 操作日志 */
const Operations = _import('admin/operations');


/* 业务管理 -- 帐号管理 */
const BusinessUsersTpl = _import('business/users_tpl');
// const BusinessAddUser = _import('business/add_user');
/* 业务管理 -- 权限配置 */
const BusinessModules = _import('business/module_privilege');


/* 商品库 -- spu */
const SpusTpl = _import('goods/spus_tpl');
/* 商品库 -- sku */
// const Skus = _import('goods/skus');
/* 商品库 -- 入库申请 */
const RequestTpl = _import('goods/request_tpl');


/* 库房管理 -- 仓库列表模板 */
const WarehousesTpl = _import('warehouse/warehouses_tpl');

/* 库房管理 -- 仓库模板 */
const WarehouseTpl = _import('warehouse/warehouse_tpl');


/* 我的商品 */
const ArticleTpl = _import('articles/article_tpl');

/* 我的评论 */
const CommentsTpl = _import('comments/comments_tpl');

/* 我的订单 */
const OrdersTpl = _import('orders/orders_tpl');

/* 我的账户 */
const Account = _import('account/index');

/* 财务管理 */
const Finance = _import('finance/index');

Vue.use(Router);

// 用户公用权限
export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/user',
    name: '用户中心',
    hidden: true,
    children: [{ path: 'user', component: user }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
  // 用户需要配置的权限
  // 0:管理员，1:大账号，2:虚拟账号，3:微信登录账号
export const asyncRouterMap = [
  {
    path: '/admin',
    component: Layout,
    redirect: 'noredirect',
    name: '管理配置',
    meta: { role: [1] },
    children: [
      { path: 'users', component: UsersTpl, name: '用户列表' },
      { path: 'modules', component: ModulesTpl, name: '模块列表' },
      { path: 'logins', component: Logins, name: '登录日志' },
      { path: 'operations', component: Operations, name: '操作日志' }
    ]
  },
  {
    path: '/business',
    component: Layout,
    redirect: 'noredirect',
    name: '业务管理',
    meta: { role: [2] },
    children: [
      { path: 'users', component: BusinessUsersTpl, name: '帐号管理' },
      { path: 'module_privilege', component: BusinessModules, name: '权限配置' }
    ]
  },
  // 商品编辑
  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    name: '商品管理',
    meta: { role: [4] },
    children: [
      { path: 'spus', component: SpusTpl, name: 'SPU列表' },
      // { path: 'skus', component: Skus, name: 'SKU列表' },
      { path: 'requests', component: RequestTpl, name: '入库申请' }
    ]
  },
  // 库房管理
  {
    path: '/warehouse',
    component: Layout,
    redirect: 'noredirect',
    name: '库房管理',
    meta: { role: [8] },
    children: [
      { path: 'warehouses', component: WarehousesTpl, name: '仓库管理' }
    ]
  },
  // 财务管理
  {
    path: '/finance',
    component: Layout,
    redirect: 'noredirect',
    name: '财务管理',
    meta: { role: [256] },
    children: [
      { path: 'finance', component: Finance, name: '审核列表' }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];

// 动态配置仓库部分路由
export function warehouseModule(warehouseId, moduleName) {
  // warehouseId 仓库id moduleName 仓库名称
  const warehouse = { path: 'warehouse/' + warehouseId, component: WarehouseTpl, name: moduleName, id: warehouseId, userName: moduleName };
  asyncRouterMap[3].children.push(warehouse);
}

// 动态配置帐号业务路由
export function modulesConfig(userIds) {
  // 我的商品
  const articles = {
    path: '/articles',
    component: Layout,
    redirect: 'noredirect',
    name: '我的商品',
    meta: { role: [16] },
    children: []
  }
  // 我的评论
  const comments = {
    path: '/comments',
    component: Layout,
    redirect: 'noredirect',
    name: '我的评论',
    meta: { role: [32] },
    children: []
  }
  // 我的订单
  const orders = {
    path: '/orders',
    component: Layout,
    redirect: 'noredirect',
    name: '我的订单',
    meta: { role: [64] },
    children: []
  }
  // 我的帐户
  const account = {
    path: '/account',
    component: Layout,
    redirect: 'noredirect',
    name: '我的帐户',
    meta: { role: [128] },
    children: []
  }
  for (let x = 0; x < userIds.length; x++) {
    const articlesTemplate = {
      path: 'articles/' + userIds[x].userId,
      component: ArticleTpl,
      name: userIds[x].userName,
      id: userIds[x].userId,
      userName: userIds[x].userName
    };
    const commentsTemplate = {
      path: 'comments/' + userIds[x].userId,
      component: CommentsTpl,
      name: userIds[x].userName,
      id: userIds[x].userId,
      userName: userIds[x].userName
    };
    const ordersTemplate = {
      path: 'orders/' + userIds[x].userId,
      component: OrdersTpl,
      name: userIds[x].userName,
      id: userIds[x].userId,
      userName: userIds[x].userName
    };
    const accountTemplate = {
      path: 'account/' + userIds[x].userId,
      component: Account,
      name: userIds[x].userName,
      id: userIds[x].userId,
      userName: userIds[x].userName
    };
    articles.children.push(articlesTemplate);
    comments.children.push(commentsTemplate);
    orders.children.push(ordersTemplate);
    account.children.push(accountTemplate);
  }
  const businessaRouterMap = [
    articles,
    comments,
    orders,
    account
  ];
  return businessaRouterMap;
}

