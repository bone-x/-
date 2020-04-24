import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

export default class LoadMore extends Component {
  constructor() {
    super()
    this.state = {
      text: '亲，我是有底线的'
    }
  }
  render() {
    const { text } = this.state
    return(
      <View className={styles.loadMore}>
        <Text>{text}</Text>
      </View>
    )
  }
}