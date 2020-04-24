import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, RichText  } from "@tarojs/components";
import styles from "./index.module.scss";

export default class EvaluateComponent extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      teachers: [],
      btnShow: false,
      nodes: ''
    }
  }

  static defaultProps = {
    evaluate: {
      teachers: []
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.evaluate.teachers) {
      nextProps.evaluate.teachers.map((k,key) => {
        if(key==0 || key==1) {
          k.moreShow = true
        } else {
          k.moreShow = false
        }
      })
      this.setState({
        teachers: nextProps.evaluate.teachers,
        nodes: nextProps.evaluate.introduction
      })
    } else {
      this.setState({
        nodes: nextProps.evaluate.introduction
      })
    }
    

    if (nextProps.evaluate.teachers && nextProps.evaluate.teachers.length > 2) {
      this.setState({btnShow: true})
    } else {
      this.setState({btnShow: false})
    }
  }

  // 查看更多
  moreClick() {
    this.state.teachers.map((v) => {
      v.moreShow = true
    })
    this.setState({btnShow: false})
  }
  render() {
    
    const { teachers, btnShow, nodes } = this.state

    return (
      <View className={styles.introductBox}>
      {
        teachers.length == 0? "": <View className={styles.courseIntroductionLecturer}>
        <Text className={styles.lecturer}>讲师介绍</Text>
        {
          (teachers || []).map((item) => {
            return(
              <View className={styles.lecturerIntroBox} key={item.lecturerId} style={item.moreShow?'display:block':'display:none'}>
                <View className={styles.avatar}>
                  <Image className={styles.avatarImg} src={item.pic} />
                </View>
                <View className={styles.lecturerIntro}>
                  <Text className={styles.lecturerName}>{item.lecturerName}</Text>
                  <Text className={styles.lecturerText}>
                    {item.lecturerIntro}
                  </Text>
                </View>
              </View>
            )
          })
        }
        <View className={styles.more} style={btnShow?'display:block': 'display: none'} onClick={this.moreClick.bind(this)}>
          <Text>查看全部<Text className={`iconfont icondown ${styles.bottomIcon}`}></Text></Text>
         </View>
       </View>
      }
        {/* 商品介绍 */}
        <View className={styles.courseIntroductionGoods}>
          <Text className={styles.goodsIntro}>商品介绍</Text>
            <View className={styles.goodsText}>
              <RichText nodes={nodes} />
            </View>
        </View>
      </View>
    );
  }
}
