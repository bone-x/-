/*
 * @Author: 蔡江旭
 * @Description: 课程卡片组件无固定标题
 * @props {Array} course 课程卡片的数据
 * 
 * @props {function} onClick (course) 点击触发的事件
 * @LastEditors: 蔡江旭
 * @Date: 2019-04-22 15:57:47
 * @LastEditTime: 2019-04-28 15:58:50
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import classNames from 'classnames'
import styles from './index.module.scss'

export default class CourseCardNoFixedTitle extends Component {
    state = {
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log('CourseCardNoFixedTitle nextProps: ', nextProps);
    // }

    /**
     * @Description: 卡片点击事件
     * @params {Object} course
     * @return: 
     * @LastEditors: 蔡江旭
     * @LastEditTime: Do not edit
     * @Date: 2019-04-09 14:35:27
     */
    cardClick = (course) => {
        const { onClick } = this.props;
        if (typeof onClick === 'function') {
            onClick(course);
        }
    }

    render () {
        const { className, style, course = {}, cardTitle = '', coverImage } = this.props;
        const newClassName = classNames(styles.courseCard, className);

        return (
            <View
              className={newClassName}
              style={style}
              onClick={() => this.cardClick(course)}
            >
                <View className={styles.imageBox}>
                    <Image
                      mode='scaleToFill'
                      className={styles.img}
                      src={coverImage}
                    />
                </View>
                {/* 相关信息区域 */}
                <View className={styles.detailBox}>
                    {this.props.children}
                </View>
            </View>
        )
    }
}
