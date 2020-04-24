import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import userListCard from '@/assets/useListenCard.png'
import pastListenCard from '@/assets/pastListenCard.png'
import { AtLoadMore, AtToast } from "taro-ui";
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
      allListCardList: [],
      allList: [],
      allPageNum: 1,
      allPageSize: 10,
      allStatus: 'noMore',
      open: false
    }
  }

  static defaultProps = {}

  componentDidMount() {
    this.init()
  }

  init() {
    const token = Taro.getStorageSync('token');
    let params1 = {
      token: token,
      pageSize: this.state.allPageSize,
      pageNum: 1,
    }
    this.getAllListenCard(params1)
  }

  getAllListenCard(params1) {
    fetch('getListenCardList', {token:params1.token,pageSize:params1.pageSize,pageNum:params1.pageNum}).then(res => {
      if (res) {
        params1.pageNum++
        this.getAllProps(res.list)
        if (res.list.length < params1.pageSize) {
          this.setState({
            allListCardList: this.state.allListCardList.concat(res.list),
            allList: res.list,
            allPageNum: params1.pageNum,
            allStatus: 'noMore',
          })
        } else {
          this.setState({
            allListCardList: this.state.allListCardList.concat(res.list),
            allList: res.list,
            allPageNum: params1.pageNum,
            allStatus: 'more',
          })
        }
      }
    })
  }

  scrolltolowerAll() {
    if (this.state.allList.length == this.state.allPageSize) {
      this.setState({
        allStatus: 'loading'
      })
    } else {
      return false;
    }
    let data = {
      pageNum: this.state.allPageNum,
      pageSize: this.state.allPageSize,
      token: Taro.getStorageSync('token')
    }
    this.getAllListenCard(data)
  }

  getAllProps(params) {
    params.map(v => {
      if (v.activeStatus !== 2) {
        v.effectiveTimeEnd = this.format(v.effectiveTimeEnd)
      } else {
        // 有效时间 + 激活时间 - 服务器时间 = 剩余可用时间
        let activeTime = new Date(v.activeTime.replace(/-/g, "/"))
        let sysDateTime = new Date(v.sysDate.replace(/-/g, "/"))
        let dataDiff = v.avaibilePeriod * 24 * 60 * 60 * 1000 + activeTime.getTime() - sysDateTime.getTime()
        let day, hour, minute;
        if (dataDiff > 0) {
          day = Math.floor(dataDiff / (60 * 60 * 24 * 1000));
          hour = Math.floor(dataDiff / (60 * 60 * 1000)) - (day * 24);
          minute = Math.floor(dataDiff / 60 / 1000) - (day * 24 * 60) - (hour * 60);
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
    if (k.activeStatus != 1) {
      return false;
    }
    let params = {
      token: Taro.getStorageSync('token'),
      courseStudentId: k.courseStudentId,
      courseCardId: k.courseCardId
    }
    fetch('getActiveCourseStudentCard', params).then(res => {
      if (res) {
        this.setState({open:true})
        
      }
    })
  }

  render() {
    const { allListCardList } = this.state
    return(
      <View>
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style='max-height: 100vh;'
          lowerThreshold='20'
          onScrollToLower={this.scrolltolowerAll.bind(this)}
        >
          <View className={styles.allListenCard}>
            {
              allListCardList.map(item => {
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
                        <View className={styles.listenCardStatusBox} onClick={this.getSaveCard.bind(this, item)}>
                          <Text className={[styles.listenCardStatus, item.activeStatus === 1? styles.listenCardUse:item.activeStatus === 2? styles.listenCardActive:styles.listenCardPast]}>{item.activeStatus === 1? '可使用':item.activeStatus === 2? '已激活': item.activeStatus === 3? '已过期':item.activeStatus === 4? '已使用': '已失效'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })
            }
            <AtLoadMore
              status={this.state.allStatus}
              noMoreText='哎呀，没有内容啦'
            />
          </View> 
        </ScrollView>
        <AtToast isOpened={this.state.open} text='已激活' icon='check'></AtToast>
      </View>
    )
  }
}