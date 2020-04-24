import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import Loading from '@/components/loading'

import styles from './index.module.scss'


@connect(state => state.counter, {add, minus, asyncAdd})
class ConfirmOrder extends Component {

  config = {
    navigationBarTitleText: 'ConfirmOrder'
  }

  state = {
    loading: true
  }

  // 慎用
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    console.log(Taro.getEnv())
    console.log(Taro.ENV_TYPE)
  }
  render () {


    return (
      <View className={styles.demo}>
        <Text>ConfirmOrder page</Text>
      </View>
    )
  }
}

export default ConfirmOrder
