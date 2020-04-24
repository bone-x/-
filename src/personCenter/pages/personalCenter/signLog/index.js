import Taro, { Component } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import fetch from '@/api/request.js'
import styles from './index.module.scss'
import { JsBridge } from '@/utils/JsBridge'
import URI from 'urijs'


class serviceContract extends Component {
  config = {
    navigationBarTitleText: '行家服务协议'
  }

  state = {
    nodes: ''
  }

  // 慎用
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    this.getList()
    JsBridge(null, {
      "code": 200,
      "message": "OK",
      "path": "title",
      "data": {
        "title": "行家服务协议"
      }
    })
  }

  defaultProps = {
    mark: ""
  }

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

  agreeBtnClick = () => {
    // 跟原生APP交互

    JsBridge(null, {
      data: {
        agree: true,
      },
      path: 'protocol',
      message: '同意协议',
      // code: data.code || statusCode,
      code: 200,
    })
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      let target = new URI('/pages/register/index')
      let uri = new URI(window.location.href)
      uri.addSearch('isAgree', true)
      let query = uri.query()
      Taro.navigateTo({ url: target.query(query).toString() })
    } else {
      Taro.navigateTo({
        url: '/pages/register/index?isAgree=true'
      })
    }
    // Taro.navigateBack({ delta: 1 })
  }
  render () {


    return (
      <View className={styles.details}>
        <RichText className={styles.richtext}  nodes={this.state.nodes} />
        <View
          className={styles.checktxt}
          onClick={this.agreeBtnClick}
        >已阅读，并且同意协议内容</View>
      </View>
    )
  }
}

export default serviceContract
