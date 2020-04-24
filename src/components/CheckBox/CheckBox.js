import Taro, { Component } from '@tarojs/taro'
import { View,Text} from '@tarojs/components'
import '../../styles/iconfont.scss'
import './CheckBox.scss'
export default class CheckBox extends Component {
    constructor(props){
        super(props)
    }
  render() {
      let {active=[],itemId}=this.props
       return (
            <Text onClick={this.props.onSelect} className={active.includes(itemId)? 'iconfont iconxuanzhong' : 'iconfont iconweixuanzhong'}></Text>
         )
  }
}
