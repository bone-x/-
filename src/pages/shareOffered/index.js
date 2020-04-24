import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import TimerComponent from '@/components/timer/index'
import GoodsComponent from '@/components/goods/index'
import fetch from 'api/request'
import URI from 'urijs'
import styles from './index.module.scss'

export default class ShareOffered extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      recordId: ''
    }
  }

  config = {
    navigationBarTitleText: "拼团详情"
  };

  NTKF_kf() {
    NTKF.im_openInPageChat('kf_10526_1559533453417');
  }
  getRecordId() {
    fetch('getRecordId', {}).then(res => {
      this.setState({recordId:res.recordId})
    })
  }

  toOffered() {
    fetch('getShareOffered', {}).then(res => {
      let { result } = res
      if (result.goto == 1) {
        fetch('getFreeListenUrl', {recordId:this.state.recordId}).then(res1 => {
          if (res1) {
            fetch('toRecord', {recordId: this.state.recordId}).then(res2 => {
              let uri = new URI(res1.recordUrl)
              uri.addSearch('cover', this.$router.params.cover)
              uri.addSearch('id', this.props.id)
              uri.addSearch('orderId', res2.orderId)
              let query = uri.query()
              let target = new URI('/learnCenter/pages/learningCenterDetail/index')
              Taro.navigateTo({
                url: target.query(query).toString()
              })
            })
          }
        })
      } else if (result.goto == 2) {
        Taro.navigateTo({
          url: `/pages/payment/submit-order/index`
        })
      } else if (result.goto == -1) {
        console.log('拼团失败')
      }
    })
  }

  render() {
    return(
      <View className={styles.shareOffered}>
        {/* 订单商品 */}
        {/* <GoodsComponent /> */}
        {/* 拼团倒计时 */}
        {/* <TimerComponent /> */}
        {/* 拼团规则 */}
        <View className={styles.shareOfferedBott}>
          <Text className={styles.rule}>拼团规则</Text>
          <Text className={styles.offeredRule}>1. 拼团成功：拼团活动有效期内，支付成功即可参与拼团</Text>
          <Text className={styles.offeredRule}>2. 拼团退款：拼团活动有效期内，已支付的订单不允许申请退款；拼团失败的订单，会有专员客服在1-7个工作日内联系您处理退款事宜</Text>
          <Text className={styles.offeredRule}>3. 其他说明：部分参加活动的课程，以活动规则为准。更多疑问，可联系客服进行咨询</Text>
        </View>
        <View className={[styles.bottBar,styles.clearfix]} >
          <View className={styles.bottBarZx} onClick={this.NTKF_kf.bind(this)}>
            <Text className={`iconfont iconxiaoxi ${styles.counselIcon}`}></Text>
            <Text className={styles.bottBarZxText}> 咨询 </Text>
          </View>
          <View className={styles.bottBarOffered} onClick={this.toOffered.bind(this)}>
            <Text className={styles.bottBarOfferedText}>我要参团</Text>
          </View>
        </View>
      </View>
    )
  }
}