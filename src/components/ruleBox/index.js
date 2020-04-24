import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import styles from './index.module.scss'
import classNames from 'classnames'

export default class RuleBox extends Component {
    render () {
        console.log(this.props)
        const {
            title
        } = this.props
        return (
          <View className={styles.RuleBox}>
             <View className={styles.questionBox}>
                <View className={classNames(styles.spanBox,styles.quest)}>Q</View>
                <Text className={styles.questTitle}>{title}</Text>
             </View>
             <View className={styles.answerBox}>
                <View className={classNames(styles.spanBox,styles.answer)}>A</View>
                <View className={styles.childView}>
                    {this.props.children}
                </View>
             </View>
          </View>
        )
      }
}