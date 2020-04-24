import Taro, { Component } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import styles from './index.module.scss'
import Header from '@/components/Header/Header'
import fetch from '@/api/request'
export default class PayScoreSuccess extends Component{
    constructor(props){
        super(props)
        this.state={
            code:'',
            myPoints:0,
            points:0
        }
      }
    componentWillMount () {
        this.init()
        // this.wxPayInit()
      }
      init () {
        let {orderId = '',code,myPoints,points} = this.$router.params
        this.setState({code,myPoints,points})
      }
      goPayScore(){
          let {orderId} = this.$router.params
          fetch('payByPointConvert',{orderId})
           .then(res=>{
                Taro.navigateTo({
                    url: `/pages/payment/pay-result-success/index?orderId=${orderId}&type=1`
                });
           })
      }
      goAgreement () {
        Taro.navigateTo({url: '/pages/payment/pay-result-agreement/index'})
      }
    render(){
        let {code,myPoints,points}=this.state
        return(
            <View className={styles.PayScoreSuccess}>
                <View className={styles.head}>
                    <Header title='提交订单' />
                </View>
                <View className={styles.wrap}>
                <View className={`gray-background ${styles.submitOrder}`}>
                <View className={styles.order}>
                    <Text>订单编号：{code}</Text>
                </View>
                <View className={styles.payOption}>
                    <View className={styles.score}>
                        <Text>账户积分：</Text>
                        <Text>
                            <Text className={styles.count}>{myPoints}</Text>分
                        </Text>
                    </View>
                    <View className={styles.score}>
                        <Text>所需总积分：</Text>
                            <Text>
                                <Text className={styles.count}>{points}</Text>分
                            </Text>
                        </View>
                </View>
                <View className={styles.submitWrap}>
                    <View className={styles.submit}>
                    <AtButton type='primary' onClick={()=>this.goPayScore()}>确认兑换</AtButton>
                    </View>
                    <View className={styles.tips}>
                    <Text className={styles.tipsText}>提交订单则标识您同意</Text>
                    <Text className={styles.tipsAgreement} onClick={()=>this.goAgreement()}>《行家服务协议》</Text>
                    </View>
                </View>
                <View className={styles.customer}>
                    <Text className={styles.customerText}>
                    支付遇到问题？点击
                    <Text className={styles.customerLink}>联系客服</Text>
                    获得
                    </Text>
                </View>
        </View>
      </View>
            </View>
        )
    }
}