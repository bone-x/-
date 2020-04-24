import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Form, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { Base64 } from 'js-base64';
import { add, minus, asyncAdd } from '@/actions/counter'
import Loading from '@/components/loading'
import fetch from '@/api/request.js'
import '@/assets/personalIcon/icon.css'

import styles from './index.module.scss'


@connect(state => state.counter, { add, minus, asyncAdd })
class ChangePassWord extends Component {

  config = {
    navigationBarTitleText: '修改密码'
  }

  constructor(props){
    super(props)
    this.state = {
      status:'password', // 旧密码类型状态
      newStatus: 'password', // 新密码类型状态
      againStatus: 'password', // 重复新密码类型状态
      loading: true,
      passWord: '', // 当前密码
      newPassword: '', // 新密码
      againPwd: '', // 再次输入新密码
    }
  } 
  

  // 返回上一页(个人资料)
  goBack = () => {
    Taro.navigateBack({ delta: 1 })
  }

  // 慎用
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
  }

  componentDidMount() {

  }


  // 旧密码
  handleChangePassWord = (e) => {
    this.setState({passWord : e.detail.value})
  }

  // 新密码
  handleChangeNewPassword = (e) => {
    this.setState({newPassword : e.detail.value})
  }

  // 再次输入新密码
  handleChangeAgainPwd = (e) => {
    this.setState({againPwd : e.detail.value})
  }

  // 切换成亮眼睛
  changeLightEye(){
     let { status } = this.state 
      if (status == 'password'){
        status = 'text'
      } else {
        status = 'password'
      }
      this.setState({status})
  }

  // 新密码显示隐藏眼睛颜色切换
  newPwdChange() {
    let { newStatus } = this.state
      if (newStatus == 'text'){
        newStatus = 'password'
      } else {
        newStatus = 'text'
      }
      this.setState({newStatus})
  }

  // 重复新密码显示隐藏眼睛颜色切换
  againNewPwdChange() {
    let { againStatus } = this.state
      if (againStatus == 'text'){
        againStatus = 'password'
      } else {
        againStatus = 'text'
      }
      this.setState({againStatus})
  }


  // 长度为6-16位，数字、大小写字母和符号的组合，不可以含有空格
  // 为空时提示：密码不能为空
  // 长度不等于6-16位时提示：密码长度在6-16位之间
  // 含有空格时提示：密码不可含有空格

  // 验证输入的新密码
  checkNewPassWord = (val) => {
    let inputNewPwd = val.detail.value;
    let reg = /^[0-9a-zA-Z]{6,16}$/;
    let regPlace = /\s/; // 纯空格
    if (regPlace.test(inputNewPwd)) {
      Taro.showToast({
        title: '密码不可含有空格！',
        icon: 'none',
        duration: 2000
      })
    } else if (inputNewPwd.length < 6|| inputNewPwd.length > 16) {
      Taro.showToast({
        title: '密码长度在6-16位之间！',
        icon: 'none',
        duration: 2000
      })
    } else if (!reg.test(inputNewPwd)) {
      Taro.showToast({
        title: '密码输入不规范！',
        icon: 'none',
        duration: 2000
      })
    } else {
      return inputNewPwd;
    }

  }



  // 保存并请求
  confirm = () => {
    // 获取输入框的值
    if (this.state.passWord === '' || this.state.newPassword === ''|| this.state.againPwd === ''){
      Taro.showToast({
        title: '输入内容不能为空！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.state.newPassword.length < 6 || this.state.newPassword.length > 16) {  
      Taro.showToast({
        title: '密码长度在6-16位之间！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.state.newPassword !== this.state.againPwd) {
      Taro.showToast({
        title: '两次输入新密码不一致！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.state.newPassword === this.state.passWord || this.state.againPwd === this.state.passWord) {
      Taro.showToast({
        title: '新密码不能与当前密码相同！',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 请求更改密码
      const query = {
        token: Taro.getStorageSync('token'),
        activePassWord: Base64.encode(this.state.newPassword), // 新密码
        inactivePassWord: Base64.encode(this.state.passWord) // 旧密码（当前密码）
      }
      fetch('changeUserPassWord', query)
      .then(res=>{
          Taro.showToast({
            title: '恭喜你，修改密码成功，请妥善保管！',
            icon: 'none',
            duration: 2000
          })    
      })
      .catch(err => {
        console.log(err);
      })
    }
  }


  render() {

  let{}=this.state
    return (
      <View className={styles.changePassWord}>
        <View className={styles.passWordTitle}>
          <Text onClick={this.goBack} className='iconfont iconLeft' style={{ fontSize: '14px', color: '#666666', position: 'absolute', left: '16px', top: '0px' }}></Text>
          <Text className={styles.passWordText}>修改密码</Text>
        </View>
        <View className={styles.pwdForm}>
          {/* 旧密码 */}
          <View className={styles.passWord}>
            <Input
              name='passWord'
              type={this.state.status}
              placeholder='请输入当前密码'
              placeholderStyle={{ color: '#999999' }}
              value={this.state.passWord}
              onChange={this.handleChangePassWord}
            />
            {
              this.state.status=='password'? <Text onClick={this.changeLightEye.bind(this)} className='iconfont iconyanjing1' style={{ fontSize: '16px', color: '#EDEDED' }}></Text> : 
              <Text onClick={this.changeLightEye.bind(this)} className='iconfont iconyanjing1' style={{ fontSize: '16px', color: '#FF7847' }}></Text>
            }    
          </View>
          {/* 新密码 */}
          <View className={styles.passWord}>
            <Input
              name='newPassword'
              type={this.state.newStatus}
              placeholder='请输入新密码'
              value={this.state.newPassword}
              onInput={this.handleChangeNewPassword}
            />
            {
              this.state.newStatus == 'password' ? <Text onClick={this.newPwdChange.bind(this)} className='iconfont iconyanjing1' style={{ fontSize: '16px', color: '#EDEDED' }}></Text> : 
              <Text onClick={this.newPwdChange.bind(this)} className='iconfont iconyanjing1' style={{ fontSize: '16px', color: '#FF7847' }}></Text>
            }
          </View>
          {/* 重复新密码 */}
          <View className={styles.passWord}>
            <Input
              name='againPwd'
              type={this.state.againStatus}
              placeholder='请再次输入新密码'
              value={this.state.againPwd}
              onInput={this.handleChangeAgainPwd}
            />
            {
              this.state.againStatus == 'password' ? <Text onClick={this.againNewPwdChange.bind(this)} className='iconfont iconyanjing1' style={{ fontSize: '16px', color: '#EDEDED' }}></Text> : 
              <Text onClick={this.againNewPwdChange.bind(this)} className='iconfont iconyanjing1' style={{ fontSize: '16px', color: '#FF7847' }}></Text>
            }
          </View>
          <View className={styles.confirm}>
            { this.state.passWord !== '' && this.state.newPassword !== '' && this.state.againPwd !== '' && this.state.newPassword === this.state.againPwd && this.state.newPassword !== this.state.passWord && this.state.againPwd !== this.state.passWord ? <Button onClick={this.confirm.bind(this)} className={styles.lightConfirm}>确定</Button> :
            <Button onClick={this.confirm.bind(this)} className={styles.confirmbtn}>确定</Button> }
          </View>
        </View>
        
      </View>
    )
  }
}

export default ChangePassWord
