import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import styles from './index.module.scss'
import spot from './spot.png'

export default class Feed extends Component {
    render() {
        return (
            <View className={styles.feed}  onClick={this.props.onEvent}>
                <View className={this.props.isItem ? styles.item : styles.item1}>
                    <Text className={styles.text}>{this.props.name}</Text>
                    <Text className={styles.time}>{this.props.time}</Text>
                    <Image src={spot} className={styles.img} />
                </View>
            </View>
        )
    }
}
