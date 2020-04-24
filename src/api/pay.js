export default {
  paySubmit: {
    url: "order/api/h5/auth/order/paySubmit",
    interFaceType: "hj",
    method: "get",
  },
  getOrderInfoByOrderId: {
    url: 'order/api/h5/auth/order/toPay',
    interFaceType: "hj",
    method: "get",
  },
  // 根据订单编号查询订单支付情况
  orderWxPayQueryById: {
    url: 'order/api/h5/auth/order/orderWxPayQueryById',
    interFaceType: 'hj',
    method: 'get'
  },
  // 根据d订单id获取已支付的订单
  getOrderIdByPaid: {
    url: 'order/api/h5/auth/order/paid',
    interFaceType: 'hj',
    method: 'get'
  },
  // 获取appid
  getAppId: {
    url: 'order/api/h5/auth/order/getAppId',
    interFaceType: 'hj',
    method: 'get'
  }
}