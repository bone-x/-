import Taro, { Component } from '@tarojs/taro'
import { View,Text,ScrollView} from '@tarojs/components'
import Loading from '@/components/loading'
import NullOrder from '@/components/NullOrder/NullOrder'
import DialogBox from '@/components/DialogBox/DialogBox'
// import CountTime from '../../OrderDetail/CountTime/CountTime'
import Timer from './Timer'
import LoadMore from '@/components/load-more'
import CarComponent from '@/components/carComponent/carComponent'
import fetch from 'api/request'
import styles from './index.module.scss'

class MyOrder extends Component {
  constructor(){
    super()
    this.state={
       loading: true,
        content:'',//弹框内容
        OrderId:'',//记录每次点击的订单ID
        type:0,//类型 点击的是删除还是取消 取消1 确认 2
        list:[],//保存全部订单
        DialogShow:false,
        loadBtn:false,
        pageNum:1,//默认分页第一页为1
        // payStatus:''//订单状态
        // isLoadingMore: false,
        // loadTxt:'加载更多...',
      lists:[
        {title:'全部',num:0},
        {title:'待支付',num:0},
        {title:'已支付',num:0},
        {title:'交易完成',num:0},
        {title:'交易关闭',num:0},
      ],
      current:0, //当前选中的头部状态
    }
  }
  config = {
    navigationBarTitleText: '我的订单'
  }
  handleClick (value) {
    let {pageNum,list,}=this.state
    this.setState({
      current: value,
      pageNum:1,
      loadBtn:false,
      list:[]
    },()=>{
        switch(value){
          case 0:
              this.getData()//获取全部数据
          break;
          case 1:
            this.getData(0)//待支付数据
          break;
          case 2:
            this.getData(2)//已支付数据
          break;
          case 3:
            this.getData(3)//交易完成数据
          break;
          case 4:
           this.getData(4)//交易关闭数据
          break;

        }
    })
  
  }

  componentDidMount() {
    ///////////////////
    this.getData()//获取数据
    this.getcountByStatus() //获取待支付的个数
    ///----------加载更多-----------------------------------------------
  }
  onScrolltoupper(){
    let{pageNum,current}=this.state
    pageNum=pageNum+1;
    this.setState({loadBtn:true,pageNum},()=>{
      switch(current){
                case 0:
                this.getData()//获取全部数据
                break;
                case 1:
                this.getData(0)//待支付数据
                break;
                case 2:
                this.getData(2)//已支付数据
                break;
                case 3:
                this.getData(3)//交易完成数据
                break;
                case 4:
                this.getData(4)//交易关闭数据
                break;
              }

    })
  }
  getData(payStatus){//0 待支付 1发起支付，2已支付，3交易完成，4交易关闭；全部订单情况下不传参数
    let {list,pageNum}=this.state;
    let obj=payStatus!=undefined?{pageNum,payStatus}:{pageNum}
    fetch('getOrderList',obj)
    .then(res=>{
      if(res.list.length>0){
        this.setState({list:[...list,...res.list],loadBtn:false})
      }else{
        this.setState({loadBtn:false})
      }  
    })
  }
  request(id,types,txt){//取消订单按钮弹出对话框
    let{OrderId,type,content}=this.state
    OrderId=id;
    content=txt;
    type=types;
    this.setState({DialogShow:true,OrderId,content,type})
}
goBuyNew(data){//从新购买
    let array=data.map(item=>item.goodsId);
    Taro.navigateTo({
        url: `/pages/SureOrder/index?id=${array.join(',')}`
    });
}
goBuy(id){//去支付
    Taro.navigateTo({
        url: `/pages/payment/submit-order/index?orderId=${id}`
    });
}
quXiao(){//取消订单
    this.setState({DialogShow:false})
}
refreshData(payStatus){//更新数据----取消和删除的时候 更新到第一页 后期需要再改动
  // let {pageNum}=this.state;
  let obj=payStatus!=undefined?{pageNum:1,payStatus}:{pageNum:1}
  fetch('getOrderList',obj)
    .then(res=>{
      if(res.list.length>0){
        this.setState({list:res.list})
      }
    })
}
getcountByStatus(){//待支付的个数
  fetch('countByStatus')
      .then(res=>{
        const { lists } = this.state;
        const newLists = Array.from(lists);
         newLists[0].num=res;
         newLists[1].num=res;
        this.setState({lists:newLists})
      })
}
Sure(){//确认
let {OrderId,type,current,list}=this.state
    if(type==1){//取消订单-----------------
        fetch('cancelOrder',{id:OrderId})
        .then(res=>{
            //关闭对话框  //更新数据
            this.setState({DialogShow:false},()=>{
                switch (current){
                  case 0:
                  this.refreshData()//更新全部的数据
                  break;
                  case 1:
                  this.refreshData(0)//更新待支付数据
                  break;
                }
                this.getcountByStatus()
            })
        })
    }else{//删除订单------------------------
        fetch('deleteOrder',{id:OrderId})
        .then(res=>{
            this.setState({DialogShow:false},()=>{
              switch (current){
                case 0:
                this.refreshData(3)//更新关闭支付数据
                break;
                case 4:
                this.refreshData(4)//更新关闭支付数据
                break;
              }
            })
        })
    }
}
  render () {
    const height={height:'100vh'}
    let {lists,current,DialogShow,content,list,loadBtn}=this.state

    return (
      <View className={styles.MyOrder}>
          <View className={styles.header}>
            {
              lists.map((item,index)=>{
                return  <View key={index} className={styles.list +' ' +(index===current?styles.active:'')}  onClick={()=>this.handleClick(index)}>
                  {item.title}
                  {
                    item.num!=0||item.num!=''?
                    <Text className={styles.num}>
                    {item.num}
                    </Text>:null
                  }
                  
            </View>
            })
          }
        </View>
        {/* -----------------------------------内容部分---------------- */}
        {
        list.length>0?
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
            <View className={styles.All}>
                {/* {
                  list.length>0? */}
                  <View className={styles.list}>
                  {/* 待支付 */}
                    
                    { 
                        list.map((Order,index)=>{//外层每个订单的循环
                            return <View  key={Order.id} className={styles.itemGood}>
                                        <View className={styles.head}>
                                            <View className={styles.time}>
                                                <Text className={styles.order}>订单号:{Order.code}</Text>
                                                <Text>{Order.createTime.split(' ')[0]}</Text>
                                            </View>
                                                {/* -------------------------支付的状态------------- */}
                                                {
                                                    Order.status===0?<View className={styles.status}>待支付</View>:
                                                    Order.status===2?<View>已支付</View>:
                                                    Order.status===3?<View>交易完成</View>:
                                                    Order.status===4?<View>交易关闭</View>:''
                                                }                                   
                                        </View>
                                        <View>
                                            {/* 点击进入详情 */}
                                            {
                                                Order.detailList.map((item,index)=>{//内层每个产品的循环
                                                    return  <View class={styles.componet} key={item.id}>
                                                                <CarComponent item={item} >
                                                                    <View className={styles.activeName}>
                                                                        {/* //判断活动类型     */}
                                                                          {  
                                                                                                                                    
                                                                              item.activityType===1?<Text className={styles.active}>积分</Text>:
                                                                              item.activityType===2?<Text className={styles.active}>限时</Text>:
                                                                              item.activityType===3?<Text className={styles.active}>抢购</Text>:
                                                                              item.activityType===4?<Text className={styles.active}>拼团</Text>:''                                                                 
                                                                          }
                                                                          <Text className={styles.price}>￥{item.price}</Text>
                                                                          <Text className={styles.real_price}>￥{item.totalFee}</Text>
                                                                          {/* ----------------------退款状态-------------- */}
                                                                          <Text className={styles.back_money}>
                                                                          {   
                                                                              item.refundStatus===1?'审核中':
                                                                              item.refundStatus===2?'已退款':
                                                                              item.refundStatus===3?'退款失败':
                                                                              item.activityType===4&&(Order.status===2||Order.status===3)?'拼团成功':''
                                                                              
                                                                          }
                                                                          </Text>                                                                                                                  
                                                                    </View>
                                                                </CarComponent>
                                                              <View className={styles.save}>
                                                                  <View className={styles.savePrice}>
                                                                    <View>已为你节省￥{(item.totalFee-item.price).toFixed(2)}</View>
                                                                    <View>实付：￥{item.price}</View>
                                                                  </View>                                                           
                                                              </View>
                                                         </View>     
                                                          
                                                })
                                            }
                                            <View className={styles.detail}>
                                                <View className={styles.foot}>
                                                        <Text className={styles.price_save}>
                                                        {
                                                            Order.status===0?<Text className={styles.time}> <Timer endTime={Order.dateNum} type={Order.discountsType} /></Text>:null
                                                        }
                                                        </Text>
                                                <Text className={styles.real_pay}>共{Order.detailList.length}件商品, 总计：￥<Text className={styles.price}>{Order.payment}</Text></Text>     
                                                </View>
                                                {/* 状态 0 待支付 1发起支付，2已支付，3交易完成，4交易关闭*/}                                       
                                                {
                                                    Order.status===0?<View className={styles.statusEvent}>
                                                                            <Text className={styles.request} onClick={()=>this.request(Order.id,1,'是否确认取消订单?')}>取消订单</Text>
                                                                            <Text className={styles.goPayFor} onClick={()=>this.goBuy(Order.id)}>去支付</Text>
                                                                    </View>:
                                                    Order.status===4?<View className={styles.statusEvent}>
                                                                            <Text className={styles.request} onClick={()=>this.request(Order.id,2,'是否确认删除订单?')}>删除</Text>
                                                                            <Text className={styles.goPayFor} onClick={()=>this.goBuyNew(Order.detailList)}>重新购买</Text>
                                                                    </View>:null               
                                                }                                            
                                            </View>
                                        </View>
                                    </View>        
                        })
                        
                    }
                  </View>
                  {/* ----------弹框------- */}
                    {
                        DialogShow?<DialogBox content={content} onQuxiao={()=>this.quXiao()} onSure={()=>this.Sure()} />:null
                    }
                    
              </View>
              </View>        
          
           <View className={styles.load}>
               <LoadMore loadMore={loadBtn}></LoadMore>
           </View>
          </ScrollView>:<NullOrder />
        }
     </View>
    )
  }
}

export default MyOrder
