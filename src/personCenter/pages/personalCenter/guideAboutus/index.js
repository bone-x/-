import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtAccordion, AtList } from 'taro-ui'
// import { connect } from '@tarojs/redux'
// import { add, minus, asyncAdd } from '@/actions/counter'
// import Loading from '@/components/loading'
import fetch from '@/api/request.js'
// import Header from '../../MyScore/Header/Header'

import styles from './index.module.scss'
import '../staticPic/icon.scss'

// import { isNativeApp, JsBridge } from '@/utils/JsBridge';

// @connect(state => state.counter, { add, minus, asyncAdd })
class GuideAboutus extends Component {

  config = {
    navigationBarTitleText: '新手指南'
  }

  state = {
    Array: [],
    Array2: [],
    Array3: [],
    Array4: [],
    currentNavtab: 1,
    navTab: ['注册登录', '选购课程', '课程学习', '其他问题'], // TAB的头部数据
    navTab1: ['注册登录1', '选购课程', '课程学习', '其他问题'],
    navTab2: ['注册登录2', '选购课程', '课程学习', '其他问题'],
    navTab3: ['注册登录3', '选购课程', '课程学习', '其他问题'],
    navTab4: ['注册登录4', '选购课程', '课程学习', '其他问题'],
  }

  handleClick = (value) => {
    const { Array } = this.state;
    const isExpend = Array.indexOf(value);
    if (isExpend > -1) {
      Array.splice(isExpend, 1)
    } else {
      Array.push(value)
    }
    this.setState({
      Array,
    })
  }
 
  handleCourse = (value) => {
    const { Array2 } = this.state;
    const isExpend = Array2.indexOf(value);
    if (isExpend > -1) {
      Array2.splice(isExpend, 1)
    } else {
      Array2.push(value)
    }
    this.setState({
      Array2,
    })
  }

  handleStudy = (value) => {
    const { Array3 } = this.state;
    const isExpend = Array3.indexOf(value);
    if (isExpend > -1) {
      Array3.splice(isExpend, 1)
    } else {
      Array3.push(value)
    }
    this.setState({
      Array3,
    })
  }

  handleQuestion = (value) => {
    const { Array4 } = this.state;
    const isExpend = Array4.indexOf(value);
    if (isExpend > -1) {
      Array4.splice(isExpend, 1)
    } else {
      Array4.push(value)
    }
    this.setState({
      Array4,
    })
  }
  // 慎用
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    // JsBridge(null, {
    //   "code": 200,
    //   "message": "OK",
    //   "path": "title",
    //   "data": {
    //     "title": "新建问题"
    //   }
    // })
    this.getList1()
    this.getList2()
    this.getList3()
    this.getList4()
  }

  switchTab(e) {
    // 点击事件判断渲染内容
    console.log(e, '切换TAB数据')
    this.setState({
      currentNavtab: e
    })
  }

   // 获取list1
   getList1 () {
    fetch('getGuideWays', {
      type:1
    }).then((res) => {
      console.log(res, '获取TabNav的数据')
      this.setState({
        navTab1:res
      })
    })
  }
  // 获取list2
  getList2 () {
    fetch('getGuideWays', {
      type:2
    }).then((res) => {
      console.log(res, '获取TabNav的数据')
      this.setState({
        navTab2:res
      })
    })
  }
  // 获取list3
  getList3 () {
    fetch('getGuideWays', {
      type:3
    }).then((res) => {
      console.log(res, '获取TabNav的数据')
      this.setState({
        navTab3:res
      })
    })
  }
  // 获取list4
  getList4 () {
    fetch('getGuideWays', {
      type:4
    }).then((res) => {
      console.log(res, '获取TabNav的数据')
      this.setState({
        navTab4:res
      })
    })
  }

  gotoRule() { // 回退
    Taro.navigateBack({ delta: 1 })
  }
  render() {
    return (
      <View className={styles.pageContent}>
        <View className={styles.top}>
          {
            this.state.navTab&&this.state.navTab.map((item, index) => {
              return (<View className={this.state.currentNavtab === (index+1) ? (styles.topbar && styles.active) : styles.topbar} key={index} onClick={this.switchTab.bind(this, index+1)}>
                {item}
              </View>)
            })
          }
        </View>
        <ScrollView>
          <View hidden={this.state.currentNavtab == 1 ? false : true}>
            {this.state.navTab1&&this.state.navTab1.map((item, index) => {
              return (
                <AtAccordion open={this.state.Array.includes(index)} onClick={() => this.handleClick(index)} title={item.question} key={index}>
                  <AtList hasBorder={false}>
                    <View style={{ fontSize: '14px', color: '#666', padding: '15px 53px 15px 30px' }}>{item.answer}</View>
                  </AtList>
                </AtAccordion>
              )
            })}
          </View>
          <View hidden={this.state.currentNavtab == 2 ? false : true}>
            {this.state.navTab2&&this.state.navTab2.map((item, index) => {
              return (
                <AtAccordion open={this.state.Array2.includes(index)} onClick={() => this.handleCourse(index)} title={item.question} key={index}>
                  <AtList hasBorder={false}>
                    <View style={{ fontSize: '14px', color: '#666', padding: '15px 53px 15px 30px' }}>{item.answer}</View>
                  </AtList>
                </AtAccordion>
              )
            })}
          </View>
          <View hidden={this.state.currentNavtab == 3 ? false : true}>
            {this.state.navTab3&&this.state.navTab3.map((item, index) => {
              return (
                <AtAccordion open={this.state.Array3.includes(index)} onClick={() => this.handleStudy(index)} title={item.question} key={index}>
                  <AtList hasBorder={false}>
                    <View style={{ fontSize: '14px', color: '#666', padding: '15px 53px 15px 30px' }}>{item.answer}</View>
                  </AtList>
                </AtAccordion>
              )
            })}
          </View>
          <View hidden={this.state.currentNavtab == 4 ? false : true}>
            {this.state.navTab4&&this.state.navTab4.map((item, index) => {
              return (
                <AtAccordion open={this.state.Array4.includes(index)} onClick={() => this.handleQuestion(index)} title={item.question} key={index}>
                  <AtList hasBorder={false}>
                    <View style={{ fontSize: '14px', color: '#666', padding: '15px 53px 15px 30px' }}>{item.answer}</View>
                  </AtList>
                </AtAccordion>
              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default GuideAboutus
