import Taro, {Component} from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
import styles from './index.module.scss'

export default class HeadBar extends Component {

  static defaultProps = {
    title: '行家网校',
    backPath: null,
    backEvent: null
  }

  static options = {
    addGlobalClass: true
  }

  backClick = () => {
    if (this.props.backPath) {
      Taro.navigateTo({url: this.props.backPath})
    } else if (this.props.backEvent === null) {
      Taro.navigateBack({delta: 1})
    }
    this.props.backEvent && this.props.backEvent()
  }

  render () {

    const {title} = this.props

    return (
      <View className={styles.headBar}>
        <View onClick={this.backClick} className={styles.left}>
          <Text className={`iconfont iconLeft ${styles.backIcon}`}></Text>
        </View>
        <Text className={styles.title}>{title}</Text>
      </View>
    )
  }
}