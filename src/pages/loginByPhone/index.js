import Taro, { Component } from '@tarojs/taro'
import { View, Image, Input, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import { AtButton } from 'taro-ui'
import styles from './index.module.scss'
import InputWrap from '@/components/input_wrap'
import FormRule from '@/components/Form_rule'
import fetch from '@/api/request'
import { Base64 } from 'js-base64'
import { getCookie, delCookie } from '@/utils/timeFormat.js'
import URI from 'urijs'

@connect(
  state => state.counter,
  { add, minus, asyncAdd }
)
class loginByPhone extends Component {
  config = {
    navigationBarTitleText: '免密登录'
  }
  constructor(arg) {
    super(arg)
    this.state = {
      loading: false,
      count: 0,
      codeText: '获取验证码',
      actived: {
        validate: false
      },
      formData: {
        mobileNo: null,
        code: null
      },
      rule: {
        mobileNo: {
          reg: '^1[3456789]\\d{9}$',
          msg: '手机号错误'
        },
        passWord: {
          require: true,
          msg: '手机号错误'
        }
      }
    }
  }
  onAccountChange(value) {
    const formData = this.state.formData
    formData.name = value.detail.value
    this.setState({
      formData,
      actived: Boolean(
        Object.entries(formData).find(([Index, item]) => {
          console.log(Index, item)
          return item
        })
      )
    })
  }
  addInput(value, key, cate = 'validate') {
    let { actived } = this.state
    this.refs[cate].add(key, value)
    this.refs[cate]
      .checkFilled()
      .then(() => {
        actived[cate] = true
        this.setState({
          actived
        })
      })
      .catch(() => {
        actived[cate] = false
        this.setState({
          actived
        })
      })
  }
  sendSMS() {
    console.log('获取验证码')
    if (this.state.count || !this.refs.validate.state.formData.mobileNo) {
      console.log(this.state.count)
      console.log(this.refs.validate.state)
      console.log('return')
      return
    }
    this.refs.validate.checkRule(['mobileNo']).then(res => {
      const { mobileNo } = this.refs.validate.state.formData
      console.log(mobileNo)
      fetch('getCode', { mobileNo, type: 2 }).then(() => {
        this.setState({
          count: 60
        })
        const countdown = setInterval(() => {
          let now = this.state.count - 1
          this.setState({
            count: now,
            codeText: now + 's'
          })
          if (now <= 0) {
            this.setState({
              codeText: '获取验证码'
            })
            clearInterval(countdown)
          }
        }, 1000)
      })
    })
  }
  doLogin(value) {
    this.setState({
      loading: true
    })
    let { formData } = JSON.parse(JSON.stringify(this.refs.validate.state))
    fetch(
      'loginByCode',
      {},
      Object.assign(formData, {
        mobileNo: formData.mobileNo,
        otp: formData.code,
        clientType: 'wp',
        versionCode: '144'
      })
    )
      .then(res => {
        Taro.setStorageSync('token', res.token)
            Taro.navigateTo({
              url: '/pages/home/index'
            })
            this.setState({
              loading: false
            })
        })
      .catch((err) => {
        this.setState({
          loading: false
        })
      })
  }

  toRegister() {
    let uri = new URI(window.location.href)
    let newUri = null
    if (uri.toString().indexOf('#') > -1) {
      newUri = new URI('/pages/register/index').query(URI(uri.fragment()).query())
    } else {
      newUri = new URI('/pages/register/index').query(uri.query())
    }
    Taro.navigateTo({
      url: newUri.toString()
    })
  }
  toFindPass() {
    let uri = new URI(window.location.href)
    let newUri = null
    if (uri.toString().indexOf('#') > -1) {
      newUri = new URI('/pages/findPassword/index').query(
        URI(uri.fragment()).query()
      )
    } else {
      newUri = new URI('/pages/findPassword/index').query(uri.query())
    }
    Taro.navigateTo({
      url: newUri.toString()
    })
  }
  loginByCount() {
    Taro.navigateTo({
      url: '/pages/loginPage/index'
    })
  }

  render() {
    return (
      <View className={styles.login}>
        <View className={styles.title}>
          <Text className={['iconfont iconhangjia-xuanzhong', styles.icon]} />
          &nbsp;
          <Text>行家</Text>
        </View>
        <FormRule
          formData={this.state.formData}
          rule={this.state.rule}
          ref="validate"
        >
          <InputWrap
            placeholder="请输入手机号"
            onInput={value => this.addInput.apply(this, [value, 'mobileNo'])}
          />
          <View className={styles.PhoneCode}>
            <InputWrap
              className={styles.input}
              placeholder="短信验证码"
              type="number"
              onInput={value => this.addInput.apply(this, [value, 'code'])}
            />
            <View
              className={styles.getPhoneCode}
              onClick={this.sendSMS.bind(this)}
            >
              {this.state.codeText}
            </View>
          </View>
        </FormRule>
        <AtButton
          loading={this.state.loading}
          type="primary"
          className={[
            styles.button_sure,
            this.state.actived.validate ? styles.actived : ''
          ]}
          onClick={this.doLogin.bind(this)}
        >
          登录
        </AtButton>
        <AtButton
          className={[styles.button_register]}
          onClick={this.toRegister.bind(this)}
        >
          注册
        </AtButton>
        <View className={styles.button_forget_password}>
          <Text
            className={[styles.subscript, styles.leftSide]}
            onClick={this.loginByCount.bind(this)}
          >
            账号登录
          </Text>
          <Text
            className={[styles.subscript, styles.rightSide]}
            onClick={this.toFindPass.bind(this)}
          >
            忘记密码？
          </Text>
        </View>
      </View>
    )
  }
}
export default loginByPhone
