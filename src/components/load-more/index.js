/*
 * @Author: 邓达
 * @Description: 
 * @props:  [boolean]loadMore是否加载
 * @event: 
 * @LastEditors: 邓达
 * @Date: 2019-04-25 09:36:36
 * @LastEditTime: 2019-04-25 11:05:39
 */

import Taro, {Component} from '@tarojs/taro'
import { View, Text,Image} from '@tarojs/components'
import styles from './index.module.scss'

export default class LoadMore extends Component {

  render () {
    const {loadMore} = this.props;
    return (
      <View className={styles.loadMore}>
       {
         loadMore?<View className={styles.loadBox}>
            
           <Image src={require('./loading.gif')} className={styles.loadImg}></Image>
           <Text className={styles.loadContent}>正在加载</Text>
         </View>:<View>哎呀，没有内容啦</View>
       }
      </View>
    )
  }
}