export default {
    getOrderList: {//获取订单列表
      url: 'order/api/h5/auth/order/getOrderList',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'get'
    },
    cancelOrder: {//取消订单
      url: 'order/api/h5/auth/order/cancelOrder',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'post'
    },
    deleteOrder: {//删除订单
      url: 'order/api/h5/auth/order/deleteOrder',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'post'
    },
    countByStatus: {//待支付的个数
      url: 'order/api/h5/auth/order/countByStatus',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'get'
    },
  }
  