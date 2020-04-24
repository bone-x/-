import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import './DialogBox.scss'
export default class DialogBox extends Component {
  static defaultProps={
    rightMenu:'确认',
    leftMenu:'取消'
  }
  constructor(props){
    super(props)
  }
  render() {
    let {content,leftMenu,rightMenu}=this.props
    return (
      <View className='Dialog'>
         <View className='box'>
            <View className='title'>提示</View>
            <View className='content'>
                {content}
            </View>
            <View className='btnList'>
                <View className='back' onClick={this.props.onQuxiao}>{leftMenu}</View>
                <View className='sure' onClick={this.props.onSure}>{rightMenu}</View>
            </View>
         </View>
         <View className='cover'></View>
      </View>
    )
  }
}
