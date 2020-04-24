import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image } from '@tarojs/components'
import styles from './index.module.scss'

export default class NoComments extends Component {
  render() {
    return(
      <View className={styles.noComments}>
        <View className={styles.noCommentsImgBox}>
          <Image className={styles.noCommentsImg} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/empty-shopcar.png' />
        </View>
        <Text className={styles.noCommentsImgText}>{this.props.pageText}</Text>
      </View>
    )
  }
}