开启了[css modules](https://nervjs.github.io/taro/docs/css-modules.html)
  * 需要用css modules处理的css文件名需要包含`.module.`
  
使用：
  ```javascript
  import Taro, { Component } from '@tarojs/taro'
  import { View, Text } from '@tarojs/components'

  import styles from './index.module.scss'

  export default class Test extends Component {
    static options = {
      addGlobalClass: true
    }
    render () {
      return (
        <View className={styles.test}>
          <Text className={`${styles.txt} ${styles.class1} global-class`}>Hello world!</Text>
        </View>
      )
    }
  }
  ```