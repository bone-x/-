import Taro, { Component, chooseInvoiceTitle } from '@tarojs/taro'
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
class ChangeEmail extends Component {

  config = {
    navigationBarTitleText: '修改邮箱'
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userInfo: {
        email: '', // 旧邮箱
        phone: '', // 经处理的手机号
        mobileNo: '', // 手机号
      },
      telTips: "获取手机验证码",
      currEmail: '', // 当前邮箱
      newEmail: '', // 新邮箱
      picCode: '', // 输入的图形验证码
      imageCode: authBaseUrl + '/api/captcha-image?' + new Date().getTime(),
      code: '', // 验证码
      tips: '',
      count: 60, // 60s倒计时
      isUserable:false, // 倒计时
      isResend: false, // 重新发送
      isOpened: false, // 修改成功弹窗
    }

  }


  // 慎用
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
  }

  componentDidMount() {
    fetch('getMineInfo')
      .then(res => {
        let { userInfo } = this.state;
        userInfo.email = res.email;
        userInfo.phone = res.mobile;
        userInfo.mobileNo = res.mobile;
        this.setState({ userInfo })
      })


  }



  // 返回上一页(个人资料)
  goBack = () => {
    Taro.navigateBack({ delta: 1 });
  }

  // 隐藏邮箱
  emailHide(val) {
    const place = val.indexOf('@');
    return val.replace(val.slice(1, place), "***");
  }



  // 当前邮箱
  getCurrentEmail = (e) => {
    this.setState({ currEmail: e.detail.value })
  }

  // 新邮箱
  getNewEmail = (e) => {
    this.setState({ newEmail: e.detail.value })
  }

  // 图形验证码
  handleChangePicCode = (e) => {
    this.setState({ picCode: e.detail.value })
  }

  // 验证码
  handleChangeCode = (e) => {
    this.setState({ code: e.detail.value })
  }



  // 提交成功提示
  success = () => {
    this.state.setState({ isOpened: !this.state.isOpened })
  }

  // 点击更新图形验证码
  updateImgCode() {
    this.setState({ imageCode: authBaseUrl + '/api/captcha-image?' + new Date().getTime() });
  }

  // 图形验证码失去焦点提示
  warnText = () => {
    if (this.state.picCode === '') {
      Taro.showToast({
        title: '输入错误，请重新输入',
        icon: 'none',
        duration: 2000
      })
    } else {
      return this.state.picCode;
    }
  }
  //组件卸载取消倒计时
  componentWillUnmount(){
    clearInterval(this.timer);
  }


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
  getCode() {
    const reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    //文本框不为空，并且验证邮箱正则成功，给出正确提示
    if (this.state.newEmail === '') {
      Taro.showToast({
        title: '请输入新邮箱！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.state.newEmail == this.state.userInfo.email) {
      Taro.showToast({
        title: '该邮箱账号已使用，请重新输入！',
        icon: 'none',
        duration: 2000
      })
    } else if (!reg.test(this.state.newEmail)) {
      Taro.showToast({
        title: '输入邮箱不合法！',
        icon: 'none',
        duration: 2000
      })
    } else {
      const data = {
        mobileNo: this.state.userInfo.mobileNo,
        captchaCode: this.state.picCode,
        type: 2
      };
      Taro.showLoading({ mask: true });
      fetch('getMobileCode', data).then((res) => {
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

  // 邮箱正确后高亮获取验证码按钮
  btnLight() {
    let reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    this.setState({ newEmail: reg.test(this.state.newEmail) })
  }

  // 保存并请求
  confirm = () => {
    //定义正则表达式的变量:邮箱正则
    let reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    //文本框不为空，并且验证邮箱正则成功，给出正确提示
    if (this.state.picCode === '' || this.state.picCode === null) {
      Taro.showToast({
        title: '请输入图形验证码！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.state.code === '' || this.state.code === null) {
      Taro.showToast({
        title: '请输入验证码！',
        icon: 'none',
        duration: 2000
      })
    } else if (!reg.test(this.state.newEmail)) {
      Taro.showToast({
        title: '输入邮箱不合法！',
        icon: 'none',
        duration: 2000
      })
    } else if (!reg.test(this.state.newEmail)) {
      Taro.showToast({
        title: '输入邮箱不合法！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.state.newEmail == this.state.userInfo.email) {
      Taro.showToast({
        title: '该邮箱账号已使用，请重新输入！',
        icon: 'none',
        duration: 2000
      })
    } else {
      const query = {
        token: Taro.getStorageSync("token"),
        newEmail: this.state.newEmail, // 输入的新邮箱
        otp: this.state.code, // 收到的手机证码
        mobile: this.state.userInfo.mobileNo
      };
      Taro.showLoading({ mask: true });
      fetch('updateEmailInfo', {}, query).then(res => {
        Taro.hideLoading();
        Taro.showToast({
          title: '恭喜你，修改邮箱成功，请妥善保管！',
          icon: 'success',
          duration: 500
        })
        setTimeout(() => {
          Taro.navigateBack();
        }, 500)
        console.log('success');
      }).catch(() => {
        this.updateImgCode();
        Taro.hideLoading();
        console.log('error');
      })

    }

  }


  render() {
    let { userInfo } = this.state


    let reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);

    let btnstyle = {
      width: '110px',
      height: '30px',
      borderRadius: '15px',
      backgroundColor: '#FF7847',
      color: '#ffffff'
    }

    let nostyle = {}
    return (
      <View className={styles.changeEmail}>
        <View className={styles.emailTitle}>
          <Text onClick={this.goBack} className='iconfont iconLeft' style={{ fontSize: '14px', color: '#666666', position: 'absolute', left: '16px', top: '0px' }}></Text>
          <Text className={styles.infoText}>修改邮箱</Text>
        </View>
        <View className={styles.formstyle} style={{ padding: '0px 35px 0px 37px' }}>
          <View className={styles.email}>
            {
              userInfo.email !== '' ? <Text className={styles.currEmail}>当前邮箱账号<Text className={styles.emailText}>{this.emailHide(userInfo.email)}</Text></Text> : <Text className={styles.currEmail}>当前邮箱账号</Text>
            }
          </View>
          <View className={styles.email}>
            <Input
              name='newEmail'
              type='text'
              placeholder='请输入新邮箱账号'
              placeholderStyle={{ color: '#999999' }}
              value={this.state.newEmail}
              onChange={this.getNewEmail}
            />
          </View>
          <View className={styles.phone}>
            <Text className={styles.telphone}>当前登录手机号</Text>
            {
              userInfo.phone !== '' ? <Text style={{ color: '#666666' }}>{userInfo.phone}</Text> : <Text></Text>
            }
          </View>
          <View><Text>{this.state.tips}</Text></View>
          <View className={styles.email}>
            <Input
              name='picCode'
              type='text'
              placeholder='请填写图形验证码'
              value={this.state.picCode}
              onChange={this.handleChangePicCode}
              onBlur={this.warnText}
            />
            <View>
              <Image onClick={this.updateImgCode.bind(this)} className={styles.imgCode} src={this.state.imageCode}></Image>
            </View>

          </View>
          <View className={styles.email}>
            <Input
              style={{ backgroundColor: '#ffffff' }}
              name='code'
              type='text'
              placeholder='请输入验证码'
              value={this.state.code}
              onChange={this.handleChangeCode}
            />
            <View>
              <Button disabled={this.state.isUserable} ref='Btn'  onClick={()=>this.getCode()} style={!reg.test(this.state.newEmail) ? nostyle : btnstyle} className={styles.emailCode}>
                {this.state.telTips}
              </Button>
            </View>

          </View>
          <View className={styles.confirm}>
            {this.state.newEmail !== '' && this.state.picCode !== '' && this.state.code !== '' && reg.test(this.state.newEmail) && this.state.newEmail !== userInfo.email ? <Button onClick={this.confirm} type='pramiry' className={styles.lightbtn}>确定</Button> :
              <Button onClick={this.confirm} className={styles.graybtn}>确定</Button>}
          </View>
        </View>


        {/* 弹窗部分 */}
        {/* 错误消息提示 */}

        {/* 成功提示 */}
      </View>
    )
  }
}

export default ChangeEmail
