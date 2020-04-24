import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtLoadMore } from "taro-ui";
import userListCard from '@/assets/useListenCard.png'
import pastListenCard from '@/assets/pastListenCard.png'
import fetch from 'api/request'
import styles from '../index.module.scss'
import '../loadMore.scss'

const useStyle = {
  background:`url(${userListCard})`,
  backgroundSize:`100% 100% `
}

const pastStyle = {
  background:`url(${pastListenCard})`,
  backgroundSize:`100% 100% `
}
export default class ListenCardList extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      pastListCardList: [],
      pastList: [],
      pastPageNum: 1,
      pastPageSize: 10,
      pastStatus: 'noMore'
    }
  }

  static defaultProps = {}

  componentDidMount() {
    let params3 = {
      token: Taro.getStorageSync('token'),
      pageSize: this.state.pastPageSize,
      pageNum: this.state.pastPageNum,
      activeStatus: 5
    }
    this.getPastListenCard(params3)
  }

  getPastListenCard(params3) {
    fetch('getListenCardList', {token:params3.token,pageSize:params3.pageSize,pageNum:params3.pageNum,activeStatus:params3.activeStatus}).then(res => {
      if (res) {
        params3.pageNum++
        this.getPastProps(res.list)
        if (res.list.length < params3.pageSize) {
          this.setState({
            pastListCardList: this.state.pastListCardList.concat(res.list),
            pastList: res.list,
            pastPageNum: params3.pageNum,
            pastStatus: 'noMore'
          })
        } else {
          this.setState({
            pastListCardList: this.state.pastListCardList.concat(res.list),
            pastList: res.list,
            pastPageNum: params3.pageNum,
            pastStatus: 'more'
          })
        }
      }
    })
  }

  scrolltolowerPast() {
    if (this.state.pastList.length == this.state.pastPageSize) {
      this.setState({
        pastStatus: 'loading'
      })
    } else {
      return false;
    }
    let data = {
      pageNum: this.state.pastPageNum,
      pageSize: this.state.pastPageSize,
      token: Taro.getStorageSync('token'),
      activeStatus: 5
    }
    this.getPastListenCard(data)
  }

  getPastProps(params) {
    params.map(v => {
      if (v.activeStatus !== 2) {
        v.effectiveTimeEnd = this.format(v.effectiveTimeEnd)
      } else {
        // 有效时间 + 激活时间 - 服务器时间 = 剩余可用时间
        let dataDiff = v.effectiveTimeEnd*24*60*60*1000 + new Date(v.activeTime.replace(/-/g, "/")) - new Date(v.sysDate.replace(/-/g, "/"))
        let day, hour, minute;
        if (dataDiff > 0) {
          day = Math.floor(dataDiff / (60 * 60 * 24));
          hour = Math.floor(dataDiff / (60 * 60)) - (day * 24);
          minute = Math.floor(dataDiff / 60) - (day * 24 * 60) - (hour * 60);
          v.timer = `剩余${day}天${hour}小时${minute}分`
        }
      }
    })
  }

  add(m){
    return m < 10? '0' + m : m;
  }

  // 时间转换
  format(sjc) {
    //sjc是整数，否则要parseInt转换
    let timeStamp = sjc.replace(/-/g, "/")
    let time = new Date(timeStamp);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();

    return y + '-' + this.add(m) + '-' + this.add(d);
  }

  // 激活听课卡
  getSaveCard(k) {
    let params = {
      token: Taro.getStorageSync('token'),
      courseStudentId: k.courseStudentId,
      courseCardId: k.courseCardId
    }
    fetch('getActiveCourseStudentCard', params).then(res => {
      this.setState()
    })
  }

  render() {
    const { pastListCardList } = this.state

    return(
      <ScrollView
        className='scrollview'
        scrollY
        scrollWithAnimation
        scrollTop='0'
        style='max-height: 100vh;'
        lowerThreshold='20'
        onScrollToLower={this.scrolltolowerPast.bind(this)}
      >
        <View className={styles.allListenCard}>
          {
            pastListCardList.map(item => {
              return(
                <View className={styles.item} key={item.courseCardId}>
                  <View className={styles.itemLeft} style={item.activeStatus === 1 || item.activeStatus === 2 ?useStyle:pastStyle}>
                    <View className={styles.endTimeBox}>
                      <Text className={styles.endTime}>{item.activeStatus == 2? item.timer:`有效期至${item.effectiveTimeEnd}`}</Text>
                    </View>
                  </View>
                  <View className={styles.itemRight}>
                    <Text className={styles.listenCardName}>{item.cardName}</Text>
                    <View className={styles.listenCardPar}>
                      <View className={styles.parScope}>
                        <Text className={styles.parName}>价格范围</Text>
                        <Text className={item.activeStatus === 3 || item.activeStatus === 4 || item.activeStatus === 5? styles.parPast:styles.par}>{`${item.priceRangeLow}-${item.priceRangeHigh}`}<Text className={styles.yuan}>元</Text></Text>
                      </View>
                      <View className={styles.listenCardStatusBox}>
                        <Text className={[styles.listenCardStatus, item.activeStatus === 1? styles.listenCardUse:item.activeStatus === 2? styles.listenCardActive:styles.listenCardPast]}>{item.activeStatus === 1? '可使用':item.activeStatus === 2? '已激活': item.activeStatus === 3? '已过期':item.activeStatus === 4? '已使用': '已失效'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          }
          <AtLoadMore
            status={this.state.pastStatus}
            noMoreText='哎呀，没有内容啦'
          />
        </View>
      </ScrollView>
    )
  }
}