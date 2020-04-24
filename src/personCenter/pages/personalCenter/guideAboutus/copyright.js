import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import fetch from '@/api/request.js'

import styles from './withUs.module.scss'
import '../staticPic/icon.scss'

// import { isNativeApp, JsBridge } from '@/utils/JsBridge';

class Copyright extends Component {

  config = {
    navigationBarTitleText: '版权说明'
  }
  state = {
    loading: true,
    nodes: '<div style="font-size:12px;">1、凡本网站注明“来源:行家”的所有作品，均为本网站合法拥有版权的作品，未经本网站授权，任何媒体、网站、个人不得转载、链接、转帖或以其他方式使2、经本网站合法授权的，应在授权范围内使用，且使用时必须注明“来源行家”，并不得对作品中出现的“行家”字样进行删减、替换等。违反上述声明者，本网站将依法追究其法律责任。3、本网站的部分资料转载自互联网，均尽力标明作者和出处。本网站转载的目的在于传递更多信息，并不意味着赞同其观点或证实其描述，本网站不对其真实性负责。4、如您认为本网站刊载作品涉及版权等问题，请与本网站联系(邮箱，电话：)，本网站核实确认后会尽快予以处理。。</div>'
  }
  // 慎用
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  // componentDidMount() {
  //   JsBridge(null, {
  //     "code": 200,
  //     "message": "OK",
  //     "path": "title",
  //     "data": {
  //       "title": "版权说明"
  //     }
  //   })
  //   let timer = setTimeout(_ => {
  //     this.setState({loading: false})
  //     clearTimeout(timer)
  //   }, 1000)
  //   this.getList()
  // }
  
goBackClick() {
  Taro.navigateBack({ delta: 1 })
  console.log(1111)
}

  // 获取list
  getList () {
    fetch('getServiceProList', {
      // 请求的参数
    }).then((res) => {
      console.log(res)
      this.setState({
        nodes:res.content
      })
    })
  }
  render () {
    return (
      <View className={styles.content}>
        <View style='margin:0px 21px 0 18px;font-size:14px;'>
          <RichText className={styles.richtext} nodes={this.state.nodes} />
        </View>
        {/* <View className={styles.btnBot}>已阅读并且同意协议内容</View> */}
      </View>
    )
  }
}

export default Copyright
