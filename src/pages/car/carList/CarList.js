import Taro, { Component } from '@tarojs/taro'
import { View,Text} from '@tarojs/components'
import CarComponent from '@/components/carComponent/carComponent'
import CountTime from '@/components/CountTime/CountTime'
import NullCar from '@/components/nullCar/nullCar'
import fetch from 'api/request'
import './CarList.scss'
import '../../../styles/iconfont.scss'
export default class CarList extends Component {
    constructor(props){
        super(props)
        this.state={
            active:[],
            allChecked:false,//底部全选,
            dataLength:[],
            data:[],
            actualPrice:0,//实际付钱的总数 
            thriftPrice:0,//优惠的价格 
            keyongScore:0,
            data_score:[],//积分数据 status 1
            data_secondKill:[],//秒杀数据 status 2
            data_limitTime:[],//限时抢购 status 3
            data_Normal:[],//普通商品 即无优惠的 下架的商品
        }
    }
    componentDidMount(){
        // let {res}=this.props
        // console.log(res)
        this.getCarList()
    }
    getCarList(){
        fetch('getCarList')
        .then(res=>{
        let {data_secondKill,data_limitTime,data_Normal,data_Stop,data_score,keyongScore,dataLength,data}=this.state
        data_secondKill=[];data_limitTime=[];data_Normal=[];data_Stop=[];data_score=[];
        keyongScore=res.allPoint;
        data=res.goodsInfoDTOList
        if(res.goodsInfoDTOList.length>0){
            res.goodsInfoDTOList.forEach(item => {
            dataLength.push(item.id)
            if(item.activiteType===0||item.activiteType===null||item.activiteType===''){ //---------无活动的商品\               普通商品
                    if(item.issueStatus===0||item.issueStatus==4){//普通商  品停售或者下架           状态0 和 4 
                            data_Stop.push(item)
                        }else{//正常上架的商品
                            data_Normal.push(item)                      
                    }
            }
            else{//----------------------------------------------------------有活动时候的商品\
                    if(item.activiteType===1){//积分数据------- status 1
                        if(item.activitePublishStatus===3){//积分活动下架的商品
                             data_Stop.push(item)
                        }
                        else{
                            data_score.push(item)
                        }
                    }
                    if(item.activiteType===2){//秒杀数据------ status 2
                        if(item.activitePublishStatus===3){//秒杀活动下架的商品
                            data_Stop.push(item)
                        }else{
                            data_secondKill.push(item)
                        }      
                    }
                    if(item.activiteType===3){//3//限时抢购数据-----status 3
                        if(item.activitePublishStatus===3){//限时抢购下架的商品
                            data_Stop.push(item)
                        }
                        else{
                            data_limitTime.push(item)
                            
                        }
    
                    }
                }
               
             })

                this.setState({
                    data,
                    dataLength,
                    keyongScore,
                    data_secondKill,
                    data_limitTime,
                    data_Normal,
                    data_Stop,
                    data_score
                })
            }else{
                this.setState({
                    data:[],
                    data_secondKill:[],
                    data_limitTime:[],
                    data_Normal:[],
                    data_Stop:[],
                    data_score:[]
                })
            }
        })
    }
    Select(e,id){//单个产品选择
        let {active}=this.state
        if(!active.includes(id)){
            active.push(id);
        }else{
            active.splice(active.indexOf(id),1)
        }
        this.setState({active,allChecked:false},()=>{
           this.fetchCountPrice()
        })
    }
    fetchCountPrice(){
        let {active,actualPrice,thriftPrice}=this.state
        let goodsIds=active.join(',')
        fetch('CountCarTotal',{goodsIds})
            .then(res=>{
                actualPrice=res.actualPrice;
                thriftPrice=res.thriftPrice;
                this.setState({actualPrice,thriftPrice})
        })

    }
  isTrue(A,B){//判断b 是否为A 的子集
    A = A.slice();
    for(var i=0, len=B.length; i<len; i++){
      if(A.indexOf(B[i]) === -1){
         return false;
      }else{
        A.splice(A.indexOf(B[i]),1);
      }
    }
    return true;
  }
    selectAll(data){//分类中的全选
        let {active}=this.state;
        let array=data.map(item=>item.id)
        if(this.isTrue(active,array)){
            active=active.filter((item,index)=> {
                return array.indexOf(item)<0
            })
        }      
        else{
            array.map(item=>active.push(item))
        }
        this.setState({active,allChecked:false},()=>{
            this.fetchCountPrice()
        })

    }
    DownSelectAll(){
        let {active,allChecked,data}=this.state;
        active=[...data.map(item=>item.id)];
        if(!allChecked){
            this.setState({active,allChecked:true},()=>{
                this.fetchCountPrice()
            })
        }else{
            this.setState({active:[],allChecked:false},()=>{
                this.fetchCountPrice()
            })
        }
    }
    goToPay(){
        let {data,active}=this.state;
        let array=[],CantArray=[],compareArray=[];
        data.forEach(item=>{
        if(item.issueStatus===0||item.issueStatus===4||item.activitePublishStatus===3){//-----发布状态0 下架 4停售 activitePublishStatus=3下架
            CantArray.push(item.id)//不能购买课程的id
        }else{
            array.push(item.id);//可以购买的课程的id
        }
    })
    compareArray = active.filter(function(v){
        return CantArray.indexOf(v)!==-1 // 利用filter方法来遍历是否有相同的元素
    })
    let id=active.join(',');
     if(compareArray.length>0){//选中的元素中是否纯在不能购买的id
        Taro.showToast({
            title: '您添加的有不可购买的商品!',
            icon: 'none',
            duration: 2000
          })
     }else{  
       if(active.length>0){//有选中的
            Taro.navigateTo({
                url: `/pages/SureOrder/index?id=${id}`
            });
       }
       
     } 
    }
    delete(){
        let{active}=this.state
        if(active.length>0){
            fetch('deleteCarGoods',{},{goodsIds:active.join(",")})
            .then(res=>{//删除时需要更新数据-----------------------------------
                Taro.showToast({
                    title: '删除成功！',
                    icon: 'none',
                    duration: 2000
                })
                this.getCarList()
            })
        }else{
            return false
        }
    }
  render() {
    let {data,data_secondKill,data_limitTime,data_Normal,data_Stop,data_score,active,keyongScore,dataLength,actualPrice,thriftPrice}=this.state;
    // console.log(active)
    return (
    
    <View className='bodyCar'>
 
        {
        data.length>0?
       <View className='CarList'>
          <View className='Carcontent'>
            {/* ------------积分抵扣------------- */}
            { 
                data_score.length>0?
                <View className='score listItem'>
                    <View className='header'>                 
                        <Text onClick={()=>this.selectAll(data_score)} className={this.isTrue(active,data_score.map(item=>item.id))?'iconfont iconxuanzhong':'iconfont iconweixuanzhong'}></Text>
                        <View className='tag'>
                            <Text>积分抵扣</Text>
                        </View>
                        <View className='require'>可用积分：{keyongScore}</View>
                    </View>
                    <View className='list'>
                    {
                        data_score.map((item,index)=>{
                            return <CarComponent car='car'  onSelect={(e)=>this.Select(e,item.id)} active={this.state.active} itemId={item.id}  item={item} key={item.id}  >
                                        <View className='date'>
                                            {
                                                item.validityDate>-1?`自购买后${item.validityDate}个月有效`:'永久有效'
                                            }
                                        </View>
                                        <View className='price_score'>
                                            <Text className='price'>￥{item.price}</Text>
                                            <Text className='need_score'>所需积分：{item.activitePoint}</Text>
                                        </View>
                                </CarComponent>
                        })
                    }                  
                    </View>              
                </View>:null
            }

            {/* -----------限时秒杀------------- */}

            {
            data_secondKill.length>0?
            <View className='limit_second listItem'>
                <View className='header'>
                    <Text onClick={()=>this.selectAll(data_secondKill)} className={this.isTrue(active,data_secondKill.map(item=>item.id))?'iconfont iconxuanzhong':'iconfont iconweixuanzhong'}></Text>
                    <View className='tag'>
                        <Text>限时秒杀</Text>
                    </View>
                </View>               
                <View className='list'>
                {
                    data_secondKill.map((item,index)=>{
                        return  <CarComponent car='car' onSelect={(e)=>this.Select(e,item.id)} active={this.state.active} itemId={item.id} item={item} key={item.id} >
                                     <View className='date'>
                                     {
                                            item.validityDate>-1?`自购买后${item.validityDate}个月有效`:'永久有效'
                                     }
                                     </View>
                                     <View className='price_score'>
                                        <Text>￥{item.price}</Text>
                                        {/* <Text className='need_score counttime'>距结束：</Text> */}
                                        <CountTime endTime={item.activityEndTime} />
                                    </View>
                                </CarComponent>
                    })
                }                  
                </View> 
            </View>:null
            }
          
           
             {/* -----------限时抢购------------- */}
             {
                data_limitTime.length>0?
                <View className='limit_second listItem'>
                    <View className='header'>
                    <Text onClick={()=>this.selectAll(data_limitTime)} className={this.isTrue(active,data_limitTime.map(item=>item.id))?'iconfont iconxuanzhong':'iconfont iconweixuanzhong'}></Text>
                        <View className='tag'>
                            <Text>限时抢购</Text>
                        </View>
                    </View>
                    <View className='list'>
                    {
                        data_limitTime.map((item,index)=>{
                            return  <CarComponent car='car' item={item} key={item.id} onSelect={(e)=>this.Select(e,item.id)} active={this.state.active} itemId={item.id} >
                                        <View className='date'>
                                        {
                                            item.validityDate>-1?`自购买后${item.validityDate}个月有效`:'永久有效'
                                        }
                                        </View>
                                        <View className='price_score'>
                                            <Text>￥{item.price}</Text>
                                            {/* <Text className='need_score counttime'>距结束：</Text> */}
                                            <CountTime endTime={item.activityEndTime} />
                                        </View>
                                    </CarComponent>
                        })
                    }                  
                    </View> 
                </View>:null
             }

            {/* -----------以下课程不享受优惠------------- */}
            {
                data_Normal.length>0?
                <View className='limit_second listItem'>
                    <View className='header'>
                        <Text onClick={()=>this.selectAll(data_Normal)} className={this.isTrue(active,data_Normal.map(item=>item.id))?'iconfont iconxuanzhong':'iconfont iconweixuanzhong'}></Text>
                        <View className='Normal'>
                            <Text>以下课程不享受优惠</Text>
                        </View>
                    </View>
                    <View className='list'>
                    {
                        data_Normal.map((item,index)=>{
                            return  <CarComponent car='car' item={item} key={item.id} onSelect={(e)=>this.Select(e,item.id)} active={this.state.active} itemId={item.id}>
                                        <View className='date'>
                                        {
                                            item.validityDate>-1?`自购买后${item.validityDate}个月有效`:'永久有效'
                                        }
                                        </View>
                                        <View className='price_score'>
                                            <Text>￥{item.price}</Text>
                                        </View>
                                    </CarComponent>
                        })
                    }                  
                    </View> 
                </View>:null
            }
            
             {/* -----------以下课程不能购买------------- */}

             {
                 data_Stop.length>0?
                 <View className='cantBuy listItem'>
                    <View className='header'>
                    <Text onClick={()=>this.selectAll(data_Stop)} className={this.isTrue(active,data_Stop.map(item=>item.id))?'iconfont iconxuanzhong':'iconfont iconweixuanzhong'}></Text>
                        <View className='Normal noSale'>
                            <Text>以下课程不能购买</Text>
                        </View>
                    </View>
                    <View className='list'>
                    {
                        data_Stop.map((item,index)=>{
                            return  <CarComponent car='car' item={item} key={item.id}  onSelect={(e)=>this.Select(e,item.id)} active={this.state.active} itemId={item.id}>
                                        <View className='date'>
                                        {
                                            item.validityDate>-1?`自购买后${item.validityDate}个月有效`:'永久有效'
                                        }
                                        </View>
                                        <View className='price_score'>
                                            <Text>￥{item.price}</Text>
                                            <Text className='originPrice'>￥{item.originPrice}</Text>
                                        </View>
                                    </CarComponent>
                        })
                    }                  
                    </View> 
                </View>:null
             }
            </View>
            <View className='foot'> 
                <View className='footer'>
                        <View className='left'>
                            <Text onClick={(e)=>this.DownSelectAll(e)} className={this.isTrue(active,dataLength)?'iconfont iconxuanzhong':'iconfont iconweixuanzhong'}></Text>
                            <Text onClick={()=>this.delete()} >删除</Text>
                        </View>
                        <View className='right'>
                                <View className='total_content'>
                                        <View className='count'>
                                            <Text>共计{active.length}件，总计：<Text className='price'>￥{actualPrice}</Text></Text>               
                                        </View>
                                        <View className='save_price'>
                                            <Text>已为您节省：￥{thriftPrice}</Text>               
                                        </View>           
                                </View>
                            <View className={active.length>0?'goToPay':'goToPayDark'} onClick={()=>this.goToPay()}>去结算</View>
                        </View>
                    </View>
                </View>
            </View>:<NullCar />
        }
       </View>
 
    )
  }
}

