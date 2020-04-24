import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import styles from './index.module.scss'

export default class Loading extends Component {
  render () {
    return (
      <View className={styles.loading}>
        <Image src={require('./loading.gif')} className={styles.loadingImage} />
      </View>
    )
  }
}
