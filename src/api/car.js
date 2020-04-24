export default {
    getCarList: {//获取购物车列表
      url: 'order/api/h5/auth/cart/cartList',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'get'
    },
    CountCarTotal: {//选中计算总价和优惠价
      url: 'order/api/h5/auth/cart/getCartPriceByIds',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'get'
    },
    deleteCarGoods: {//删除购物车列表
      url: 'order/api/h5/auth/cart/delete',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'delete'
    },
    gotoPayMoney: {//去结算 判断走哪条路
      url: 'order/api/h5/auth/cart/judgeGoods',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'get'
    },
    save:{//去结算 判断走哪条路
      url: 'order/api/h5/auth/order/save',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'post'
    },
    payByPointConvert:{//积分兑换
      url: 'order/api/h5/auth/order/payByPointConvert',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'post'
    },
  }
  