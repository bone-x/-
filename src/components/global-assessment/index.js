import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtRate } from 'taro-ui'
import fetch from 'api/request'
import styles from './index.module.scss'

export default class GlobalAssessment extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      reviewInfo: ''
    }
  }
  static defaultProps = {
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    this.getGoodsEvaluationInfo(this.props.globalReview.goodsId)
  }

  getGoodsEvaluationInfo(params) {
    fetch('getEvaluationInfo', {goodsId: params}).then(res => {
      if (res) {
        this.setState({reviewInfo: res})
      } else {
        return false;
      } 
    }).catch(error => {
      console.log(error)
    })
  }
  
  render() {
    const { reviewInfo } = this.state
    
    return( 
      <View className={styles.reviewTop}>
        <Text className={styles.reviewTopName}>整体评价</Text>
        <View className={styles.reviewStarBox}>
          <Text className={styles.reviewStar}>
            <Text className={styles.reviewGrade}>{Math.floor(reviewInfo.avgOverallScore * 10) / 10}</Text>
            <View className={styles.starts}>
              <AtRate value={reviewInfo.avgOverallScore} />
            </View>
          </Text>
          <Text className={styles.reviewUser}>
            <Text className={styles.reviewUserPer}>{reviewInfo.goodsEvaluationRate}%</Text> 用户推荐此课程
          </Text>
        </View>
      </View>
    )
  }
}