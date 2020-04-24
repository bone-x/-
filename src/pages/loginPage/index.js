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
class Register extends Component {
  config = {
    navigationBarTitleText: '登录'
  }
  state = {
    loading: false,
    actived: {
      validate: false
    },
    formData: {
      mobileNo: null,
      passWord: null
    },
    rule: {
      mobileNo: {
        reg: `^1[3456789]\\d{9}$`,
        msg: '手机号错误'
      },
      passWord: {
        require: true,
        msg: '手机号错误'
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
  doLogin(value) {
    this.setState({
      loading: true
    })
    let { formData } = JSON.parse(JSON.stringify(this.refs.validate.state))
    fetch(
      'login',
      {},
      Object.assign(formData, {
        passWord: Base64.encode(formData.passWord),
        clientType: 'web',
        versionCode: '144',
        redirectUrl: window.location.href
      })
    )
      .then(res => {
        Taro.setStorageSync('token', getCookie('token'))
        sessionStorage.setItem('token', getCookie('token'))
        //异步更新增量  不管成功失败  -- DD
        fetch('updateUserInfo', { source: 'hangjia_h5',channelType:this.$router.params.channelTypeId||""})
        fetch('getUserInfo', {
          token: Taro.getStorageSync('token')
        }).then(res2 => {
          Taro.setStorageSync('userInfo', res2)
          this.setState({
            loading: false
          })
            //头部玩家回调
          if (this.$router.params.type == 'headActivity') {
            let activityId = ''
            if (
              this.$router.params.activityId &&
              this.$router.params.activityId != 'null'
            ) {
              activityId = this.$router.params.activityId
            } else {
              activityId = 1
            }
            fetch('stuJoinActivity', {
              activityId,
              type: 'I'
            }).then(res3 => {
              //res = 1: 成功， 2:已报名，3:报名失败
              let uri = new URI(window.location.href)
              let newUri = null
              let queryData = ''
              if (uri.toString().indexOf('#') > -1) {
                queryData = URI(uri.fragment()).search(true)
                if (res3 == 1) {
                  queryData['callbackType'] = 'sign'
                }
                queryData['uid'] = 'recommended@' + res2.uid
              } else {
                queryData = uri.search(true)
                if (res3 == 1) {
                  queryData['callbackType'] = 'sign'
                }
                queryData['uid'] = 'recommended@' + res2.uid
              }
              queryData['activityId'] = activityId
              queryData['channelTypeId'] = this.$router.params.channelTypeId
              queryData['callBackUrl'] = ''
              let hostUrl = uri.hostname()
              newUri = new URI(
                `http://${hostUrl}/ac/headActivity/index.html`
              ).query(queryData)
              if (res3 == 3) {
                Taro.showToast({
                  title: '报名失败，请重试',
                  icon: 'none',
                  duration: 1000
                })
                window.location.reload()
              } else {
                window.location.href = newUri.toString()
              }
            })
          }else if (this.$router.params.type == 'huawei') {
            let activityId = ''
            if (
              this.$router.params.activityId &&
              this.$router.params.activityId != 'null'
            ) {
              activityId = this.$router.params.activityId
            } else {
              activityId = 2
            }
            let uri = new URI(window.location.href)
            let newUri = null
            let queryData = ''
            if (uri.toString().indexOf('#') > -1) {
              queryData = URI(uri.fragment()).search(true)
              queryData['uid'] = encodeURIComponent('recommended@' + res2.uid)
            } else {
              queryData = uri.search(true)
              queryData['uid'] = encodeURIComponent('recommended@' + res2.uid)
            }
            queryData['activityId'] = activityId
            queryData['channelTypeId'] = this.$router.params.channelTypeId
            let hostUrl = uri.hostname()
            newUri = new URI(
              `http://${hostUrl}/ac/huawei/index.html`
            ).query(queryData) 
            window.location.href = newUri.toString()          
          } else {
            Taro.navigateTo({
              url: '/pages/home/index'
            })
          }
        })
      })
      .catch(() => {
        this.setState({
          loading: false
        })
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
  toRegister() {
    let uri = new URI(window.location.href)
    let newUri = null
    if (uri.toString().indexOf('#') > -1) {
      newUri = new URI('/pages/register/index').query(
        URI(uri.fragment()).query()
      )
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
  loginNoPass(){
    Taro.navigateTo({
      url: '/pages/loginByPhone/index'
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
            placeholder="手机号"
            onInput={value => this.addInput.apply(this, [value, 'mobileNo'])}
          />
          <InputWrap
            placeholder="密码"
            type="password"
            onInput={value => this.addInput.apply(this, [value, 'passWord'])}
          />
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
            onClick={this.loginNoPass.bind(this)}
          >
            免密登录
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

export default Register
