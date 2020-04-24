import Taro, { Component } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
// import {getDemoList} from 'api/demo'
import Loading from '@/components/loading'

import styles from './checkAgreement.module.scss'



@connect(state => state.counter, {add, minus, asyncAdd})
class checkAgreement extends Component {
  config = {
    navigationBarTitleText: '行家-服务协议'
  }

  state = {
    loading: true,
    nodes: '<div style="font-size:14px;">欢迎使用行欢迎使用行家，为了保障您的权益，请在使用行家服务之前，详细阅读此服务协议（以下简称“本协议”）所有内容，特别是加粗部分。本协议内容包括协议正文、本协议下述协议明确援引的其他协议、上海恒企教育培训有限公司（以下简称“恒企”）已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。除另行明确声明外，您使用行家服务均受本协议约束。家，为了保障您的权益，请在使用行家服务之前，详细阅读此服务协议（以下简称“本协议”）所有内容，特别是加粗部分。本协议内容包括协议正文、本协议下述协议明确援引的其他协议、上海恒企教育培训有限公司（以下简称“恒企”）已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。欢迎使用行欢迎使用行家，为了保障您的权益，请在使用行家服务之前，详细阅读此服务协议（以下简称“本协议”）所有内容，特别是加粗部分。本协议内容包括协议正文、本协议下述协议明确援引的其他协议、上海恒企教育培训有限公司（以下简称“恒企”）已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。除另行明确声明外，您使用行家服务均受本协议约束。家，为了保障您的权益，请在使用行家服务之前，详细阅读此服务协议（以下简称“本协议”）所有内容，特别是加粗部分。本协议内容包括协议正文、本协议下述协议明确援引的其他协议、上海恒企教育培训有限公司（以下简称“恒企”）已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。除另行明确声明外，您使用行家服务均受本协议约束。除另行明确声明外，您使用行家服务均受本协议约束。</div>'
  }

  // 慎用
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    console.log(Taro.getEnv())
    console.log(Taro.ENV_TYPE)
  }

  defaultProps = {
    mark: ""
}


  render () {



    return (
      <View className={styles.details}>
        <RichText className={styles.richtext}  nodes={this.state.nodes} />
        <View className={styles.checktxt}>已阅读，并且同意协议内容</View>
      </View>
    )
  }
}

export default checkAgreement
