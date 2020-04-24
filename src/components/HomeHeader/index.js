import Taro, { Component } from '@tarojs/taro'
import { View,Text,Image } from '@tarojs/components'
import Qs from 'qs'
import styles from './index.module.scss'
import logo from '@/assets/logo.png'

export default class HomeHeader extends Component {
      //跳转列表
  goToSearch = () =>{
    Taro.navigateTo({
      url: '/pages/courseList/index?keyword=&searchFocus=1'
    })
  }
  gotoHome = ()=>{
    const { params } = this.$router;
    const url = `${'/pages/home/index'}?${Qs.stringify(params)}`;
    Taro.navigateTo({
      url,
    })
  }

  gotoDownload = ()=>{
    Taro.navigateTo({
      url: '/pages/downLoad/index'
    })
  }
  render() {
    return (
      <View className={styles.HomeHeader}>
         <View className={styles.topNavBox}>
          <Image className={styles.logoBox} mode='scaleToFill' src={logo} onClick={this.gotoHome}></Image>
          <View className={styles.saerchBox} onClick={this.goToSearch}>
            <View className='iconfont iconsousuo'></View>
            <View className={styles.inputBox}>
              <Text>搜索感兴趣的课程</Text>
            </View>
          </View>
          <View className={styles.Btn}></View>
          {/* <View className={styles.actionBtn} onClick={this.gotoDownload}>打开APP</View> */}
        </View>
      </View>
    )
  }
}
