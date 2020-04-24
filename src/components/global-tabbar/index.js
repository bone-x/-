import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'

export default class GlobalTabBar extends Component {
  constructor(props) {
    super(props)
  }

  static options = {
    addGlobalClass: true
  }

  // TabBar Click点击
  handleTabBarClick = value => {
    switch (value) {
      case 0:
        Taro.redirectTo({
          url: `/pages/home/index`
        })
        break
      case 1:
        const token = Taro.getStorageSync('token')
        if (!token) {
          if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
            Taro.redirectTo({ url: '/pages/bindPhone/index' })
          } else {
            Taro.redirectTo({ url: '/pages/loginPage/index' })
          }
        } else {
          Taro.redirectTo({
            url: `/learnCenter/pages/learningCenter/index`
          })
        }
        break
      case 2:
        Taro.redirectTo({
          url: `/pages/newsList/index`
        })
        break
      case 3:
        Taro.redirectTo({
          url: `/personCenter/pages/personalCenter/index`
        })
        break
      default:
        break
    }
  }

  goToSearch = () => {
    Taro.redirectTo({
      url: '/pages/search/index'
    })
  }

  render() {
    return (
      <View className="global-tabbar-box">
        <AtTabBar
          iconSize={20}
          fontSize={9}
          tabList={[
            {
              title: '行家',
              iconPrefixClass: 'iconfont',
              iconType: 'hangjia-moren',
              selectedIconType: 'hangjia-xuanzhong'
            },
            {
              title: '学习',
              iconPrefixClass: 'iconfont',
              iconType: 'xuexi-moren',
              selectedIconType: 'xuexi-xuanzhong'
            },
            {
              title: '发现',
              iconPrefixClass: 'iconfont',
              iconType: 'faxian-moren',
              selectedIconType: 'faxian-xuanzhong'
            },
            {
              title: '我的',
              iconPrefixClass: 'iconfont',
              iconType: 'wode-moren',
              selectedIconType: 'wode-xuanzhong'
            }
          ]}
          onClick={this.handleTabBarClick}
          current={this.props.current}
        />
      </View>
    )
  }
}
