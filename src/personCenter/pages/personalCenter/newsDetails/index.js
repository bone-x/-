import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, RichText} from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import { add, minus, asyncAdd } from '@/actions/counter'
import fetch from '@/api/request.js'

import styles from './index.module.scss'
import '../staticPic/icon.scss'


// 时间戳转换
function add0(m){return m<10?'0'+m:m }
function timeFormat(timestamp){

    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return year+'-'+add0(month)+'-'+add0(date)+' '+add0(hours)+':'+add0(minutes)+':'+add0(seconds);
}

// @connect(state => state.counter, {add, minus, asyncAdd})
class newsDetails extends Component {
  config = {
    navigationBarTitleText: '行家'
  }

  state = {
    nodes: '',
    picture: '',
    pushTime: '',
    id:'',
    type:'',
  }
  goDetails() { // 跳转
    Taro.navigateTo({
      url: `/personCenter/pages/personalCenter/checktxt/index?id=${this.state.id}&type=${this.state.type}`
    })
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
    Taro.setStorageSync('type', type)
    Taro.setStorage({ key: type, data: id }) // 设置消息详情的数据到全局
    .then(res => console.log(res))
    console.log(id , type, '周期执行的数据') 
    this.setState({
      id,
      type,
    })
    if (type == 0) {
      // 平台消息已读  ---400
      console.log(123123123, '平台消息已读',id)
      fetch('getPlatformNewsReadMsg',{}, 
     { SSOTOKEN: Taro.getStorageSync('token'),
      msgIds: id}).then((res) => {
        console.log(res, '平台消息已读',this.state.id)
      })
      // 平台消息详情--200
      fetch('getPlatefromDetails', {
        SSOTOKEN:Taro.getStorageSync('token'),
        msgId:id
      }).then((res) => {
        console.log(res, '平台消息返回详情')
        this.setState({
          nodes: res.pushText,
          picture: res.picture,
          pushTime:res.pushTime,
        })
      })
    } else {
      fetch('getCourseReadMsg', {}, {
        SSOTOKEN: Taro.getStorageSync('token'),
        msgIds: id,
      }).then((res) => {
        console.log(res, '课程消息已读')
      })
      // getCourseDetails 课程查看详情
      fetch('getCourseDetails', {
        SSOTOKEN:Taro.getStorageSync('token'),
        msgId:id
      }).then((res) => {
        console.log(res, '课程消息详情')
        this.setState({
          nodes: res.pushText,
          picture: res.picture,
          pushTime:res.pushTime,
        })
      })
    }
   
  }

  defaultProps = {
    mark: ""
}
  
platefromDetails () {
  fetch('getPlatefromDetails', {
    SSOTOKEN:Taro.getStorageSync('token'),
    // msgId: this.state.msgIds
  }).then((res) => {
    console.log(res, '平台消息返回详情')
  })
}

  render () {

    return (
      <View className={styles.details}>
         <View className={styles.title}><Text className='iconfont icon-left' style={{ position: 'absolute', left: '21px' }} onClick={this.goBackClick.bind(this)}></Text>消息详情</View>
         {this.state.picture?<View style='padding: 25px 18px 30px 18px;'><Image src={this.state.picture} className={styles.img} /></View>:<View style='height:50px;'></View>}
         <View className={styles.div}>
              <View className={styles.newsInfrom}>新的考试通知</View>
              <View className={styles.timer}> <Text className='iconfont icon-shijian' style={{fontSize:'15px',marginRight:'5px'}}></Text>{timeFormat(this.state.pushTime)}</View>
              <View className={styles.text}><RichText className={styles.richtext}  nodes={this.state.nodes} /></View>
          <View onClick={this.goDetails.bind(this)} className={styles.txt}><Text className='iconfont icon-fujian1' style={{fontSize:'15px',marginRight:'5px'}}></Text>查看附件</View>
         </View>
      </View>
    )
  }
}

export default newsDetails
