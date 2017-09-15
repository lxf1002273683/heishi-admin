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
const Users = _import('admin/users');
const AddUser = _import('admin/add_user');
const ModulePrivilege = _import('admin/module_privilege');
const UpdateUser = _import('admin/update_user');
/* 管理配置 -- 模块列表 */
const Modules = _import('admin/modules');
const AddModule = _import('admin/add_module');
/* 管理配置 -- 登录日志 */
const Logins = _import('admin/logins');
/* 管理配置 -- 操作日志 */
const Operations = _import('admin/operations');

/* 业务管理 -- 帐号管理 */
const BusinessUsers = _import('business/users');
const BusinessAddUser = _import('business/add_user');
/* 业务管理 -- 权限配置 */
const BusinessModules = _import('business/module_privilege');

/* 商品库 -- spu */
const Spus = _import('goods/spus');
const AddCategories = _import('goods/add_categories');
const AddSpus = _import('goods/add_spus');
const AddShops = _import('goods/add_shops');
/* 商品库 -- sku */
const Skus = _import('goods/skus');
// const AddSkus = _import('goods/add_skus');
/* 商品库 -- 入库申请 */
const Request = _import('goods/request');
const AddRequest = _import('goods/add_request');

/* 库房管理 -- 仓库管理 */
const Warehouses = _import('warehouse/warehouses');
const AddWarehouse = _import('warehouse/add_warehouse');
/* 库房管理 -- 入库申请列表 */
const Warehouse = _import('warehouse/warehouse');
/* 库房管理 -- 仓库详情列表 */
const CommodityInfo = _import('warehouse/commodity_info');
/* 库房管理 -- 完成的申请 */
const FinishWarehouse = _import('warehouse/finish_warehouse');


/* 我的商品 */
const Articles = _import('articles/index');

/* 我的评论 */
const Comments = _import('comments/index');

/* 我的订单 */
const Orders = _import('orders/index');

/* 我的账户 */
const Account = _import('account/index');

/* 发布商品 */
const Release = _import('release/index');

Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta : `{ role: ['admin'] }`  will control the page role
  **/
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
      { path: 'users', component: Users, name: '用户列表' },
      { path: 'add_user', component: AddUser, name: '创建用户', hidden: true },
      { path: 'module_privilege', component: ModulePrivilege, name: '权限配置', hidden: true },
      { path: 'update_user', component: UpdateUser, name: '修改用户', hidden: true },
      { path: 'modules', component: Modules, name: '模块列表' },
      { path: 'add_module', component: AddModule, name: '创建模块', hidden: true },
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
      { path: 'users', component: BusinessUsers, name: '帐号管理' },
      { path: 'add_user', component: BusinessAddUser, name: '创建帐号', hidden: true },
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
      { path: 'spus', component: Spus, name: 'SPU列表' },
      { path: 'add_spus', component: AddSpus, name: '创建SPU', hidden: true },
      { path: 'add_shops', component: AddShops, name: '创建店铺', hidden: true },
      { path: 'add_categories', component: AddCategories, name: '创建分类', hidden: true },
      { path: 'skus', component: Skus, name: 'SKU列表' },
      // { path: 'add_skus', component: AddSkus, name: '创建SKU', hidden: true },
      { path: 'request', component: Request, name: '入库申请' },
      { path: 'add_request', component: AddRequest, name: '申请入库', hidden: true }
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
      { path: 'warehouses', component: Warehouses, name: '仓库管理' },
      { path: 'add_warehouse', component: AddWarehouse, name: '创建仓库', hidden: true }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];

// 动态配置仓库路由
export function warehouseModule(warehouseId, moduleName) {
  const warehouse = { path: 'warehouse' + warehouseId, component: Warehouse, name: moduleName, id: warehouseId, userName: moduleName, hidden: true };
  const commodity_info = { path: 'commodityInfo' + warehouseId, component: CommodityInfo, name: moduleName, id: warehouseId, userName: moduleName };
  const finish_warehouse = { path: 'finishWarehouse' + warehouseId, component: FinishWarehouse, name: moduleName, id: warehouseId, userName: moduleName, hidden: true };
  asyncRouterMap[3].children.push(warehouse);
  asyncRouterMap[3].children.push(commodity_info);
  asyncRouterMap[3].children.push(finish_warehouse);
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
  // 发布商品
  const release = {
    path: '/release',
    component: Layout,
    redirect: 'noredirect',
    name: '发布商品',
    meta: { role: [256] },
    children: []
  }
  for (let x = 0; x < userIds.length; x++) {
    const articlesTemplate = { path: 'articles/' + userIds[x].userName, component: Articles, name: '', id: 0, userName: '' };
    const commentsTemplate = { path: 'comments/' + userIds[x].userName, component: Comments, name: '', id: 0, userName: '' };
    const ordersTemplate = { path: 'orders/' + userIds[x].userName, component: Orders, name: '', id: 0, userName: '' };
    const accountTemplate = { path: 'account/' + userIds[x].userName, component: Account, name: '', id: 0, userName: '' };
    const releaseTemplate = { path: 'release/' + userIds[x].userName, component: Release, name: '', id: 0, userName: '' };
    articlesTemplate.id = commentsTemplate.id = ordersTemplate.id = accountTemplate.id = releaseTemplate.id = userIds[x].userId;
    articlesTemplate.userName = commentsTemplate.userName = ordersTemplate.userName = accountTemplate.userName = releaseTemplate.userName = userIds[x].userName;
    articlesTemplate.name = commentsTemplate.name = ordersTemplate.name = accountTemplate.name = releaseTemplate.name = userIds[x].userName;
    articles.children.push(articlesTemplate);
    comments.children.push(commentsTemplate);
    orders.children.push(ordersTemplate);
    account.children.push(accountTemplate);
    release.children.push(releaseTemplate);
  }
  const businessaRouterMap = [];
  businessaRouterMap.push(articles);
  businessaRouterMap.push(comments);
  businessaRouterMap.push(orders);
  businessaRouterMap.push(account);
  businessaRouterMap.push(release);
  return businessaRouterMap;
}

