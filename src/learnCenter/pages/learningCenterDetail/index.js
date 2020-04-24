/*
 * @Author: 黄剑敏
 * @LastEditors: 黄剑敏
 * @Description:
 * @Date: 2019-04-25 22:22:46
 * @LastEditTime: 2019-05-27 17:30:38
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Video, Image, Input, Text } from '@tarojs/components'
import Loading from '@/components/loading'
import fetch from '@/api/request'
import { ossSign, upload } from '@/utils/upload'
import {
  AtTabs,
  AtTabsPane,
  AtFloatLayout,
  AtTextarea,
  AtModal,
  AtCurtain,
  AtToast,
  AtButton,
  AtActivityIndicator
} from 'taro-ui'

import Introduce from '@/components/learningCenterDetail/Introduce'
import List from '@/components/learningCenterDetail/List'
import Comment from '@/components/learningCenterDetail/Comment'
import Note from '@/components/learningCenterDetail/Notes'
import styles from './index.module.scss'
import './modify.scss'
import errorImg from '@/assets/error.png'




//保利威 js
let saveNoteItem = {}

class LearningCenterDetail extends Component {
  config = {
    navigationBarTitleText: '学习中心详情页'
  }
  constructor() {
    super(...arguments);

    this.state = {
      loading: true,
      tabCurrent: 1,
      isIphoneX: false, // 是否ipx
      isCollection: false, // 是否收藏
      videoSrc: null,
      showDel: false,
      showNote: false,
      showCurtain: false,
      showToast: false,
      disabled: true,
      id: '',
      value: '',
      topicType: 20,
      url: '',
      file: null,
      autoFocus: true,
      propsData: {},

      startTime: 0,
      switchLoading: true,
      dakaObj: null,
      isFirstDaka: true, //判断是否第一次打卡
    }
  }


  componentWillMount() {
    // 获取路由参数 更新vid
    this.setState({ propsData: this.$router.params })

    Taro.getSystemInfo({
      success: res => {
        if (res.model == 'iPhone X (GSM+CDMA)<iPhone10,3>') {
          this.setState({
            isIphoneX: true
          })
        }
      }
    })
  }

  componentDidMount() {
    setTimeout(()=>{
      this.setState({ loading: false })
    },1000)

    let timerDom = null
    timerDom = () => {
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        this.initFn()
      } else {
        require( './utils/polyvplayer.min.js')

        setTimeout(() => {
          if (document.getElementById('polyvVideo') === null) {
            timerDom()
          } else {
            clearTimeout(timerDom)
            timerDom = null
            this.initFn()
          }
        }, 200)
      }
    }
    timerDom()
  }

  
  componentWillUnmount() {
    this.exitCardFn()
  }

  // 录播间持续打卡信息接口
  punchCardFn = () => {
    fetch('queryRecordAttendanceInfo', {
      recordId: this.state.propsData.recordId
    })
      .then(result => {
        if (result) {
          // 记录第一次进来时间
          this.setState({
            dakaObj: result
          }, () => {
            console.log(this.state.dakaObj.startTime, '录播间进入时间')

            this.aa = setTimeout(() => {
              // 第一次打卡
              let firstInterval = result.interval + result.waitTime
              result.interval = firstInterval

              Taro.request({
                url: '/daka/attendance/service',
                data: {
                  ...result,
                  SSOTOKEN: Taro.getStorageSync('token')
                },
                header: {
                  'content-type': 'application/json'
                }
              }).then((res) => {
                console.log('滴，打卡成功')
              })

              // 以后打卡
              this.bb = setInterval(() => {
                result.interval = firstInterval - result.waitTime
                Taro.request({
                  url: '/daka/attendance/service',
                  data: {
                    ...result,
                    SSOTOKEN: Taro.getStorageSync('token')
                  },
                  header: {
                    'content-type': 'application/json'
                  }
                }).then(res => console.log(res.data))
              }, result.interval)
            }, result.waitTime)
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // 退出录播间/切换视频打卡
  exitCardFn = () => {
    this.setState({
      switchLoading: true
    })
    return new Promise((resolve, reject) => {
      // 清空定时器
      if (this.aa) clearTimeout(this.aa)
      if (this.bb) clearInterval(this.bb)

      let param = this.state.dakaObj
      let outTime = new Date().getTime()
      param.interval = outTime - param.startTime
      param = JSON.parse(JSON.stringify(param))
      delete param.waitTime

      console.log(outTime, '退出时间')
      console.log(param.interval, '观看时间')

      Taro.request({
        url: '/daka/attendance/client',
        data: {
          ...param,
          SSOTOKEN: Taro.getStorageSync('token')
        },
        header: {
          'content-type': 'application/json'
        }
      })
        .then(res => {
          resolve()
        })
        .catch(error => {
          resolve()
          console.log(error)
        })
    })

  }

  timeUpdate = e => {
    polyv.timeUpdate(e)
  }

  // table 切换
  handleTabClick = value => {
    this.setState({
      tabCurrent: value
    })
  }

  // 初始化
  initFn = () => {
    this.queryIsCollectionFn()
    let vid = this.state.propsData.vid

    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      /*小程序端 获取视频数据*/
      let obj = {
        vid: vid,
        callback: videoInfo => {
          this.setState({
            videoSrc: videoInfo.src[0]
          })
        }
      }
      polyv.getVideo(obj)
      this.videoContext = Taro.createVideoContext('myVideo')
      console.log('小程序 获取视频数据')
    } else {
      this.player = window.polyvPlayer({
        wrap: '#polyvVideo',
        height: 211, // 422/2
        vid: vid,
        autoplay: true
      })

      console.log('h5 获取视频数据', vid)
    }

    this.punchCardFn()
  }

  queryIsCollectionFn = () => {
    fetch(
      'queryExistCollection',
      {
        goodsId: this.state.propsData.id
      },
      {}
    )
      .then(res => {
        this.setState({
          isCollection: res.existCollection
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  // 切换视频方法
  switchVideoFn = (recordId, vid) => {
    Taro.redirectTo({
      url: `/learnCenter/pages/learningCenterDetail/index?recordId=${recordId}&vid=${vid}&courseId=${
        this.state.propsData.courseId
        }&title=${this.state.propsData.title}&timestamp=${
        this.state.propsData.timestamp
        }&type=recorded&cover=${this.state.propsData.cover}&id=${
        this.state.propsData.id
        }&orderId=${this.state.propsData.orderId}`
    })
  }

  // // 切换视频方法
  // switchVideoFn = (recordId, vid) => {
  //   this.exitCardFn().then(() => {

  //     this.setState({
  //       switchLoading: false
  //     })

  //     let data = this.state.propsData
  //     data.recordId = recordId
  //     this.setState(
  //       {
  //         propsData: data
  //       },
  //       () => {
  //         this.child.getNoteList()
  //         this.punchCardFn()
  //       }
  //     )

  //     if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  //       // 停止视频播放
  //       this.videoContext.stop()
  //       /*小程序端 获取视频数据*/
  //       let obj = {
  //         vid: vid,
  //         callback: videoInfo => {
  //           this.setState(
  //             {
  //               videoSrc: videoInfo.src[0]
  //             },
  //             () => {
  //               // src 切换成功后继续播放
  //               this.videoContext.play()
  //             }
  //           )
  //         }
  //       }
  //       polyv.getVideo(obj)
  //     } else {
  //       this.player.changeVid(vid)
  //     }
  //   })
  // }

  // 检查是否可以评论
  inspectTime = () => {
    let countTime = new Date().getTime() - this.state.dakaObj.startTime
    //已经评价过 或者时间不到10分钟不能评价
    let newTime = 0
    newTime = ~~(countTime / 60000)

    if (~~newTime >= 5) {
      console.log('大于5')
      return true
    } else {
      Taro.showToast({
        title: `您现在已观看了${newTime}分钟，还需${5 - newTime}分钟才能评价`,
        icon: 'none',
        duration: 2000
      })
      console.log('小于5')
      return false
    }
  }

  //收藏方法
  collectionFn = () => {
    let operateType = 1
    let msg  = ''
    if (this.state.isCollection) {
      operateType = 2
      msg = '取消收藏成功'
    } else {
      operateType = 1
      msg = '收藏成功'
    }

    fetch(
      'addRemoveCollection',
      {
        goodsId: this.state.propsData.id,
        operateType //操作类型（ 1：添加收藏 2：取消收藏）
      },
      {}
    ).then(res => {
      Taro.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
      })
      this.queryIsCollectionFn()
    }).catch(error => {
      console.log(error)
    })
  }

  // 评论跳转
  linkCommentFn = () => {
    this.setState({
      tabCurrent: 2
    })
  }
  //笔记弹窗方法
  onRef = ref => {
    this.child = ref
  }

  //保存编辑笔记
  postSaveOrUpdateNote() {
    Taro.showLoading({ title: '保存中', mask: true })
    console.log(this.saveNoteItem)
    fetch('postSaveOrUpdateNote', {
      ...(this.state.id ? { id: this.state.id } : {}),
      content: this.state.value,
      topic: this.state.propsData.recordId,
      topicType: this.state.topicType,
      url: this.state.url
    })
      .then(res => {
        Taro.hideLoading()
        this.child.getNoteList()
      })
      .catch(error => {
        console.error()
      })
  }
  //删除笔记弹窗
  handleShowModel = id => {
    console.log(id, 123)
    this.setState({
      showDel: true,
      id
    })
  }

  //编辑保存笔记弹层
  handleShowNote = item => {
    console.log(item)
    if (item && item.content) {
      saveNoteItem = JSON.parse(JSON.stringify(item))
      this.setState({
        id: item.id,
        showNote: true,
        disabled: false,
        url: item.url,
        value: item.content,
        topic: item.topic,
        topicType: item.topicType,
        url: item.url
      })
    } else {
      this.setState({
        showNote: true,
        id: '',
        value: '',
        disabled: true,
        url: ''
      })
    }
  }

  //点击删除方法
  handleShowDel = id => {
    console.log(id)
    this.setState({
      showDel: true,
      id
    })
  }

  //监听文本框
  handleChange(event) {
    if (event.target.value.length > 0) {
      this.setState({
        disabled: false
      })
    } else {
      this.setState({
        disabled: true
      })
    }
    if (event.target.value.length > 200) {
      this.setState({
        showToast: true,
        disabled: true
      })
    } else {
      this.setState({
        showToast: false
      })
    }
    this.setState({
      value: event.target.value
    })
  }
  //小程序点击选择图片
  handleImageUpload() {
    console.log(123)
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      const file = res.tempFiles[0]
      console.log('file是', file)
      console.log('res是', res)
      if (!file) return false
      this.setState({
        file,
        url: file.path
      })
      const fileStr = String(file.path).split('.')
      console.log('fileStr', fileStr)
      const fileType = fileStr[fileStr.length - 1]
      console.log(fileType)
      const fileSize = Number(file.size) / 1024 / 1024
      //对文件类型检查
      const imgStr = /(jpg|jpeg|png|bmp|BMP|JPG|PNG|JPEG)$/
      if (!imgStr.test(fileType)) {
        Taro.showToast({
          title: '不支持此格式',
          icon: 'none'
          // image: errorImg
        })
        this.setState({
          url: ''
        })
        return false
      }
      // 文件大小检查
      if (fileSize > 5) {
        Taro.showToast({ title: '图片大小超过5M', image: errorImg })
        this.setState({
          url: ''
        })
        return false
      }
    })
  }
  //h5监听图片选中状态
  onFileChange = e => {
    const file = e.target.files[0]
    console.log('file', file)
    const windowURL = window.URL || window.webkitURL //实现预览
    const dataURl = windowURL.createObjectURL(file) //硬盘或sd卡指向文件路径
    console.log(dataURl)
    this.setState({
      url: dataURl,
      file
    })
    const fileStr = String(file.type).split('/')
    const fileType = fileStr[fileStr.length - 1]
    console.log(fileType)
    const fileSize = Number(file.size) / 1024 / 1024
    //对文件类型检查
    const imgStr = /(jpg|jpeg|png|bmp|BMP|JPG|PNG|JPEG)$/
    if (!imgStr.test(fileType)) {
      Taro.showToast({
        title: '不支持此格式',
        image: errorImg
      })
      this.setState({
        url: ''
      })
      return false
    }
    if (fileSize > 5) {
      // 文件大小检查
      Taro.showToast({
        title: '图片大小超过5M',
        image: errorImg
      })
      this.setState({
        url: ''
      })
      return false
    }
  }
  //点击删除预览图
  delImage() {
    this.setState({
      url: ''
    })
  }
  //点击确定保存
  saveNote() {
    const { url, file } = this.state
    if (url && url !== saveNoteItem.url) {
      //小程序上传图片
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        const splitUrl = String(file.path).split('/')
        const fileName = splitUrl[splitUrl.length - 1]
        console.log('fileName', fileName)
        // 获取图片签名
        Taro.showLoading({ title: '上传中', mask: true })
        ossSign({ key: fileName })
          .then(signRes => {
            if (signRes.statusCode !== 200) {
              Taro.showToast({ title: '网络异常', icon: 'none' })
              console.error('oss 签名出错', file)
              return false
            }
            const signObj = signRes.data
            console.log(signObj)
            // 上传
            Taro.uploadFile({
              url: signObj.host,
              filePath: file.path,
              name: 'file',
              header: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST',
                'Content-Type': 'multipart/form-data'
              },
              formData: {
                key: `${signObj.dir}${fileName}`,
                policy: signObj.policy,
                OSSAccessKeyId: signObj.accessid,
                success_action_status: 200,
                signature: signObj.signature,
                callback: signObj.callback
              }
            })
              .then(() => {
                Taro.hideLoading()
                // 上传成功
                this.setState(
                  {
                    url: signObj.url
                  },
                  () => {
                    this.postSaveOrUpdateNote(saveNoteItem)
                    this.setState({
                      showNote: false,
                      id: '',
                      url: '',
                      file: null
                    })
                  }
                )
              })
              .catch(() => {
                Taro.hideLoading()
                console.error('上传到oss出错', file)
              })
            console.log(signObj)
          })
          .catch(() => {
            Taro.hideLoading()
            Taro.showToast({ title: '网络异常', icon: 'none' })
            console.error('oss 签名出错', file)
          })
      } else {
        //h5上传图片
        const fileName = file.name
        console.log(file)
        // 获取图片签名
        Taro.showLoading({ title: '上传中', mask: true })
        ossSign({ key: fileName })
          .then(signRes => {
            if (signRes.statusCode !== 200) {
              Taro.showToast({ title: '网络异常', icon: 'none' })
              console.error('oss 签名出错', file)
              return false
            }
            const signObj = signRes.data
            console.log(signObj)
            upload(signObj, file)
              .then(() => {
                Taro.hideLoading()
                // 上传成功
                this.setState(
                  {
                    url: signObj.url
                  },
                  () => {
                    this.postSaveOrUpdateNote(saveNoteItem)
                    this.setState({
                      showNote: false,
                      id: '',
                      url: '',
                      file: null
                    })
                  }
                )
              })
              .catch(error => {
                Taro.hideLoading()
                console.error('上传到oss出错', error)
              })
          })
          .catch(() => {
            Taro.hideLoading()
            Taro.showToast({ title: '网络异常', icon: 'none' })
            console.error('oss 签名出错', file)
          })
      }
    } else {
      this.postSaveOrUpdateNote(saveNoteItem)
      this.setState({
        showNote: false,
        id: '',
        url: '',
        file: null
      })
      return
    }
  }

  //点击关闭
  handleClose() {
    saveNoteItem = {}
    this.setState({
      showDel: false,
      showNote: false,
      value: '',
      file: null,
      url: '',
      id: '',
      showCurtain: false,
      disabled: true,
      showToast: false
    })
  }
  //点击弹窗确定删除笔记
  handleConfirm(id) {
    console.log(id)
    this.child.getDeleteNote(id)
    this.setState({
      showDel: false,
      id: ''
    })
  }
  //弹窗点击取消
  handleCancel() {
    this.setState({
      showDel: false
    })
  }
  //点击看大图
  handleImage = url => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      this.setState({ url }, () => {
        Taro.previewImage({
          current: url, // 当前显示图片的http链接
          urls: [url] // 需要预览的图片http链接列表
        })
      })
    } else {
      this.setState({
        showCurtain: true,
        url
      })
    }
  }
  //看大图点击关闭图片
  closeImage() {
    this.setState({
      showCurtain: false,
      url:''
    })
  }
  render() {
    const {
      tabCurrent,
      isIphoneX,
      isCollection,
      videoSrc,
      showNote,
      showDel,
      showToast,
      disabled,
      id,
      showCurtain,
      propsData,
      url
    } = this.state


    return (
      <View
        className={styles.wrapBox}
        style={
          tabCurrent == 3
            ? null
            : isIphoneX
              ? 'paddingBottom: 80px '
              : 'paddingBottom : 53px'
        }
      >
        <View id="polyvVideo" className={styles.videoBox}>
          {Taro.getEnv() === Taro.ENV_TYPE.WEAPP && videoSrc && (
            <Video
              className="vp-v"
              id="myVideo"
              src={videoSrc}
              onTimeupdate={this.timeUpdate}
              controls
              poster=""
              initialTime="0"
              loop={false}
            />
          )}
        </View>
        <AtTabs
          current={tabCurrent}
          swipeable={false}
          tabList={[
            { title: '介绍' },
            { title: '目录' },
            { title: '评价' },
            { title: '笔记' }
          ]}
          onClick={this.handleTabClick}
        >
          <AtTabsPane current={tabCurrent} index={0}>
            <Introduce goodsId={this.$router.params.id} />
          </AtTabsPane>

          <AtTabsPane current={tabCurrent} index={1}>
            <List
              data={this.state.propsData}
              onSwitchVideoFn={this.switchVideoFn}
            />
          </AtTabsPane>
          <AtTabsPane current={tabCurrent} index={2}>
            <Comment
              data={this.state.propsData}
              onInspectTime={this.inspectTime}
            />
          </AtTabsPane>
          <AtTabsPane current={tabCurrent} index={3}>
            <Note
              onHandleShowModel={this.handleShowModel}
              onHandleShowNote={this.handleShowNote}
              onHandleImage={this.handleImage}
              recordId={propsData.recordId}
              onRef={this.onRef}
            />
          </AtTabsPane>
        </AtTabs>
        {tabCurrent != 3 && (
          <View className={styles.bottomActionBox}>
            <View
              onClick={this.collectionFn}
              className={isCollection ? 'item-box on' : 'item-box'}
            >
              <View className="iconfont iconshoucang1" />
              <View className="text">收藏</View>
            </View>

            <View
              onClick={this.linkCommentFn}
              className={tabCurrent == 2 ? 'item-box on' : 'item-box'}
            >
              <View className="iconfont iconpinglun" />
              <View className="text">评价</View>
            </View>
          </View>
        )}
        {tabCurrent === 3 && (
          <View onClick={this.handleShowNote.bind(this)} className="write_note">
            <Text className="iconfont iconbi" />
            记笔记
          </View>
        )}
        <AtFloatLayout isOpened={showNote} onClose={() => this.handleClose()}>
          <AtTextarea
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
            maxLength={200}
            height={270}
            textOverflowForbidden={false}
            placeholder="请输入笔记内容..."
          />
          <AtToast isOpened={showToast} text="请不要超过200字" />
          {Taro.getEnv() === Taro.ENV_TYPE.WEAPP ? (
            <View>
              {url ? (
                <View className="img_box">
                  <Image className="upload_img" src={url} />
                  <Text
                    onClick={this.delImage.bind(this)}
                    className="iconfont iconfont_del"
                  >
                    &#xe614;
                  </Text>
                </View>
              ) : (
                  <View
                    onClick={this.handleImageUpload.bind()}
                    className="uploadImage_box"
                  />
                )}
            </View>
          ) : (
              <View>
                {url ? (
                  <View className="img_box">
                    <Image className="upload_img" src={url} />
                    <Text
                      onClick={this.delImage.bind(this)}
                      className="iconfont iconfont_del"
                    >
                      &#xe614;
                  </Text>
                  </View>
                ) : (
                    <View
                      // onClick={e => this.handleImageUpload(e)}
                      className="uploadImage_box"
                    >
                      <Input
                        ref={c => {
                          this.photoInput = c
                        }}
                        hidden
                        type="file"
                        className='input_img'
                        accept="image/*"
                        onchange={e => this.onFileChange(e, this.photoInput)}
                      />
                    </View>
                  )}
              </View>
            )}

          <AtButton
            onClick={() => this.saveNote()}
            disabled={disabled}
            className={
              Taro.getEnv() === Taro.ENV_TYPE.WEB ? 'save_web' : 'save_weapp'
            }
          >
            确定
          </AtButton>
        </AtFloatLayout>
        {Taro.getEnv() === Taro.ENV_TYPE.WEB && (
          <View>
            <AtCurtain
              isOpened={showCurtain}
              onClose={this.handleClose.bind(this)}
            >
              <Image style="width:100%;height:auto;" src={url} />
            </AtCurtain>
            {showCurtain && (
              <View className="closeImage" onClick={() => this.closeImage()} />
            )}
          </View>
        )}
        <AtModal
          isOpened={showDel}
          title="温馨提示"
          cancelText="取消"
          confirmText="确认"
          onClose={() => this.handleClose()}
          onCancel={() => this.handleCancel()}
          onConfirm={() => this.handleConfirm(id)}
          content="是否确定删除笔记?"
        />

        {/* <AtCurtain
            isOpened={this.state.switchLoading}
          >
          <AtActivityIndicator mode='center' content="加载中..."></AtActivityIndicator>
        </AtCurtain> */}
      </View>
    )
  }
}

export default LearningCenterDetail
