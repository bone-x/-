import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtRate, AtLoadMore } from 'taro-ui'
import fetch from 'api/request'
import Loading from "@/components/loading";
import defaultAvatar from '@/assets/defaultLogo.png'
import backAvatar from '@/assets/backAvatar.png'
import styles from './index.module.scss'

export default class AssessmentList extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      reviewList: [],
      pageNum: 1,
      pageSize: null,
      goodsId: null,
      listLoadding: false,
      size: [],
      status: 'noMore'
    }
  }

  static defaultProps = {
    goods: ''
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    this.init()
  }

  getGoodsEvaluationList(params) {
    fetch('getGoodsEvaluation', {goodsId: params.goodsId, pageNum: params.pageNum, pageSize: params.pageSize}).then(res => {
      if (res) {
        params.pageNum++
        if(res.list.length < params.pageSize) {
          this.setState({
            reviewList: this.state.reviewList.concat(res.list),
            goodsId: params.goodsId,
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            size: res.list,
            status: 'noMore'
          })
        } else {
          this.setState({
            reviewList: this.state.reviewList.concat(res.list),
            goodsId: params.goodsId,
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            size: res.list,
            status: 'more'
          })
        }  
      } else {
        return false;
      }
    }).then(error => {
      console.log(error)
    })
  }

  // chushihua
  init() {
    let { reviewListParms } = this.props

    if (!reviewListParms.pageNum) {
      reviewListParms.pageNum = 1
    }
    if (!reviewListParms.pageSize) {
      reviewListParms.pageSize = 10
    }

    if (reviewListParms.pageNum == 1) {
      this.getGoodsEvaluationList(reviewListParms)
    }
  }

  scrolltolower() {
    if (this.state.size.length == this.state.pageSize) {
      this.setState({
        status: 'loading'
      })
    } else {
      return false;
    }
    let data = {
      goodsId: this.state.goodsId,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
    }
    this.getGoodsEvaluationList(data)
  }

  render() {
    if (this.state.listLoadding) {
      return <Loading />;
    }
    const { reviewList } = this.state
    const reviewListDom = (reviewList || []).map((item) => {
      return <View key={item.id} className={styles.reviewBox}>
        {/* 头像 */}
        <View className={styles.reviewAvatar}>
          <Image onError={() => item.avatar=backAvatar} className={styles.img} src={item.avatar?item.avatar:defaultAvatar} />
        </View>
        <View className={styles.reviewUserBox}>
          <View className={styles.reviewBoxTop}>
            <Text className={styles.reviewUserName}>{item.userName}</Text>
            <View className={styles.reviewUserStar}>
            <AtRate value={item.overallScore} />
            </View>
          </View>
          <View className={styles.reviewBoxMid}>
            <Text className={styles.reviewBoxMidStudy}>学习{item.duration}个课时</Text>
            <Text className={styles.reviewBoxMidTime}>{item.updateTime}</Text>
          </View>
          <View className={styles.reviewBoxText}>
            <Text>
              {item.commentContent}
            </Text>
          </View>
        </View>
      </View>
    })
    return (
      <View className={styles.box}>
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style='height: 260px;'
          lowerThreshold='20'
          onScrollToLower={this.scrolltolower.bind(this)}
        >
          <View className={styles.reviewList}>
            { reviewListDom }
            <AtLoadMore
              status={this.state.status}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}