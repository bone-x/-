import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import styles from './index.module.scss'

class EmptyList extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
  }
  componentWillMount() {}
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  goTolearn() {
    Taro.navigateTo({
      url: `/pages/courseList/index`
    })
  }

  render() {
    return (
      <View className={styles.empty}>
        <View className={styles.empty_img}>
          <Image
            className={styles.img}
            src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/empty-shopcar.png'
          />
        </View>
        <View className={styles.empty_info}>{this.props.title}</View>
        <View onClick={this.goTolearn.bind(this)} className={styles.to_learn}>
          前往学堂
        </View>
      </View>
    )
  }
}
export default EmptyList
