import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import fetch from 'api/request'
import NoListenCard from './noListenCard/index' 
// import LoadMore from './loadMore/index'
import styles from './index.module.scss'

export default class ListenCardList extends Component {
  constructor() {
    super(...arguments)
    this.state = {}
  }

  static defaultProps = {}

  componentDidMount() {}

  // 保存听课卡
  getSaveCard() {
    fetch('getSaveListenCard',this.props.listenCardList).then(res => {
      console.log(res)
    })
  }

  render() {
    const { listenCardList } = this.props
    console.log(listenCardList, '8888888888888888888888888888888888888888')
    return(
      listenCardList.length === 0? <NoListenCard /> : <View className={styles.allListenCard}>
        {
          listenCardList.map(item => {
            return(
              <View className={styles.item} key={item.courseCardId}>
                <View className={styles.itemLeft}>
                  <Text className={styles.cardImg}>
                    <Image className={styles.img} />
                  </Text>
                  <View className={styles.endTimeBox}>
                    <Text className={styles.endTime}>有效期至2019.03.10</Text>
                  </View>
                </View>
                <View className={styles.itemRight}>
                  <Text className={styles.listenCardName}>{item.cardName}</Text>
                  <View className={styles.listenCardPar}>
                    <View className={styles.parScope}>
                      <Text className={styles.parName}>价格范围</Text>
                      <Text className={item.activeStatus === 3 || item.activeStatus === 4 || item.activeStatus === 5? styles.parPast:styles.par}>{`${item.priceRangeLow}-${item.priceRangeHigh}`}<Text className={styles.yuan}>元</Text></Text>
                    </View>
                    <View className={styles.listenCardStatusBox} onClick={this.getSaveCard.bind(this)}>
                      <Text className={[styles.listenCardStatus, item.activeStatus === 1? styles.listenCardUse:item.activeStatus === 2? styles.listenCardActive:styles.listenCardPast]}>{item.activeStatus === 1? '可使用':item.activeStatus === 2? '已激活': item.activeStatus === 3? '已过期':item.activeStatus === 4? '已使用': '已失效'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          })
        }
        {/* <LoadMore /> */}
      </View>
    )
  }
}