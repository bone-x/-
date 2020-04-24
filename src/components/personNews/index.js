import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import styles from './index.module.scss'

export default class PersonNews extends Component {
    render() {
        return (
            <View>
              <View className={styles.time}><Text className={styles.line}></Text> <Text style={{ color: '#E1E3E5' }}>/</Text> {this.props.pushTime}更新 <Text style={{ color: '#E1E3E5' }}>/</Text> <Text className={styles.line}></Text></View>
                  <View className={styles.bottom}  onClick={this.props.ongoDetails}>
                    <View  className={styles.news}>
                      <View style={{ position: 'relative' }}>
                        <View className={styles.title}>
                          {!this.props.isReaded
                         ? <Text className='iconfont icon-xiaoxi2' style={{ fontSize: '20px', position: 'relative',color:'#FF5A1F'}}><Text className='iconfont icon-dian-copy' style={{ position: 'absolute', left: '10px', top: '-8px', color: '#FF5A1F' }}></Text></Text>
                            : <Text className='iconfont icon-xiaoxi2' style='font-size:20px;color:#999'></Text>}
                        <Text style={{color:'#333',paddingLeft:'10px'}}>{this.props.title}</Text></View>
                        <Text className='iconfont icon-right' style={{ fontSize: '15px', position: 'absolute', right: '11px', top: '28px' }}></Text>
                      </View>
                      <View className={styles.newsContent} style='-webkit-box-orient: vertical;'>{this.props.describe}</View>
                    </View>
                  </View>  
            </View>      
        )
    }
}
