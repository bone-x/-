import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import styles from './index.module.scss'

export default class NoListenCard extends Component {
  constructor() {
    super()
    this.state = {
      text: '暂无可使用的听课卡'
    }
  }
  render() {
    const { text } = this.state
    return(
      <View className={styles.noListenCard}>
        <Text className={styles.imgBox}>
          <Image className={styles.img} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/empty-shopcar.png' />
        </Text>
        <Text className={styles.noText}>{text}</Text>
      </View>
    )
  }
}