import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtLoadMore } from "taro-ui"
import fetch from '@/api/request.js'
import PersonNews from '@/components/PersonNews'

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

class NewsInform extends Component {

  config = {
    navigationBarTitleText: '行家'
  }


  state = {
    selectTabType: 0, //判断加载的消息类型
    selectLoadCourse:0, //课程加载结束状态
    selectLoadPlatfrom:0, //平台加载状态
    listClass:[], //课程消息
    listPlatform:[], // 平台消息
    count: null, // 课程消息未读总数
    paltfromCount: null, // 平台消息未读总数
    status: 'more',
    statusCourse: 'more',
    defaultColor: false,
    defaultColor2: true,
    courseAll:1, // 所有的课程消息数目
    platfromAll:1, // 所有的平台消息数目
    page:1, // 平台页码
    pageCourse:1, // 课程页码
  }

  // 慎用
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidShow () {
    console.log('改变消息的状态')
    if (this.state.selectTabType === 0) {
     this.msgUnReadCount() //平台未读消息
     console.log(this.state.listPlatform, '返回的数据之前');
     Taro.getStorage({ key: '0' })
     .then(res => this.setState({
      listPlatform:this.state.listPlatform.map(i => {
        if ( i.msgId == res.data) {
         i.isReaded = 1;
       }
       return i;
      })
     }))
     console.log(this.state.listPlatform, '返回的数据之后');
    } else if (this.state.selectTabType === 1) {
      this.courseUnReadMsgCount() // 课程消息未读总数 
      Taro.getStorage({ key: '1' })
      .then(res => this.setState({
       listClass:this.state.listClass.map(i => {
         if ( i.msgId == res.data) {
          i.isReaded = 1;
        }
        return i;
       })
      }))  
    }
  }
  componentDidMount () {
    this.courseClick() // 课程的数据
    this.pageClick() // 平台消息的数据
    this.platnewsClick() //初次渲染平台消息的数据
    this.courseMsgCount() // 课程消息总数
    this.courseUnReadMsgCount() // 课程消息未读总数
    this.msgUnReadCount() //平台未读消息
  }

  // 请求课程消息的数据
  courseClick = () => {
    fetch('getCourseMsg', {
      SSOTOKEN:Taro.getStorageSync('token'),
      pageSize:5,
      page:this.state.pageCourse,
    }).then((res) => {
      console.log(res, '课程消息的接口')
      this.setState({
        listClass: res,
        selectLoadCourse:1,
        pageCourse:this.state.pageCourse+1,
      })
      if (res.length <= 5) {
        this.setState({
          statusCourse:'noMore'
        })
      }
    })
  }

  // 请求平台消息的数据
  pageClick() { 
    this.setState({
      defaultColor: false,
      defaultColor2: true,
    })
    fetch('getplatformMsg', {
      SSOTOKEN:Taro.getStorageSync('token'),
      pageSize:5,
      page:this.state.page,
    }).then((res) => {
      console.log(res, '平台消息接口')
      this.setState({
        listPlatform: res,
        selectLoadPlatfrom:1,
        page:this.state.page+1,
      })
      if (res.length <= 5) {
        this.setState({
          status:'noMore'
        })
      }
    })
  }

   // 课程消息点击事件
   courseNewsClick() {
    this.setState({
      defaultColor: true,
      defaultColor2: false,
      selectTabType: 1,
    })
  }
  // 平台消息点击事件
  platnewsClick() {
    this.setState({
      selectTabType: 0,
      defaultColor: false,
      defaultColor2: true
    })
  }

//  请求课程消息总数
courseMsgCount () {
  fetch('getCourseAllMsg', {
    SSOTOKEN:Taro.getStorageSync('token'),
  }).then((res) => {
    console.log(res, '课程消息总数')
    this.setState({
      courseAll:res.count
    })
  })
}

// 平台消息总数
courseMsgCount () {
  fetch('getPlatfromAllMsg', {
    SSOTOKEN:Taro.getStorageSync('token'),
  }).then((res) => {
    console.log(res, '平台消息总数')
    this.setState({
      platfromAll:res.count
    })
  })
}
// 请求未读消息
courseUnReadMsgCount () {
  fetch('getCourseUnReadMsg', {
    SSOTOKEN:Taro.getStorageSync('token'),
  }).then((res) => {
    console.log(res, '课程未读总数')
    this.setState({
     count: res.count,
    })
  })
}
// 平台未读消息
msgUnReadCount () {
  fetch('getMsgUnReadCount', {
    SSOTOKEN:Taro.getStorageSync('token'),
  }).then((res) => {
    console.log(res, '平台未读总数')
    this.setState({
     paltfromCount: res.count,
    })
  })
}

  goDetails(id) { // 跳转
    console.log(id, 'selectTypeId数据')
    Taro.navigateTo({
      url: `/personCenter/pages/personalCenter/newsDetails/index?id=${id}&type=${this.state.selectTabType}`,
    }) 
  }

  goBack() { //回退一级
    Taro.navigateBack({ delta: 1 })
  }
  loadClick = () => {
    console.log('上拉到底部触发',this.state.platfromAll,this.state.courseAll)
    // 判断要操作的容器(selectTabType)
    if (this.state.selectTabType === 0) { // 平台
    if (this.state.selectLoadPlatfrom === 1) {
        this.setState({
          defaultColor: false,
          defaultColor2: true,
          status: 'loading' // 平台加载
        })
        fetch('getplatformMsg', {
          SSOTOKEN:Taro.getStorageSync('token'),
          pageSize:5,
          page:this.state.page,
        }).then((res) => {
          console.log(res, '平台消息接口')
          if (res.length == 0) {
            this.setState({
              status: 'noMore',
              selectLoadPlatfrom:0
            })
          } else {
            // 有更多数据的时候
            let moreData = this.state.listPlatform.concat(res);
            this.setState({
            listPlatform:moreData,
            selectLoadPlatfrom:1,
            page:this.state.page+1,
            status: 'more'
          })
          }
        })
    }
    } else if (this.state.selectTabType === 1) { // 课程
      console.log('进入课程数据的上啦加载',this.state.selectTabType,'课程加载完之后的数据',this.state.selectLoadCourse)
      if (this.state.selectLoadCourse === 1) {
        console.log('课程已经加载完毕',this.state.selectTabType)
        this.setState({
          defaultColor: true,
          defaultColor2: false,
          statusCourse: 'loading' // 课程加载
        })
        fetch('getCourseMsg', {
          SSOTOKEN:Taro.getStorageSync('token'),
          pageSize:5,
          page:this.state.pageCourse,
        }).then((res) => {
          console.log(res, '课程消息接口')
          if (res.length == 0) {
            console.log('没数据了')
            this.setState({
              statusCourse: 'noMore',
              selectLoadCourse:0
            })
          } else {
            // 有更多数据的时候
            let moreData = this.state.listClass.concat(res);
            this.setState({
            listClass:moreData,
            selectLoadCourse:1,
            pageCourse:this.state.pageCourse+1,
            statusCourse: 'more'
          })
          }
        })
    }  
    }
  }

  render() {

    let styleObj = {
      color: this.state.defaultColor?'#666':'#ff7847'
    }
    let styleObj2 = {
      color: this.state.defaultColor2?'#666':'#ff7847'
    }

    let mapListData = []; // 对容器的数据进行筛选
    if (this.state.selectTabType === 0) {
      mapListData = this.state.listPlatform.concat([]);
    } else if (this.state.selectTabType === 1) {
      mapListData = this.state.listClass.concat([]);
    }

    
    return (
      
      <View className={styles.content}>
        <View className={styles.componentsPage}>
          <View style={styleObj} className={styles.button} onClick={this.platnewsClick.bind(this)}><Text className='iconfont icon-left' style={{float:'left',paddingLeft:'21px',color:'#666'}} onClick={this.goBack.bind(this)}></Text>
          平台消息{(this.state.paltfromCount!=0)&&<Text className={styles.number1}>{this.state.paltfromCount}</Text>}</View>
          <View style={styleObj2} className={styles.button} onClick={this.courseNewsClick.bind(this)}>课程消息{(this.state.count!=0)&&<Text className={styles.number}>{this.state.count}</Text>}</View>
        </View>
        <ScrollView
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style={{height:'667px',marginTop:'44px'}}
          lowerThreshold='20'
          upperThreshold='20'
          onScrollToLower={this.loadClick}
          hidden={this.state.selectTabType==0?false:true}
        >
          {
            mapListData.map((item,index) => {
              item.pushTime = timeFormat(item.pushTime);
              return <PersonNews key={index} isReaded={item.isReaded} title={item.title} describe={item.describe} pushTime={item.pushTime} ongoDetails={()=>this.goDetails(item.msgId)} />
            })
          }
          <AtLoadMore status={this.state.status} noMoreTextStyle={{
            width: '100%',
            lineHeight: '10px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#ccc',
            border: 'none',
          }} noMoreText='已无更多消息' moreBtnStyle={{
            width: '100%',
            lineHeight: '10px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#ccc',
            border: 'none',
          }}
          />
        </ScrollView>

        <ScrollView
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style={{height:'667px',marginTop:'44px'}}
          lowerThreshold='20'
          upperThreshold='20'
          onScrollToLower={this.loadClick}
          hidden={this.state.selectTabType==1?false:true}
        >
          {
            mapListData.map((item,index) => {
              item.pushTime = timeFormat(item.pushTime);
              return <PersonNews key={index} isReaded={item.isReaded} title={item.title} describe={item.describe} pushTime={item.pushTime} ongoDetails={()=>this.goDetails(item.msgId)} />
            })
          }
          <AtLoadMore status={this.state.statusCourse} noMoreTextStyle={{
            width: '100%',
            lineHeight: '10px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#ccc',
            border: 'none',
          }} noMoreText='已无更多消息' moreBtnStyle={{
            width: '100%',
            lineHeight: '10px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#ccc',
            border: 'none',
          }}
          />
        </ScrollView>
      </View>
    )
  }
}

export default NewsInform
