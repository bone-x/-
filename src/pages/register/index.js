import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import { AtButton, AtMessage } from 'taro-ui'
import styles from './index.module.scss'
import InputWrap from '@/components/input_wrap'
import FormRule from '@/components/Form_rule'
import fetch from '@/api/request'
import URI from 'urijs'
import { Base64 } from 'js-base64'
import { getCookie } from '@/utils/timeFormat.js';

//img
import focus_img from './img/focus.png'
import no_focus_img from './img/no_focus.png'
import arrow_img from './img/arrow.png'

let hasSendSMS = false
function validateRepeat(item, formData) {
  return Boolean(item === formData.passWord)
}

@connect(
  state => state.counter,
  { add, minus, asyncAdd }
)
class Register extends Taro.Component {
  constructor(props) {
    super(props)
    this.passwordLengthLimit = 6
  }
  config = {
    navigationBarTitleText: '注册'
  }

  state = {
    actived: {
      validate: false
    },
    hash: 0,
    count: 0,
    formData: {
      mobileNo: null,
      passWord: null,
      otp: null,
      firstpassWord: null,
      captchaCode: null
    },
    rule: {
      mobileNo: {
        reg: '^1[3456789]\\d{9}$',
        msg: '手机号错误'
      },
      otp: {
        require: true,
        msg: '请输入短信验证码'
      }
    },
    actived_register: false,
    isFocus: false,
    loading: false
  }
  //   getSmS
  // validateSmS
  componentWillMount() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      if (window.location.href.indexOf('isAgree') > -1) {
        this.changeFocus()
      }
      if (
        window.location.href.indexOf('regPhone') > -1 ||
        window.location.href.indexOf('regCode') > -1
      ) {
        let obj = URI(window.location.href).search(true)
        this.setState({
          formData: {
            mobileNo: obj.regPhone,
            otp: obj.regCode
          }
        })
      }
    }
  }
  componentDidMount() {}
  doRegister() {
    if (!this.state.isFocus) {
      Taro.showToast({
        title: '请阅读并同意协议',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.refs.validate.state.formData.mobileNo) {
      Taro.showToast({
        title: '请填写手机号',
        duration: 2000
      })
      return
    }
    if (!this.refs.validate.state.formData.otp) {
      Taro.showToast({
        title: '请填写验证码',
        duration: 2000
      })
      return
    }
    //头部玩家
    const {
      channelTypeId,
      activityId,
      callBackUrl,
      uid,
      type
    } = this.$router.params

    let newActivityId = ''
    if (activityId && activityId != 'null') {
      newActivityId = activityId
    } else {
      newActivityId = 1
    }

    let { formData } = this.refs.validate.state
    formData = JSON.parse(JSON.stringify(formData))
    formData.passWord = Base64.encode(formData.passWord)
    formData.channelType = uid || channelTypeId //channelId
    formData.activityId = newActivityId //活动ID
    formData.redirectUrl = callBackUrl || window.location.href //回调地址
    this.setState({
      loading: true
    })
    formData.clientType = 'web'

    return fetch('register', {
      mobileNo: formData.mobileNo,
      otp: formData.otp,
      clientType: 'web',
      channelType:formData.channelType,
      activityId:formData.activityId,
      redirectUrl: '/'
    }).then(res => {
      Taro.setStorageSync('token', Taro.setStorageSync('token',res.data.token))
      this.setState({
        loading: false
      })
      Taro.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        if (type) {
          let uri = new URI(window.location.href)
          let newUri = null
          let queryData = ''
          if (uri.toString().indexOf('#') > -1) {
            queryData = URI(uri.fragment()).search(true)
            queryData['callbackType'] = 'reg'
          } else {
            queryData = uri.search(true)
            queryData['callbackType'] = 'reg'
          }
          queryData['activityId'] = newActivityId
          queryData['channelTypeId'] = this.$router.params.channelTypeId
          queryData['callBackUrl'] = ''
          let hostUrl = uri.hostname()
          if (type == 'headActivity') {
            newUri = new URI(
              `http://${hostUrl}/ac/headActivity/index.html`
            ).query(queryData)
          } else if (type == 'huawei') {
            newUri = new URI(`http://${hostUrl}/ac/huawei/index.html`).query(
              queryData
            )
          }
          window.location.href = newUri.toString()
        } else {
          Taro.navigateTo({
            url: '/pages/setPassWord/index?isFirst=true'
          })
          console.log()
        }
      }, 2000)
    })
  }
  changeFocus() {
    let status = !this.state.isFocus
    this.setState({
      isFocus: status
    })
  }
  addInput(value, key, cate = 'validate') {
    let { actived } = this.state
    this.refs[cate].add(key, value)
    if (
      this.refs.validate.state.formData.mobileNo &&
      this.refs.validate.state.formData.otp
    ) {
      this.setState({
        actived_register: true
      })
    } else {
      this.setState({
        actived_register: false
      })
    }

    // let repeatCheck = () => {
    //   const { firstpassWord, passWord } = this.refs.validate.state.formData
    //   console.log(firstpassWord, passWord, firstpassWord === passWord)
    //   if (
    //     firstpassWord === passWord &&
    //     firstpassWord.length >= this.passwordLengthLimit
    //   )
    //     return true
    //   else throw 'error'
    // }
  }
  toRegister() {
    Taro.navigateTo({
      url: '/pages/register/index'
    })
  }
  goLogin() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.navigateTo({
        url: '/pages/bindPhone/index'
      })
    }
    Taro.navigateTo({
      url: '/pages/loginPage/index'
    })
  }
  goAgreement() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      Taro.navigateTo({
        url: `/personCenter/pages/personalCenter/signLog/index?regPhone=${
          this.refs.validate.state.mobileNo
        }&regCode=${this.refs.validate.otp}`
      })
    } else {
      Taro.navigateTo({
        url: '/personCenter/pages/personalCenter/signLog/index'
      })
    }
  }
  sendSMS() {
    if (this.state.count) {
      return
    }
    hasSendSMS = true
    this.setState({
      count: 60,
      hash: Date.parse(new Date())
    })
    const countdown = setInterval(() => {
      let now = this.state.count - 1
      this.setState({
        count: now
      })
      if (now <= 0) {
        clearInterval(countdown)
      }
    }, 1000)
    const { formData } = this.refs.validate.state
    // 干正事
    fetch('getMsgCode', { mobileNo: formData.mobileNo, type: 1 })
      .then(() => {
      })
      .catch(res => {
        this.setState({
          count:0
        })
        clearInterval(countdown)
        Taro.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      })
  }
  render() {
    return (
      <View className={styles.register}>
        <FormRule
          formData={this.state.formData}
          rule={this.state.rule}
          ref="validate"
        >
          <InputWrap
            onInput={value => this.addInput.apply(this, [value, 'mobileNo'])}
            placeholder="请输入手机号码"
          />
          <InputWrap
            onInput={value => this.addInput.apply(this, [value, 'otp'])}
            placeholder="短信验证码"
            hasRight
          >
            <View
              className={[
                styles.button_send,
                this.state.actived_send && !this.state.count
                  ? styles.avtive
                  : ''
              ]}
              onClick={this.sendSMS.bind(this)}
            >
              {this.state.count || `获得验证码`}
            </View>
          </InputWrap>
          {/* <InputWrap
            onInput={value =>
              this.addInput.apply(this, [value, 'firstpassWord'])
            }
            placeholder="输入密码，长度不小于6位"
            type="password"
          />
          <InputWrap
            onInput={value => this.addInput.apply(this, [value, 'passWord'])}
            placeholder="确认密码"
            type="password"
          /> */}
        </FormRule>
        <View className={styles.contract}>
          <Image
            className={styles.image}
            src={this.state.isFocus ? focus_img : no_focus_img}
            onClick={this.changeFocus.bind(this)}
          />
          <Text onClick={this.changeFocus.bind(this)}>阅读并且同意 </Text>
          <Text className={styles.agree} onClick={this.goAgreement.bind(this)}>
            行家服务协议
          </Text>
        </View>
        <AtButton
          type="primary"
          loading={this.state.loading}
          className={[
            styles.button_sure,
            this.state.actived_register && this.state.isFocus
              ? styles.avtive
              : ''
          ]}
          onClick={this.doRegister.bind(this)}
        >
          立即注册
        </AtButton>
        <View onClick={this.goLogin} className={styles.login}>
          已注册或有恒企账号 马上登陆{' '}
          <Image className={styles.image} src={arrow_img} />
        </View>
        <AtMessage />
      </View>
    )
  }
}

export default Register
