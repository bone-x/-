import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Form, Textarea } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import GlobalTabbar from '@/components/global-tabbar'
import defaultLogoPng from '@/assets/defaultLogo.png'
import ActionSheetUploadImg from '@/components/ActionSheetUploadImg';
import '@/assets/personalIcon/icon.css'
import Loading from '@/components/loading'
import fetch from '@/api/request.js'


import styles from './index.module.scss'

console.log(999, Taro.getStorageSync("token"));

@connect(state => state.counter, {add, minus, asyncAdd})
class PersonalData extends Component {

  config = {
    navigationBarTitleText: '个人信息'
  }

  constructor(props){
    super(props);
    this.state = {
      userInfo: {}, // 获取个人信息
      genderText:'',
      isShowSelectImg: false, // 点击头像弹窗开关
      nickNameDialog: false, // 昵称弹窗开关
      userNameDialog: false, // 姓名弹窗开关
      isShowSex: false, // 性别弹窗开关
      idCardDialog: false, // 身份证弹窗开关
      genderList: [
        {
          text: '女',
          value: 0
        },
        {
          text: '男',
          value: 1
        },
        {
          text: '保密',
          value: 2
        }
      ]
    }
  }

  // 慎用
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }
  componentDidShow() {
    this.componentDidMount();
  }
  componentDidMount() {
    fetch('getMineInfo')
    .then(res=>{
      this.setState({userInfo: res})
      if(res.gender === 0) {
        this.setState({genderText: '女'})
      } else if (res.gender === 1) {
        this.setState({genderText: '男'})
      } else if(res.gender === 2) {
        this.setState({genderText: '保密'})
      }

    })


  }

  // 返回上一页
  goBack() {
    Taro.navigateTo({url: '/personCenter/pages/personalCenter/index'});
  }

  // 关闭头像弹窗(new)
  onCloseSelectImg() {
    this.setState({isShowSelectImg: false})
  }
  
  // 点击头像打开头像弹窗(new)
  selectImg = () => {
    this.setState({isShowSelectImg: !this.state.isShowSelectImg})
  }

  
  // 修改用户信息
  putUserInfo({ nickName, gender, avatar, name, idCard }) {
    let query = {
      token: Taro.getStorageSync("token"),
      nickName: nickName || this.state.userInfo.nickName || undefined,
      gender: gender || this.state.userInfo.gender || undefined,
      avatar: avatar || this.state.userInfo.avatar || undefined,
      name: name || this.state.userInfo.name || undefined,
      id_card: idCard || this.state.userInfo.idCard || undefined,
    };

    // 没有修改头像，默认头像参数为空
    if (query.avatar == defaultLogoPng) {
      query.avatar = "";
    }

    // 性别是否为0
    if (gender !== undefined) {
      query.gender = gender;
    } else if (this.state.userInfo.gender !== undefined) {
      query.gender = this.state.userInfo.gender;
    }

    // 姓名为空
    if (name !== undefined) {
      query.name = name;
    } else {
      query.name = '';
    }

    // 校验必填项
    return fetch('currectUserInfo', {}, query).then(res => {
      Taro.showToast({
        title: '修改成功！',
        icon: 'success',
        duration: 2000
      })
    }).catch(() => {
      Taro.showToast({
        title: '修改失败！',
        icon: 'none',
        duration: 2000
      })
    });
  }


  // 选择图片后返回url
  selectedImg = url => {
    this.putUserInfo({ avatar: url }).then(res => {

      this.setState({
        userInfo: Object.assign({}, this.state.userInfo, { avatar: url }),
      })

    });
    Taro.showToast({ title: '操作成功' });
    this.setState({
      isShowSelectImg: false,
    });
  }
  

  // 点击修改昵称出现弹窗
  // 打开修改昵称弹窗
  changeNickName() {
    this.setState({nickNameDialog: !this.state.nickNameDialog});
  }
  
  // 关闭昵称弹窗
  closeNickNameDialog() {
    this.setState({nickNameDialog: false});
  }

  // 昵称弹窗确定按钮
  nickNameCommit(e) {
    const newNickName = e.detail.value.editNickName;

    const reg = /\s+/;
    const reg2 = /[^\u4e00-\u9fa5a-zA-Z\d/-_]+/;
    if ((this.state.userInfo.nickName && reg.test(this.state.userInfo.nickName)) || (newNickName && reg.test(newNickName))) {
      Taro.showToast({
        title: '不可以含有空格！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.state.userInfo.nickName.length < 2 || newNickName.length < 2) {
      Taro.showToast({
        title: '昵称长度在2-20位之间！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.state.userInfo.nickName.length > 20 || newNickName.length > 20) {
      Taro.showToast({
        title: '昵称长度在2-20位之间！',
        icon: 'none',
        duration: 2000
      })
    } else if ((this.state.userInfo.nickName && reg2.test(this.state.userInfo.nickName)) || (newNickName && reg2.test(newNickName))) {
      Taro.showToast({
        title: '输入不规范！',
        icon: 'none',
        duration: 2000
      })
    } else {
      let {userInfo} = this.state;
      userInfo.nickName = newNickName;
      this.putUserInfo({ nickName: newNickName }).then(res => {
      });
      this.setState({nickNameDialog:false})
    }
  }


  // 获取输入的姓名
  inputUserName(event) {
    this.setState({userName: event.target.value});
  }

  // 姓名弹窗确定按钮
  userNameCommit(e) {
    const newName = e.detail.value.editName;
    const reg = /\s+/;
    const reg2 = /[^\u4e00-\u9fa5]+/;
    if ( newName && reg.test(newName)) {
      Taro.showToast({
        title: '不可以含有空格！',
        icon: 'none',
        duration: 2000
      })
    } else if (newName && reg2.test(newName)) {
      Taro.showToast({
        title: '不可以含有数字、字母、符号等！',
        icon: 'none',
        duration: 2000
      })
    } else if ( newName.length > 10) {
      Taro.showToast({
        title: '姓名长度在2-10位之间！',
        icon: 'none',
        duration: 2000
      })
    } else if ( newName.length < 2) {
      Taro.showToast({
        title: '姓名长度在2-10位之间！',
        icon: 'none',
        duration: 2000
      })
    } else {
      let {userInfo} = this.state;
      userInfo.name = newName;
      this.putUserInfo({ name: newName }).then(res => {
      });
      this.setState({userNameDialog:false})
    }
  }

  // 选中性别
  checkGenderIndex( value ){
    this.putUserInfo({ gender: value }).then(res => {

      let genderText = '';
      if(value === 0) {
        genderText = '女';
      } else if (value === 1) {
        genderText = '男';
      } else if (value === 2){
        genderText = '保密';
      }
      const newUserInfo = Object.assign({}, this.state.userInfo, { gender: value });
      this.setState({
        genderText,
        userInfo: newUserInfo
      })

    });
    this.setState({genderDialog:false,})
  }

   // 关闭性别弹窗(new)
   onClose() {
    this.setState({isShowSex: false});

  }

  // 打开性别弹窗(new)
  showGender() {
    this.setState({isShowSex: !this.state.isShowSex})
  }

   // 打开姓名弹窗
   changeUserName() {
    this.setState({userNameDialog:!this.state.userNameDialog});
  }

  // 关闭姓名弹窗(new)
  closeUserNameDialog() {
    this.setState({userNameDialog:false})
  }

  // 点击身份证出现弹窗
  changeIdCard() {
    this.setState({idCardDialog:!this.state.idCardDialog});
  }

  // 关闭身份证弹窗
  closeIdCardDialog = () => {
    this.setState({idCardDialog:false})
  }

  // 获取输入的身份证
  inputIdCardNum = (event) => {
  this.setState({userInfo: event.target.value})
  }

  // 身份证弹窗确定按钮
  idCardCommit = (e) => {
    const newIdCard = e.detail.value.editIdCard;
    
    const reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X|x])$/;
      if ((this.state.userInfo.idCard && !reg.test(this.state.userInfo.idCard)) || (newIdCard && !reg.test(newIdCard))) {
        Taro.showToast({
          title: '身份证不合法！',
          icon: 'none',
          duration: 2000
        })
      } else {
        let {userInfo} = this.state;
        userInfo.idCard = newIdCard;
        this.putUserInfo({ id_card: newIdCard }).then(res => {
        });
        this.setState({idCardDialog:false})
      }
  }

  // 默认图片
  noFind(event){
    this.setState({
      userInfo: Object.assign({}, this.state.userInfo, { avatar: defaultLogoPng }),
    })
  }



  // 隐藏邮箱
  emailHide(val) {
    const place = val.indexOf("@");
    return val.replace(val.slice(1, place - 0), "****");
  }

  // 跳转绑定邮箱
  goAddEmail() {
    Taro.navigateTo({url: '/personCenter/pages/personalCenter/addEmail/index'});
  }

  // 跳转修改邮箱
  goChangeEmail() {
    Taro.navigateTo({url: '/personCenter/pages/personalCenter/changeEmail/index'});
  }

  // 跳转修改密码
  goChangePassWord() {
    let userInfo = Taro.getStorageSync('userInfo')
    if(userInfo.passwordStatus == 1){
      Taro.navigateTo({url: '/pages/setPassWord/index'});
    }else{
      Taro.navigateTo({url: '/personCenter/pages/personalCenter/changePassWord/index'});
    }
  }

 
  render () {
    let{userInfo}=this.state

    let fontstyle = {
      fontSize: '14px',
      color: '#666666',
      fontFamily: 'PingFang-SC-Regular'
    };

    let iconstyle = {
      fontSize: '14px',
      color: '#999999',
      marginLeft: '9px'
    }

    let idcardstyle = {
      fontSize: '14px',
      color: '#FF7847',
      fontFamily: 'PingFang-SC-Regular'
    }

    // console.log('000')
    return (
      <View className={styles.personalData}>
        <View  className={styles.mine}>
          <View className={styles.pcData}>
            <Text onClick={this.goBack} className='iconfont iconLeft' style={{ fontSize: '14px', color: '#666666', position: 'absolute', left: '16px', top: '0px' }}></Text>
            <Text className={styles.infoText}>个人信息</Text>
          </View>

          {/* 昵称 */}
          <View className={styles.order} onClick={this.changeNickName.bind(this)}>
            <Text className={styles.dataText}>用户昵称</Text>
            <View>
              {
                userInfo.nickName === '' ? <Text className={styles.emailNumLight}>去完善</Text> : <Text className={styles.emailNum}>{userInfo.nickName}</Text>
              }
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View> 
          </View> 

          {/* 修改头像 */}
          <View className={styles.order} onClick={this.selectImg.bind(this)}>
            <Text className={styles.dataText}>修改头像</Text>
            <View className={styles.avatar}>
              <Image onError={this.noFind.bind(this)} style={{ width: '52px', height: '52px', display: 'inline-block', marginTop: '10px', marginBottom: '10px', borderRadius: '50%' }} src={userInfo.avatar}></Image> 
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View>
          </View>
        

          {/* 姓名    */}
          <View className={styles.order} onClick={this.changeUserName.bind(this)}>
            <Text className={styles.dataText}>姓名</Text>
            <View>
              {
                userInfo.name === '' ? <Text className={styles.emailNumLight}>去完善</Text> : 
                <Text className={styles.emailNum}>{userInfo.name}</Text>
              }
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View>
          </View>

          {/* 性别 */}
          <View className={styles.order} onClick={this.showGender.bind(this)}>
            <Text className={styles.dataText}>性别</Text>
            <View>
              {
                userInfo.gender === '' ? <Text className={styles.emailNumLight}>去完善</Text> : 
                <Text className={styles.emailNum}>{this.state.genderText}</Text>
              }
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View>
          </View>

          {/* 身份证号 */}
          {/* <View className={styles.orderData} onClick={this.changeIdCard.bind(this)}>
            <Text className={styles.dataText}>身份证号</Text>
            <View>
              {
                userInfo.idCard === '' ? <Text className={styles.idFinish}>去完善</Text> : 
                <Text style={fontstyle} className={styles.emailNum}>{userInfo.idCard.replace(this.state.userInfo.idCard.slice(3, 14), '*********')}</Text>
              }
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View>
          </View> */}

          {/* 手机号 */}
          <View className={styles.order}>
            <View className={styles.dataText}>手机号 <Text className={styles.tel}>(手机号是登录账号凭证，不可修改)</Text></View>
            <Text className={styles.telNum}>{userInfo.mobile.replace(userInfo.mobile.slice(3, 7), '****')}</Text>
          </View>

          {/* 电子邮箱 */}
          <View className={styles.orderData} onClick={() => Boolean(userInfo.email) ? this.goAddEmail() : this.goChangeEmail()}>
            <Text className={styles.dataText}>电子邮箱</Text>
            <View>
              {
                Boolean(userInfo.email) ? <Text style={fontstyle}>未绑定</Text> :
                <Text style={fontstyle} className={styles.emailNum}>{this.emailHide(userInfo.email)}</Text>
              }
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View>
          </View>

          {/* 密码管理 */}
          <View className={styles.orderData} onClick={this.goChangePassWord}>
            <Text className={styles.dataText}>密码管理</Text>
            <View>
              <Text style={fontstyle} className={styles.emailNum}>修改</Text>
              <Text style={iconstyle} className='iconfont iconright'></Text>
            </View>
          </View>
          {/* 底部tabbar */}
          <GlobalTabbar current={3}></GlobalTabbar>
        </View>


        {/* 弹窗部分 */}

        {/* 修改昵称 */}
        {
          !this.state.nickNameDialog ? null : 
          <View className={styles.container}>
            <View className={styles.maskDialog} onClick={this.closeNickNameDialog.bind(this)}></View>
            <View className={styles.ul}>
            <Form onSubmit={this.nickNameCommit.bind(this)}>
              <View className={styles.editNickNameBox}>
                <View className={styles.editNickNameBoxMain}>
                  <Textarea
                    name='editNickName'
                    count={false}
                    className={styles.editNickNameBoxContent}
                    value={userInfo.nickName}
                    placeholder='请输入昵称...'
                  />
                  <View className={styles.editNickNameBoxTips}>2-20位，可由中英文、数字、“_”、“-”组成</View>
                </View>
              </View>
              
              <View className={styles.userName}>
                <Text className={styles.name}>昵称</Text>
                <View>
                  <Button form-type='submit' className={styles.namebtn}>确定</Button>
                </View>
              </View>
            </Form>
            </View>
          </View>
        }

        {/* 修改姓名 */}
        {
          !this.state.userNameDialog ? null : 
          <View className={styles.container}>
            <View className={styles.maskDialog} onClick={this.closeUserNameDialog.bind(this)}></View>
            <View className={styles.ul}>
            <Form onSubmit={this.userNameCommit.bind(this)}>
              <View className={styles.editNameBox}>
                <View className={styles.editNameBoxMain}>
                  <Textarea
                    name='editName'
                    count={false}
                    className={styles.editNameBoxContent}
                    value={userInfo.name}
                    placeholder='请输入姓名...'
                  />
                </View>
              </View>
              
              <View className={styles.userName}>
                <Text className={styles.name}>姓名</Text>
                <View>
                  <Button form-type='submit' className={styles.namebtn}>确定</Button>
                </View>
              </View>
            </Form>
            </View>
          </View>
        }

        {/* 修改性别 */}
        {
          !this.state.isShowSex ? null : 
          <View className={styles.container} onClick={this.onClose.bind(this)}>
            <View className={styles.maskDialog}></View>
            <View className={styles.ul}>
              <View className={styles.chooseGender}>选择性别</View>
              <View>
                {this.state.genderList.map((item, index) => {
                  return <View onClick={this.checkGenderIndex.bind(this,item.value)} className={this.state.genderText == item.text ? styles.activeLight : styles.takePhoto} key={index}>{item.text}</View>
                })}
              </View>
              <View className={styles.cancelClose} onClick={this.onClose.bind(this)}>取消</View>
            </View>
          </View>
        }

        {/* 身份证 */}
        {/* {
          !this.state.idCardDialog ? null : 
          <View className={styles.container}>
            <View className={styles.maskDialog} onClick={this.closeIdCardDialog.bind(this)}></View>
            <View className={styles.ul}>
            <Form onSubmit={this.idCardCommit.bind(this)}>
              <View className={styles.editNameBox}>
                <View className={styles.editNameBoxMain}>
                  <Textarea
                    name='editIdCard'
                    count={false}
                    className={styles.editNameBoxContent}
                    value={userInfo.idCard}
                    placeholder='请输入身份证...'
                  />
                </View>
              </View>
              
              <View className={styles.userName}>
                <Text className={styles.name}>身份证</Text>
                <View>
                  <Button form-type='submit' className={styles.namebtn}>确定</Button>
                </View>
              </View>
            </Form>
            </View>
          </View>
        } */}

        {/* 提示弹窗 */}
        {/* 点击头像弹窗 */}
        <ActionSheetUploadImg isShow={this.state.isShowSelectImg} onClose={this.onCloseSelectImg.bind(this)} onSuccess={this.selectedImg} />
      </View>
    )
  }
}

export default PersonalData
