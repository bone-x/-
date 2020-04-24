import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtModal } from 'taro-ui'
import EmptyList from '../emptyList'
import styles from './index.module.scss'
import fetch from '@/api/request.js'
import Loading from '@/components/loading'
import LoadMore from '@/components/load-more'

class Learn extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      loading: true,
      page: 1,
      pageSize: 10,
      isIphoneX: false, // 是否ipx
      viewHeight: 0,
      totalPage: 1,
      queryType: 1,
      riseOrFall: 1,
      orderType: 1,
      loadBtn: false,
      showArrow: true,
      actived: false,
      isActived: false,
      showArrowA: true,
      activedA: false,
      isActivedA: false,
      showMenu: false,
      learnList: [],
      title: '很遗憾，没有可学习的课程商品',
      menuList: [
        { queryType: 1, title: '全部' },
        { queryType: 2, title: '付费' },
        { queryType: 3, title: '即将过期' },
        { queryType: 4, title: '已过期' }
      ],
      menuIndex: 1,
      selectItem: [
        { orderType: 1, title: '按学习时间' },
        { orderType: 2, title: '按加入时间' }
      ]
    }
  }
  componentDidMount() {
    this.getCourseList('load')
    // this.props.onRef(this)
    Taro.getSystemInfo({
      success: res => {
        console.log(res.screenHeight, 123)
        if (res.model == 'iPhone X (GSM+CDMA)<iPhone10,3>') {
          this.setState({
            isIphoneX: true,
            viewHeight: res.screenHeight - 156
          })
        } else {
          this.setState({ isIphoneX: false }, () => {
            this.setState({
              viewHeight: res.screenHeight - 156
            })
          })
        }
      }
    })
  }
  //获取学习中心课程列表
  getCourseList = type => {
    this.setState({
      loadBtn: true
    })
    let {
      pageSize,
      page,
      learnList,
      queryType,
      orderType,
      riseOrFall
    } = this.state

    if (type === 'load') {
      learnList = []
    }

    fetch('getCourseList', {
      riseOrFall,
      queryType,
      orderType,
      pageSize,
      page
    })
      .then(res => {
        if (res.list.length > 0) {
          console.log(res.totalCount, 23333)
          this.setState({
            totalPage: res.totalPage,
            page: res.currPage,
            learnList: learnList.concat(res.list),
            loading: false,
            loadBtn: true
          })
        } else {
          this.setState({
            learnList: [],
            page: page - 1,
            loading: false,
            loadBtn: false
          })
        }
      })
      .catch(error => {
        console.log('error', error)
        this.setState({
          loadBtn: false,
          loading: false
        })
      })
  }
  //滚动加载更多课程
  onScrolltoupper = () => {
    console.log(123)
    const { page, totalPage } = this.state
    this.setState(
      {
        page: page + 1
      },
      () => {
        if (totalPage > page) {
          this.getCourseList()
        }else {
          this.setState({
            loadBtn: false
          })
        }
      }
    )
  }

  handleClose() {
    if (this.state.showMenu == true) {
      this.setState({
        showMenu: false
      })
    }
  }
  handleLearnTime() {
    if (this.state.showArrow) {
      this.setState(
        {
          showArrowA: true,
          riseOrFall: 1,
          page: 1,
          orderType: 1,
          activedA: false,
          isActivedA: false,
          actived: false,
          isActived: true,
          loading: true,
          learnList: []
        },
        () => {
          this.setState({
            showArrow: false
          })
          this.getCourseList('load')
        }
      )
    } else {
      this.setState(
        {
          showArrowA: true,
          riseOrFall: 2,
          page: 1,
          activedA: false,
          isActivedA: false,
          actived: true,
          isActived: false,
          loading: true,
          learnList: []
        },
        () => {
          this.setState({
            showArrow: true
          })
          this.getCourseList('load')
        }
      )
    }
  }
  handleAddTime() {
    if (this.state.showArrowA) {
      this.setState(
        {
          showArrow: true,
          orderType: 2,
          page: 1,
          actived: false,
          riseOrFall: 1,
          isActived: false,
          activedA: false,
          isActivedA: true,
          loading: true,
          learnList: []
        },
        () => {
          this.setState({ showArrowA: false })
          this.getCourseList('load')
        }
      )
    } else {
      this.setState(
        {
          showArrow: true,
          actived: false,
          page: 1,
          riseOrFall: 2,
          isActived: false,
          activedA: true,
          isActivedA: false,
          loading: true,
          learnList: []
        },
        () => {
          this.setState({ showArrowA: true })
          this.getCourseList('load')
        }
      )
    }
  }
  goTolearn() {
    Taro.navigateTo({
      url: `/pages/courseList/index`
    })
  }
  handleShowMenu() {
    this.setState({
      showMenu: !this.state.showMenu
    })
  }
  //点击按钮目录
  handleToSelect(queryType) {
    console.log(queryType)
    this.setState(
      {
        page: 1,
        learnList: [],
        loading: true,
        queryType,
        menuIndex: queryType,
        showMenu: false
      },
      () => {
        this.getCourseList('load')
      }
    )
  }
  render() {
    const {
      learnList,
      loadBtn,
      menuList,
      viewHeight,
      showMenu,
      menuIndex,
      orderType,
      title
    } = this.state

    return (
      <View
        onClick={this.handleClose.bind(this)}
        className={styles.learn_container}
      >
        <View className={styles.learn_tabs}>
          <View
            onClick={this.handleLearnTime.bind(this)}
            className={`learn_tabs_item ${styles.leran_time}`}
          >
            <Text className={orderType === 1 ? `${styles.active}` : null}>
              按学习时间
            </Text>
            <Text
              className={
                this.state.actived == true
                  ? 'iconfont iconsanjiaojiantoushang' + ' ' + styles.active
                  : 'iconfont iconsanjiaojiantoushang'
              }
            />
            <Text
              className={
                this.state.isActived == true
                  ? 'iconfont icondown-copy' + ' ' + styles.active
                  : 'iconfont icondown-copy'
              }
            />
          </View>
          <View
            onClick={this.handleAddTime.bind(this)}
            className={`learn_tabs_item ${styles.leran_time}`}
          >
            <Text className={orderType === 2 ? `${styles.active}` : null}>
              按加入时间
            </Text>
            <Text
              className={
                this.state.activedA == true
                  ? 'iconfont iconsanjiaojiantoushang' + ' ' + styles.active
                  : 'iconfont iconsanjiaojiantoushang'
              }
            />
            <Text
              className={
                this.state.isActivedA == true
                  ? 'iconfont icondown-copy' + ' ' + styles.active
                  : 'iconfont icondown-copy'
              }
            />
          </View>
          <View
            onClick={() => this.handleShowMenu()}
            className={`learn_tabs_item ${styles.learn_icon}`}
          >
            <Text className={`iconfont ${styles.iconfenlei}`}>&#xe6b3;</Text>
          </View>
        </View>
        {showMenu && (
          <View className={styles.menuList}>
            {menuList.map((item, index) => {
              return (
                <View
                  key={index}
                  className={
                    item.queryType == menuIndex
                      ? `${styles.active} ${styles.menuItem}`
                      : `${styles.menuItem}`
                  }
                  onClick={() => this.handleToSelect(item.queryType)}
                >
                  {item.title}
                </View>
              )
            })}
          </View>
        )}
        {learnList && learnList.length > 0 && (
          <ScrollView
            className='scrollview'
            scrollTop='0'
            scrollY
            lowerThreshold='20'
            style={{ height: `${viewHeight}px` }}
            scrollWithAnimation
            onScrollToLower={this.onScrolltoupper}
          >
            <View className={styles.learn_list}>
              {learnList.map((item, index) => {
                return (
                  <View
                    onClick={this.props.onHandleClickToLearn.bind(this, item)}
                    className={styles.learn_item}
                    key={index}
                  >
                    <View className={styles.learn_list_img}>
                      <Image className={styles.item_img} src={item.coursePic} />
                    </View>
                    <View className={styles.learn_item_info}>
                      <View
                        className={
                          item.studyStatus === 5
                            ? `${styles.learn_item_info_title} frozen`
                            : `${styles.learn_item_info_title}`
                        }
                      >
                        {item.courseName}
                      </View>
                      <View className={styles.learn_item_info_bottom}>
                        {item.studyStatus === 1 && (
                          <View>
                            <Text>去学习</Text>
                            <Text className={styles.line}>丨</Text>
                            <Text>待学习</Text>
                          </View>
                        )}
                        {item.studyStatus === 2 && (
                          <View>
                            {item.watchRecordNum === item.totalRecordNum ? (
                              <Text>已学{item.watchRecordNum}课时</Text>
                            ) : (
                              <Text>
                                已学{item.watchRecordNum}/{item.totalRecordNum}
                                课时
                              </Text>
                            )}
                          </View>
                        )}
                        {item.studyStatus === 3 && (
                          <View>
                            {item.watchRecordNum === item.totalRecordNum ? (
                              <Text>已学{item.watchRecordNum}课时</Text>
                            ) : (
                              <Text>
                                已学{item.watchRecordNum}/{item.totalRecordNum}
                                课时
                              </Text>
                            )}
                            <Text className={styles.line}>丨</Text>
                            <Text>{item.dateValidity}天后过期</Text>
                          </View>
                        )}
                        {item.studyStatus === 4 && (
                          <View>
                            {item.watchRecordNum === item.totalRecordNum ? (
                              <Text>已学{item.watchRecordNum}课时</Text>
                            ) : (
                              <Text>
                                已学{item.watchRecordNum}/{item.totalRecordNum}
                                课时
                              </Text>
                            )}
                            <Text className={styles.line}>丨</Text>
                            <Text>已过期</Text>
                          </View>
                        )}
                        {item.studyStatus === 5 && (
                          <View>
                            {item.watchRecordNum === item.totalRecordNum ? (
                              <Text>已学{item.watchRecordNum}课时</Text>
                            ) : (
                              <Text>
                                已学{item.watchRecordNum}/{item.totalRecordNum}
                                课时
                              </Text>
                            )}
                            <Text className={styles.line}>丨</Text>
                            <Text>已冻结</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                )
              })}
              <View
                onClick={this.goTolearn.bind(this)}
                className={styles.add}
              />
            </View>
            {learnList.length >= 10 && <LoadMore loadMore={loadBtn} />}
          </ScrollView>
        )}
        {/* 无数据时 */}
        {(!learnList || (learnList && learnList.length === 0)) && (
          <EmptyList title={title} />
        )}
      </View>
    )
  }
}
export default Learn
