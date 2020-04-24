import Taro, { Component } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import Loading from '@/components/loading'
// import { isNativeApp, JsBridge } from '@/utils/JsBridge';
import styles from './aboutUs.module.scss'
import '../staticPic/icon.scss'


class AboutUs extends Component {
  config = {
    navigationBarTitleText: '关于我们'
  }

  state = {
    loading: true
  }

  // 慎用
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  // componentDidMount() {
  //   JsBridge(null, {
  //     "code": 200,
  //     "message": "OK",
  //     "path": "title",
  //     "data": {
  //       "title": "关于我们"
  //     }
  //   })
  //   let timer = setTimeout(_ => {
  //     this.setState({ loading: false })
  //     clearTimeout(timer)
  //   }, 1000)
  // }

  aboutUsClick() {
    Taro.navigateTo({
      url: "/personCenter/pages/personalCenter/guideAboutus/withUs"
    })
  }
  concatUsClick() {
    Taro.navigateTo({
      url: "/personCenter/pages/personalCenter/guideAboutus/concatUs"
    })
  }
  serviceProClick() {
    Taro.navigateTo({
      url: "/personCenter/pages/personalCenter/guideAboutus/servicePro"
    })
  }
  versionClick() {
    Taro.navigateTo({
      url: "/personCenter/pages/personalCenter/guideAboutus/copyright"
    })
  }
  gotoRule() {
    // 回退
    Taro.navigateBack({ delta: 1 })
  }

  render() {

    return (
      <View className={styles.aboutus}>
          {/* <View className={styles.abus} onClick={this.gotoRule.bind(this)}>
            <Text
              className="iconfont icon-left"
              style={{ position: 'absolute', left: '21px', fontSize: '15px' }}
            />
            关于我们
          </View> */}
        <View className={styles.title} onClick={this.aboutUsClick.bind(this)}>
          关于我们
          <Text className="iconfont icon-right" style={{ float: "right" }} />
        </View>
        <View className={styles.line} onClick={this.concatUsClick.bind(this)}>
          联系我们
          <Text className="iconfont icon-right" style={{ float: "right" }} />
        </View>
        <View
          className={styles.title}
          onClick={this.serviceProClick.bind(this)}
        >
          服务协议
          <Text className="iconfont icon-right" style={{ float: "right" }} />
        </View>
        <View className={styles.title} onClick={this.versionClick.bind(this)}>
          版权说明
          <Text className="iconfont icon-right" style={{ float: "right" }} />
        </View>
      </View>
    )
  }
}

export default AboutUs
