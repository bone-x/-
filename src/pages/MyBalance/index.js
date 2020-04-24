import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import styles from "./index.module.scss";
import { AtNavBar } from 'taro-ui';
import RuleBox from '@/components/ruleBox'

import { isNativeApp, JsBridge } from '@/utils/JsBridge';

export default class MyBalance extends Component {
  config = {
    navigationBarTitleText: '我的余额'
  }

  constructor(props) {
    super(props);
    this.state = {
        ruleList:[{
            title:"什么是行家币？",
            answer:"行家币是行家平台的虚拟货币，用户购买平台内的付费内容。行家币充值后不会过期，但是只能消费，不能提现、退款或转赠他人",
            img:null
        },{
            title:"为什么行家币仅限iOS设备使用？",
            answer:"由于苹果公司的规定，购买虚拟物品必须使用苹果系统充值购买。安卓设备、网页等其他平台可直接使用支付宝、微信支付",
            img:null
        },{
          title:"人民币与行家币的兑换标准？",
          answer:"使用苹果系统购买课程等产生的费用，苹果公司会收取部分分成，扣除分成外的金额才是机构的收入。因此为了保障机构的正常收入，人民币与行家币之间存在一定的兑换比例。用户也可在安卓设备、网页等其他平台搜索报名课程，只要账号一致，也可以在iOS设备正常上课",
          img:null
        },{
          title:"为什么只能充值指定金额的行家币？",
          answer:"由于苹果公司的规定，iOS设备在使用内购流程时，只能选择预设好的充值金额",
          img:null
        },{
          title:"如何使用行家币？",
          answer:"iOS设备的用户可直接用于购买APP内虚拟商品",
          img:null
      }]
    };
  }

  componentDidMount() {
    JsBridge(null, {
      "code": 200,
      "message": "OK",
      "path": "title",
      "data": {
        "title": "我的余额"
      }
    })
  }

  handleClick = ()=>{
    Taro.navigateTo({
      url: `/pages/MyBalance/index`
    });
  }
  render() {
      const {
        ruleList
      } = this.state
    return (
      <View className={styles.scoreRlue}>
        {/* -------------------头部 ---------------*/}
        {!isNativeApp() &&
          <View className={styles.header}>
            <AtNavBar
              onClickLeftIcon={this.handleClick}
              color='#000'
              title='我的余额'
              leftIconType='chevron-left'
            />
          </View>
        }
        <View className={styles.contentBox}>
        {ruleList.map((ele,index)=>{
           return  <RuleBox key={index} title={ele.title} className={styles.boldTitle}>
                        <View className={styles.answerTitle}>{ele.answer}</View>
                        {ele.img != null? <Image src={ele.img} className={styles.imgBox}></Image>:null}
                    </RuleBox>
        })}
        </View> 
      </View>
    );
  }
}
