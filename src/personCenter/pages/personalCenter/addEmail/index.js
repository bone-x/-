import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import Loading from '@/components/loading'
import fetch from '@/api/request.js'
import '@/assets/personalIcon/icon.css'

import styles from './index.module.scss'

let authBaseUrl = '/authBaseUrl';
if (process.env.TARO_ENV === 'weapp' && process.env.NODE_ENV === 'development') {
  authBaseUrl = 'http://hangjiah5.beta.hqjy.com';
}

@connect(state => state.counter, { add, minus, asyncAdd })
class AddEmail extends Component {

  config = {
    navigationBarTitleText: '绑定邮箱'
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      email: '', // 邮箱
      picCode: '', // 图形验证码
      imageCode: authBaseUrl + '/api/captcha-image?' + new Date().getTime(),
      code: '', // 点击获取的验证码
      tips: '',
      count: 60, // 倒计时
      isUserable:false, // 倒计时
      liked: true, // 显示倒计时开关
      telTips: "获取手机验证码",
      userInfo: {
        email: '', // 邮箱
        phone: '', // 经处理的手机号
        mobileNo: '' // 手机号
      },
    }
  }
  

  // 慎用
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
  }

  componentDidMount() {
    fetch('getMineInfo')
    .then(res=>{
      let {userInfo} = this.state;
      userInfo.phone = res.mobile;
      userInfo.mobileNo = res.mobile;
      this.setState({userInfo})
    })
  }


  // 返回上一页(个人资料)
  goBack = () => {
    Taro.navigateBack({ delta: 1 })
  }

  // 邮箱
  handleChangeEmail = (e) => {
    this.setState({email : e.detail.value})
  }

  // 图形验证码
  handleChangePicCode = (e) => {
    this.setState({picCode : e.detail.value})
  }

  // 验证码
  // 图形验证码
  handleChangeCode = (e) => {
    this.setState({code : e.detail.value})
  }

  // 点击更新图形验证码
  updateImgCode() {
    this.setState({imageCode: authBaseUrl + '/api/captcha-image?' + new Date().getTime()});
  }



  // 点击获取验证码倒数
  getSmsCode() {
    let { count,isUserable,telTips } = this.state;
    if (count===0) {
      // console.log(count)
      this.setState({isUserable:false,count: 60,telTips:'重新发送' })
    } else {
      isUserable=false;
      count = --count;
      this.setState({ isUserable, count,telTips:count+'s'})
      this.timer=setTimeout(() => {
        this.getSmsCode();
      }, 1000);
    }
  }

    // 点击获取验证码
    getCode = () => {
      const reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
      if (this.state.email === '') {
        Taro.showToast({
          title: '请输入邮箱！',
          icon: 'none',
          duration: 2000
        })
      } else if (!reg.test(this.state.email)) {
        Taro.showToast({
          title: '输入邮箱不合法！',
          icon: 'none',
          duration: 2000
        })
      } else {
        // 发送邮箱验证码请求
        const data = {
          mobileNo: this.state.userInfo.mobileNo,
          captchaCode: this.state.picCode,
          type: 2
        };
        Taro.showLoading({ mask: true });
        fetch('getMobileCode', data).then(res => {
          Taro.hideLoading();
          Taro.showToast({
            title: res,
            icon: 'none',
            duration: 2000
          });
          this.getSmsCode();
      }).catch(() => {
        this.updateImgCode();
        Taro.hideLoading();
      })
      }
    }


  // 保存并请求
  confirm = () => {
    const reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    if (this.state.email === '' || this.state.email === null){
      Taro.showToast({
        title: '请输入邮箱账号！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.state.code === '' || this.state.code === null) {
      Taro.showToast({
        title: '请输入验证码！',
        icon: 'none',
        duration: 2000
      })
    } else if (!reg.test(this.state.email)) {
      Taro.showToast({
        title: '输入邮箱不合法！',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 绑定邮箱发送请求
      const query = {
        token: Taro.getStorageSync("token"),
        newEmail: this.state.email, // 邮箱
        otp: this.state.code, // 手机证码
        mobile: this.state.userInfo.mobileNo
      };
      fetch('updateEmailInfo', {}, query).then(res => {
        Taro.hideLoading();
        Taro.showToast({
          title: '恭喜你，修改邮箱成功，请妥善保管！',
          icon: 'success',
          duration: 2000
        })
          setTimeout(() =>{
            Taro.navigateBack();
          },500)
          Taro.navigateBack({ delta: 1 });
      }).catch(() => {
        this.updateImgCode();
        Taro.hideLoading();
        console.log('error');
      })
    }
  }


  render() {
    let { userInfo } = this.state


    let reg=new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);

    let btnstyle = {
      width: '110px',
      height: '30px',
      borderRadius: '15px',
      backgroundColor: '#FF7847',
      color: '#ffffff'
    }

    let nostyle = {}
    return (
      <View className={styles.addEmail}>
        <View className={styles.emailTitle}>
          <Text onClick={this.goBack} className='iconfont iconLeft' style={{ fontSize: '14px', color: '#666666', position: 'absolute', left: '16px', top: '0px' }}></Text>
          <Text className={styles.infoText}>绑定邮箱</Text>
        </View>
        <View style={{ padding: '0px 35px 0px 37px' }} className={styles.inputForm}>
          <View className={styles.email}>
            <Input
              className={styles.inputArea}
              name='oneEmail'
              type='text'
              placeholder='请输入绑定邮箱账号'
              placeholderStyle={{ color: '#999999' }}
              value={this.state.email}
              onChange={this.handleChangeEmail.bind(this)}
            />
          </View>
          <View><Text>{this.state.tips}</Text></View>
          <View className={styles.phone}> 
            <Text className={styles.telphone}>当前登录手机号</Text>
            {
              userInfo.phone !== '' ? <Text style={{ color: '#666666' }}>{userInfo.phone}</Text> : <Text></Text>
            }
        </View>
          <View className={styles.email}>
            <Input
              className={styles.inputArea}
              name='picCode'
              type='text'
              placeholder='请填写图形验证码'
              value={this.state.picCode}
              onChange={this.handleChangePicCode}
            />
            <Image onClick={this.updateImgCode.bind(this)} className={styles.imgCode} src={this.state.imageCode}></Image>
          </View>
          <View className={styles.email}>
            <Input
              className={styles.inputArea}
              name='code'
              type='text'
              placeholder='请输入短信验证码'
              value={this.state.code}
              onChange={this.handleChangeCode}
            />
            <View>
              <Button disabled={this.state.isUserable} ref='Btn' onClick={()=>this.getCode()} style={!reg.test(this.state.email) ? nostyle : btnstyle} className={styles.emailCode}>
                {this.state.telTips}
              </Button>
              {/* <Button style={!reg.test(this.state.email) ? nostyle : btnstyle} onClick={this.getCode} className={styles.emailCode}>
              {
                this.state.liked
                  ? '获得验证码'
                  : this.state.count + 's'
              }
              </Button> */}
            </View>
          </View>
          <View className={styles.confirm}>
            { this.state.email !== '' && this.state.picCode !== '' && this.state.code !== '' && reg.test(this.state.email) ? <Button onClick={this.confirm} type='pramiry' className={styles.lightbtn}>确定</Button> :
            <Button className={styles.graybtn} onClick={this.confirm}>确定</Button> }
          </View>
        </View>
        
      </View>
    )
  }
}

export default AddEmail
