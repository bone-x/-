import Taro, {Component} from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import HeadBar from 'components/head-bar'
import fetch from '@/api/request'
import {setTitle} from '@/utils/mixins-script/index'
import styles from './index.module.scss'
import PaySuccess from './pay_successful.png'

export default class PayResultSuccess extends Component {

  state = {
    orderInfo: {},
    orderName: '',
    timerNum: 3,
    orderInfoStatu: true
  }

  componentDidMount () {
    setTitle('行家')
    this.getOrderIdByPaid()
  }

  getOrderIdByPaid () {
    let {orderId} = this.$router.params
    if (!orderId) {
      Taro.redirectTo({url: '/pages/learningCenter/index'})
    }
    fetch('getOrderIdByPaid', {id: orderId}).then(res => {
      if (res) {
        this.setState({orderInfo: res.pmOrder})
        let name = ''
        res.orderDetailList.forEach(res => {
          name = name + res.goodsName + '，';
        });
        this.setState({orderName: name.substring(0, name.length -1)})
        this.orderDetailList = res.orderDetailList
        this.countDown(this.goLearnCenter)
      }
      this.setState({orderInfoStatu: false})
    })
  }

  countDown = (cb) => {
    this.timer = null
    let walk = () =>{
      this.timer = setTimeout(() => {
        let {timerNum} = this.state
        if (timerNum !== 0) {
          this.setState({timerNum: timerNum - 1})
          walk()
        } else {
          cb()
        }
      }, 1000)
    }
    walk();
  }

  goLearnCenter = () => {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.orderDetailList) {
      if (this.orderDetailList.length === 1) {
        Taro.redirectTo({url: '/learnCenter/pages/courseDetail/index?id=' + this.orderDetailList[0].goodsId})
      } else if (this.orderDetailList.length > 1) {
        Taro.redirectTo({url: '/pages/learningCenter/index'})
      }
    } else {
      Taro.showToast({
        title: '获取已支付订单列表失败',
        icon: 'none',
        duration: 2000
      })
    }
  }

  render() {
    let {orderInfo, orderName, timerNum, orderInfoStatu} = this.state
    let {type}=this.$router.params
    let paymentTypeDict = {
      0: '支付宝',
      1: '微信',
      2: '行家币',
      3: '积分'
    }
    
    return (
      <View>
        <HeadBar title="支付结果" />
        <View className={styles.wrap}>
          <View className={styles.imageWrap}>
            <Image className={styles.image} src={PaySuccess} />
          </View>
          <View className={styles.successPay}>
            <Text>
              {
                type==='1'?'兑换成功':'支付成功'
              }
              
            </Text>
          </View>
          <View className={styles.detail}>
            <View className={styles.item}>
              <Text>商品订单号：{orderInfo.code}</Text>
            </View>
            <View className={styles.item}>
              <Text>商品名称：{orderName}</Text>
            </View>
            <View className={styles.item}>
              <Text>实付金额: {orderInfo.payment}</Text>
            </View>
            <View className={styles.item}>
              <Text>支付方式：
              
                 {paymentTypeDict[orderInfo.paymentType]}
              
              </Text>
            </View>
            <View className={styles.item}>
              <Text>购买时间：{orderInfo.endTime}</Text>
            </View>
          </View>
          <View className={styles.buttonWrap}>
            <View className={styles.button}>
              <AtButton loading={orderInfoStatu} disabled={orderInfoStatu} onClick={this.goLearnCenter.bind(this)} type='primary'>{`${orderInfoStatu ? '支付查询中' : timerNum + 's后前往学习'}`}</AtButton>
            </View>
          </View>
        </View>
      </View>
    )
  }
}