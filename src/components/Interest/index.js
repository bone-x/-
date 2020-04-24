import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import Loading from '@/components/loading'
import fetch from "api/request";

import './style.scss'
import { AtAccordion, AtTag, AtButton } from 'taro-ui'


@connect(state => state.counter, { add, minus, asyncAdd })

export default class Interest extends Component {
	
	static options = {
      addGlobalClass: true
    }


	state = {
		loading: true,
	}

	// 慎用
	componentWillReceiveProps(nextProps) {
		console.log(this.props, nextProps)
	}

	componentDidMount() {
		console.log(Taro.getEnv())
		console.log(Taro.ENV_TYPE)

	}
	
	

	// 跳过
	onCloseFn = () =>{
	  this.props.onClose()
	}




	// tag 选择 
	handleTagClick = (item, e) => {
		console.log(e, 'e')
		let {selectedList} = this.props;
		let {name: id} = e;
		id = ~~id
		if(selectedList.includes(id)){
			let index =  selectedList.indexOf(id);
			selectedList.splice(index,1)
		}else{
			if(selectedList.length <5){
				selectedList.push(id);	
			}else{
				Taro.showToast({
					title: '兴趣最多不能超过5个',
					icon: 'none',
					duration: 2000
				})
			}
		}
		this.setState({
			selectedList
		})

			
		
		// let newArray = selectedList;
		
	}

	// 确认
	subFn = () => {
		let {onClose,selectedList} = this.props;
		if(selectedList.length == 0){
			onClose();
			return false;
		}
		fetch('addInterest',{
			token:Taro.getStorageSync("token"),
			goodsCategoryIdList:selectedList.join(',')
		}).then(() =>{
			this.props.onClose();
		})
	}

	render() {
		const { categoryList,selectedList } = this.props

		// cons

		if (this.state.loading) {
			return <Loading />
		}

		return (
			<View className='interestDiv'>
				<View className='interest-box'>
					<View className='title-box'>
						<View className='b-title'>选择您感兴趣的领域</View>
						<Text className='s-title'>最多选择5个，可随时调整</Text>
						<View className='action-btn' onClick={this.onCloseFn}>	跳过</View>
					</View>
					<View className='contentBox'>
					{
						categoryList && categoryList.length &&
						categoryList.map((item, index)=>{
							return(
								<View className='item-box' key={index}>
									<View className='title'>{item.name}</View>
 
									<View className='content'>
										{
											item.childList && item.childList.length>0 &&
											item.childList.map((i,k)=>{
												const test = Object.assign({}, i)
												return(	
													<AtTag 
														key={test.id + k}
														name={test.id} 
														active={selectedList.includes(test.id)}
														onClick={(e)=>this.handleTagClick(test,e)}
													>
														{test.name}
													</AtTag>
												)
											})
										}
									</View>	
								</View>
							)}
						)
					}
					</View>
				</View>
				<View className='sub-btn'>
					<AtButton onClick={this.subFn} type='primary'>{` 确定（已选${selectedList.length}个）`}</AtButton>
				</View>
			</View>
		)
	}
}
