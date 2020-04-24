import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import { AtButton, AtTabs, AtTabsPane, AtMessage } from 'taro-ui'
import styles from './index.module.scss'
import InputWrap from '@/components/input_wrap'
import './modifyComponent.scss'
import FormRule from '@/components/Form_rule'
import fetch from '@/api/request'
import { Base64 } from 'js-base64'

@connect(
  state => state.counter,
  { add, minus, asyncAdd }
)
class findPassword extends Component {
  config = {
    navigationBarTitleText: '忘记密码'
  }

  state = {
    captchaCode: null,
    count: 0,
    hash: 0,
    loading: {
      phone: false,
      mail: false
    },
    hasSend: {
      phone: false,
      mail: false
    },
    actived: {
      actived_send: {
        validate_phone: false,
        validate_mail: false
      },
      actived_register: {
        validate_phone: false,
        validate_mail: false
      }
    },
    current: 0,
    formData: {
      mobileNo: null,
      email: null,
      passWord: null,
      otp: null,
      firstpassWord: null,
      captchaCode: null
    },
    rule_phone: {
      mobileNo: {
        reg: '^1[3456789]\\d{9}$',
        msg: '手机号错误'
      },
      passWord: {
        reg: `^\\w{6,16}$`,
        msg: '请输入6-16位密码'
      },
      otp: {
        require: true,
        msg: '请输入短信验证码'
      },
      captchaCode: {
        require: true,
        msg: '请输入图形验证码'
      }
    },
    rule_mail: {
      email: {
        reg:
          '^[A-Za-z\\d]+([-_.][A-Za-z\\d]+)*@([A-Za-z\\d]+[-.])+[A-Za-z\\d]{2,4}$',
        msg: '邮箱错误'
      },
      passWord: {
        reg: `^\\w{6,16}$`,
        msg: '请输入6-16位密码'
      },
      otp: {
        require: true,
        msg: '请输入短信验证码'
      },
      captchaCode: {
        require: true,
        msg: '请输入图形验证码'
      }
    }
  }
  repeatCheck(cate) {
    const { firstpassWord, passWord } = this.refs[cate].state.formData
    console.log(firstpassWord, passWord, firstpassWord === passWord)
    if (firstpassWord === passWord) return true
    else {
      Taro.atMessage({
        message: '请确认两次输入密码一致',
        type: 'error'
      })
      throw 'error'
    }
  }
  msgFilled(detail) {
    this.setState({
      actived: Boolean(detail.value)
    })
  }
  handleClick(current) {
    this.setState({
      current
    })
  }
  validate(cate) {
    return this.refs[cate]
      .checkRule()
      .then(this.repeatCheck(cate))
      .then(res => {
        return res
      })
      .catch(res => {
        // console.log(res)
        Taro.atMessage({
          message: res.msg,
          type: 'error'
        })
      })
    // this.refs.validate_mail.checkRule()
  }
  addInput_base(value, key, cate) {
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
        console.log(value, key)
        actived[cate] = false
        this.setState({
          actived
        })
      })
    this.refs[cate]
      .checkRule(['captchaCode'])
      .then(res => {
        actived.actived_send[cate] = true
        this.setState({
          actived
        })
        this.refs[cate]
          .checkRule()
          .then(res => {
            actived.actived_register[cate] = true
            this.setState({
              actived
            })
          })
          .catch(res => {
            actived.actived_register[cate] = false
            this.setState({
              actived
            })
          })
      })
      .catch(res => {
        actived.actived_send[cate] = false
        this.setState({
          actived
        })
      })
  }
  addInput_phone(value, key) {
    this.addInput_base(value, key, 'validate_phone')
  }
  addInput_mail(value, key) {
    this.addInput_base(value, key, 'validate_mail')
  }
  sendSMS() {
    if (this.state.count) return
    this.refs.validate_phone
      .checkRule(['mobileNo', 'captchaCode'])
      .then(res => {
        const { formData } = this.refs.validate_phone.state
        // 干正事
        fetch('getSmS', { ...formData, type: 2 })
          .then(() => {
            const { hasSend } = this.state
            hasSend.phone = true
            this.setState({
              count: 60,
              hasSend
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
          })
          .catch(res => {
            this.setState({
              hash: Date.parse(new Date())
            })
          })
      })
      .catch(res => {
        Taro.atMessage({
          message: res.msg,
          type: 'error'
        })
      })
  }
  sendMail() {
    if (this.state.count) return
    this.refs.validate_mail
      .checkRule(['email', 'captchaCode'])
      .then(res => {
        const { formData } = this.refs.validate_mail.state
        // 干正事
        fetch('getMail', { ...formData, type: 1 })
          .then(() => {
            const { hasSend } = this.state
            hasSend.mail = true
            this.setState({
              count: 60,
              hasSend
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
          })
          .catch(res => {
            this.setState({
              hash: Date.parse(new Date())
            })
          })
      })
      .catch(res => {
        console.log(res, 'res')
        Taro.atMessage({
          message: res.msg,
          type: 'error'
        })
      })
  }
  findPassWord() {
    // if (!this.state.hasSend.phone) {
    //   Taro.atMessage({
    //     'message': '请先发送验证码',
    //     'type': 'error',
    //   })
    //   return
    // }

    // 校验
    if (!this.state.actived.actived_register.validate_phone) {
      return
    }

    this.validate('validate_phone').then(() => {
      const { loading } = this.state
      loading.phone = true
      this.setState({
        loading
      })
      let { formData } = this.refs.validate_phone.state
      formData = JSON.parse(JSON.stringify(formData))
      formData.passWord = Base64.encode(formData.passWord)
      formData.redirectUrl = 'justFill'
      formData .clientType = 'web'
      fetch('validateSmS', {}, { ...formData })
        .then(res => {
          fetch('findPassWord', {}, formData)
            .then(res => {
              Taro.showToast({
                title: '找回密码成功',
                icon: 'success',
                duration: 2000
              })
              loading.phone = false
              this.setState({
                loading
              })
              setTimeout(() => {
                Taro.navigateBack(-1)
              }, 1000)
            })
            .catch(() => {
              loading.phone = false
              this.setState({
                loading
              })
            })
        })
        .catch(() => {
          loading.phone = false
          this.setState({
            loading
          })
        })
    })
  }
  modifyEmail() {
    if (!this.state.hasSend.mail) {
      Taro.atMessage({
        message: '请先发送验证码',
        type: 'error'
      })
      return
    }

    // 校验
    if (!this.state.actived.actived_register.validate_mail) {
      return
    }

    this.validate('validate_mail').then(() => {
      const { loading } = this.state
      loading.mail = true
      this.setState({
        loading
      })
      let { formData } = this.refs.validate_mail.state
      formData = JSON.parse(JSON.stringify(formData))
      ;(formData.passWord = Base64.encode(formData.passWord)),
        fetch('validateMail', {}, { ...formData })
          .then(res => {
            fetch('modifyEmail', {}, formData)
              .then(res => {
                loading.mail = false
                this.setState({
                  loading
                })
                Taro.showToast({
                  title: '找回密码成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(() => {
                  Taro.navigateBack(-1)
                }, 1000)
              })
              .catch(() => {
                loading.mail = false
                this.setState({
                  loading
                })
              })
          })
          .catch(() => {
            loading.mail = false
            this.setState({
              loading
            })
          })
    })
  }
  arrayBufferToBase64(buffer) {
    let binary = ''
    let bytes = new Uint8Array(buffer)
    let len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }
  getCatpcha() {
    fetch('getCaptcha', {
      hash: Date.parse(new Date())
    }).then(res => {
      const base64Data = Taro.arrayBufferToBase64(res.data)
      this.setState({
        captchaCode: `data:image/jpeg;base64,${base64Data}`
      })
    })
  }
  componentDidMount() {
    this.getCatpcha()
  }
  render() {
    const validate_phone_msm = (
      <View
        className={[
          styles.button_send,
          this.state.actived.actived_send.validate_phone && !this.state.count
            ? styles.avtive
            : ''
        ]}
        onClick={this.sendSMS.bind(this)}
      >
        {this.state.count || `获得验证码`}
      </View>
    )
    const validate_mail_msm = (
      <View
        className={[
          styles.button_send,
          this.state.actived.actived_send.validate_mail && !this.state.count
            ? styles.avtive
            : ''
        ]}
        onClick={this.sendMail.bind(this)}
      >
        {this.state.count || `获得验证码`}
      </View>
    )
    return (
      <View className={styles.findPassword}>
        <AtMessage />
        <FormRule
              formData={this.state.formData}
              rule={this.state.rule_phone}
              ref="validate_phone"
            >
              <InputWrap
                placeholder="请输入手机号码"
                onInput={value =>
                  this.addInput_phone.apply(this, [value, 'mobileNo'])
                }
              />
              <InputWrap
                placeholder="图形验证码"
                hasRight
                onInput={value =>
                  this.addInput_phone.apply(this, [value, 'captchaCode'])
                }
              >
                <View onClick={this.getCatpcha.bind(this)}>
                  <Image
                    className={styles.taro_img}
                    src={this.state.captchaCode}
                  />
                </View>
              </InputWrap>
              <InputWrap
                placeholder="短信验证码"
                hasRight
                onInput={value =>
                  this.addInput_phone.apply(this, [value, 'otp'])
                }
              >
                {validate_phone_msm}
              </InputWrap>
              <InputWrap
                placeholder="输入新密码，长度不小于6位"
                type="password"
                onInput={value =>
                  this.addInput_phone.apply(this, [value, 'firstpassWord'])
                }
              />
              <InputWrap
                placeholder="确认新密码"
                type="password"
                onInput={value =>
                  this.addInput_phone.apply(this, [value, 'passWord'])
                }
              />
            </FormRule>
            <AtButton
              type="primary"
              loading={this.state.loading.phone}
              className={[
                styles.button_sure,
                this.state.actived.actived_register.validate_phone
                  ? styles.actived
                  : ''
              ]}
              onClick={this.findPassWord.bind(this)}
            >
              确认修改
            </AtButton>
        <AtMessage />
      </View>
    )
  }
}

export default findPassword
