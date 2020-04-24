import Taro, { Component } from "@tarojs/taro";
import { View  } from "@tarojs/components";
import EvaluateComponent from '@/components/evaluate/index'
import ProductShotComponent from '../productShot/index'
import styles from "./index.module.scss";

class CourseIntroduction extends Component {
  constructor() {
    super(...arguments);
    this.state = {
    }
  }

  componentDidMount() {
    this.setState({})
  }

  render() {
    const { goods } = this.props
    
    return (
      <View className={styles.courseIntroduction}>
        {/* 商品展示 */}
        <ProductShotComponent productShot={goods} />
        {/* 教师介绍 */}
        <EvaluateComponent evaluate={goods} />
      </View>
    );
  }
}

export default CourseIntroduction;
