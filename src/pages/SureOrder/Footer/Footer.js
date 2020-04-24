import Taro, { Component } from '@tarojs/taro'
import { View,Text} from '@tarojs/components'
import './Footer.scss'
export default class carFooter extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <View className='footer'>
        <View className='left'></View>
        <View className='right'>
              <View className='total_content'>
                  <View className='count'>
                      <Text>共计{this.props.count}件，总计：<Text className='price'>￥{this.props.actualPrice}</Text></Text>               
                  </View>
                  <View className='save_price'>
                      <Text>已为您节省：￥{this.props.thriftPrice}</Text>               
                  </View>           
              </View>
              <View className='goToPay' onClick={this.props.ongoToPay} >去结算</View>
        </View>
      </View>
    )
  }
}
