import Taro, { Component } from '@tarojs/taro'
import { View, Text, Video, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import { AtToast, AtActionSheet, AtLoadMore, AtButton } from 'taro-ui'
import URI from 'urijs'
import fetch from 'api/request'
import Loading from '@/components/loading'
import userListCard from '@/assets/useListenCard.png'
import pastListenCard from '@/assets/pastListenCard.png'
import defaultImage from '@/assets/default-image.png'
import card from '@/assets/card.png'
import TabComponent from '@/components/courseDetail/tab/index'
import NoComments from '@/components/courseDetail/noComments/index'

import './index.scss'

const useStyle = {
  background: `url(${userListCard})`,
  backgroundSize: `100% 100% `
}

const pastStyle = {
  background: `url(${pastListenCard})`,
  backgroundSize: `100% 100% `
}

@connect(
  state => state.counter,
  {
    add,
    minus,
    asyncAdd
  }
)
class CourseDetail extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      listLoadding: true,
      open: false,
      activeOpen: false,
      existCollection: null,
      goodsDetail: {},
      toastList: {},
      orderId: '',
      recordUrl: '',
      useListenCardList: [],
      listenCard: false,
      pageSize: 10,
      pageNum: 1,
      allCard: [],
      status: 'noMore',
      isCardList: '',
      btnLoadding: false,
      groupLoadding: false,
      // 立即学习和立即拼团goto为3时, noGoods为2，让页面展示暂无商品
      noGoods: 1
    }
  }

  static options = {
    addGlobalClass: true
  }

  config = {
    navigationBarTitleText: '商品详情页'
  }

  // 慎用
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidUpdate() {
    if (this.state.open == true) {
      let studyTimer = setTimeout(() => {
        this.setState({
          open: false
        })
        clearTimeout(studyTimer)
        var uri = new URI(this.state.recordUrl)
        uri.addSearch('cover', this.state.goodsDetail.coverPicture)
        uri.addSearch('id', this.$router.params.id)
        uri.addSearch('orderId', this.state.orderId)
        let query = uri.query()
        let target = new URI('/learnCenter/pages/learningCenterDetail/index')
        Taro.navigateTo({
          url: target.query(query).toString()
        })
      }, 3000)
    }
  }

  componentDidMount() {
    // 判断是否收藏改商品
    this.getExist(this.$router.params.id)
    this.getCourseDetail(this.$router.params.id)
    this.getListenCardCount(this.$router.params.id)
  }

  // 判断该商品是否已收藏
  getExist(params) {
    const token = Taro.getStorageSync('token')
    if (token == '') {
      return false
    }
    fetch('getExistCollection', { goodsId: params })
      .then(res => {
        this.setState({ existCollection: res.existCollection })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getCourseDetail(params) {
    fetch('getGoodsDetail', { goodsId: params })
      .then(res => {
        if (res) {
          this.setState({ goodsDetail: res })
        } else {
          return false
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // 播放视频
  play() {
    if (process.env.TARO_ENV === 'weapp') {
      const video = Taro.createVideoContext('video')
      video.play()
    } else if (process.env.TARO_ENV === 'h5') {
      // let videoH5 = this.videoDom
    }
  }

  // 收藏
  collectClick() {
    const token = Taro.getStorageSync('token')
    if (token == '') {
      Taro.navigateTo({
        url: '/pages/loginPage/index'
      })
      return false
    }
    let operateType
    if (this.state.existCollection) {
      // 取消收藏
      operateType = 2
    } else {
      // 收藏
      operateType = 1
    }
    let data = {
      goodsId: this.$router.params.id,
      operateType: operateType
    }

    fetch('AddOrCancelCollection', data)
      .then(res => {
        console.log(res)
        this.setState({
          toastList: {},
          existCollection: !this.state.existCollection,
          listenCard: false
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  // 获取听课卡列表
  getListenCard(param) {
    fetch('getListenCardList', param)
      .then(re => {
        if (re) {
          param.pageNum++
          if (re.list.length < param.pageSize) {
            this.setState(
              {
                useListenCardList: this.state.useListenCardList.concat(re.list),
                allCard: re.list,
                pageNum: param.pageNum,
                status: 'noMore',
                btnLoadding: false,
                listenCard: true
              },
              () => {
                this.getUseProps(this.state.useListenCardList)
              }
            )
          } else {
            this.setState(
              {
                useListenCardList: this.state.useListenCardList.concat(re.list),
                allCard: re.list,
                pageNum: param.pageNum,
                status: 'more',
                btnLoadding: false,
                listenCard: true
              },
              () => {
                this.getUseProps(this.state.useListenCardList)
              }
            )
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // 取消听课卡 直接跳到确认订单，如果有听课卡的话就不会是免费而且肯定是没购买的
  onClose() {
    this.setState({ listenCard: false })
    Taro.navigateTo({
      url: `/pages/SureOrder/index?id=${this.$router.params.id}`
    })
  }

  // 立即学习 如果有听课卡的话让选择听课卡，如果不选就走之前的流程
  toStudy() {
    if (this.state.goodsDetail.issueStatus == 0) {
      return false
    }
    this.setState({ btnLoadding: true })
    fetch('goToStudy', { goodsId: this.$router.params.id }).then(res => {
      // goto  1跳学习中心 2跳确认订单 4打开听课卡 5保存听课卡
      if (res.goto == 1) {
        fetch('getRecordId', res).then(res2 => {
          if (res2) {
            fetch('toRecord', { recordId: res2.recordId }).then(res3 => {
              this.setState({
                toastList: {},
                open: true,
                orderId: res.orderId,
                recordUrl: res3.recordUrl,
                btnLoadding: false
              })
            })
          }
        })
      } else if (res.goto == 2) {
        this.setState({ btnLoadding: false })
        Taro.navigateTo({
          url: `/pages/SureOrder/index?id=${this.$router.params.id}`
        })
      } else if (res.goto == 3) {
        this.setState({ noGoods: 2, btnLoadding: false })
      } else if (res.goto == 4) {
        // 如果有听课卡的话，展示听课卡列表，如果激活听课卡的话，再保存听课卡
        let param = {
          activeStatus: 1,
          pageNum: this.state.pageNum,
          pageSize: this.state.pageSize,
          goodsId: this.$router.params.id,
          token: Taro.getStorageSync('token')
        }
        if (param.token) {
          this.getListenCard(param)
        }
      } else if (res.goto == 5) {
        this.getSaveCard(res.courseCardId)
      }
    })
  }

  // 拼团按钮
  toShareOffered() {
    this.setState({ groupLoadding: true })
    let offered = {
      goodsId: this.$router.params.id,
      groupId: this.state.goodsDetail.activiteId,
      clientType: 'h5'
    }
    fetch('getShareOffered', {}, offered)
      .then(res => {
        // goto 1跳转到学习中心详情 2直接跳转到提交订单 3.商品不存在跳错误页面 4.弹窗听课卡列表，跟立即学习流程一样 5.保存听课卡，暂时先跳转至学习中心
        if (res.goto == 1) {
          this.goToLearnCenter(res)
        } else if (res.goto == 2) {
          fetch('getSaveOrderByGroup', {}, offered).then(res1 => {
            this.setState({ groupLoadding: false })
            Taro.navigateTo({
              url: `/pages/payment/submit-order/index?offered=true&orderId=${
                res1.pmOrderSaveVo.orderId
              }&id=${this.$router.params.id}`
            })
          })
        } else if (res.goto == 3) {
          // 暂时展示商品不存在吧
          this.setState({ noGoods: 2, groupLoadding: false })
          this.setState({})
        } else if (res.goto == 4) {
          let cardParam = {
            activeStatus: 1,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            goodsId: this.$router.params.id,
            token: Taro.getStorageSync('token')
          }
          if (cardParam.token) {
            this.getListenCard(cardParam)
          }
        } else if (res.goto == 5) {
          this.getSaveCard(res.courseCardId)
        } else if (res.goto == -1) {
          this.setState({ groupLoadding: false })
          let groupToast = {
            text: '拼团失败',
            icon: 'check-circle',
            isOpened: true
          }
          this.setState({ toastList: groupToast, groupLoadding: false })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // 加入购物车
  toCar() {
    let toast
    fetch('getToCartSave', {
      goodsId: this.$router.params.id,
      courseId: this.state.goodsDetail.courseId
    })
      .then(res => {
        if (res == 1) {
          toast = {
            text: '加入购物车',
            icon: 'check-circle',
            isOpened: true
          }
          this.setState({ toastList: toast })
        } else if (res == 2) {
          toast = {
            text: '购物车已存在',
            icon: 'alert-circle',
            isOpened: true
          }
          this.setState({ toastList: toast })
        } else if (res == 0) {
          toast = {
            text: '暂无该商品',
            icon: 'alert-circle',
            isOpened: true
          }
          this.setState({ toastList: toast })
        } else if (res == 3) {
          toast = {
            text: '此商品已购买，且商品还在有效期！',
            icon: 'alert-circle',
            isOpened: true
          }
          this.setState({ toastList: toast })
        } else {
          this.setState({ activeOpen: true })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  verifyBtn() {
    this.setState({ activeOpen: false })
  }

  cancelBtn() {
    this.setState({ activeOpen: false })
  }

  NTKF_kf() {
    NTKF.im_openInPageChat('kf_10526_1559533453417')
  }

  // 跳转到学习中心详情
  goToLearnCenter(goto) {
    this.setState({ btnLoadding: false, groupLoadding: false })
    fetch('getRecordId', goto)
      .then(res1 => {
        if (res1) {
          fetch('toRecord', { recordId: res1.recordId }).then(res2 => {
            let uri = new URI(res2.recordUrl)
            uri.addSearch('cover', res1.pic)
            uri.addSearch('id', this.$router.params.id)
            uri.addSearch('orderId', res2.orderId)
            let query = uri.query()
            let target = new URI(
              '/learnCenter/pages/learningCenterDetail/index'
            )
            Taro.navigateTo({
              url: target.query(query).toString()
            })
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // 保存听课卡 保存后暂时先跳学习中心
  getSaveCard(courseCardId) {
    let offered = {
      goodsId: this.$router.params.id,
      // groupId: this.state.goodsDetail.activiteId,
      courseCardId: courseCardId
      // clientType: 'h5'
    }
    fetch('getSaveListenCard', {}, offered)
      .then(res => {
        if (res.goto == 1) {
          this.goToLearnCenter(res)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // 激活听课卡
  getActiveCard(v) {
    let activeParams = {
      token: Taro.getStorageSync('token'),
      courseStudentId: v.courseStudentId,
      courseCardId: v.courseCardId
    }
    fetch('getActiveCourseStudentCard', activeParams)
      .then(res => {
        // 激活听课卡后走订单流程
        if (res) {
          this.getSaveCard(v.courseCardId)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // 处理听课卡数据
  getUseProps(params) {
    params.map(v => {
      if (v.activeStatus !== 2) {
        v.effectiveTimeEnd = this.format(v.effectiveTimeEnd)
      } else {
        // 有效时间 + 激活时间 - 服务器时间 = 剩余可用时间
        let activeTime = new Date(v.activeTime.replace(/-/g, '/'))
        let sysDateTime = new Date(v.sysDate.replace(/-/g, '/'))
        let dataDiff =
          v.avaibilePeriod * 24 * 60 * 60 * 1000 +
          activeTime.getTime() -
          sysDateTime.getTime()
        let day, hour, minute
        if (dataDiff > 0) {
          day = Math.floor(dataDiff / (60 * 60 * 24))
          hour = Math.floor(dataDiff / (60 * 60)) - day * 24
          minute = Math.floor(dataDiff / 60) - day * 24 * 60 - hour * 60
          v.timer = `剩余${day}天${hour}小时${minute}分`
        }
      }
      this.setState({ useListenCardList: params })
    })
  }

  add(m) {
    return m < 10 ? '0' + m : m
  }

  // 时间转换
  format(sjc) {
    //sjc是整数，否则要parseInt转换
    let timeStamp = sjc.replace(/-/g, '/')
    let time = new Date(timeStamp)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()

    return y + '-' + this.add(m) + '-' + this.add(d)
  }

  // 滚动听课卡
  scrollListCard() {
    if (this.state.allCard.length == this.state.pageSize) {
      this.setState({
        status: 'loading'
      })
    } else {
      return false
    }
    let data = {
      activeStatus: 1,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      goodsId: this.$router.params.id,
      token: Taro.getStorageSync('token')
    }
    this.getListenCard(data)
  }

  // 获取听课卡各状态的列表数
  getListenCardCount(id) {
    if (!Taro.getStorageSync('token')) {
      return false
    }
    fetch('getListenCountByParams', {
      goodsId: id,
      token: Taro.getStorageSync('token')
    }).then(res => {
      this.setState({ isCardList: res.canUseCount + res.onActiveCount })
    })
  }

  render() {
    const goods = this.$router.params.id
    const { goodsDetail, toastList, useListenCardList, isCardList } = this.state

    return (
      <View>
        {goodsDetail.issueStatus == 0 ||
        goodsDetail.issueStatus == 1 ||
        this.state.noGoods == 2 ? (
          <View className="courseDetail">
            <View className="detailsTop">
              {goodsDetail.videoUrl ? (
                <View className="videoBox">
                  <Video
                    className="video"
                    controls
                    src={goodsDetail.videoUrl}
                  />
                </View>
              ) : (
                <Image className="img" src={goodsDetail.coverPicture?goodsDetail.coverPicture:defaultImage} />
              )}
              <View
                style={isCardList > 0 ? '' : 'display:none'}
                className="cardImgBox"
              >
                <Image className="cardImg" src={card} />
              </View>
              <Text
                onClick={this.collectClick.bind(this)}
                className={`iconfont iconshoucang ${
                  this.state.existCollection ? 'collectIconRed' : 'collectIcon'
                }`}
              />
            </View>
            {/* 选项卡 */}
            <View className="goodsTab">
              <TabComponent
                event={this.scrolltolower}
                goodsDetail={[goodsDetail, goods]}
              />
            </View>
            {/* 底部固定栏 */}
            <View className="bottBar">
              <View
                className="bottBarCounsel"
                onClick={this.NTKF_kf.bind(this)}
              >
                <Text className="iconfont iconxiaoxi counselIcon" />
                <Text className="bottBarCounselText"> 咨询 </Text>
              </View>
              {goodsDetail.activiteType == 4 ? (
                <View
                  className="groupBtnBox"
                  onClick={this.toShareOffered.bind(this)}
                >
                  <AtButton loading={this.state.groupLoadding} type="primary">
                    <Text>
                      拼团价￥{goodsDetail.activitePrice}
                      <Text className="groupyj">￥{goodsDetail.price}</Text>
                    </Text>
                  </AtButton>
                </View>
              ) : (
                <View className="noGroup">
                  <View className="bottCarBtn" onClick={this.toCar.bind(this)}>
                    <Text> 加入购物车</Text>
                  </View>
                  <View
                    className={
                      this.state.goodsDetail.issueStatus == 1
                        ? 'bottBarBtn'
                        : 'soldOut'
                    }
                    onClick={this.toStudy.bind(this)}
                  >
                    {/* <Text> {this.state.goodsDetail.issueStatus == 1? '立即学习': '该商品已下架'}</Text> */}
                    <AtButton loading={this.state.btnLoadding} type="primary">
                      {this.state.goodsDetail.issueStatus == 1
                        ? '立即学习'
                        : '该商品已下架'}
                    </AtButton>
                  </View>
                </View>
              )}
            </View>
            {/* 学习提示 */}
            <View
              className="studyBox"
              style={this.state.open ? 'display: flex' : 'display: none'}
            >
              <Loading />
            </View>
            {/* 活动价格提示 */}
            <View
              className="activePrice"
              style={this.state.activeOpen ? 'display: block' : 'display: none'}
            >
              <View className="activePriceBox">
                <View className="activePriceBoxTop">
                  <Text>提示</Text>
                </View>
                <View className="activePriceBoxMid">
                  <Text>活动尚未开始，暂不享受活动价格</Text>
                </View>
                <View className="activePriceBoxBot">
                  <Text
                    className="activeQx"
                    onClick={this.cancelBtn.bind(this)}
                  >
                    取消
                  </Text>
                  <Text
                    className="activeQr"
                    onClick={this.verifyBtn.bind(this)}
                  >
                    确定
                  </Text>
                </View>
              </View>
            </View>
            {/* 收藏提示 */}
            <AtToast
              isOpened={toastList.isOpened}
              text={toastList.text}
              duration={3000}
              icon={toastList.icon}
            />
            {/* 听课卡 */}
            <AtActionSheet
              onCancel={this.onClose.bind(this)}
              isOpened={this.state.listenCard}
              cancelText="取消"
              title="可用听课卡"
            >
              <ScrollView
                className="scrollview"
                scrollY
                scrollWithAnimation
                scrollTop="0"
                style="height: 300px;"
                lowerThreshold="20"
                onScrollToLower={this.scrollListCard.bind(this)}
              >
                <View className="allListenCard">
                  {useListenCardList.map(v => {
                    return (
                      <View className="item" key={v.courseCardId}>
                        <View
                          className="itemLeft"
                          style={v.activeStatus === 2 ? pastStyle : useStyle}
                        >
                          <View className="endTimeBox">
                            <Text className="endTime">
                              {v.activeStatus == 2
                                ? v.timer
                                : `有效期至${v.effectiveTimeEnd}`}
                            </Text>
                          </View>
                        </View>
                        <View className="itemRight">
                          <Text className="listenCardName">{v.cardName}</Text>
                          <View className="listenCardPar">
                            <View className="parScope">
                              <Text className="parName">价格范围</Text>
                              <Text
                                className={
                                  v.activeStatus === 3 ||
                                  v.activeStatus === 4 ||
                                  v.activeStatus === 5
                                    ? 'parPast'
                                    : 'par'
                                }
                              >
                                {`${v.priceRangeLow}-${v.priceRangeHigh}`}
                                <Text className="yuan">元</Text>
                              </Text>
                            </View>
                            <View
                              className="listenCardStatusBox"
                              onClick={this.getActiveCard.bind(this, v)}
                            >
                              <View className="listenCardStatusBox">
                                <Text
                                  className={[
                                    'listenCardStatus',
                                    v.activeStatus === 1
                                      ? 'listenCardUse'
                                      : v.activeStatus === 2
                                      ? 'listenCardActive'
                                      : 'listenCardPast'
                                  ]}
                                >
                                  {v.activeStatus === 1
                                    ? '激活'
                                    : v.activeStatus === 2
                                    ? '已激活'
                                    : v.activeStatus === 3
                                    ? '已过期'
                                    : v.activeStatus === 4
                                    ? '已使用'
                                    : '已失效'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </View>
                <AtLoadMore
                  status={this.state.status}
                  noMoreText="哎呀，没有内容啦"
                />
              </ScrollView>
            </AtActionSheet>
          </View>
        ) : (
          <NoComments pageText="商品不存在" />
        )}
      </View>
    )
  }
}

export default CourseDetail
