import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import styles from './index.module.scss'

export default class GoodsComponent extends Component {
  constructor() {
    super(...arguments)
    this.state = {
    }
  }

  static defaultProps = {
    goodsDetail: {},
    offered: ''
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
  }

  render() {
    const { goodsDetail, offered } = this.props.courseDetail

    return(
      goodsDetail?<View className={[styles.goodsName, styles.clearfix]}>
        <View className={styles.imgBox}>
          <Image className={styles.img} src={goodsDetail.coverPicture} />
        </View>
        <View className={styles.textBox}>
          <Text className={styles.courseName}>{goodsDetail.name}</Text>
          <Text className={styles.gradeType}>大师班</Text>
          <Text className={styles.valid} style={offered?'':'display:none'}>{goodsDetail.validityDate == -1?'永久有效':`自购买后${goodsDetail.validityDate}个月有效`}</Text>
          <Text className={styles.offeredPar}><Text style={offered?'':'display:none'} className={styles.pintuan}>{goodsDetail.activiteTypeName}</Text>￥{goodsDetail.activitePrice}<Text className={styles.par}>￥{goodsDetail.price}</Text></Text>
        </View>
      </View>: ''
    )
  }
}