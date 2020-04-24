import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import fetch from 'api/request'
import GlobalAssessment from '@/components/global-assessment/index'
import AssessmentList from '@/components/assessment-list/index'
import NoComments from '../noComments/index'
import styles from "./index.module.scss";

class ReviewComponent extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      reviewShow: true,
    }
  }

  static defaultProps = {
    // goods: ''
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    this.getGoodsEvaluationList(this.props.goods)
  }

  getGoodsEvaluationList(params) {
    fetch('getGoodsEvaluation', {goodsId: params, pageNum: 1, pageSize: 10}).then(res => {
      if (res && res.list.length > 0) {
        this.setState({reviewShow: true})
      } else {
        this.setState({reviewShow: false})
      }
    }).catch(error => {
      console.log(error)
      this.setState({reviewShow: false})
    })
  }
  
  render() {
    const { reviewShow } = this.state
    const { goods } = this.props

    return (
      <View>
        <View className={styles.review} style={reviewShow?'display:block':'display:none'}>
          {/* 整体评价 */}
          <GlobalAssessment globalReview={{goodsId:goods}} />
          {/* 评论列表 */}
          <AssessmentList reviewListParms={{goodsId:goods}} />
        </View>
        <View style={reviewShow?'display:none':'display:block'}>
          {/* 暂无评论 */}
          <NoComments pageText='暂无评价' />
        </View>
      </View>
    );
  }
}

export default ReviewComponent;
