import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { AtLoadMore } from 'taro-ui'
// import { connect } from '@tarojs/redux'
// import { add, minus, asyncAdd } from '@/actions/counter'
import fetch from 'api/request'
import Loading from '@/components/loading'
import Header from '@/components/HomeHeader'

import Feed from '@/components/highdamage/index'
import MoreDiscount from '@/components/moreDiscount/index'
import styles from './index.module.scss'
import './../personalCenter/staticPic/icon.scss'
import hj from './hj.png'
import defaultPng from '@/assets/default-image.png'

export default class Discount extends Component  {

  config = {
    navigationBarTitleText: '行家'
  }

  state = {
    loadStatus:0, // 加载的状态
    pageNumber:1, // 页码
    loading: true,
    timeList: [],
    contentList: [],
    selectType:1, //选中Tab栏的初始值
    
    exist:true // 判断初始状态数据是否为空
  }

  // 慎用
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    
    // 时间TAb的初始化
    fetch('getShowTime',{}).then((res) => {
      console.log(res, '秒杀')
     this.setState({
      timeList: res.list,
     })
      // 遍历数据获取选中状态
      res.list.map(item =>{
       if ( item.status === 2) {
         console.log(item.value, '选中的数据')
        this.setState({
          selectType:item.value // 初始化的时候获取疯抢中的tab数据
        },()=>{
          console.log(333333, item.value)
          this.getShowContent()
        })
       }
      })
    })
  }

  loadClick = () => {
    // 上拉刷新加载数据
    //底部状态栏变成loading
    // 给一个状态位，当上拉刷新完毕的时候才可以下一次加载
    // 加载完毕判断数据是否全部加载
    // 切换另一个TAB时候，页码变成第一页

    
    if (this.state.loadStatus === 1) {
      fetch('getShowContent', {
        pageNum:this.state.pageNumber,
        pageSize:5,
        type:2,
        timeValue:this.state.selectType // 切换tab标签替换内容
      }).then((res) => {
        console.log(res.list, '加载的数据')
        if (res.list.length === 0) {
          this.setState({
            status: 'noMore'
          })
        } else {
        if (this.state.pageNumber < res.totalPage) {
        this.setState({
              contentList: res.list.concat(this.state.contentList),
              pageNumber:this.state.pageNumber+1,
              loadStatus:1
            })
          } else if (this.state.pageNumber === res.totalPage) {
            this.setState({
              status: 'noMore',
              contentList: res.list.concat(this.state.contentList),
              loadStatus:1,
              pageNumber:this.state.pageNumber+1,
            })
          }
        }
      })
    }
    console.log('上拉到底部触发事jian ')
  }

  change(val){ // 获取点击tab-Id
    this.setState({
      selectType:val,
      pageNumber:1,
      status: 'more',
      contentList:[]
    },()=>{ // 利用回调执行
      this.getShowContent()
    })
    
  }

  // 秒杀时间
  getShowtime() {
    fetch('getShowTime',{}).then((res) => {
      console.log(res, '秒杀')
     this.setState({
      timeList: res.list,
     })
    })
  }

  // 秒杀内容
  getShowContent() {
    console.log(this.state.selectType, '获取标签的内容')
    fetch('getShowContent', {
      pageNum:this.state.pageNumber,
      pageSize:5,
      type:2,
      timeValue:this.state.selectType // 切换tab标签替换内容
    }).then((res) => {
      console.log(res, '内容')
     this.setState({
      contentList: res.list,
      pageNumber:this.state.pageNumber+1,
      loadStatus:1,
      exist:true,
      loading:false
     })
     if (res.totalPage === 1) {
       this.setState({
        status: 'noMore',
       })
     } else if (res.totalCount === 0) {
      this.setState({
        exist:false,
       })
     }
    })
  }

  navigateTo(url) {
    Taro.navigateTo({url:url})
  }

  onShoping(id) {
    console.log('马上抢', id)
    Taro.navigateTo({
      url: `/learnCenter/pages/courseDetail/index?id=${id}`
    })
  }

  render() {

    
    return (
      <View className={styles.discount}>
        <Header />

        <ScrollView
          scrollX
          scrollWithAnimation
          scrollLeft='0'
          style={{width:'100%',height:'110px',paddingTop:'50px'}}
          lowerThreshold='20'
          upperThreshold='20'
        >
          <View className={styles.shoping} >
            {this.state.timeList.map(item => {
              return <Feed key={item} isItem={item.value!=this.state.selectType} name={item.statusName} time={item.label} onEvent={()=>this.change(item.value)} />
            })
            }
          </View>
        </ScrollView>

        <ScrollView
          scrollY
          scrollWithAnimation
          scrollTop='0'
          lowerThreshold='20px'
          upperThreshold='20px'
          onScrollToUpper={this.loadClick}
          // onScrollToLower={this.loadClick}
        >
          {
            this.state.contentList&&this.state.contentList.map((item,index) => {
              return <MoreDiscount key={index} name={item.name} price={item.price} activitePrice={item.activitePrice} activiteStatus={item.activiteStatus} activityRepertory={item.activityRepertory} coverPicture={item.coverPicture || defaultPng} onEvent={()=>this.onShoping(item.id)} />
            })
          }
         {this.state.exist === true ?
        <AtLoadMore onClick={this.loadClick.bind(this)} status={this.state.status} noMoreTextStyle={{
          width: '100%',
          lineHeight: '10px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#ccc',
          border: 'none',
        }} noMoreText='哎呀，没有内容啦' moreBtnStyle={{
          width: '100%',
          lineHeight: '10px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#ccc',
          border: 'none',
        }}
        />:<View><Image src={hj} style={{width:'144px',height:'265px',paddingTop:'75px',paddingBottom:'10px',display:'block',margin:'auto'}} />
        <View style={{color:'#3C3D41',textAlign:'center',fontSize:'14px'}}>暂无秒杀活动</View>
        </View>}
        </ScrollView>

        
      </View>
    )
  }
}

