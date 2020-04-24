import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import GlobalTabbar from '@/components/global-tabbar'
import fetch from '@/api/request.js'
import {delCookie} from '@/utils/timeFormat.js'
import noLoginDefalutPng from '@/assets/noLoginDefalut.png'
import defaultLogoPng from '@/assets/defaultLogo.png'
import '@/assets/personalIcon/icon.css'

import styles from './index.module.scss'



@connect(state => state.counter, { add, minus, asyncAdd })
class PersonalCenter extends Component {

  config = {
    navigationBarTitleText: '个人中心'
  }

  constructor(props){
    super(props)
    this.state = {
      userInfo: {
        avatar: "",
        nickName: "",
        gender: 0,
        idCard: "",
        mobile: "",
        mobileNo: "",
        name: "",
        nickName: "",
        schoolId: "",
        status: 0,
        uid: "",
        wxNickname: "",
        wxUnionid: "",
        msgNum: '',
        goodsCount: '' // 购物车商品数量
      },
      totalPoint: '', // 积分
      goodsCount: '', // 购物车数量
      courseCount: '', // 课程数量
      platformCount: '', // 平台消息
      msgTotalCount: '', // 消息总条数
      courseCard: '', // 听课卡张数
      dateSelected: true
    }
  }
  
  // 慎用
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
  }

  componentDidMount() {
    this.getPersonalInfo(); 
    this.setState({msgTotalCount: this.state.courseCount + this.state.platformCount}); // 总消息条数
    this.getGoodsNum(); // 获取商品数量
    this.courseMsgCount (); // 课程总消息
    this.platMsgCount(); // 平台总消息
    this.getCourseCount(); // 听课卡张数
  }

  // 个人信息数据请求
  getPersonalInfo() {
    if (Taro.getStorageSync('token') !== '') {
      fetch('getMineInfo')
      .then(res=>{
        let {userInfo} = this.state;
        userInfo.avatar = res.avatar;
        userInfo.nickName = res.nickName;
        this.setState({userInfo});
      })
    } else {
      return false;
    }
  }

  //  请求课程消息总数, platformCount, msgTotalCount
  courseMsgCount () {
    let {courseCount} = this.state;
    if (Taro.getStorageSync('token') !== '') {
      fetch('getCourseAllMsg', {
        SSOTOKEN: Taro.getStorageSync('token'),
      }).then((res) => {
        courseCount = res.count;
        this.setState({courseCount});
      })
    } else {
      return false;
    }
    
  }

  // 平台消息总数
  platMsgCount () {
    let {platformCount} = this.state;
    if (Taro.getStorageSync('token') !== '') {
      fetch('getPlatfromAllMsg', {
        SSOTOKEN: Taro.getStorageSync('token'),
      }).then((res) => {
        platformCount = res.count;
        this.setState({platformCount})
      })
    } else {
      return false;
    }
    
  }


  // 购物车请求
  getGoodsNum() {
    let {totalPoint, goodsCount} = this.state;
    if (Taro.getStorageSync('token') !== '') {
      fetch('getCarList')
      .then(res=>{
        totalPoint = res.allPoint;
        if (!res.goodsInfoDTOList) {
          goodsCount = '';
        } else {
          goodsCount = res.goodsInfoDTOList.length;
        } 
        console.log('you', res)
        this.setState({totalPoint, goodsCount});
      })
    } else {
      return false;
    }
    
  }

  // 获取听课卡张数
  getCourseCount() {
    let {courseCard} = this.state;
    if (Taro.getStorageSync('token') !== '') {
      fetch('getListenCardList',{
        token: Taro.getStorageSync('token'),
      })
      .then(res=>{
        if (res.list === null) {
          courseCard = '';
        } else {
          courseCard = res.totalCount;
        }
        this.setState({courseCard});
      })
    } else {
      return false;
    }
  }

  // 更换头像
  handleMask() {
    this.setState({
       dateSelected: !this.state.dateSelected
    })
  }

  // 跳转消息
  goMessage = () => {
    if (Taro.getStorageSync('token') !== '') {
      Taro.navigateTo({ url: '/personCenter/pages/personalCenter/newsInform/index' })
    } else {
      this.toLogin()
    }
  }

  // 跳转个人资料
  goPersonalData = () => {
    if (Taro.getStorageSync('token') !== '') {
      Taro.navigateTo({ url: '/personCenter/pages/personalCenter/personalData/index' })
    } else {
      this.toLogin()
    }
    
  }

  // 跳转到登录页面
  goLogin = () => {
    Taro.navigateTo({ url: '/pages/loginPage/index' });
  }

  // 跳转到注册页面
  goRegister = () => {
    Taro.navigateTo({ url: '/pages/register/index' });
  }

  // 退出登录
  quit() {
    const query = Taro.getStorageSync('token');
    fetch('logout',{}, {token: query})
    .then(res=>{
        delCookie('token')
        Taro.showToast({
          title: '退出成功！',
          icon: 'none',
          duration: 2000
        });
        Taro.removeStorageSync('token');
        Taro.navigateTo({ url: '/pages/home/index' }); 
    })
      .catch(err => {
        console.log(err);
      })
  }

  // 默认图片
  noFind(event){
    this.setState({
      userInfo: Object.assign({}, this.state.userInfo, { avatar: defaultLogoPng }),
    })
  }


  toLogin () {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.navigateTo({ url: '/pages/bindPhone/index' });
    } else {
      Taro.navigateTo({ url: '/pages/loginPage/index' });
    }
  }

  // 跳转我的订单
  myOrder = () => {
    if (Taro.getStorageSync('token') !== '') {
      Taro.navigateTo({ url: '/pages/myOrder/index' })
    } else {
      this.toLogin()
    }  
  }

  // 跳转我的听课卡
  myListenCard = () => {
    if (Taro.getStorageSync('token') !== '') {
      Taro.navigateTo({ url: '/pages/listenCard/index' })
    } else {
      this.toLogin()
    }  
  }

  // 跳转积分
  goPoint = () => {
    if (Taro.getStorageSync('token') !== '') {
      Taro.navigateTo({ url: '/pages/MyScore/index' })
    } else {
      this.toLogin()
    }
  }

  // 跳转购物车
  goShoppingCar = () => {
    if (Taro.getStorageSync('token') !== '') {
      Taro.navigateTo({ url: '/pages/car/index' })
    } else {
      this.toLogin()
    }
    
  }

  // 跳转意见反馈
  goFeedback = () => {
    if (Taro.getStorageSync('token') !== '') {
      Taro.navigateTo({ url: '/personCenter/pages/personalCenter/feedback/index' })
    } else {
      this.toLogin()
    }
  }

  // 跳转新手指南
  goGuide = () => {
    if (Taro.getStorageSync('token') !== '') {
      Taro.navigateTo({ url: '/personCenter/pages/personalCenter/guideAboutus/index' })
    } else {
      this.toLogin()
    }
  }

  // 跳转关于行家
  goAboutUs = () => {
    if (Taro.getStorageSync('token') !== '') {
      Taro.navigateTo({ url: '/personCenter/pages/personalCenter/guideAboutus/aboutUs' })
    } else {
      this.toLogin()
    }

  }

  
  render() {
    let{userInfo}=this.state

    let iconstyle = {
      fontSize: '14px',
      color: '#999999',
      marginLeft: '9px'
    }

    return (
      <View className={styles.personalCenter}>
        <View className={styles.photo}>
          <Image src='http://hq-auth.oss-cn-shenzhen.aliyuncs.com/assets/pcbg.png' className={styles.bgImg}></Image>
          <View className={styles.maskView}></View> 
          <View className={styles.changePhoto} onClick={this.goMessage}>
            <Text className='iconfont iconxiaoxi1' style={{ fontSize: '22px', color: '#666666', textAlign: 'right' }}></Text>
            {
              this.state.msgTotalCount === '' ? '' : <View className={styles.shadow}><View className={styles.message}><Text className={styles.msgNum}>{this.state.msgTotalCount}</Text></View></View>
            } 
          </View>
          {
            Taro.getStorageSync('token') !== '' ?
            <View className={styles.picture} onClick={this.goPersonalData}>
              <View className={styles.myAvatar}>
                {
                  userInfo.avatar === '' ? <Image style={{ width: '75px', height: '75px', borderRadius: '50%', display: 'inline-block', borderRadius: '50%' }} src={defaultLogoPng}>
                  </Image> : <Image onError={this.noFind.bind(this)} style={{ width: '75px', height: '75px', display: 'inline-block', borderRadius: '50%' }} src={userInfo.avatar}>
                </Image>
                } 
                
              </View>
            {
              this.state.userInfo.nickName === '' ? <Text className={styles.text}>待完善</Text> :
              <Text className={styles.text} onClick={this.changePhoto}>{userInfo.nickName}</Text>
            }
            </View> : 
            <View className={styles.picture}>
              <View onClick={this.toLogin}>
                <Image className={styles.avatar} style={{pointerEvents: 'none', width: '75px', height: '75px', display: 'inline-block', borderRadius: '50%' }} src={noLoginDefalutPng}></Image>   
              </View>
              <View className={styles.text}>
                <Text onClick={this.toLogin}>登录</Text>
                <Text onClick={this.goRegister}>/注册</Text>
              </View>
            </View>
          }
        </View>
        <View className={styles.mine}>
          <View  onClick={this.myOrder} className={styles.order}>
            <Text className={styles.myText}>我的订单</Text>
            <Text style={iconstyle} className='iconfont iconright'></Text>
          </View>
          <View onClick={this.goPoint} className={styles.order}>
            <Text className={styles.myText}>我的积分</Text>
            <View>
              <Text style={{ color: '#FF5A1F', fontSize: '14px', marginRight: '0px' }}>{this.state.totalPoint === '' ? '' : this.state.totalPoint}</Text>
              <Text style={{ color: '#9a9a9a', fontSize: '14px', marginLeft: '4px' }}>{this.state.totalPoint === '' ? '' : '积分'}</Text>
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View>
          </View>
          <View  onClick={this.myListenCard} className={styles.order}>
            <Text className={styles.myText}>我的听课卡</Text>
            <View>
              <Text style={{ color: '#FF5A1F', fontSize: '14px', marginRight: '0px' }}>{this.state.courseCard === '' ? '' : this.state.courseCard}</Text>
              <Text style={{ color: '#9a9a9a', fontSize: '14px', marginLeft: '4px', marginRight: '4px' }}>{this.state.courseCard === '' ? '' : '张'}</Text>
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View>
          </View>
          <View onClick={this.goShoppingCar} className={styles.orderData}>
            <Text className={styles.myText}>我的购物车</Text>
            <View>
              <Text style={{ color: '#FF5A1F', fontSize: '14px', marginRight: '0px' }}>{this.state.goodsCount === '' ? '' : this.state.goodsCount}</Text>
              <Text style={{ color: '#9a9a9a', fontSize: '14px', marginLeft: '4px', marginRight: '4px' }}>{this.state.goodsCount === '' ? '' : '件商品'}</Text>
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View>
          </View>
          <View onClick={this.goPersonalData} className={styles.orderData}>
            <Text className={styles.myText}>个人资料</Text>
            <Text style={iconstyle} className='iconfont iconright'></Text>
          </View>
          <View onClick={this.goFeedback} className={styles.order}>
            <Text className={styles.myText}>意见反馈</Text>
            <Text style={iconstyle} className='iconfont iconright'></Text>
          </View>
          <View onClick={this.goGuide} className={styles.order}>
            <Text className={styles.myText}>新手指南</Text>
            <Text style={iconstyle} className='iconfont iconright'></Text>
          </View>
          <View onClick={this.goAboutUs} className={styles.orderData}>
            <Text className={styles.myText}>关于我们</Text>
            <Text style={iconstyle} className='iconfont iconright'></Text>
          </View>
          {
            Taro.getStorageSync('token') !== '' ? <View onClick={this.quit} className={styles.aboutData}><Text className={styles.quitBtn}>退出登录</Text></View> : ''
          }
        </View>
        {/* 底部tabbar */}
        <GlobalTabbar current={3}></GlobalTabbar>
      </View>
    )
  }
}

export default PersonalCenter
