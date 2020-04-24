import Taro, { Component } from "@tarojs/taro";
import { View, Text,ScrollView } from "@tarojs/components";
import styles from "./index.module.scss";
import CourseCard from "@/components/courseCard";
import Header from '@/components/Header/Header'
import LoadMore from '@/components/load-more'
import fetch from 'api/request'
import classNames from "classnames";
export default class MyScore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNum:1,
      pageSize:10,
      loadBtn:false,
      todayPoint:0,
      totalPoint:0,
      sortInfo: {
        key: 0,
        order: true
      },
      tabs: [
        { title: "最热", upActive: false, DownActive: false ,activityOrder:'HOT'},
        { title: "最新", upActive: false, DownActive: false ,activityOrder:'NEW'},
        { title: "价格", upActive: false, DownActive: false ,activityOrder:'POINTS'}
      ],
      onlyChange: false,//0:否；1：是
      courseList: []
    };
  }
  config = {
    navigationBarTitleText: '我的积分'
  }
componentDidMount(){
    // let {res}=this.props
    // console.log(res)
    this.getScore()
    this.getScoreList()
}
getScore(){
  let {totalPoint,todayPoint}=this.state
  fetch('getIntegral')
  .then(res=>{
    todayPoint=res.todayPoint
    totalPoint=res.totalPoint
    this.setState({totalPoint,todayPoint})
  })
}
getScoreList(){
  this.setState({
    loadBtn:true
  })
  let {courseList,sortInfo,tabs,onlyChange,pageSize,pageNum}=this.state
  let {key,order} = sortInfo;
  let orderCode = order?2:1;
  let convertible=onlyChange?1:0
  fetch('score',{type:1,activityOrder:tabs[key].activityOrder,orderCode,convertible,pageSize,pageNum})
  .then(res=>{
    if(res.list.length>0){
      this.setState({loadBtn:false,courseList:[...courseList,...res.list]})
    }
   else{
      this.setState({
        loadBtn:false
      })
   }
  })
}
  change(e, indexs) {
    const { sortInfo } = this.state;
    if (indexs == sortInfo.key) {
      this.setState(
        {
          sortInfo: {
            key: indexs,
            order: !sortInfo.order,
            pageNum:1,
          },
          courseList:[],
        },
        () => {
          this.getScoreList()
        }
      );
    } else {
      this.setState(
        {
          sortInfo: {
            key: indexs,
            order: true,
            pageNum:1,
          },
          courseList:[],
        },
        () => {
          this.getScoreList()
        }
      );
    }
  }
  onScrolltoupper =()=>{
    const {pageNum} = this.state;
    this.setState({
      pageNum:pageNum+1
    },()=>{
      this.getScoreList();
    })
  }
  gotoDetail(e, course) {
    Taro.navigateTo({
      url: `/learnCenter/pages/courseDetail/index?id=${course.id}`
    });
  }

  onGotoRule = () =>{
    Taro.navigateTo({
      url: "/pages/MyScore/scoreRule/index"
    });
  }
  changeBtnClick = () => {
    const { onlyChange } = this.state;
    this.setState(
      {
        onlyChange: !onlyChange
      },
      () => {
        // console.log(this.state);
      }
    );
  };

  render() {
    let { tabs, sortInfo, onlyChange, courseList ,todayPoint,totalPoint,loadBtn} = this.state;
    return (
      <View className={styles.MyScore}>
        {/* 头部 */}
        <Header onGotoRule={this.onGotoRule} rightTxt='积分规则'  title='我的积分' />

        <View className={styles.body}>
          <View className={styles.ScoleList}>
            <View className={styles.left}>
              <View className={styles.today}>今日积分</View>
              <View className={styles.todayScore}>{todayPoint}</View>
            </View>
            <View className={styles.right}>
              <View className={styles.Num}>累计积分</View>
              <View className={styles.NumScore}>{totalPoint}</View>
            </View>
          </View>

          <View className={styles.content}>
           
            <View className={styles.title}>积分兑换</View>
            <View className={styles.tabs}>

              <View className={styles.tab}>
                {tabs.map((item, index) => {
                  return (
                    <View
                      className={styles.Hot}
                      key={index}
                      onClick={e => this.change(e, index)}
                    >
                      <Text className={styles.txt}>{item.title}</Text>
                      <Text
                        className={
                          styles.Upsanjiao +
                          " " +
                          (index == sortInfo.key && sortInfo.order
                            ? styles.Upactive
                            : "")
                        }
                      />
                      <Text
                        className={
                          styles.Downsanjiao +
                          " " +
                          (index == sortInfo.key && !sortInfo.order
                            ? styles.Upactive
                            : "")
                        }
                      />
                    </View>
                  );
                })}
              </View>

              <View className={styles.change} onClick={this.changeBtnClick}>
                <Text
                  className={classNames(
                    "iconfont",
                    onlyChange ? "iconxuanzhong" : "iconweixuanzhong",
                    styles.changeBtn
                  )}
                />
                <Text className={styles.changeWord}>只看可兑换</Text>
              </View>

            </View>

            <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              scrollTop='0'
              style={{flex:1}}
              lowerThreshold='20'
              upperThreshold='20'
              onScrollToLower={this.onScrolltoupper}
            >
            <View className={styles.list}>
              {courseList.map((course, index) => (
                <CourseCard
                  course={course}
                  key={index}
                  cardTitle={course.name}
                  coverImage={course.coverPicture}
                  className={styles.cardItem}
                >
                  <View className={styles.childBox}>
                    <View className={styles.priceBox}>
                      <Text className={styles.newPrice}>
                        {course.activitePoint}积分
                      </Text>
                      <Text className={styles.oldPrice}>￥{course.buyPrice}</Text>
                    </View>

                    {course.activityRepertory > 0 ? (
                      <View className={styles.btnBox}>
                        <View className={styles.btnBoxLeft}>
                          仅剩{course.activityRepertory}位
                        </View>
                        <View
                          className={styles.btnBoxRight}
                          onClick={e => this.gotoDetail(e, course)}
                        >
                          去兑换
                        </View>
                      </View>
                    ) : (
                      <View className={styles.btnBox}>
                        <View className={styles.btnBoxLeft}>已兑完</View>
                        <View
                          className={styles.btnBoxRight}
                          onClick={e => this.gotoDetail(e, course)}
                        >
                          去看看
                        </View>
                      </View>
                    )}
                  </View>
                </CourseCard>
              ))}
            </View>
             <View className={styles.load}>
                <LoadMore loadMore={loadBtn}></LoadMore>
             </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
