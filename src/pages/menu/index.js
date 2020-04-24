import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import {getDemoList} from 'api/demo'
import Loading from '@/components/loading'

import styles from './index.module.scss'


@connect(state => state.counter, {add, minus, asyncAdd})
class Index extends Component {

  config = {
    navigationBarTitleText: '测试'
  }

  state = {
    loading: true
  }

  // 慎用
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
  }

  sendMsg () {
    Taro.request({
        url: 'http://www.baidu.com',
        method: 'GET'
    })
  }
  openMap () {
      Taro.chooseLocation({
        success: function(res) {
            console.log(res, 'res')
        }  
      })
    //   Taro.getLocation({
    //     type: 'wgs84',
    //     success: function(res) {
    //         console.log(res, 'res')
    //     //   var latitude = res.latitude
    //     //   var longitude = res.longitude
    //     //   var speed = res.speed
    //     //   var accuracy = res.accuracy
    //     }
    //   })
  }
  render () {



    return (
      <View className={styles.demo}>
        <View><Text>{this.props.num}</Text></View>
        <View><Text>Hello, World</Text></View>
        <Button  onClick={this.sendMsg}>ajax测试</Button>
        <Button  onClick={this.openMap}>调用微信sdk</Button>
      </View>
    )
  }
}

export default Index
