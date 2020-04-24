import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import styles from './index.module.scss'

export default class MoreDiscount extends Component {
    render() {
        return (
            <View>
                <View className={styles.course} key={this.props}>
                    <Image src={this.props.coverPicture} className={styles.courseImg} onClick={this.props.onEvent} />
                    <Text className={styles.title} style='-webkit-box-orient: vertical;'>{this.props.name}</Text>
                    <Text className={styles.price} >￥{this.props.activitePrice}  <Text style='text-decoration:line-through;'>￥{this.props.price}</Text></Text>
                    {this.props.activiteStatus===1?<Text className={styles.number}>未开始</Text>:this.props.activiteStatus===2?<Text className={styles.number}>{this.props.activityRepertory === 999999999?'':`仅剩${this.props.activityRepertory}位`}</Text>:<Text className={styles.number}>已结束</Text>}
                    {this.props.activiteRepertory===0?<Text className={styles.button}>已抢完</Text>:<Text className={styles.button}  onClick={this.props.onEvent}>马上抢</Text>}
                </View>
            </View>
           
        )
    }
}
