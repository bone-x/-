import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import activity from '@/assets/activity-bg.png'
import styles from './index.module.scss'

const bgStyle = {
  background:`url(${activity})`,
  backgroundSize:`100% 100% `
}

export default class TimerComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offeredEnd: 1,
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
    courseDetail: {}
  }

  componentWillReceiveProps(nextProps) {
    let endTime = nextProps.courseDetail.activityEndTime
    // 获取当前时间
    let nowTime = nextProps.courseDetail.sysDate
    if (endTime > nowTime) {
      //获取时间差
      this.setState({
        timediff: Math.round((endTime - nowTime) / 1000)
      }, () => {
        this.countTime()
      })
    } else {
      this.setState({offeredEnd:2})
    }
  }

  componentDidMount() {
  } 

  // 计时器
  countTime() {
    let timediff = this.state.timediff;
    let hour, minute, second;
    this.timer = setInterval(() => {
      //防止倒计时出现负数
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
        s: second
      })
    } else {
        clearInterval(this.timer);
      }
    }, 1000);

    // let t = setTimeout(this.countTime, 1000);
    // if (timediff > 0) {
    //   //获取还剩多少小时
    //   hour = parseInt(timediff / 3600);
    //   //获取还剩多少分钟
    //   minute = parseInt(timediff / 60 % 60);
    //   //获取还剩多少秒
    //   second = timediff % 60;
    //   this.setState({
    //     timediff: --timediff,
    //     h: hour,
    //     m: minute,
    //     s: second
    //   })
    // } else if(timediff == 0) {
    //   clearTimeout(t)
    // }
  }

  render() {
    return(
      <View className={styles.timerBox}>
        <View className={[styles.timer, this.state.offeredEnd == 1? styles.timerStart:styles.timerEnd]} style={this.state.offeredEnd == 1?bgStyle:''}>
          {this.state.offeredEnd == 1?<View className={styles.offeredTimer}>
            <Text className={styles.timerText}>距结束</Text>
            <Text className={styles.hour}>{this.state.h > 9? this.state.h: '0' + this.state.h}</Text>
            <Text className={styles.time}>时</Text>
            <Text className={styles.hour}>{this.state.m > 9? this.state.m: '0' + this.state.m}</Text>
            <Text className={styles.time}>分</Text>
            <Text className={styles.hour}>{this.state.s > 9? this.state.s: '0' + this.state.s}</Text>
            <Text className={styles.time}>秒</Text>
          </View>:<View className={styles.offeredEnd}>
            <Text>活动已结束</Text>
          </View>}
          <View className={styles.offeredNum}>
            <Text>已有{this.props.courseDetail.groupQuantity}人成功拼团</Text>
          </View>
        </View>
      </View>
    )
  }
}