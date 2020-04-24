import Taro, { Component } from '@tarojs/taro'
import { View,Text} from '@tarojs/components'
// import SureOrderList from './SureOrderList/SureOrderList'
import CarComponent from '@/components/carComponent/carComponent'
import Header from '@/components/Header/Header'
import styles from './index.module.scss'
import Footer from './Footer/Footer'
import fetch from 'api/request'
import Dialog from './Dialog/Dialog'
export default class SureOrder extends Component {
  constructor(props){
    super(props)
    this.state={
      dialog:false,
      list:[],//确认订单列表
      actualPrice:0,//实际付钱的总数 
      thriftPrice:0,//优惠的价格 
    }
  }
  // sure(){
  //   alert('我是确定')
  // }
  componentDidMount(){//获取确认订单列表
    // 让小程序调用

    let {list,actualPrice,thriftPrice}=this.state
    let goodsIds=this.$router.params.id;
    fetch('CountCarTotal',{goodsIds})
    .then(res=>{
        list=res.goodsInfoDTOList;
        actualPrice=res.actualPrice;
        thriftPrice=res.thriftPrice;
        this.setState({list,actualPrice,thriftPrice})
    })
  }
  goToPay(){//去结算
        let {dialog}=this.state
        let id=this.$router.params.id;
        fetch('gotoPayMoney',{goodsIds:id})
        .then(res=>{//0走支付流程，1走积分流程，2商品下架，网络异常等
            if(res.type===0){
                fetch('save',{goodsIds:id})
                .then(res=>{             
                   Taro.navigateTo({
                        url: `/pages/payment/submit-order/index?orderId=${res.pmOrderId}`
                    });
                })                
           }
          if(res.type===1){//积分
            fetch('save',{goodsIds:id})
                .then(res=>{       
                  let{pmOrderId,myPoints,points,code}=res      
                   Taro.navigateTo({
                        url: `/pages/payment/PayScoreSuccess/index?orderId=${pmOrderId}&code=${code}&myPoints=${myPoints}&points=${points}`
                    });
              })                                        
          }
          if(res.type===2){//商品 商品下架，网络异常等
            this.setState({dialog:!dialog})
          }
        })
    }
    sure(){//确定的时候 
      let {dialog}=this.state
       this.setState({dialog:!dialog})
  }

  render() {
    let {list,actualPrice,thriftPrice,dialog}=this.state
    return (
      <View className={styles.sureOrder}>
            {/* 头部 */}
          <View className={styles.header}>
              <Header title='确认订单' />
          </View>   
          {/* body */}
          <View className={styles.body}>
            <View className={styles.list}>
              { 

                list.map((item,index)=>{
                  return <View key={item.id} className={styles.listGoods}> 
                            <CarComponent  item={item}>
                                  <View className={styles.activeName}>
                                      <View className={styles.top}>
                                        {
                                           item.activiteType===1?<Text className={styles.active}>积分</Text>:
                                           item.activiteType===2?<Text className={styles.active}>限时</Text>:
                                           item.activiteType===3?<Text className={styles.active}>抢购</Text>:null

                                        }
                                        {/* <Text className={styles.active}>
                                          {
                                            // (item.active==1&&'积分')||(item.active==2&&'秒杀')||(item.active==3&&'限时')   
                                               item.activiteType===1?'积分': item.activiteType===2?'限时':item.activiteType===3?'抢购':''
                                             
                                          }
                                        </Text> */}
                                        <Text className={styles.status}>
                                          {
                                            item.validityDate>-1?`自购买后${item.validityDate}个月有效`:'永久有效'
                                          }
                                        </Text>  
                                      </View> 
                                      <View className={styles.bottom}>
                                        <Text className={styles.real_price}>￥
                                       {/* //无活动的时候显示原价 有活动的时候显示活动价 */}
                                        {                                         
                                          (item.activiteType=='0'||item.activiteType=='')?item.price:item.activitePrice
                                        }
                                        </Text>
                                        <Text className={styles.orginPrice}>￥{item.price}</Text>
                                      </View>                                                                                                                                 
                                  </View>
                            </CarComponent>
                            <View className={styles.detail}>
                                <Text className={styles.price_save}>
                                {/* //1积分不足显示积分不足 2积分足够节省活动积分个 节省原价  限时和抢购 节省原价-活动价 */}
                                {
                                  (item.activiteType===1&&item.pointDescribe==='积分不足')?'积分不足':
                                  (item.activiteType===1&&item.pointDescribe!=='积分不足')?`已抵销${item.activitePoint}积分为您节省￥${item.price} `:
                                  (item.activiteType===2||item.activiteType===3)?`已为您节省￥${item.price-item.activitePrice}`:''                                
                                }
                                </Text>
                                <View className={styles.real_pay}>实付：￥
                                    {
                                      (item.activiteType===1&&item.pointDescribe!='积分不足')?<Text className={styles.price}>0.00</Text>:
                                      (item.activiteType===2||item.activiteType===3)?<Text className={styles.price}>{item.activitePrice}</Text>:
                                                                                     <Text className={styles.price}>{item.price}</Text>
                                    }
                                     
                                </View>
                            </View>
                      </View>
                })
              }   
            </View>
          </View>
          {/* footer */}
          <View className={styles.footer}>
            <Footer thriftPrice={thriftPrice} actualPrice={actualPrice} count={list.length} ongoToPay={()=>this.goToPay()} />
          </View>
          <View>
           {
              dialog? <Dialog onSure={()=>{this.sure()}} />:null
            }       
           </View>
      </View>
    )
  }
}
