/*
 * @Author: 邓达
 * @Description:  资讯列表页卡片组件
 * @props:
 * @event:
 * @LastEditors: 邓达
 * @Date: 2019-04-17 15:37:29
 * @LastEditTime: 2019-05-09 18:08:37
 */

import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
// import classNames from "classnames";
import styles from "./index.module.scss";

export default class NewsCard extends Component {
  state = {};

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps: ", nextProps);
  }

  /**
   * @Description:  卡片点击事件
   * @params:
   * @return:
   * @LastEditors: 邓达
   * @LastEditTime: Do not edit
   * @Date: 2019-04-17 15:54:05
   */
  cardClick = news => {
    Taro.navigateTo({
      url: `/pages/newsDetail/index?id=${news.id}`
    })
  };

  formatTitle = title => {
    if(title&&title.length!=0){
      return title.length > 40 ? title.slice(0, 40) + "..." : title;  
    }else{
      return null
    }
    
  };

  render() {
    const { className, style, news = {} } = this.props;
    // const newClassName = classNames(styles.newsCard, className);

    return (
      <View
        className={styles.newsCard}
        style={style}
        onClick={() => this.cardClick(news)}
      >
        {/* 相关信息区域 */}
        <View className={styles.detailBox}>
          <View className={styles.title}>
            <Text>{this.formatTitle(news.title)}</Text>
          </View>
          <View className={styles.detail}>
            <Text>作者：{news.author}</Text>
            <Text className={styles.updateTime}>{news.publishTimeFormat}</Text>
          </View>
        </View>
        {/* 资讯封面 */}
        <View className={styles.imageBox}>
          <Image mode="widthFix" className={styles.img} src={news.coverImage} />
        </View>
      </View>
    );
  }
}
