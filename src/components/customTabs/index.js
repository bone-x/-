/*
 * @Author: 蔡江旭
 * @Description: 自定义Tabs标签页
 * @props {Array} categoryList tab的列表
 * @props {String} activeValue 激动态的值
 * @props {String} activeKeyName 指定数据项的key，控制tab的激活态时
 * @props {Object} scrollOptions 用于改动Taro ScrollView组件的配置
 *
 * @props {Function} tabRender (item, index) 当前tab渲染，必须return // 不指定则用数据项的name值
 * @props {Function} onClick (item, index) tabs点击事件
 *
 * @LastEditors: 蔡江旭
 * @Date: 2019-04-17 15:11:10
 * @LastEditTime: 2019-04-29 11:22:38
 */
import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import classNames from 'classnames';
import isNullOrUndefined from '@/utils/isNullOrUndefined';

import styles from './index.module.scss';

export default class CustomTabs extends Component {
  state = {
    activeValue: null
  };

  // 慎用
  componentWillReceiveProps(nextProps) {
    console.log('CustomTabs props', nextProps);
    const { activeValue } = nextProps;
    if ('activeValue' in nextProps && activeValue !== this.state.activeValue) {
      let newActiveValue = Number.isNaN(activeValue) ? null : activeValue;
      this.setState({
        activeValue: newActiveValue,
      })
    }
  }

  componentDidMount() {
    console.log('CustomTabs')
  }

  /**
   * @Description: 类目tag点击事件
   * @params:
   * @return:
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-17 11:42:05
   */
  tagClick = (item, index) => {
    console.log('customeTabs onClick', item, index);
    const { activeKeyName = 'value' } = this.props;
    const value = item[activeKeyName];
    this.setState({
      activeValue: value
    });

    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(item, index);
    }
  };

  render() {
    const {
      categoryList = [],
      activeKeyName = 'value',
      tabRender
    } = this.props;

    const { activeValue } = this.state;

    return (
      <View className={styles.categoryListBox}>
        <ScrollView
          className='scroll-view'
          scrollX
          scrollWithAnimation
          // eslint-disable-next-line taro/no-spread-in-props
          // {...scrollOptions}
        >

          {categoryList.map((ele, index) => {
            const canActive = (!isNullOrUndefined(activeValue) && activeValue === ele[activeKeyName]) || (isNullOrUndefined(activeValue) && index === 0)
            return (
              <View
                className={classNames(
                  'tag',
                  canActive
                    ? 'active'
                    : ''
                )}
                key={index}
                onClick={() => this.tagClick(ele, index)}
              >
                {(typeof tabRender === 'function' && tabRender(ele, index)) ||
                  ele.name}
              </View>
            )}
          )}
        </ScrollView>
      </View>
    );
  }
}
