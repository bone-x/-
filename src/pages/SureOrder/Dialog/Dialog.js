import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import './Dialog.scss'
export default class Dialog extends Component {
  constructor(props){
    super(props)
  }
  backCar(){
    Taro.navigateTo({
      url: "/pages/car/index"
    });
  }
  render() {
    return (
      <View className='Dialog'>
         <View className='box'>
            <View className='title'>提示</View>
            <View className='content'>
                <View className='reason'>存在部分商品无法购买，请仔细检查，无法购买可能有以下原因：</View>
                <View className='list'>1.库存为0;</View>
                <View className='list'>2.商品已下架;</View>
                <View className='list'>3.商品已失效;</View>
                <View className='list'>4.网络原因等等;</View>
            </View>
            <View className='btnList'>
                <View className='back' onClick={()=>this.backCar()}>返回购物车</View>
                <View className='sure' onClick={this.props.onSure}>确定</View>
            </View>
         </View>
         <View className='cover'></View>
      </View>
    )
  }
}
