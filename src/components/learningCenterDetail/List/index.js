import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import Loading from '@/components/loading'
import fetch from '@/api/request'

import './style.scss'
import { AtAccordion } from 'taro-ui'

@connect(state => state.counter, { add, minus, asyncAdd })

export default class List extends Component {
	
	static options = {
    addGlobalClass: true
  }

	state = {
		loading: true,
		listData: [],
		recordId: '',
		defaultOpen: '', // 默认打开
	}

	componentWillMount() {
		this.initFn()
		this.setState({
			recordId: this.props.data.recordId
		})
	}

	componentDidMount() {
	}

	// 初始化
	initFn = () => {
    fetch('queryCourseRecord',{
      courseId: this.props.data.courseId,
    }, {}).then(res=>{
			this.setState({
				listData: res
			},()=>{
				this.state.listData.map((item, index)=>{
					item.list && item.list.map(item=>{
						if(item.recordId == this.props.data.recordId){
							this.setState({
								defaultOpen: item.parentId,
								[`accordion${index}`]: !this.state[`accordion${index}`],
							})
						}
					})
				})
			})
    }).catch(error=>{
      console.log(error,1231)
		}) 
	}

	// 手风琴 点击
	accordionClick = (index) => {
    this.setState({
			defaultOpen: '',
      [`accordion${index}`]: !this.state[`accordion${index}`],
		},()=>{
			console.log(this.state.accordion)
		})
	}

	//目录点击跳转
	courseLickFn = (recordId, vid) => {
		const { onSwitchVideoFn } = this.props
		onSwitchVideoFn(recordId, vid)

		this.setState({
			recordId
		})
	}

	render() {
		const { listData, recordId, defaultOpen } = this.state

		if (this.state.loading) {
			return <Loading />
		}

		return (
			<View>
				{
				listData.map((item, index) => {
					return(
						<View key={item.recordId}>
							<AtAccordion
								isAnimation={false}
								open={!!this.state[`accordion${index}`]}
								title={item.name}
								onClick={this.accordionClick.bind(this, index)}
							>
								<View className='contentBox'>
								{
									item.list && item.list.length &&
									item.list.map((i, k)=>{
										return (
											<View 
												key={i.recordId} 
												className={recordId == i.recordId ? 'item-box on' : 'item-box'} 
												onClick={()=>{this.courseLickFn(i.recordId, i.vid)}}
											>
												<View className='history-icon'>
													{
														i.videoStatus != 0 &&
														<View className={i.videoStatus == 2 ? 'circle' : 's-circle'}></View>
													}
												</View>
									
												<View className='item'>
													<View className='video-icon iconfont iconvideo'></View>							
													<View className='info'>
														<View className='title'>{i.name}</View>
														<Text className='time'>{i.duration}</Text>
													</View>
													<View className='action'>
														<View className='iconfont iconfujian'></View>
													</View>
												</View>
											</View>
										)
									})									
								}
									<View className='time-axis'></View>
								</View>
							</AtAccordion>
		
						</View>
					)
				})
			}		
			</View>
		)
	}
}
