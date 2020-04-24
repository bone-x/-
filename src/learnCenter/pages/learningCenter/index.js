import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtModal } from 'taro-ui'
import styles from './index.module.scss'
import Learn from '@/components/learningCenter/learn'
import Collect from '@/components/learningCenter/collect'
import Loading from '@/components/loading'
import GlobalTabBar from '@/components/global-tabbar'
import fetch from '@/api/request.js'
import URI from 'urijs'

class LearningCenter extends Component {
  // static options = {
  //   addGlobalClass: true
  // }
  constructor(props) {
    super(props)
    this.state = {
      showModel: false,
      loading: true,
      current: 0
    }
  }
  config = {
    navigationBarTitleText: '学习中心首页'
  }
  componentWillReceiveProps(nextProps) {
    //  console.log(this.props, nextProps)
  }
  componentWillMount() {
    // const token = Taro.getStorageSync('token')
    // if (!token) {
    //   console.count(1111)
    //   this.toLogin()
    // }
  }
  componentDidMount() {}
  componentWillUnmount() {}
  onRef = ref => {
    this.child = ref
  }
  componentDidShow() {
    // console.log('哈哈哈哈哈')
    if (this.child) {
      // this.child.getCourseList()
      this.child.getCollectionList('load')
    }
  }
  // toLogin() {
  //   if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  //     Taro.navigateTo({ url: '/pages/bindPhone/index' })
  //   } else {
  //     Taro.navigateTo({ url: '/pages/loginPage/index' })
  //   }
  // }
  componentDidHide() {}

  handleChangeTab(value) {
    this.setState({
      current: value
    })
  }
  handleClose() {
    this.setState({
      showModel: false
    })
  }
  handleCancel() {
    this.setState({
      showModel: false
    })
  }
  handleConfirm() {
    NTKF.im_openInPageChat('kf_10526_1559533453417')
  }
  //获取recordId
  getRecordId(item) {
    return fetch('getRecordId', item)
      .then(res => {
        console.log(res.recordId)
        return res
      })
      .catch(error => {
        console.log(error)
      })
  }
  handleClickToLearn = item => {
    console.log(item.studyStatus)
    if (item.studyStatus === 4) {
      Taro.navigateTo({
        url: `/learnCenter/pages/courseDetail/index?id=${item.hjGoodId}`
      })
      return false
    }
    if (item.studyStatus === 5) {
      this.setState({
        showModel: true
      })
    } else {
      this.getRecordId(item).then(res => {
        console.log(res, 'res')
        const recordId = res.recordId
        fetch('toRecord', {
          recordId
        })
          .then(res => {
            var uri = new URI(res.recordUrl)
            uri.addSearch('cover', item.coursePic)
            uri.addSearch('id', item.hjGoodId)
            uri.addSearch('orderId', item.orderId)
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
    }
  }
  render() {
    const { showModel } = this.state
    const tabList = [{ title: '学习' }, { title: '收藏' }]

    return (
      <View className={styles.learningCenter}>
        <AtTabs
          scroll
          swipeable={false}
          animated={false}
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleChangeTab.bind(this)}
        >
          <AtTabsPane current={this.state.current} index={0}>
            <Learn
              // onRef={this.onRef}
              onHandleClickToLearn={this.handleClickToLearn}
            />
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <Collect onRef={this.onRef} />
          </AtTabsPane>
        </AtTabs>
        <GlobalTabBar current={1} />
        <AtModal
          isOpened={showModel}
          title="提示"
          cancelText="取消"
          confirmText="咨询客服"
          onClose={this.handleClose.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          onConfirm={this.handleConfirm.bind(this)}
          content="当前课程无学习权限详情请咨询客服"
        />
      </View>
    )
  }
}
export default LearningCenter
