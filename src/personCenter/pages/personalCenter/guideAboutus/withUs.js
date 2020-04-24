import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import Loading from '@/components/loading'


import styles from './withUs.module.scss'
import '../staticPic/icon.scss'

// import { isNativeApp, JsBridge } from '@/utils/JsBridge';


class WithUs extends Component {

  config = {
    navigationBarTitleText: '关于行家'
  }

  state = {
    loading: true,
    nodes: '<div style="font-size:14px;">十余载潜心沉淀，一朝夕蓬勃而发。互联网企业大学是恒企教育全力打造的在线学习平台，主要为学习者提供海量的高质量课程。<div style="height:20px;"></div><p>互联网企业大学旨在为每一位希望自我提升的学习者提供实用的一站式学习服务。互联网企业大学自主研发，精心制作课程。现课程涵盖财务会计、IT互联网、职场技能、兴趣生活、设计创作、学历等6大门类，为学习者从职业、学历、娱乐等多维度提供学习平台。</p></div> '
}

// 慎用
componentWillReceiveProps(nextProps) {
  console.log(this.props, nextProps)
}

// componentDidMount() {
//   JsBridge(null, {
//     "code": 200,
//     "message": "OK",
//     "path": "title",
//     "data": {
//       "title": "产品介绍"
//     }
//   })
//   let timer = setTimeout(_ => {
//     this.setState({ loading: false })
//     clearTimeout(timer)
//   }, 1000)
// }

goBackClick() {
  Taro.navigateBack({ delta: 1 })
}

render() {
  return (
    <View className={styles.content}>
      <View style='margin:0px 21px 0 18px;'>
        <RichText className={styles.richtext} nodes={this.state.nodes} />
      </View>
    </View>
  )
}
}

export default WithUs
