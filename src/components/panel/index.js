/*
 * @Author: 邓达
 * @Description:  首页块级组件
 * @props:
 * @event:
 * @LastEditors: 邓达
 * @Date: 2019-04-20 15:05:04
 * @LastEditTime: 2019-05-08 15:08:03
 */

import Taro, { Component } from "@tarojs/taro";
import classNames from "classnames";
import { View, Text,ScrollView,Image} from "@tarojs/components";
import CourseCard from "@/components/courseCard";
import Feed from '@/components/highdamage'

// import classNames from "classnames";
import styles from "./index.module.scss";

export default class Panel extends Component {
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
    Taro.navigateTo({
      url: `/learnCenter/pages/courseDetail/index?id=${course.id}`
    })
  }

  gotoList=()=>{
    Taro.navigateTo({
      url: `/pages/courseList/index`
    })
  }
  gotoMore = (type,categoryId) =>{
      if(type == '1'){
        Taro.navigateTo({
          url: `/pages/MyScore/index`
        })
      }else if(type == '2'){
        Taro.navigateTo({
          url: `/pages/Discount/index`
        })
      }else{
        Taro.navigateTo({
          url: `/pages/courseList/index?id=${categoryId}`
        })
      }
  }
  render() {
    const { isMove, courseList, title,timeList,timeSelected,onChangeTime,eventType,categoryId} = this.props;
    return (
      <View className={styles.panelBox}>
        <Text className={styles.panelTitle}>{title}</Text>
        {
          eventType == '2'?
          <ScrollView
            scrollX
            scrollWithAnimation
            scrollLeft='0'
            lowerThreshold='20'
            upperThreshold='20'
          >
          <View className={styles.shoping} >
            {timeList&&timeList.length>0&&timeList.map(item => {
              return <Feed key={item} isItem={item.value!=timeSelected} name={item.statusName} time={item.label} onEvent={()=>onChangeTime(item.value)} />
            })
            }
          </View>
        </ScrollView>:null
        }
        {
          courseList&&courseList.length >0?
          <View>
            <View className={styles.panelList}>
              {courseList.map((course, index) => (
                <CourseCard
                  course={course}
                  key={index}
                  cardTitle={course.name}
                  coverImage={course.coverPicture}
                  className={styles.cardItem}
                >
                  { isMove === 'true' ? (
                    <View className={styles.childBox}>
                      <View className={styles.priceBox}>
                        {course.activiteType === 1?(
                        <Text className={styles.newPrice}>
                          {course.activitePoint}积分
                        </Text>):(<Text className={styles.newPrice}>
                          ￥{course.activitePrice}
                        </Text>)}
                        <Text className={styles.oldPrice}>￥{course.price}</Text>
                      </View>
                      {course.activiteStatus == 1?(
                        <View className={styles.btnBox}>
                          <View className={styles.btnBoxLeft}>未开始</View>
                          <View
                            className={styles.btnBoxRight}
                            onClick={e => this.gotoDetail(e, course)}
                          >
                            去看看
                          </View>
                        </View>)
                        :course.activiteStatus == 3?(
                          <View className={styles.btnBox}>
                            <View className={styles.btnBoxLeft}>已结束</View>
                            <View
                              className={styles.btnBoxRight}
                              onClick={e => this.gotoDetail(e, course)}
                            >
                              去看看
                            </View>
                          </View>)
                        :<View>
                          { course.activityRepertory > 0 ? (
                            <View className={styles.btnBox}>
                              { course.activityRepertory !=  999999999 ?
                              <View className={styles.btnBoxLeft}>
                                仅剩{course.activityRepertory}位
                              </View>:<View className={styles.btnBoxLeft}></View>
                              }
                              <View
                                className={styles.btnBoxRight}
                                onClick={e => this.gotoDetail(e, course)}
                              >
                                马上抢
                              </View>
                            </View>
                          ) : (
                            <View className={styles.btnBox}>
                              {course.activiteType ===1?<View className={styles.btnBoxLeft}>已兑完</View>:course.activiteType ===2?<View className={styles.btnBoxLeft}>已抢完</View>:null}
                              <View
                                className={styles.btnBoxRight}
                                onClick={e => this.gotoDetail(e, course)}
                              >
                                去看看
                              </View>
                            </View>
                          )}
                        </View>
                      }
                      
                    </View>
                  ) : (
                    <View className={styles.childBox1}>
                      <View className={styles.wordBox}>
                        <Text>{course.teacherName}老师</Text>
                        <Text className={styles.studentNum}>{course.totalBuyCount}人学过</Text>
                      </View>
                      { course.activiteType === 0?(<View className={styles.priceBox}>
                        <Text className={styles.newPrice}>
                          ￥{course.price}
                        </Text>
                      </View>):course.activiteType === 1?(<View className={styles.priceBox}>
                        <View className={styles.tag}>{course.activiteTypeName}</View>
                        <Text className={styles.newPrice}>
                          {course.activitePoint}积分
                        </Text>
                        <Text className={styles.oldPrice}>￥{course.price}</Text>
                      </View>):(course.activiteType === 2 ||course.activiteType === 3)?(<View className={styles.priceBox}>
                        <Text className={styles.newPrice}>
                          ￥{course.activitePrice}
                        </Text>
                        <Text className={styles.oldPrice}>￥{course.price}</Text>
                      </View>):null
                      }
                    </View>
                  )}
                </CourseCard>
              ))}
            </View>
            <View className={styles.jumpBox} onClick={()=>this.gotoMore(eventType,categoryId)}>
                    查看更多<Text className={classNames('iconfont','iconright')}></Text>
            </View>
          </View>
          :<View className={styles.noCourse}>
              <Image className={styles.noImage} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/empty-shopcar.png' mode='widthFix'></Image>
              <View className={styles.noContent}>
                    {
                      eventType == '2'?<View className={styles.noContent1}>暂无秒杀活动</View>
                      :eventType == '1'?<View className={styles.noContent1}>暂无积分活动</View>
                      :<View className={styles.noContent1}>暂无课程</View>
                    }
                    <View className={styles.noContent2}  onClick={()=>this.gotoList()}>看看其他课程</View>
              </View>
          </View>
        }
        
      </View>
    );
  }
}
