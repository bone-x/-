
import Taro, { Component } from '@tarojs/taro'
import { View,Text} from '@tarojs/components'
export default class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = {
    //   day: 0,
      show:true,
      hour: 0,
      minute: 0,
      second: 0,
    }
  }
  componentDidMount() {
    
    let {endTime,type}=this.props;
    if(endTime){
     
      if(type===1){//有活动 2小时减去
        if(900000-endTime > 0){
          endTime= 900000-endTime
        }
      }else{
        if(7200000-endTime > 0){//无活动 15分钟减去
          endTime= 7200000-endTime;
        }
      }
      this.countFun(endTime);
    }
  }
  //组件卸载取消倒计时
  componentWillUnmount(){
    clearInterval(this.timer);
  }
  
  countFun = (time) => {
    let {show}=this.state
    this.timer = setInterval(() => {
    //防止倒计时出现负数
      if (time >= 1000) {
        time -= 1000;
        let hour = Math.floor((time / 1000 / 3600) % 24);
        let minute = Math.floor((time / 1000 / 60) % 60);
        let second = Math.floor(time / 1000 % 60);
        this.setState({
          hour:hour < 10 ? "0" + hour : hour,
          minute:minute < 10 ? "0" + minute : minute,
          second:second < 10 ? "0" + second : second
        })
      } else {
        
        this.setState({
          show:false
        })
        clearInterval(this.timer);
        //倒计时结束时触发父组件的方法
        //  this.setState({show:false})
        //this.props.timeEnd();
      }
    }, 1000);
  }
  render() {
      let {hour,minute,second,show}=this.state
      return (
          <View>
            {
              show?
              <View>
                距离超时还有<Text style={{ color:'#ff5a1f',paddingLeft:'8px'}}>{hour}:{minute}:{second}</Text>
              </View>:null
            }
             
          </View>
      )
  }
}

