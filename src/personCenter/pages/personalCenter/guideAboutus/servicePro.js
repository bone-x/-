import Taro, { Component } from '@tarojs/taro'
import { View, RichText, Text} from '@tarojs/components'
import fetch from '@/api/request.js'
import styles from './withUs.module.scss'
import '../staticPic/icon.scss'
// import { isNativeApp, JsBridge } from '@/utils/JsBridge';

class ServicePro extends Component {

  config = {
    navigationBarTitleText: '服务协议'
  }

  state = {
    loading: true,
    nodes: ''
  }

  // 慎用
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    this.getList();
  }
  
  goBackClick() {
    Taro.navigateBack({ delta: 1 })
  }
  // 获取list
  getList () {
    fetch('getWithUsList', {
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
      </View>
    )
  }
}

export default ServicePro
