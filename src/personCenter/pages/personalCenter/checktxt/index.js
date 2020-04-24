import Taro, { Component } from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import { add, minus, asyncAdd } from '@/actions/counter'
import fetch from '@/api/request.js'

import styles from './index.module.scss'
import '../staticPic/icon.scss'



// @connect(state => state.counter, {add, minus, asyncAdd})
class Checktxt extends Component {

  config = {
    navigationBarTitleText: '行家'
  }
  navigateTo(url) {
    Taro.navigateTo({url:url})
  }
  state = {
    list: [],
    id:'',
    type:'',
  }
  goBackClick() {
    Taro.navigateBack({ delta: 1 })
  }

  // 慎用
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    console.log(this.$router.params, '获取页面的msgId')
    const {id, type} = this.$router.params;
    console.log(id , type, '周期执行的数据') 
    this.setState({
      id,
      type,
    })
    if (type == 0) {
      // 平台消息详情--200
      fetch('getPlatefromDetails', {
        SSOTOKEN:Taro.getStorageSync('token'),
        msgId:id
      }).then((res) => {
        console.log(res, '平台消息返回详情')
        this.setState({
         list:res.fileList
        })
      })
    } else {
      // getCourseDetails 课程查看详情
      fetch('getCourseDetails', {
        SSOTOKEN:Taro.getStorageSync('token'),
        msgId:id
      }).then((res) => {
        console.log(res, '课程消息详情')
        this.setState({
          list:res.fileList
         })
      })
    }

  }

  render () {
    return (
      <View className={styles.checktxt}>
        <View className={styles.title}><Text className='iconfont icon-left' style={{ position: 'absolute', left: '21px' }} onClick={this.goBackClick.bind(this)}></Text>查看附件</View>
        {
          this.state.list&&this.state.list.map((item ,index) => {
            return <View key={item} onClick={this.navigateTo.bind(this,item.fileUrl)}>
              {(index%2) === 0 && <View className={styles.txt} ><Text className='iconfont icon-fujian1' style={{fontSize:'15px',marginRight:'18px'}}></Text>附件 {item.fileName}</View>}
              {(index%2) === 1 && <View className={styles.txt} style={{background:'#FFF5F5F5'}}><Text className='iconfont icon-fujian1' style={{fontSize:'15px',marginRight:'18px'}}></Text>附件 {item.fileName}</View>}
            </View>
            
          })
        }
       
      </View>
    )
  }
}

export default Checktxt
