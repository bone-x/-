import Taro, { Component } from "@tarojs/taro";
import { View, Text,Image} from "@tarojs/components";
import styles from "./index.module.scss";
import { AtNavBar } from 'taro-ui';
import RuleBox from '@/components/ruleBox'

// import { isNativeApp, JsBridge } from '@/utils/JsBridge';

export default class ScoreRule extends Component {
  config = {
    navigationBarTitleText: '积分规则'
  }
  constructor(props) {
    super(props);
    this.state = {
        ruleList:[{
            title:"如何获得积分？",
            answer:"用户获得积分的方法如下：",
            img:"https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/pointRule.png"
        },{
            title:"用户个人积分上限？",
            answer:"每个人每天获得积分上限为1000分",
            img:null
        },{
          title:"积分期限是多少？",
          answer:"自然年内有效，次年3月31日23：59分将清空积分",
          img:null
        },{
          title:"积分用途？",
          answer:"积分可用来兑换某些商品，后期将会开发更多积分活动，请积极参与哦~",
          img:null
      }]
    };
  }

  componentDidMount() {
  }

  handleClick = ()=>{
    Taro.navigateTo({
      url: `/pages/MyScore/index`
    });
  }
  render() {
      const {
        ruleList
      } = this.state
    return (
      <View className={styles.scoreRlue}>
        {/* -------------------头部 ---------------*/}
        {/* <View className={styles.header}>
          <AtNavBar
            onClickLeftIcon={this.handleClick}
            color="#000"
            title="积分规则"
            leftIconType="chevron-left"
          />
        </View> */}
        <View className={styles.contentBox}>
        {ruleList.map((ele,index)=>{
           return  <RuleBox key={index} title={ele.title} >
                    <View>
                      <View className={styles.answerTitle}>{ele.answer}</View>
                      {ele.img !== null? <Image src={ele.img} className={styles.imgBox}></Image>:null}
                    </View> 
                    </RuleBox>
        })}
        </View> 
      </View>
    );
  }
}
