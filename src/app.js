import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/demo/index'
import configStore from './store'
// import './styles/iconfont.scss'
import './styles/index.scss'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production'&& process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {
  config = {
    pages: [
      'pages/home/index',
      'pages/bindPhone/index',
      'pages/loginPage/index',
      'pages/loginByPhone/index',
      'pages/setPassWord/index',//设置密码
      'pages/Discount/index', //更多秒杀
      'pages/myOrder/index',
      'pages/newsList/index',
      'pages/car/index',
      'pages/courseList/index',
      'pages/findPassword/index',
      'pages/register/index',
      'pages/SureOrder/index',
      'pages/MyScore/index',
      'pages/MyScore/scoreRule/index',
      'pages/menu/index',
      'pages/MyBalance/index', // 我的余额
      'pages/demo/index',
      'pages/confirmOrder/index',
      'pages/forgetPassword/index',
      'pages/messageCenter/index',
      'pages/newsDetail/index',
      'pages/listenCard/index', // 我的听课卡
      'pages/shareOffered/index', //分享拼团
      // 'pages/submitOrder/index',
      // 'pages/payment/index',
      'pages/payment/submit-order/index', // 支付
      'pages/payment/pay-result-success/index', // 支付成功
      'pages/payment/pay-result-wait/index', // 支付失败
      'pages/payment/pay-back/index', // 支付结果查询\
      'pages/payment/pay-result-agreement/index', // 支付协议
      'pages/downLoad/index',
      'pages/payment/PayScoreSuccess/index',
      'pages/GroupBooking/index'//更多拼团
    ],
    subpackages: [
      {
        root: 'learnCenter',
        pages: [
          'pages/learningCenter/index', //学习中心
          'pages/learningCenterDetail/index', //学习中心详情页
          'pages/courseDetail/index' // 商品详情页
        ]
      },
      {
        root: 'personCenter',
        pages: [
          'pages/personalCenter/index', // 个人中心
          'pages/personalCenter/personalData/index', // 个人中心 - 个人资料
          'pages/personalCenter/changeEmail/index', // 个人中心 - 修改邮箱
          'pages/personalCenter/addEmail/index', // 个人中心 - 绑定邮箱
          'pages/personalCenter/changePassWord/index', // 个人中心 -密码修改
          'pages/personalCenter/feedback/index', // 个人中心 - 意见反馈
          'pages/personalCenter/signLog/index', // 注册--服务协议
          'pages/personalCenter/guideAboutus/index', // 新手指南
          'pages/personalCenter/guideAboutus/aboutUs', // 总-关于我们
          'pages/personalCenter/guideAboutus/servicePro', // 服务协议
          'pages/personalCenter/guideAboutus/copyright', // 版权说明
          'pages/personalCenter/guideAboutus/concatUs', // 联系我们
          'pages/personalCenter/guideAboutus/withUs', // 关于行家
          'pages/personalCenter/newsInform/index', // 消息通知
          // 'pages/submitOrder/index',
          // 'pages/payment/index',
          'pages/personalCenter/newsDetails/index', // 消息详情页
          'pages/personalCenter/checktxt/index' // 附件
        ]
      }
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    // tabBar: {
    //   color: '#B8B8B8',
    //   selectedColor: '#ff7847',
    //   // #B8B8B8  #ff7847;
    //   list: [
    //     {
    //       text: '行家',
    //       pagePath: 'pages/home/index',
    //       iconPath: './assets/icon/hangjia_default.png',
    //       selectedIconPath: './assets/icon/hangjia_chosen.png'
    //     },
    //     {
    //       text: '学习',
    //       pagePath: 'pages/learningCenter/index',
    //       iconPath: './assets/icon/learn_default.png',
    //       selectedIconPath: './assets/icon/learn_chosen.png'
    //     },
    //     {
    //       text: '发现',
    //       pagePath: 'pages/newsList/index',
    //       iconPath: './assets/icon/discover_default.png',
    //       selectedIconPath: './assets/icon/discover_chosen.png'
    //     },
    //     {
    //       text: '我的',
    //       pagePath: 'pages/personalCenter/index',
    //       iconPath: './assets/icon/my_default.png',
    //       selectedIconPath: './assets/icon/my_chosen.png'
    //     }
    //   ]
    // }
  }

  componentDidMount() {
    if(Taro.getEnv() != Taro.ENV_TYPE.WEAPP){
      if (!Object.entries)
      Object.entries = function(obj) {
        var ownProps = Object.keys(obj),
          i = ownProps.length,
          resArray = new Array(i) // preallocate the Array
        while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]]

        return resArray
      }
    }
    //兼容低版本浏览器不支持Object.entries方法
  }

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
