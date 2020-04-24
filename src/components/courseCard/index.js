/*
 * @Author: 蔡江旭
 * @Description: 课程卡片组件
 * @props {Array} course 课程卡片的数据
 * 
 * @props {function} onClick (course) 点击触发的事件
 * @LastEditors: 邓达
 * @Date: 2019-04-08 10:02:25
 * @LastEditTime: 2019-05-17 09:55:52
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import classNames from 'classnames'
import defaultPng from '@/assets/default-image.png'

import styles from './index.module.scss'

export default class CourseCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: this.props.coverImage
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            imageUrl: nextProps.coverImage
        })
        // console.log('CourseCard nextProps: ', nextProps);
    }

    /**
     * @Description: 卡片点击事件
     * @params {Object} course
     * @return: 
     * @LastEditors: 蔡江旭
     * @LastEditTime: Do not edit
     * @Date: 2019-04-09 14:35:27
     */
    cardClick = (course) => {
        // const { onClick } = this.props;
        // if (typeof onClick === 'function') {
        //     onClick(course);
        // }
        Taro.navigateTo({
            url: `/learnCenter/pages/courseDetail/index?id=${course.id}`
          })
    }

    onError = () =>{
        this.setState({
            imageUrl: defaultPng
        })
    }

   

    render () {
        const { className, style, course = {}, cardTitle = '', coverImage} = this.props;
        const {imageUrl} = this.state;
        const newClassName = classNames(styles.courseCard, className);
        return (
            <View
              className={newClassName}
              style={style}
              onClick={() => this.cardClick(course)}
            >
                <View className={styles.imageBox}>
                    <Image mode='aspectFit' className={styles.img} src={imageUrl||defaultPng} onError={(e)=>this.onError(e)} />
                </View>
                {/* 相关信息区域 */}
                <View className={styles.detailBox}>
                    <View
                      className={styles.title}
                    >
                        {cardTitle}
                    </View>
                    {this.props.children}
                </View>
            </View>
        )
    }
}
