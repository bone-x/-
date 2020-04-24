import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Button } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtDrawer, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import Panel from '@/components/panel'
import PanelGroup from '@/components/panel_group'

import GlobalTabBar from '@/components/global-tabbar'
import Header from '@/components/HomeHeader'
import fetch from 'api/request'
import Interest from '@/components/Interest'
import styles from './index.module.scss'
import defaultPng from '@/assets/default-image.png'

// import classifyIconAll from '@/assets/icon_01.png'

// import icon_01 from '../../assets/icon_01.png'
// import icon_02 from '../../assets/icon_02.png'
// import icon_03 from '../../assets/icon_03.png'
// import icon_04 from '../../assets/icon_04.png'
// import icon_05 from '../../assets/icon_05.png'
// import icon_06 from '../../assets/icon_06.png'
// import icon_07 from '../../assets/icon_07.png'
// import icon_08 from '../../assets/icon_08.png'

// var img_dict = {
//   icon_01,
//   icon_02,
//   icon_03,
//   icon_04,
//   icon_05,
//   icon_06,
//   icon_07,
//   icon_08
// }

export default class Home extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor() {
    super(...arguments)

    this.state = {
      showPasswordMsg:false,
      iconList: [],
      categoryList: [],
      intersetList: [],
      selectedList: [],
      swiperList: [],
      goodLessonList: [],
      intersetLessonList: [],
      integralList: [],
      adviseCurrent: 0,
      isInterestOpened: false, //选择兴趣开关
      courseList: [],
      recommendationList: [],
      timeList: [],
      timeSelected: 1,
      groupList: []
    }
  }
  componentWillMount () {
    if(this.$router.params.noSetPassword){
      this.setState({
        showPasswordMsg:true
      })
    }

  }
  componentDidMount() {
    this.getPictureList()
    this.productCategory()
    this.getInterestList()
    this.getgoodLesson()
    this.getPointList()
    this.getRecommendation()
    this.getTimeList()
    this.getGroupList()
  }

  // navigateTo = (url) => {
  //   Taro.navigateTo({url})
  // }
  goSetPassword=()=>{
    let userInfo = Taro.getStorageSync('userInfo')
    if(userInfo.passwordStatus == 1){
      Taro.navigateTo({url: '/pages/setPassWord/index'});
    }else{
      Taro.navigateTo({url: '/personCenter/pages/personalCenter/changePassWord/index'});
    }
  }
  closeMsg=()=>{
    console.log("取消")
    this.setState({
      showPasswordMsg:false
    })
  }

  // swiper 点击跳转
  goToSwiper = url => {
    Taro.navigateTo({
      url: url
    })
  }

  // swiper 点击跳转
  goToDetails = course => {
    Taro.navigateTo({
      url: `/learnCenter/pages/courseDetail/index?id=${course.id}`
    })
  }

  //跳转列表
  goToSearch = () => {
    Taro.navigateTo({
      url: '/pages/courseList/index?keyword=&searchFocus=1'
    })
  }

  //回到首页
  gotoHome = () => {
    Taro.navigateTo({
      url: '/pages/home/index'
    })
  }

  //获取轮播图
  getPictureList = () => {
    // let {swiperList} = this.state;
    fetch('roundPictureList').then(res => {
      this.setState({
        swiperList: res.roundPicture
      })
    })
  }

  // 获取好课推荐
  getgoodLesson() {
    fetch('goodLesson').then(res => {
      this.setState({
        goodLessonList: res
      })
    })
  }

  //获取类目
  productCategory = () => {
    const { iconList, categoryList } = this.state
    let newList = iconList
    fetch('productCategory').then(res => {
      let iconList = new Array()
      for (let index = 0; index < res.length; index++) {
        let num = (index % 8) + 1
        iconList[index] = `http://hq-auth.oss-cn-shenzhen.aliyuncs.com/assets/icon_0${num}.png`
      }
      newList = newList.concat(iconList)

      this.setState(
        {
          iconList: newList,
          categoryList: [...categoryList, ...res]
        },
        res => {
          console.log(this.state.iconList)
        }
      )
    })
  }

  // 获取兴趣列表
  getInterestList() {
    let { intersetList, selectedList } = this.state
    intersetList = [{ title: '好课推荐', id: 1 }]
    selectedList = []
    // alert(Taro.getStorageSync("token"))
    if (Taro.getStorageSync('token')) {
      fetch('getInterestList', { token: Taro.getStorageSync('token') })
        .then(res => {
          if (res.intersetList != null) {
            res.intersetList.map(item => {
              let obj = {}
              obj['title'] = item.name
              obj['id'] = item.id
              intersetList.push(obj)
              selectedList.push(item.id)
            })
            this.setState({
              intersetList,
              selectedList
            })
          }
        })
        .catch(err => {
          // console.log(err)
          this.setState({
            intersetList,
            selectedList
          })
        })
    } else {
      this.setState({
        intersetList,
        selectedList
      })
    }
  }

  //积分兑换
  getPointList() {
    let { integralList } = this.state
    integralList = []
    fetch('fastestBuy', {
      pageNum: 1,
      pageSize: 4,
      type: 1
    }).then(res => {
      this.setState({
        integralList: [...res.list]
      })
    })
  }

  //拼团
  getGroupList() {
    let { groupList } = this.state
    groupList = []
    fetch('fastestBuy', {
      pageNum: 1,
      pageSize: 4,
      type: 4
    }).then(res => {
      this.setState({
        groupList: [...res.list]
      })
    })
  }

  // 商品推荐
  getRecommendation() {
    let { recommendationList } = this.state
    recommendationList = []
    fetch('getRecommendation').then(res => {
      this.setState(
        {
          recommendationList: [...res]
        },
        () => {
          // console.log(this.state)
        }
      )
    })
  }
  //兴趣
  getInterestLesson(index) {
    let { intersetList, intersetLessonList } = this.state
    intersetLessonList = []
    fetch('getGoodsByCategoryId', {
      goodsCategoryId: intersetList[index].id
    }).then(res => {
      if (res && res.length > 0) {
        this.setState({
          intersetLessonList: res
        })
      }
    })
  }

  //获取时间
  getTimeList() {
    let { timeList, timeSelected } = this.state
    timeList = []
    fetch('getTimeList').then(res => {
      res.list.map(ele => {
        if (ele.status === 2) {
          timeSelected = ele.value
        }
      })
      this.setState(
        {
          timeList: res.list,
          timeSelected
        },
        () => {
          this.getFastKill()
        }
      )
    })
  }
  TextOverHidden(txt, num) {
    return txt.length > num ? txt.slice(0, num) + '...' : txt
  }
  //更改秒杀时间段
  onChangeTime = value => {
    this.setState(
      {
        timeSelected: value
      },
      () => {
        this.getFastKill()
      }
    )
  }
  //限时秒杀
  getFastKill() {
    let { courseList, timeSelected } = this.state
    courseList = []
    fetch('fastestBuy', {
      pageNum: 1,
      pageSize: 4,
      type: 2,
      timeValue: timeSelected
    }).then(res => {
      this.setState({
        courseList: [...res.list]
      })
    })
  }

  //类目跳转
  categoryClick = item => {
    if (item != 'all') {
      Taro.navigateTo({
        url: `/pages/courseList/index?id=${item.id}`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/courseList/index`
      })
    }
  }
  // 好课推荐 切换
  handleAdviseClick = value => {
    this.setState({
      adviseCurrent: value
    })
    if (value != 0) {
      this.getInterestLesson(value)
    }
  }

  formatPrice = price => {
    if (typeof price != 'undefined' && typeof price != null) {
      return price == 0 ? '免费' : '￥ ' + price
    }
  }

  onError = index => {
    let { swiperList } = this.state
    swiperList[index].mobileUrl = defaultPng
    this.setState({
      swiperList
    })
  }

  onError1 = index => {
    let { goodLessonList } = this.state
    goodLessonList[index].mobileUrl = defaultPng
    this.setState({
      goodLessonList
    })
  }

  // 兴趣选择 开关
  onHandleInterestSwitch = () => {
    const { isInterestOpened } = this.state
    if (Taro.getStorageSync('token')) {
      this.setState(
        {
          isInterestOpened: !isInterestOpened
        },
        () => {
          this.getInterestList()
        }
      )
    } else {
      // Taro.showToast({
      //   title: '请先登录',
      //   icon: 'none',
      //   duration: 2000
      // })
      Taro.navigateTo({
        url: `/pages/loginPage/index`
      })
    }
  }

  onError = index => {
    let { swiperList } = this.state
    swiperList[index].imgUrl = defaultPng
  }

  render() {
    const {
      iconList,
      categoryList,
      intersetList,
      selectedList,
      swiperList,
      adviseCurrent,
      courseList,
      recommendationList,
      isInterestOpened,
      goodLessonList,
      intersetLessonList,
      integralList,
      timeList,
      timeSelected,
      groupList
    } = this.state

    let newList =
      intersetList && intersetList.length > 0
        ? intersetList
        : [{ title: '好课推荐', id: 1 }]
    return (
      <View className={styles.wrapBox}>
        <Header />
        <AtModal isOpened={this.state.showPasswordMsg} onConfirm={ this.goSetPassword }>
          <AtModalHeader>提示</AtModalHeader>
          <AtModalContent>
            登录成功，可前往<span className={styles.msgBoxSpan}>"我的>个人信息>密码管理"</span>设置登录密码
          </AtModalContent>
          <AtModalAction> <Button onClick={ this.closeMsg }>取消</Button> <Button onClick={ this.goSetPassword }>去设置</Button> </AtModalAction>
        </AtModal>
        {/* 轮播 */}
        <View className={styles.swiperBox}>
          <Swiper circular autoplay>
            {swiperList &&
              swiperList.length > 0 &&
              swiperList.map((item, index) => {
                return (
                  <SwiperItem key={index}>
                    <View
                      className={styles.swiperItem}
                      onClick={e => this.goToSwiper(item.jumpUrl, e)}
                    >
                      <Image
                        className={styles.imgBox}
                        mode="scaleToFill"
                        src={item.imgUrl || defaultPng}
                        onError={e => this.onError(index, e)}
                      />
                    </View>
                  </SwiperItem>
                )
              })}
          </Swiper>
        </View>

        {/* 分类 */}
        <View className={styles.classifyBox}>
          <View
            className={styles.classifyItem}
            onClick={e => this.categoryClick('all', e)}
          >
            <Image className="icon" mode="scaleToFill" src='http://hq-auth.oss-cn-shenzhen.aliyuncs.com/assets/icon_01.png' />
            <Text className="text">全部</Text>
          </View>
          {categoryList &&
            categoryList.length > 0 &&
            categoryList.map((item, index) => {
              return (
                <View
                  className={styles.classifyItem}
                  key={index}
                  onClick={e => this.categoryClick(item, e)}
                >
                  <Image
                    className="icon"
                    mode="scaleToFill"
                    src={iconList[index]}
                  />
                  <Text className="text">{item.name.substring(0, 4)}</Text>
                </View>
              )
            })}
        </View>

        {/* 好课推荐 */}
        <View className={styles.adviseBox}>
          <View
            className={styles.adviseNavIcon}
            onClick={this.onHandleInterestSwitch}
          >
            <View
              style={{ fontSize: '18px', color: '#666' }}
              className="iconfont iconfenlei"
            />
          </View>
          <AtTabs
            current={adviseCurrent}
            scroll
            tabList={newList}
            onClick={this.handleAdviseClick}
          >
            <AtTabsPane current={adviseCurrent} index={0}>
              <View className={styles.adviseContent}>
                {goodLessonList &&
                  goodLessonList.length > 0 &&
                  goodLessonList.map((goodItem, index) => (
                    <View
                      className={styles.adviseItem}
                      key={index}
                      onClick={() => this.goToDetails(goodItem)}
                    >
                      <Image
                        className={styles.adviseCover}
                        mode="scaleToFill"
                        src={goodItem.coverPicture || defaultPng}
                        onError={e => this.onError1(index, e)}
                      />
                      {/* <View className={styles.adviseTitle}>{goodItem.name}</View> */}
                      <View className={styles.adviseTitle}>
                        {this.TextOverHidden(goodItem.name, 20)}
                      </View>
                      <View className={styles.adviseInfo}>
                        <Text className={styles.adviseAuthor}>
                          {goodItem.teacherName}老师
                        </Text>
                        <Text className={styles.adviseRead}>
                          {goodItem.totalBuyCount}人学过
                        </Text>
                      </View>

                      <View className={styles.advisePriceBox}>
                        {goodItem.activiteType != 0 ? (
                          <View className="icon">
                            {goodItem.activiteTypeName}
                          </View>
                        ) : null}
                        {goodItem.activiteType == 0 ? (
                          <View className="price">
                            {this.formatPrice(goodItem.price)}
                          </View>
                        ) : goodItem.activiteType == 1 ? (
                          <View className="price">
                            {goodItem.activitePoint} 积分
                          </View>
                        ) : goodItem.activiteType == 2 ||
                          goodItem.activiteType == 3 ||
                          goodItem.activiteType == 4 ? (
                          <View className="price">
                            {this.formatPrice(goodItem.activitePrice)}
                          </View>
                        ) : null}
                        {goodItem.activiteType != 0 ? (
                          <Text className="price retail">
                            {this.formatPrice(goodItem.price)}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  ))}
              </View>
            </AtTabsPane>
            {selectedList &&
              selectedList.length > 0 &&
              selectedList.map((goodItem, index) => (
                <AtTabsPane
                  current={adviseCurrent}
                  index={index + 1}
                  key={index}
                >
                  <View className={styles.adviseContent}>
                    {intersetLessonList &&
                      intersetLessonList.length > 0 &&
                      intersetLessonList.map((iItem, iIndex) => (
                        <View
                          className={styles.adviseItem}
                          key={iIndex}
                          onClick={() => this.goToDetails(iItem)}
                        >
                          <Image
                            className={styles.adviseCover}
                            mode="scaleToFill"
                            src={iItem.coverPicture}
                          />
                          <View className={styles.adviseTitle}>
                            {iItem.name}
                          </View>
                          <View className={styles.adviseInfo}>
                            <Text className={styles.adviseAuthor}>
                              {iItem.teacherName}老师
                            </Text>
                            <Text className={styles.adviseRead}>
                              {iItem.totalBuyCount}人学过
                            </Text>
                          </View>

                          <View className={styles.advisePriceBox}>
                            {iItem.activiteType != 0 ? (
                              <View className="icon">
                                {iItem.activiteTypeName}
                              </View>
                            ) : null}
                            {iItem.activiteType == 0 ? (
                              <View className="price">
                                {this.formatPrice(iItem.price)}
                              </View>
                            ) : iItem.activiteType == 1 ? (
                              <View className="price">
                                {iItem.activitePoint} 积分
                              </View>
                            ) : iItem.activiteType == 2 ||
                              iItem.activiteType == 3 ? (
                              <View className="price">
                                {this.formatPrice(iItem.activitePrice)}
                              </View>
                            ) : null}
                            {iItem.activiteType != 0 ? (
                              <Text className="price retail">
                                {this.formatPrice(iItem.price)}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      ))}
                  </View>
                </AtTabsPane>
              ))}
          </AtTabs>
        </View>

        {/* 秒杀 */}
        <View className={styles.fastClickBox}>
          <Panel
            courseList={courseList}
            isMove="true"
            title="限时秒杀"
            timeList={timeList}
            timeSelected={timeSelected}
            onChangeTime={this.onChangeTime}
            eventType="2"
          />
        </View>

        {/* 积分 */}
        <View className={styles.pointBox}>
          <Panel
            courseList={integralList}
            isMove="true"
            title="积分兑换"
            eventType="1"
          />
        </View>

        {/* 拼团 */}
        <View className={styles.pointBox}>
            <PanelGroup courseList={groupList} isMove='true' title='拼团' eventType='4'></PanelGroup>
        </View> 

        {/* 商品推荐 */}
        {recommendationList.map((item, index) => (
          <View className={styles.recommendationBox} key={index}>
            <Panel
              courseList={item.goodsList}
              isMove="false"
              title={item.title}
              categoryId={item.categoryId}
            />
          </View>
        ))}

        {/* 选择兴趣 */}
        <AtDrawer show={isInterestOpened} right width={'100%'} mask>
          <View className={styles.interestBox}>
            <Interest
              onClose={this.onHandleInterestSwitch}
              categoryList={categoryList}
              selectedList={selectedList}
            />
          </View>
        </AtDrawer>

        <GlobalTabBar current={0} />
      </View>
    )
  }
}
