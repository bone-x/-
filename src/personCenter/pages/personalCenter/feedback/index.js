import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Textarea, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import Loading from '@/components/loading'
import fetch from '@/api/request.js'
import '@/assets/personalIcon/icon.css'
import ActionSheetUploadImg from '@/components/ActionSheetUploadImg';

import styles from './index.module.scss'


@connect(state => state.counter, { add, minus, asyncAdd })
class Feedback extends Component {

  config = {
    navigationBarTitleText: '意见反馈'
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      opinion: '',
      maxValue: 200,
      changingNum: 0,
      isShowSelectImg: false,
      imgList: [],
    }
  }

  // 慎用
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
  }

  componentDidMount() {

    let timer = setTimeout(() => {
      this.setState({ loading: false })
      clearTimeout(timer)
    }, 1000)
  }

  // 返回上一页
  goBack = () => {
    Taro.navigateBack({ delta: 1 });
  }

  // 获取输入长度
  keyBoardDown = (e) => {
    this.setState({opinion:e.detail.value})
  }

   // 关闭头像弹窗(new)
   onCloseSelectImg = () => {
    this.setState({isShowSelectImg: false})
  }
  
  // 点击头像打开头像弹窗(new)
  selectImg = () => {
    if(this.state.imgList.length === 6) {
      Taro.showModal({
        content: '最多上传6张图片',
        showCancel: false,//是否显示取消按钮
        confirmText:"关闭",//默认是“确定”
        confirmColor: '#333333',//确定文字的颜色
     })
    } else {
      this.setState({isShowSelectImg: !this.state.isShowSelectImg})
    }
  }

  // 选择图片后返回url
  selectedImg = url => {
    this.state.imgList.push(url);
    this.setState({
      isShowSelectImg: false,
    });
  }

  // 提交反馈内容
  submitContext = () => {
    if(!this.state.opinion) {
      Taro.showModal({
        content: '请输入您的问题和意见',
        showCancel: false,
        confirmText:"确定",
        confirmColor: '#333333',
     })
    } else {
      const data = {
        token: Taro.getStorageSync("token"),
        clientType: 'h5',
        context: this.state.opinion,
        images: this.state.imgList.join(','),
        versionCode: '1.3',
        distinguishability: '1024*768',
        equipmentVersion: navigator.userAgent,
      };
      fetch('feedbackCommit', data).then(res => {
        Taro.showModal({
          content: '提交成功，感谢您对行家的支持！',
          showCancel: false,
          confirmText:"关闭",
          confirmColor: '#333333',
       })
      })
      .catch(err => {
        return false;
      })
    }
  }


  render() {
    let {opinion, maxValue, imgList} = this.state;

    let img = (
      <View>
        {imgList.map((item) =>
          <Image className={styles.img} key={item.index} src={item}></Image>
        )}
      </View>
    )



    return (
      <View className={styles.Feedback}>
        <View className={styles.question}>
          <View className={styles.txt}>请详细说明您的问题和意见(必填)</View>
          <View className={styles.editNameBoxMain}>
            <Textarea
              name='editIdCard'
              maxlength='200'
              className={styles.editNameBoxContent}
              value={opinion}
              placeholder='请输入您的问题和意见'
              onInput={this.keyBoardDown}
            />
            <View className={styles.num}>{opinion.length}/{maxValue}</View>
          </View>
          <View className={styles.imgTxt}>上传相关问题截图或图片(最多6张)</View>
          <View className={styles.imgArea}>
            {
              imgList == [] ? '' : img
            }
            <View onClick={this.selectImg} className={styles.addBtn}>
              <View className='iconfont iconjiahao' style={{fontSize:'20px'}}></View>
            </View>
          </View>
          <View className={styles.confirm}>
            <Button onClick={this.submitContext} className={styles.graybtn}>提交</Button>
          </View>
        </View>
        <ActionSheetUploadImg isShow={this.state.isShowSelectImg} onClose={this.onCloseSelectImg.bind(this)} onSuccess={this.selectedImg} />
      </View>
    )
  }
}

export default Feedback
