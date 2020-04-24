import Taro, { Component } from '@tarojs/taro'
import { View,Text,ScrollView,Image} from '@tarojs/components'
import styles from './index.module.scss'
import CarComponent from '@/components/carComponent/carComponent'
import LoadMore from '@/components/load-more'
import Header from '@/components/HomeHeader'
import CountTime from '@/components/CountTime/CountTime'
import fetch from 'api/request'
import classNames from "classnames";
export default class GroupBooking extends Component {
    constructor(props){
        super(props)
        this.state={
            loadBtn:false,
            pageNum:1,
            list:[],
            tabs: [
                { title: "最热", upActive: false, DownActive: false ,activityOrder:'HOT'},
                { title: "最新", upActive: false, DownActive: false ,activityOrder:'NEW'},
                { title: "活动价格", upActive: false, DownActive: false ,activityOrder:'PRICE'}
              ],
              sortInfo: {
                key: 0,
                order: true
              },
        }
    }
    // goToBooking(groupId,id){
    //     Taro.navigateTo({
    //         url: `/learnCenter/pages/courseDetail/index?groupId=${groupId}&id=${id}`
    //     });
    // }
    componentDidMount(){
        this.getBookingList()
    }
    getBookingList(){
      let {list,pageNum}=this.state
      fetch('bookingList',{type:4,pageNum,pageSize:10}).then(res=>{
          if(res.list.length>0){
            this.setState({list:[...list,...res.list],loadBtn:false})
          }else{
            this.setState({loadBtn:false})
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
              list:[],
            },
            () => {
              this.getBookingList()
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
              list:[],
            },
            () => {
              this.getBookingList()
            }
          );
        }
      }
    onScrolltoupper(){
        let{pageNum}=this.state
        pageNum=pageNum+1;
        this.setState({loadBtn:true,pageNum},()=>{
           this.getBookingList()
        })
    }
  render() {
      let {list,sortInfo,loadBtn,tabs}=this.state
      const height={
          height:'100%'
      }
    return (
      <View className={styles.GroupBooking}>
        <View className={styles.head}>
            <Header />
        </View>
        <View className={styles.tabs}>
                <View className={styles.tab}>
                {tabs.map((item,index) => {
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
            </View>
        {
        Boolean(list.length>0)?
        <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            scrollTop='0'
            style={height}
            lowerThreshold='50'
            upperThreshold='50'
            onScrollToLower={()=>this.onScrolltoupper()}
        >
            <View className={styles.body}>
                <View className={styles.content}>
                {/* ----tabs--------- */}
                {
                    list.map((item,index)=>{
                        return <CarComponent key={item.id} item={item}>
                                <View className={styles.price}>
                                        <Text>￥{item.activitePrice==null?0:item.activitePrice}</Text>
                                        <Text className={styles.OnSalse}>￥{item.price}</Text>
                                        <View className={styles.intro}>已有{item.groupQuantity}人成功拼团</View>
                                        <View className={styles.times}>
                                            <CountTime endTime={item.groupStopTime}  />
                                        </View>
                                        <Text className={styles.goGroup}>去拼团</Text>
                                </View>
                            </CarComponent>
                    })
                }      
                </View>
                <View className={styles.load}>
                    <LoadMore loadMore={loadBtn} />
                </View>
            </View>
         </ScrollView>:
         <View className={styles.blank}>
            <Image className={styles.img} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/empty-shopcar.png' />
            <View>暂无此活动。</View>
        </View>
        }
       
      </View>
    )
  }
}
