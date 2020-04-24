import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import styles from './index.module.scss'
import fetch from '@/api/request'
import Loading from '@/components/loading'
// 时间戳转换
function add0(m) {
  return m < 10 ? '0' + m : m
}
function timeFormat(timestamp) {
  var time = new Date(timestamp)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var date = time.getDate()
  var hours = time.getHours()
  var minutes = time.getMinutes()
  var seconds = time.getSeconds()
  return (
    year +
    '-' +
    add0(month) +
    '-' +
    add0(date) +
    ' ' +
    add0(hours) +
    ':' +
    add0(minutes) +
    ':' +
    add0(seconds)
  )
}
//笔记列表进行排序
function compare(property) {
  return function(a, b) {
    return b[property] - a[property]
  }
}

class Note extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
    this.state = {
      viewHeight: 0,
      loading: true,
      // isIphoneX: false, // 是否ipx
      noteList: [],
      showDel: false,
      topicType: 20
    }
  }

  componentWillMount() {
    this.getNoteList()
  }

  componentDidMount() {
    console.log(Taro.getEnv())
    console.log(Taro.ENV_TYPE)

    // Taro.getSystemInfo({
    //   success: res => {
    //     console.log(res.screenHeight, 123)
    //     if (res.model == 'iPhone X (GSM+CDMA)<iPhone10,3>') {
    //       this.setState({
    //         isIphoneX: true,
    //         viewHeight: res.screenHeight - 304
    //       })
    //     } else {
    //       this.setState({ isIphoneX: false }, () => {
    //         this.setState({
    //           viewHeight: res.screenHeight - 276
    //         })
    //       })
    //     }
    //   }
    // })
    this.props.onRef(this)
  }
  //获取笔记列表数据
  getNoteList() {
    console.log(this.props.recordId)
    fetch('getNoteList', {
      topic: this.props.recordId
    })
      .then(res => {
        this.setState({
          noteList: res
        })
        console.log(res)
      })
      .catch(error => {
        console.log(error)
      })
  }
  //删除笔记
  getDeleteNote(id) {
    fetch('getDeleteNote', {
      ids: id
    })
      .then(res => {
        this.getNoteList()
        Taro.showToast({ title: '删除成功', icon: 'success' })
      })
      .catch(error => {
        console.error()
      })
  }
  render() {
    const { noteList } = this.state

    return (
      <ScrollView
        scrollY
        scrollWithAnimation
        // style={{ height: `${viewHeight}px` }}
        style="height:100%;"
        className={styles.note_container}
      >
        {!noteList || noteList.length === 0 ? (
          <View className={styles.empty}>
            <View className={styles.empty_img}>
              <Image
                className={styles.img}
                src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/empty-shopcar.png"
              />
            </View>
            <View className={styles.empty_info}>很遗憾,没有记录笔记</View>
          </View>
        ) : (
          noteList.sort(compare('createTime')).map((item, index) => {
            return (
              <View className={styles.note_list} key={index}>
                <View className={styles.note_tabs}>
                  <View className={styles.ball} />
                  <Text className={styles.note_date}>
                    {timeFormat(item.createTime)}
                  </Text>
                  <View className={styles.note_option}>
                    <View
                      className={styles.note_edit}
                      onClick={this.props.onHandleShowNote.bind(this, item)}
                    >
                      <Text className={`iconfont ${styles.iconbianji}`}>
                        &#xe627;
                      </Text>
                      <Text className={styles.editText}>编辑</Text>
                    </View>
                    <View
                      className={styles.note_del}
                      onClick={this.props.onHandleShowModel.bind(this, item.id)}
                    >
                      <Text className={`iconfont ${styles.iconshanchu1}`}>
                        &#xe608;
                      </Text>
                      <Text className={styles.delText}>删除</Text>
                    </View>
                  </View>
                </View>
                <View className={styles.note_des}>
                  <Text className={styles.note_info}>{item.content}</Text>
                  {item.url ? (
                    <Image
                      onClick={this.props.onHandleImage.bind(this, item.url)}
                      className={styles.note_image}
                      src={item.url}
                    />
                  ) : null}
                </View>
              </View>
            )
          })
        )}
      </ScrollView>
    )
  }
}
export default Note
