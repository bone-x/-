import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtSwipeAction, AtRate } from 'taro-ui'
import styles from './index.module.scss'
import EmptyList from '../emptyList'
import fetch from '@/api/request.js'
import Loading from '@/components/loading'
import LoadMore from '@/components/load-more'
import URI from 'urijs'

class Collect extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      totalPage: 0,
      totalCount: 0,
      isIphoneX: false, // 是否ipx
      viewHeight: 0,
      pageNum: 1,
      pageSize: 10,
      loadBtn: false,
      selectType: 2,
      title: '很遗憾，没有收藏的课程商品',
      tabList: [
        { selectType: 2, title: '全部' },
        { selectType: 1, title: '付费' },
        { selectType: 3, title: '免费' }
      ],
      collectList: [],
      collectIndex: 2
    }
  }
  config = {
    navigationBarTitleText: '收藏'
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
  }
  componentDidMount() {
    this.getCollectionList('load')
    this.props.onRef(this)
    Taro.getSystemInfo({
      success: res => {
        console.log(res.screenHeight, 123)
        console.log(res.screenHeight - 311, 11111)
        if (res.model == 'iPhone X (GSM+CDMA)<iPhone10,3>') {
          this.setState({
            isIphoneX: true,
            viewHeight: res.screenHeight - 146
          })
        } else {
          this.setState({ isIphoneX: false }, () => {
            this.setState({
              viewHeight: res.screenHeight - 146
            })
          })
        }
      }
    })
  }
  getCollectionList = type => {
    this.setState({
      loadBtn: true
    })
    let { pageSize, pageNum, collectList, selectType } = this.state
    if (type === 'load') {
      collectList = []
      pageNum = 1
    }
    fetch('getCollectionList', {
      selectType,
      pageSize,
      pageNum
    })
      .then(res => {
        console.log(res.list, 123456789)
        if (res.list.length > 0) {
          this.setState({
            totalPage: res.totalPage,
            totalCount: res.totalCount,
            pageNum: res.currPage,
            collectList: collectList.concat(res.list),
            loadBtn: true,
            loading: false
          })
        } else {
          this.setState({
            loadBtn: false,
            loading: false
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          loadBtn: false,
          loading: false
        })
      })
  }
  //取消收藏
  getCancelCollection(id) {
    fetch('getCancelCollection', {
      operateType: 2,
      goodsId: id
    })
      .then(res => {
        if (this.state.totalCount <= 10) {
          //根据是否删除成功进行下一步操作
          //直接删除操作
          let arr = this.removeItem(id)
          this.setState({
            collectList: arr
          })
        } else if (this.state.totalCount === 11) {
          this.getCollectionList('load')
        } else {
          //请求下一页的数据,添加进入collectList
          console.log('currentcount 12', this.state.totalCount)
          let arrList = this.removeItem(id)

          this.setState({
            loadBtn: true
          })
          let { pageSize, selectType } = this.state
          let pageNum = this.state.pageNum
          fetch('getCollectionList', {
            selectType,
            pageSize,
            pageNum
          })
            .then(data => {
              console.log('data list', data.list)
              this.setState({
                totalPage: data.totalPage,
                totalCount: data.totalCount,
                pageNum: data.currPage,
                collectList: this.getUniqueArr(arrList, data.list),
                loadBtn: false
              })
            })
            .catch(error => {
              console.log(error)
              this.setState({
                loadBtn: false
              })
            })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  getUniqueArr = (parentList, addList) => {
    addList.map(item => {
      let hasElement = null
      hasElement = parentList.find(parentItem => {
        if (parentItem.id == item.id) {
          return true
        }
      })
      if (!hasElement) {
        parentList.push(item)
      }
    })
    return parentList
  }
  removeItem = id => {
    let eleIndex = null
    let arrayList = Array.from(this.state.collectList)
    this.state.collectList.find((item, index) => {
      if (item.id == id) {
        eleIndex = index
        return true
      }
    })
    if (eleIndex != null) {
      arrayList.splice(eleIndex, 1)
    }
    return arrayList
  }
  //选项切换全部付费免费
  handleSelectCharge(selectType) {
    this.setState(
      {
        collectList: [],
        loading: true,
        pageNum: 1,
        collectIndex: selectType,
        selectType
      },
      () => {
        this.getCollectionList('load')
      }
    )
  }
  handleSingle() {
    this.setState({
      isOpened: true
    })
  }

  handleDelItem(id) {
    console.log(id)
    this.getCancelCollection(id)
    Taro.showToast({ title: '删除成功', icon: 'success' })
  }
  addFreeOrder(item) {
    return fetch('addFreeOrder', {
      goodsId: item.id
    })
      .then(res => {
        return res
      })
      .catch(error => {
        console.log(error)
      })
  }
  //收藏跳转
  ToCourseDetail = item => {
    console.log(item)
    this.addFreeOrder(item).then(res => {
      console.log('我是第1个', res)
      if (res.goto === 1) {
        Taro.showLoading({ title: '加入学习', mask: true })
        const orderId = res.orderId
        fetch('getRecordId', {
          courseId: item.courseId,
          orderId
        })
          .then(res => {
            console.log(res.recordId)
            const recordId = res.recordId
            fetch('toRecord', {
              recordId
            })
              .then(res => {
                var uri = new URI(res.recordUrl)
                uri.addSearch('cover', item.coverPicture)
                uri.addSearch('id', item.id)
                uri.addSearch('orderId', orderId)
                let query = uri.query()
                console.log(res, 'res')
                let target = new URI(
                  '/learnCenter/pages/learningCenterDetail/index'
                )

                Taro.navigateTo({
                  url: target.query(query).toString()
                })
              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        Taro.navigateTo({
          url: `/learnCenter/pages/courseDetail/index?id=${item.id}`
        })
      }
    })
  }
  //滚动加载更多收藏
  onScrolltoupper = () => {
    console.log(123)
    const { pageNum, totalPage } = this.state
    this.setState(
      {
        pageNum: pageNum + 1
      },
      () => {
        if (totalPage > pageNum) {
          this.getCollectionList()
        } else {
          this.setState({
            loadBtn: false
          })
        }
      }
    )
  }
  render() {
    const {
      collectList,
      tabList,
      collectIndex,
      loadBtn,
      title,
      viewHeight
    } = this.state

    return (
      <View className={styles.collect_container}>
        <View className={styles.collect_tabs}>
          {tabList.map((item, index) => {
            return (
              <Text
                className={
                  item.selectType == collectIndex
                    ? `${styles.actived} ${styles.tabs_item}`
                    : `${styles.tabs_item}`
                }
                onClick={() => this.handleSelectCharge(item.selectType)}
                key={index}
              >
                {item.title}
              </Text>
            )
          })}
        </View>
        {collectList && collectList.length > 0 && (
          <ScrollView
            className='scrollview'
            scrollTop='0'
            scrollY
            lowerThreshold='20'
            style={{ height: `${viewHeight}px` }}
            scrollWithAnimation
            onScrollToLower={this.onScrolltoupper}
          >
            <View className={styles.collect_list}>
              {collectList.map((item, index) => {
                return (
                  <AtSwipeAction
                    key={index}
                    autoClose
                    onOpened={() => this.handleSingle()}
                    isOpened={item.isOpened}
                    onClick={() => this.handleDelItem(item.id)}
                    options={[
                      {
                        text: '',
                        style: {
                          backgroundColor: '#fff'
                        }
                      }
                    ]}
                  >
                    <View
                      className={styles.collect_item}
                      onClick={() => this.ToCourseDetail(item)}
                    >
                      <View className={styles.collect_list_img}>
                        <Image
                          className={styles.collect_img}
                          src={item.coverPicture}
                        />
                      </View>
                      <View className={styles.collect_list_info}>
                        <View className={styles.collect_item_info_title}>
                          {item.name}
                        </View>
                        <View className={styles.collect_number}>
                          <AtRate
                            size='15'
                            margin='2'
                            value={item.evaluatePoint}
                          />
                          <Text className={styles.learn_number}>
                            {item.evaluatePoint}分
                          </Text>
                          <Text className={styles.learn_number}>
                            ({item.totalBuyCount}人学过)
                          </Text>
                        </View>
                        {item.price === 0 && (
                          <Text className={styles.free}>免费</Text>
                        )}
                        {item.price > 0 && item.activiteType === 0 ? (
                          <Text className={styles.collect_size}>
                            &yen; {item.price}
                          </Text>
                        ) : null}
                        {item.activiteType === 1 && (
                          <View>
                            <Text className={styles.collect_icon}>
                              {item.activiteTypeName}
                            </Text>
                            <Text className={styles.collect_size}>
                              {item.activitePoint}积分
                            </Text>
                            <Text className={styles.collect_oldPrice}>
                              ¥{item.price}
                            </Text>
                          </View>
                        )}
                        {item.price > 0 && item.activiteType >= 2 ? (
                          <View>
                            <Text className={styles.collect_icon}>
                              {item.activiteTypeName}
                            </Text>
                            <Text className={styles.collect_size}>
                              ¥{item.activitePrice}
                            </Text>
                            <Text className={styles.collect_oldPrice}>
                              ¥{item.price}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </AtSwipeAction>
                )
              })}
              {collectList.length >= 10 && <LoadMore loadMore={loadBtn} />}
            </View>
          </ScrollView>
        )}
        {/* 无数据时 */}
        {(!collectList || (collectList && collectList.length === 0)) && (
          <EmptyList title={title} />
        )}
      </View>
    )
  }
}
export default Collect
