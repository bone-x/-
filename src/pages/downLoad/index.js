import Taro, { Component } from '@tarojs/taro'
import { View,Text,Image} from '@tarojs/components'
import styles from './index.module.scss'
const style1 = {
  background:`url("http://hq-auth.oss-cn-shenzhen.aliyuncs.com/assets/weapp-download-bg.png")`,
  backgroundSize:`100% 100% `
}
   // background-size:100% 100%; 
export default class DownLoad extends Component {
  render() {
    return (
      <View className={styles.downLoad} style={style1}>
          <View className={styles.btn}>
             <Text className={styles.txt}>下载行家APP</Text>
          </View>
      </View>
    )
  }
}
