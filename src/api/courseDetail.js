export default {
  // 获取商品详情
  getGoodsDetail: {
    url: 'goods/api/h5/v1/goods/getGoodsDetailByGoodsId',
      interFaceType: "hj",
      method: 'get'
  },
  // 获取商品课程目录
  getCourseRecord: {
    url: 'goods/api/h5/v1/school/getCourseRecordByGoodsId',
      interFaceType: "hj",
      method: 'get'
  },
  
  // 获取商品评价列表
  getGoodsEvaluation: {
    url: 'goods/api/h5/goodsEvaluation/getEvaluationList',
      interFaceType: "hj",
      method: 'get'
  },
  // 判断是否收藏该商品
  getExistCollection: {
    url: 'goods/api/h5/v1/collection/existCollection',
      interFaceType: "hj",
      method: 'get',
      hasToken: 'token'
  },
  // 添加或取消收藏 
  AddOrCancelCollection: {
    url: 'goods/api/h5/v1/collection/add',
      interFaceType: "hj",
      method: 'post',
  },
   // 查询整理评价 
   getEvaluationInfo: {
    url: 'goods/api/h5/goodsEvaluation/getEvaluationInfo',
      interFaceType: "hj",
      method: 'get'
  },
  // 加入购物车
  getToCartSave: {
    url: 'order/api/h5/auth/cart/save',
      interFaceType: "hj",
      method: 'post'
  },
  // 立即学习
  goToStudy: {
    url: 'order/api/h5/auth/order/addFreeOrder',
      interFaceType: "hj",
      method: 'post'
  },
  // 试看跳转至学习中心
  getFreeListenUrl: {
    url: 'local/web/record/getAddress',
    interFaceType: "lj",
    method: "get"
  },
  // 立即拼团
  getShareOffered: {
    url: 'order/api/h5/auth/order/fightGroup',
      interFaceType: "hj",
      method: 'post'
  },
   // 保存拼团
   getSaveOrderByGroup: {
    url: 'order/api/h5/auth/order/saveOrderByGroup',
      interFaceType: "hj",
      method: 'post'
  },
  // 保存听课卡
  getSaveListenCard: {
    url: 'order/api/h5/auth/order/saveCard',
      interFaceType: "hj",
      method: 'post'
  },
}