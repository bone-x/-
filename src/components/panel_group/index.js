/*
 * @Author: 邓达
 * @Description:  首页块级组件
 * @props:
 * @event:
 * @LastEditors: 邓达
 * @Date: 2019-04-20 15:05:04
 * @LastEditTime: 2019-05-17 17:43:34
 */

import Taro, { Component } from "@tarojs/taro";
import classNames from "classnames";
import { View, Text,ScrollView,Image} from "@tarojs/components";
import CarComponent from '@/components/carComponent/carComponent'
import CountTime from '@/components/CountTime/CountTime'

// import classNames from "classnames";
import styles from "./index.module.scss";

export default class panelGroup extends Component {
  state = {};

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps: ", nextProps);
  }

  formatPrice =(price)=>{
      if( typeof(price) !='undefined' && typeof(price) !=null){
          return price == 0?'免费':'￥ '+price
      }
  }
 
  gotoDetail=(course)=>{
    Taro.redirectTo({
      url: `/learnCenter/pages/courseDetail/index?id=${course.id}`
    })
  }

  gotoList=()=>{
    Taro.navigateTo({
      url: `/pages/courseList/index`
    })
  }
  
  gotoMore = (type,categoryId) =>{
        Taro.navigateTo({
          url: `/pages/GroupBooking/index`
        })
  }
  render() {
    const { isMove, courseList, title,timeList,timeSelected,changeTime,eventType,categoryId} = this.props;
    return (
      <View className={styles.panelBox}>
        <Text className={styles.panelTitle}>{title}</Text>
        {
          courseList&&courseList.length >0?
          <View>
            <View className={styles.panelList}>
              {
                    courseList.map((item,index)=>{
                        return <CarComponent key={item.id} item={item}>
                                <View className={styles.price}>
                                        <Text>￥{item.activitePrice}</Text>
                                        <Text className={styles.OnSalse}>￥{item.price}</Text>
                                        <View className={styles.intro}>已有{item.groupQuantity}人成功拼团</View>
                                        <View className={styles.times}>
                                            <CountTime endTime={item.groupStopTime}  />
                                        </View>
                                        <Text className={styles.goGroup} onClick={()=>this.gotoDetail(item)}>去拼团</Text>
                                </View>
                            </CarComponent>
                    })
                }     
            </View>
            <View className={styles.jumpBox} onClick={()=>this.gotoMore(eventType)}>
                    查看更多<Text className={classNames('iconfont','iconright')}></Text>
            </View>
          </View>
          :<View className={styles.noCourse}>
              <Image className={styles.noImage} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/empty-shopcar.png' mode='widthFix'></Image>
              <View className={styles.noContent}>
                    <View className={styles.noContent1}>暂无拼团活动</View>
                    <View className={styles.noContent2}  onClick={()=>this.gotoList()}>看看其他课程</View>
              </View>
          </View>
        }
        
      </View>
    );
  }
}
