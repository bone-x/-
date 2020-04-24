import Taro, {Component} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import fetch from '@/api/request'
import styles from './index.module.scss'

export default class PayResultSuccess extends Component {

  state = {
    ifPay: false
  }

  componentDidMount () {
    this.checkPayResult()
  }

  goFail () {
    let {orderId} = this.$router.params
    Taro.navigateTo({url: '/pages/payment/pay-result-wait/index?orderId=' + orderId})
  }

  goSuccess () {
    let {orderId} = this.$router.params
    Taro.navigateTo({url: '/pages/payment/pay-result-success/index?orderId=' + orderId})
  }

  checkPayResult () {
    let {orderId} = this.$router.params
    fetch('orderWxPayQueryById', {id: orderId}).then(res => {
      if (res) {
        this.state({ifPay: true})
        Taro.navigateTo({url: '/pages/payment/pay-result-success/index?orderId=' + orderId})
      }
    })
  }

  render() {
    
    return (
      <View className={styles.wrap}>
        <View className={styles.inner}>
          <Text className={styles.text}>支付结果查询中...</Text>
          <View className={styles.button}>
            <AtButton onClick={this.goSuccess.bind(this)} type="primary" >已完成支付</AtButton>
          </View>
          <View className={styles.button}>
            <AtButton onClick={this.goFail.bind(this)} type="secondary" >支付遇到问题，重新支付</AtButton>
          </View>
        </View>
      </View>
    )
  }
}