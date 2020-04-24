/*
 * @Author: 蔡江旭
 * @Description: 资讯详情页
 * @props:
 * @event:
 * @LastEditors: 邓达
 * @Date: 2019-04-02 17:22:27
 * @LastEditTime: 2019-06-04 11:03:18
 */

import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import classNames from 'classnames'
import { add, minus, asyncAdd } from '@/actions/counter'
import Loading from '@/components/loading'

import fetch from 'api/request'
import { JsBridge } from '@/utils/JsBridge'
import styles from './index.module.scss'

import likeIconImage from '@/assets/like-icon.png'

@connect(
  state => state.counter,
  { add, minus, asyncAdd }
)
class NewsDetail extends Component {
  config = {
    navigationBarTitleText: '资讯详情'
  }

  state = {
    loading: true,
    shareIconList: [
      {
        icon: 'wechat'
      },
      {
        icon: 'qq'
      },
      {
        icon: 'wefriend'
      },
      {
        icon: 'weibo'
      }
    ],
    newsDetail: {},
    toStarIsRequesting: false
  }

  // 慎用
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    // console.log(Taro.getEnv())
    // console.log(Taro.ENV_TYPE)

    const { params = {} } = this.$router
    console.log('params: ', params)
    const { id } = params
    if (id && id.length) {
      // 请求拿数据
      fetch('getNewsDetail', {
        id
      })
        .then(res => {
          console.log('new detail result:', res)
          this.setState({
            loading: false,
            newsDetail: res
          })
        })
        .catch(err => {
          console.log('getNewsDetail err: ', err)
        })
    } else {
      Taro.showToast({
        title: 'url错误，请返回刷新重试！',
        icon: 'none',
        duration: 2000
      })
    }
  }

  /**
   * @Description: 点赞
   * @params {Number} id
   * @params {Boolean} toStar
   * @return:
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-23 17:04:00
   */
  toStar = (id, toStar) => {
    console.log('toStar: ', toStar)
    const { toStarIsRequesting } = this.state
    if (!toStarIsRequesting) {
      this.setState({
        toStarIsRequesting: true
      })
      // 请求
      fetch('postStarNews', {
        informationId: id,
        upOrDown: toStar
      })
        .then(res => {
          console.log('new postStarNews result:', res)
          const { newsDetail } = this.state
          newsDetail.isLike = toStar
          newsDetail.likeAccount = res
          this.setState(
            {
              loading: false,
              newsDetail,
              toStarIsRequesting: false
            },
            () => {
              console.log(this.state)
            }
          )
        })
        .catch(err => {
          console.log('postStarNews err: ', err, this.$router)
          this.setState({
            toStarIsRequesting: false
          })
          // 跟原生APP交互
          const { params } = this.$router
          const { data = {}, statusCode } = err
          let code = 0;
          if(data.code == 1132){
              code = 401
          }else{
            code = data.code || statusCode;
          }

          JsBridge(null, {
            data: {
              ...data,
              token: params.token
            },
            path: 'news/like',
            message: '请求失败',
            code
          })
        })
    }
  }

  render() {
    const { shareIconList, newsDetail } = this.state
    // const date = new Date(newsDetail.publishTime || newsDetail.updateTime);
    // const dayStr = `${date.getMonth() + 1}.${date.getDay()}`;
    // const timeStr = `${date.getHours()}.${date.getMinutes()}`;

    return (
      <View className={styles.newsDetail}>
        {/* 标题 */}
        <View className={styles.title}>{newsDetail.title}</View>
        {/* 信息 */}
        <View className={styles.newsInfo}>
          <Text className={styles.author}>{newsDetail.author}</Text>
          <Text className={styles.date}>{newsDetail.publishTimeFormat}</Text>
          {/* <Text className={styles.time}>{timeStr}</Text> */}
          <Text className={styles.viewNum}>
            <Text
              className={classNames(styles.icon, 'iconfont', 'iconyanjing1')}
            />
            {newsDetail.viewer}
          </Text>
        </View>
        {/* 正文 */}
        <RichText className={styles.contentBox} nodes={newsDetail.content} />
        {/* 点赞 */}
        <View className={styles.likeBox}>
          <View
            className={classNames(styles.likeBtn, {
              liked: newsDetail.isLike
            })}
            onClick={() => this.toStar(newsDetail.id, !newsDetail.isLike)}
          >
            <Image
              className={styles.likeIcon}
              src={likeIconImage}
              mode="widthFix"
            />
            <View className={styles.text}>
              点赞({newsDetail.likeAccount || 0})
            </View>
          </View>
        </View>
        {/* 分享 */}
        {/* <View className={styles.shareBox}>
          <View className={styles.shareTitle}>
            <View className={styles.titleTextBox}>
              <Text className={styles.titleText}>分享至</Text>
            </View>
          </View>
          <View className={styles.shareList}>
            {shareIconList.map((ele, index) => (
              <View className={classNames(styles.shareBtn, ele.icon)} key={index}>{ele.icon}</View>
            ))}
          </View>
        </View> */}
      </View>
    )
  }
}

export default NewsDetail
