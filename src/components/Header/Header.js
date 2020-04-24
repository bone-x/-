import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import './Header.scss'
import '../../styles/iconfont.scss'
export default class Header extends Component {
    constructor(props){
        super(props)
    }
    goBack(){
      Taro.navigateBack({
        delta:1
      })
    }
  render() {
    return (
        <View className='head'>
            <Text className='iconfont iconLeft score' onClick={()=>this.goBack()}></Text>
            <View className='score'>{this.props.title}</View>
            {
                this.props.rightTxt==="积分规则"? <View className='score' onClick={() => this.props.onGotoRule()}>{this.props.rightTxt}</View>:<View className='score'></View>
            }
           
       </View>
    )
  }
}
