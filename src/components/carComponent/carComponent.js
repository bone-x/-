import Taro, { Component } from '@tarojs/taro'
import { View,Text,Image} from '@tarojs/components'
import CheckBox from '@/components/CheckBox/CheckBox'
import './carComponent.scss'
export default class CarComponent extends Component {
    static defaultProps = {
        item:{},
        checkboxList:[],
        active:[]
    }
    constructor(props){
        super(props)
    }
    TextOverHidden(txt,num){
        return txt.length > num ? txt.slice(0, num) + '...' : txt ;
    }
    goToDetail(item){//跳转--------
        //购物车的详情取id   我 的订单和别的取goodsID
        let url=item.groupId?`/learnCenter/pages/courseDetail/index?id=${item.goodsId}&groupId=${item.groupId}`:`/learnCenter/pages/courseDetail/index?id=${item.goodsId||item.id}`
        Taro.navigateTo({
            url:url
        });
    }
  render() {
      let { item,active}=this.props;
    return (
            <View className='list_car'>
                
                {
                    this.props.car==='car'?<View className='selectBtn'>
                                       
                                    <CheckBox onSelect={this.props.onSelect} active={active} itemId={this.props.itemId} />
                                    </View>:null
                   
                }
                <View onClick={()=>this.goToDetail(item)} className='right_box'>
                    <View className='img'>    
                        <Image mode='widthFix' className='imgGood' src={item.coverPicture||item.goodsImage} />
                    </View>
                    <View className='title'>
                        <View className='titleName'>{this.TextOverHidden(item.name||item.goodsName,20)}</View>
                        {this.props.children}
                    </View>
                </View>
            </View>
            )
  }
}
