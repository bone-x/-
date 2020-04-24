import Taro, {
  Component
} from '@tarojs/taro'
import {View, Text } from '@tarojs/components'
import { AtRate } from 'taro-ui'
import activity from '@/assets/activity-bg.png'
import './index.scss'

const bgStyle = {
  background:`url(${activity})`,
  backgroundSize:`100% 100% `
}


class ProductShotComponent extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      h: '0',
      m: '0',
      s: '0',
      timediff: null
    };
    this.countTime = this.countTime.bind(this)
  }

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    productShot : {}
  }

  componentDidMount() {
    //  let endTime = Number(new Date('2019-05-8 11:33:00'));
    let endTime = this.props.productShot.activityEndTime
    // 获取当前时间
    // let nowTime = Date.now();
    let nowTime = this.props.productShot.sysDate
    //获取时间差
    this.setState({timediff: Math.round((endTime - nowTime) / 1000)})
    this.countTime()
  }
  
  // 计时器
  countTime() {
    let timediff = this.state.timediff;
    let hour, minute, second;
    let t = setTimeout(this.countTime, 1000);
    if (timediff > 0) {
      //获取还剩多少小时
      hour = parseInt(timediff / 3600);
      //获取还剩多少分钟
      minute = parseInt(timediff / 60 % 60);
      //获取还剩多少秒
      second = timediff % 60;
      this.setState({
        timediff: --timediff,
        h: hour,
        m: minute,
        s: second,
      })
    } else if(timediff == 0) {
      clearTimeout(t)
    }
  }

  render() {
    const { productShot } = this.props

    return(
      <View className='courseIntroductionTop'>
        <View className='courseTitle'>
        {/* activiteType 0：免费，1：积分，2：秒杀，3：限时抢购,4:拼团  price 0:免费 非0 原价*/}
          {
            productShot.activiteType == 0?'':<Text className='courseLabel'>{productShot.activiteType ==1?'积分':productShot.activiteType == 2?'秒杀':productShot.activiteType == 3?'限时抢购':'拼团'}</Text>
          }
          <Text>
            {productShot.name}
          </Text>
        </View>
        <View className='courseStateBox'>
          <View className='courseState'>
            <Text className='user'>{productShot.totalBuyCount}人学过</Text>
            <Text className='timeOut'>{productShot.validityDate == -1? '永久有效':'购买后' + productShot.validityDate + '月失效'}</Text>
          </View>
          <View className='starBox'>
            <View className='star'>
            <AtRate value={productShot.evaluatePoint} />
            </View>
            <Text className='grade'>{productShot.evaluatePoint}</Text>
          </View>
        </View>
        {/* 倒计时 */}  
        <View className='contest' style={bgStyle}>
        {
          productShot.activiteType == 4?<View className='group'>
            <Text className='groupPar'>￥{productShot.activitePrice}</Text>
            <Text className='cost'>￥{productShot.price}</Text>
            <Text className='groupText'>已有{productShot.groupQuantity}人拼团成功</Text>
          </View>:<View className='price'>
            <Text className='integral'>{productShot.activiteType == 0? (productShot.price == 0?'免费': '￥' + productShot.price): (productShot.activiteType == '1'? productShot.activitePoint + '积分' : (productShot.activiteType == 2? '￥' + productShot.activitePrice : '￥' + productShot.activitePrice))}</Text>
            <Text style={productShot.activiteType == 0?'display:none':'display:block'} className='par'>￥{productShot.price}</Text>
          </View>
        }
          <View className='timerBoxXs' style={productShot.activiteType == 0? 'display:none':'display:block'}>
            <Text className='timerText'>距结束</Text>
            <Text className='hour'>{this.state.h > 9? this.state.h: '0' + this.state.h}</Text>
            <Text className='time'>时</Text>
            <Text className='hour'>{this.state.m > 9? this.state.m: '0' + this.state.m}</Text>
            <Text className='time'>分</Text>
            <Text className='hour'>{this.state.s > 9? this.state.s: '0' + this.state.s}</Text>
            <Text className='time'>秒</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default ProductShotComponent
