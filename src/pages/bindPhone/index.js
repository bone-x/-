import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtMessage } from 'taro-ui'
import styles from './index.module.scss'
import InputWrap from '@/components/input_wrap'
import FormRule from '@/components/Form_rule'
import fetch from '@/api/request'
import { Base64 } from 'js-base64';
import { asyncLogin } from '@/actions/login'

@connect(state => state.loginReducer, { asyncLogin })
class bindPhone extends Taro.Component {

  config = {
    navigationBarTitleText: '登陆'
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
        msg: '手机号错误',
      },
      passWord: {
        require: true,
        msg: '请输入密码'
      }
    }
  }
//   getSmS
// validateSmS
  doBindPhone () {
    if (!this.state.actived_bindPhone) return false
    let {formData} = this.refs.validate.state
    formData = JSON.parse(JSON.stringify(formData))
    formData.passWord =  Base64.encode(formData.passWord)
    // Taro.setStorageSync('token', '80e8cec28000016a9a97782080000090')
    this.props.asyncLogin(formData)
    // Taro.navigateTo({
    //   url: '/pages/home/index'
    // })
    // fetch('validateSmS', {}, {...formData}).then(res => {
      // fetch('bindWechat', {}, formData).then(res => {
      //   Taro.showToast({
      //     title: '注册成功',
      //     icon: 'success',
      //     duration: 2000
      //   })
      // })
    // })
  }
  addInput(value, key, cate = 'validate') {
    let { actived } = this.state
    this.refs[cate].add(key, value)
    let repeatCheck = () => {
      const {firstpassWord, passWord} = this.refs.validate.state.formData
      console.log(firstpassWord, passWord, firstpassWord === passWord)
      if (firstpassWord === passWord) return true
      else throw 'error'
    }
    this.refs.validate.checkRule(['captchaCode']).then(res => {
      this.setState({
        actived_send: true
      })
      this.refs.validate.checkRule().then(repeatCheck).then(res => {
        this.setState({
          actived_bindPhone: true
        })
      }).catch(res => {
        this.setState({
          actived_bindPhone: false
        })
      })
    }).catch(res => {
      this.setState({
        actived_send: false
      })
    })
  }
  toRegister () {
    Taro.navigateTo({
      url: '/pages/register/index'
    })
  }
  sendSMS () {
    if (this.state.count) return
    this.refs.validate.checkRule(['mobileNo', 'captchaCode']).then(res => {
      const {formData} = this.refs.validate.state
      // 干正事
      fetch('getSmS', {...formData, type: 2}).then(() => {
        this.setState({
          count: 60
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
      }).catch(res => {
        this.getCatpcha()
      })
    }).catch(res => {
      Taro.atMessage({
        'message': res.msg,
        'type': 'error',
      })
    })
  }
  toBindPhone () {
    Taro.navigateTo({
      url: '/pages/bindPhone/index'
    })
  }
  toFindPass () {
    Taro.navigateTo({
      url: '/pages/findPassword/index'
    })
  }
  arrayBufferToBase64( buffer ) {
    let binary = '';
    let bytes = new Uint8Array( buffer );
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}
  getCatpcha () {
    fetch('getCaptcha', {
      hash: Date.parse(new Date())
    }).then(res => {
      const base64Data = this.arrayBufferToBase64(res.data)

      if(Taro.getEnv() === Taro.ENV_TYPE.WEB) {
        this.setState({
          captchaCode: `data:image/jpeg;base64,${base64Data}`
        })
      } else {
        this.setState({
          captchaCode: `data:image/jpeg;base64,${res.data}`
        })
      }
    })
  }
  componentDidMount () {
    this.getCatpcha()
    // console.log(this.props, 'this.props')
    // fetch('loginWechat')
  }
  render() {
    return (
      <View className={styles.bindPhone}>
        <FormRule formData={this.state.formData} rule={this.state.rule} ref='validate'>
          <InputWrap 
            onInput={(value) => this.addInput.apply(this, [value, 'mobileNo'])}
          placeholder='请输入手机号码'></InputWrap>
          <InputWrap 
            onInput={(value) => this.addInput.apply(this, [value, 'firstpassWord'])}
          placeholder='输入密码，长度不小于6位' type='password'></InputWrap>
          <InputWrap 
            onInput={(value) => this.addInput.apply(this, [value, 'passWord'])}
          placeholder='确认密码' type='password'></InputWrap>
        </FormRule>
        <Button open-type='getUserInfo' className={[styles.button_sure, this.state.actived_bindPhone ? styles.avtive : '']} onClick={this.doBindPhone.bind(this)}>立即绑定</Button>
        <View className='at-row at-row__justify--between'>
          <View className='at-col at-col-5'>
            <Text className={[styles.subscript, styles.leftSide]} onClick={this.toRegister.bind(this)}>注册</Text>
          </View>
          <View className='at-col at-col-5'>
            <Text className={[styles.subscript, styles.rightSide]} onClick={this.toFindPass.bind(this)}>忘记密码？</Text>
          </View>
        </View>
        <AtMessage />
      </View>
    )
  }
}

export default bindPhone
