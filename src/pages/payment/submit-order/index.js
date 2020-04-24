import Taro, { Component } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import CheckBox from "components/check-box"
import { AtButton, AtModal } from "taro-ui"
import HeadBar from "components/head-bar"
import TimerComponent from "@/components/timer/index"
import GoodsComponent from "@/components/goods/index"
import { setTitle } from "@/utils/mixins-script/index"
import fetch from "@/api/request"
import styles from "./index.module.scss"

const hj_protocol = "http://"

const innerWxBrowser = (() => {
  if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    return false
  }
  return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
    "MicroMessenger"
    ? true
    : false
})()

const PayTypeList = (() => {
  // paymentEntry (1, "电脑支付")(2, "微信H5支付"),(3, "微信APP支付"),(4, "支付宝APP支付"),(5, "支付宝H5支付"),
  let arr = [
    {
      icon: "iconweixinzhifu1",
      text: "微信支付",
      id: 2,
      color: "#1BC764"
    }
  ]
  let aliPay = {
    icon: "iconzhifubaozhifu",
    text: "支付宝支付",
    id: 5,
    color: "#56ADFF"
  }
  if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    return arr
  } else if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    // if (innerWxBrowser) {
    //   return [...arr, wxPay]
    // } else {
    //   return [...arr, aliPay]
    // }
    return innerWxBrowser ? arr : [...arr, aliPay]
  }
})()

export default class SubmitOrder extends Component {
  state = {
    // 默认微信支付
    paymentEntry: 2,
    orderId: "",
    orderInfo: {},
    // 公众支付
    code: "",
    // 在微信内的jsapi支付后台返回一个url请求？？？不合理，小程序支付也要一个一样的接口
    url: "",
    courseDetail: {}
  }

  componentWillMount() {
    setTitle("行家")
    this.init()
    if (this.$router.params.offered) {
      this.getCourseDetail(this.$router.params.id)
    }
  }

  getOrderInfoByOrderId(id) {
    fetch("getOrderInfoByOrderId", { id }).then(res => {
      if (res) {
        this.setState({ orderInfo: res })
      }
    })
  }

  changePayType = item => {
    this.setState({ paymentEntry: item.id })
  }

  // 在微信内h5支付
  onBridgeReady(obj) {
    WeixinJSBridge.invoke(
      "getBrandWCPayRequest",
      {
        appId: obj.appid, //公众号名称，由商户传入
        timeStamp: obj.timeStamp, //时间戳，自1970年以来的秒数
        nonceStr: obj.nonceStr, //随机串
        package: obj.package,
        signType: obj.signType, //微信签名方式：
        paySign: obj.paySign //微信签名
      },
      function(res) {
        console.log(res, "微信支付成功回调")
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          function parse_url(url) {
            //定义函数
            var pattern = /(\w+)=(\w+)/gi //定义正则表达式
            var parames = {} //定义数组
            url.replace(pattern, function(a, b, c) {
              parames[b] = c
            })
            return parames //返回这个数组.
          }
          //获取当前url   取到code
          var url = window.location.href
          var params = parse_url(url)
          let { orderId } = params
          alert(url)
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          Taro.redirectTo({
            url: "/pages/payment/pay-back/index?orderId=" + orderId
          })
        } else {
          Taro.showToast({
            title: res.err_desc,
            icon: "none",
            duration: 2000
          })
        }
      }
    )
  }

  init() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      // 小程序
      this.browserInit()
    } else {
      // 浏览器
      innerWxBrowser ? this.wxBrowerInit() : this.browserInit()
    }
  }

  browserInit = () => {
    let { orderId } = this.$router.params
    this.getOrderInfoByOrderId(orderId)
    this.setState({ orderId })
  }

  wxBrowerInit() {
    function parse_url(url) {
      //定义函数
      var pattern = /(\w+)=(\w+)/gi //定义正则表达式
      var parames = {} //定义数组
      url.replace(pattern, function(a, b, c) {
        parames[b] = c
      })
      return parames //返回这个数组.
    }
    //获取当前url   取到code
    var url = window.location.href
    var params = parse_url(url)
    let { code, orderId, state } = params
    // code存在，获取code这步微信的重定向
    if (state == 123) {
      this.getOrderInfoByOrderId(orderId)
      this.setState({ code, orderId })
      return false
    }
    fetch("getAppId").then(res => {
      if (res) {
        let redirectUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          "/pages/payment/submit-order/index?orderId=" +
          orderId
        Taro.navigateTo({
          url: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
            res.appid
          }&redirect_uri=${encodeURIComponent(
            redirectUrl
          )}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
        })
      }
    })
  }

  payInnerWx = () => {
    let code = ""
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      // 登入获取
      wx.login({
        success: res => {
          if (res.errMsg === "login:ok") {
            code = res.code
          }
        }
      })
    } else {
      // 微信内jsAPI支付
      code = this.state.code
    }
    // 根据code获取吊起支付参数
    fetch("paySubmit", {
      id: this.state.orderId,
      code,
      paymentEntry: 6
    }).then(res => {
      if (!res.pmOrderExist) {
        let params = res.result
        if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
          this.mpPay(params)
        } else {
          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener(
                "WeixinJSBridgeReady",
                () => this.onBridgeReady(params),
                false
              )
            } else if (document.attachEvent) {
              document.attachEvent("WeixinJSBridgeReady", () =>
                this.onBridgeReady(params)
              )
              document.attachEvent("onWeixinJSBridgeReady", () =>
                this.onBridgeReady(params)
              )
            }
          } else {
            this.onBridgeReady(params)
          }
        }
      }
    })
  }

  mpPay(params) {
    wx.requestPayment({
      ...params,
      success(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          Taro.redirectTo({
            url: "/pages/payment/pay-back/index?orderId=" + this.state.orderId
          })
        } else {
          Taro.showToast({
            title: res.err_desc,
            icon: "none",
            duration: 2000
          })
        }
      },
      fail(res) {}
    })
  }

  payInnerBrower = () => {
    // console.log(returnCitySN["cip"])
    if (this.state.orderId === "") return
    let { orderId, paymentEntry, orderInfo } = this.state
    //这里为测试修改----------------------
    let url = "/pages/payment/pay-back/index"
    if (innerWxBrowser) {
      url = url + "?orderId=" + orderId
    }
    // let url=`/pages/payment/pay-back/index?orderId=${orderId}`
    let redirectUrl = hj_protocol + window.location.host + url
    let data = {
      id: orderId,
      // orderNo: orderInfo.code,
      paymentEntry,
      cip: returnCitySN["cip"],
      // terminalType: 'H5',
      redirectUrl: encodeURIComponent(redirectUrl)
    }
    fetch("paySubmit", data).then(res => {
      if (!res.pmOrderExist) {
        // 微信支付
        if (this.state.paymentEntry === 2) {
          Taro.navigateTo({
            url: `${res.mweb_url}&redirect_url=${encodeURIComponent(
              redirectUrl
            )}`
          })
          // 支付宝支付
        } else if (this.state.paymentEntry === 5) {
          if (res && res.code == 200) {
            let div = document.createElement("div")
            div.innerHTML = res.result.form
            document.body.appendChild(div)
            document.forms[0].submit()
          }
        }
      } else {
        Taro.showToast({
          title: "无效订单，请重新下单",
          icon: "none",
          duration: 2000
        })
      }
    })
  }

  submitPay = () => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      this.payInnerWx()
    } else {
      innerWxBrowser ? this.payInnerWx() : this.payInnerBrower()
    }
  }

  goAgreement() {
    Taro.navigateTo({ url: "/pages/payment/pay-result-agreement/index" })
  }
  contactUs() {
    NTKF.im_openInPageChat("kf_10526_1559533453417")
  }

  // 获取商品详情
  getCourseDetail(params) {
    fetch("getGoodsDetail", { goodsId: params })
      .then(res => {
        if (res) {
          this.setState({ courseDetail: res })
        }
      })
      .then(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <View className={styles.wrap}>
        <HeadBar backPath="/pages/car/index" title="提交订单" />
        <View className={`gray-background ${styles.submitOrder}`}>
          <View className={styles.order}>
            <Text>订单编号：{this.state.orderInfo.code}</Text>
          </View>
          {/* 拼团详情 */}
          {this.$router.params.offered ? (
            <View>
              <TimerComponent courseDetail={this.state.courseDetail} />
              <GoodsComponent
                courseDetail={{
                  goodsDetail: this.state.courseDetail,
                  offered: this.$router.params.offered
                }}
              />
            </View>
          ) : (
            ""
          )}
          <View className={styles.payOption}>
            <View className={styles.paymentEntry}>
              <Text>支付方式</Text>
            </View>
            <CheckBox
              checkClick={this.changePayType}
              defaultValue={this.state.paymentEntry}
              optionList={PayTypeList}
            />
          </View>
          <View className={styles.submitWrap}>
            <View className={styles.submit}>
              <AtButton onClick={this.submitPay.bind(this)} type="primary">
                确认支付
              </AtButton>
            </View>
            <View className={styles.tips}>
              <Text className={styles.tipsText}>提交订单则标识您同意</Text>
              <Text
                onClick={this.goAgreement.bind(this)}
                className={styles.tipsAgreement}
              >
                《行家服务协议》
              </Text>
            </View>
          </View>
          <View className={styles.customer}>
            <Text className={styles.customerText}>
              支付遇到问题？点击
              <Text
                onClick={this.contactUs.bind(this)}
                className={styles.customerLink}
              >
                联系客服
              </Text>
              获得
            </Text>
          </View>
        </View>
      </View>
    )
  }
}
