import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Loading from '@/components/loading'

import styles from './withUs.module.scss'
import '../staticPic/icon.scss'

// import { isNativeApp, JsBridge } from '@/utils/JsBridge';

class ConcatUs extends Component {

  config = {
    navigationBarTitleText: '联系我们'
  }

  state = {
    loading: true
  }

  // 慎用
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    JsBridge(null, {
      "code": 200,
      "message": "OK",
      "path": "title",
      "data": {
        "title": "联系我们"
      }
    })
  }
  goBackClick() {
    Taro.navigateBack({ delta: 1 })
  }

  render () {
    return (
      <View className={styles.content}>
        <View className={styles.div}>
        <View className={styles.ways}> 电子邮件：whoami@hqjy.com</View>
        <View className={styles.way}> 公司地址：广州市白云区永平街泰兴路4号</View>
        <View className={styles.line}>恒企文化产业园</View>
        <View className={styles.ways} style={{marginTop:'22px'}}> 邮政编码：510630</View>
        <View className={styles.way}> 工作时间：周一至周日 09:00-22:00</View>
        <View className={styles.line}>(春节假期除外)</View>
        </View>
        <View className={styles.bot}>温馨提醒：为了更快帮您解决问题，请在邮件中留下电话、账号、订单号、截图等信息，并尽可能详细地描述问题。课程相关服务请在课程页面联系客服进行资询。</View>
      </View>
    )
  }
}

export default ConcatUs
