import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import fetch from "api/request";
import EvaluateComponent from '../../../components/evaluate/index'
import styles from "./index.module.scss";

export default class Introduce extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      courseList: {}
    }
  }

  componentDidMount() {
    console.log(this.props.goodsId, '666666666666666666666666666666')
    this.getLearningCenterCourseDetail(this.props.goodsId)
  }

  // 获取课程介绍
  getLearningCenterCourseDetail(params) {
    fetch('getGoodsDetail', {goodsId: params}).then(res => {
      if (res) {
        this.setState({courseList: res})
      } else {
        return false;
      }
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    const { courseList } = this.state

    return (
      <View className={styles.courseIntroduction}>
        <EvaluateComponent evaluate={courseList} />
      </View>
    );
  }
}
