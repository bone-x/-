import Taro, { Component } from '@tarojs/taro'
import { View, Image, Input, Text, Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import { AtButton, AtToast } from 'taro-ui'
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
class setPassWord extends Component {
  config = {
    navigationBarTitleText: '设置密码'
  }
  state = {
    loading: false,
    isFirst: false,
    actived: {
      validate: false
    },
    showMsg: false,
    msg: '',
    formData: {
      passWord1: null,
      passWord2: null
    },
    rule: {
      mobileNo: {
        reg: '^1[3456789]\\d{9}$',
        msg: '手机号错误'
      },
      passWord1: {
        require: true,
        reg: '^d{6}$',
        msg: '请输入大于6位的密码'
      }
    }
  }
  componentDidMount() {
    fetch('getUserInfo', {
      token: Taro.getStorageSync('token')
    }).then(res => {
      Taro.setStorageSync('userInfo', res)
    })
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      if (window.location.href.indexOf('isFirst') > -1) {
        this.setState({
          isFirst: true
        })
      }
    }else{
      let {isFirst} = this.$router.params;
      if(isFirst){
        this.setState({
          isFirst:true
        })
      }
    }
  }

  setPassWord() {
    let { formData } = JSON.parse(JSON.stringify(this.refs.validate.state))

    if (
      !formData.passWord1.length ||
      formData.passWord1.length < 6 ||
      formData.passWord1.length > 20
    ) {
      this.setState({
        showMsg: true,
        msg: '请输入6-20密码'
      })
    } else if (formData.passWord1 != formData.passWord2) {
      this.setState({
        showMsg: true,
        msg: '密码不一致,请重新'
      })
    } else {
      console.log('设置密码')
      let token = getCookie('token')
      fetch(
        'installPassWord',
        {},
        Object.assign({
          token,
          firstPassWord: Base64.encode(formData.passWord1),
          secondPassWord: Base64.encode(formData.passWord2)
        })
      ).then(res => {
        if (res) {
          Taro.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            Taro.navigateTo({
              url: '/pages/home/index'
            })
          }, 2000);
        }
      })
    }
    let that = this
    setTimeout(function() {
      that.setState({
        showMsg: false
      })
    }, 2000)
  }
  enterHome() {
    Taro.navigateTo({
      url: '/pages/home/index?noSetPassword=true'
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
  render() {
    return (
      <View className={styles.login}>
        {this.state.isFirst ? (
          <View className={styles.title}>
            <Text className={['iconfont iconhangjia-xuanzhong', styles.icon]} />
            &nbsp;
            <Text>行家</Text>
          </View>
        ) : null}
        <FormRule
          formData={this.state.formData}
          rule={this.state.rule}
          ref="validate"
        >
          <InputWrap
            className={styles.input_wrap}
            placeholder="请输入6-20位的密码"
            type="password"
            onInput={value => this.addInput.apply(this, [value, 'passWord1'])}
          />
          <InputWrap
            className={styles.input_wrap}
            placeholder="确认密码"
            type="password"
            onInput={value => this.addInput.apply(this, [value, 'passWord2'])}
          />
        </FormRule>
        <AtToast
          isOpened={this.state.showMsg}
          text={this.state.msg}
          duration={2000}
        />
        <AtButton
          loading={this.state.loading}
          type="primary"
          className={[styles.button_sure, styles.actived]}
          onClick={this.setPassWord.bind(this)}
        >
          {this.state.isFirst ? '进入行家' : '确认'}
        </AtButton>
        {this.state.isFirst && (
          <View className={styles.button_forget_password}>
            <Text
              className={[styles.subscript]}
              onClick={this.enterHome.bind(this)}
            >
              跳过
            </Text>
          </View>
        )}
      </View>
    )
  }
}
export default setPassWord
