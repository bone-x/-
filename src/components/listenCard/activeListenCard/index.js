import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtLoadMore } from 'taro-ui'
import userListCard from '@/assets/useListenCard.png'
import pastListenCard from '@/assets/pastListenCard.png'
import fetch from 'api/request'
import styles from '../index.module.scss'
import '../loadMore.scss'

const useStyle = {
  background: `url(${userListCard})`,
  backgroundSize: `100% 100% `
}

const pastStyle = {
  background: `url(${pastListenCard})`,
  backgroundSize: `100% 100% `
}
export default class ListenCardList extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      activeListCardList: [],
      activeList: [],
      activePageNum: 1,
      activePageSize: 10,
      activeStatus: 'noMore'
    }
  }

  static defaultProps = {}

  componentDidMount() {
    let params2 = {
      token: Taro.getStorageSync('token'),
      pageSize: this.state.activePageSize,
      pageNum: this.state.activePageNum,
      activeStatus: 2
    }
    this.getActiveListenCard(params2)
  }

  getActiveListenCard(params2) {
    fetch('getListenCardList', {
      token: params2.token,
      pageSize: params2.pageSize,
      pageNum: params2.pageNum,
      activeStatus: params2.activeStatus
    }).then(res => {
      if (res) {
        params2.pageNum++
        this.getActiveProps(res.list)
        if (res.list.length < params2.pageSize) {
          this.setState({
            activeListCardList: this.state.activeListCardList.concat(res.list),
            activeList: res.list,
            activePageNum: params2.pageNum,
            activeStatus: 'noMore'
          })
        } else {
          this.setState({
            activeListCardList: this.state.activeListCardList.concat(res.list),
            activeList: res.list,
            activePageNum: params2.pageNum,
            activeStatus: 'more'
          })
        }
      }
    })
  }

  scrolltolowerActive() {
    if (this.state.activeList.length == this.state.activePageSize) {
      this.setState({
        activeStatus: 'loading'
      })
    } else {
      return false
    }
    let data = {
      pageNum: this.state.activePageNum,
      pageSize: this.state.activePageSize,
      token: Taro.getStorageSync('token'),
      activeStatus: 2
    }
    this.getActiveListenCard(data)
  }

  getActiveProps(params) {
    params.map(v => {
      if (v.activeStatus !== 2) {
        v.effectiveTimeEnd = this.format(v.effectiveTimeEnd)
      } else {
        // 有效时间 + 激活时间 - 服务器时间 = 剩余可用时间
        let activeTime = new Date(v.activeTime.replace(/-/g, "/"))
        let sysDateTime = new Date(v.sysDate.replace(/-/g, "/"))
        let dataDiff =
          v.avaibilePeriod * 24 * 60 * 60 * 1000 +
          activeTime.getTime() -
          sysDateTime.getTime()
        let day, hour, minute
        if (dataDiff > 0) {
          day = Math.floor(dataDiff / (60 * 60 * 24 * 1000))
          hour = Math.floor(dataDiff / (60 * 60 * 1000)) - day * 24
          minute = Math.floor(dataDiff / 60 / 1000) - day * 24 * 60 - hour * 60
          v.timer = `剩余${day}天${hour}小时${minute}分`
        }
      }
    })
  }

  add(m) {
    return m < 10 ? '0' + m : m
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

  render() {
    const { activeListCardList } = this.state
    return (
      <ScrollView
        className="scrollview"
        scrollY
        scrollWithAnimation
        scrollTop="0"
        style="max-height: 100vh;"
        lowerThreshold="20"
        onScrollToLower={this.scrolltolowerActive.bind(this)}
      >
        <View className={styles.allListenCard}>
          {activeListCardList.map(item => {
            return (
              <View className={styles.item} key={item.courseCardId}>
                <View
                  className={styles.itemLeft}
                  style={
                    item.activeStatus === 1 || item.activeStatus === 2
                      ? useStyle
                      : pastStyle
                  }
                >
                  <View className={styles.endTimeBox}>
                    <Text className={styles.endTime}>
                      {item.activeStatus == 2
                        ? item.timer
                        : `有效期至${item.effectiveTimeEnd}`}
                    </Text>
                  </View>
                </View>
                <View className={styles.itemRight}>
                  <Text className={styles.listenCardName}>{item.cardName}</Text>
                  <View className={styles.listenCardPar}>
                    <View className={styles.parScope}>
                      <Text className={styles.parName}>价格范围</Text>
                      <Text
                        className={
                          item.activeStatus === 3 ||
                          item.activeStatus === 4 ||
                          item.activeStatus === 5
                            ? styles.parPast
                            : styles.par
                        }
                      >
                        {`${item.priceRangeLow}-${item.priceRangeHigh}`}
                        <Text className={styles.yuan}>元</Text>
                      </Text>
                    </View>
                    <View className={styles.listenCardStatusBox}>
                      <Text
                        className={[
                          styles.listenCardStatus,
                          item.activeStatus === 1
                            ? styles.listenCardUse
                            : item.activeStatus === 2
                            ? styles.listenCardActive
                            : styles.listenCardPast
                        ]}
                      >
                        {item.activeStatus === 1
                          ? '可使用'
                          : item.activeStatus === 2
                          ? '已激活'
                          : item.activeStatus === 3
                          ? '已过期'
                          : item.activeStatus === 4
                          ? '已使用'
                          : '已失效'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
          <AtLoadMore
            status={this.state.activeStatus}
            noMoreText="哎呀，没有内容啦"
          />
        </View>
      </ScrollView>
    )
  }
}
