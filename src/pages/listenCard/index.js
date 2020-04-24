import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from "taro-ui";
import fetch from 'api/request'
import Loading from "@/components/loading";
import AllListenCard from '@/components/listenCard/allListenCard/index'
import ActiveListenCard from '@/components/listenCard/activeListenCard/index'
import PastListenCard from '@/components/listenCard/pastListenCard/index'
import NoListenCard from '@/components/listenCard/noListenCard/index' 
import './listenCardTabs.scss'
import styles from './index.module.scss'


export default class ListenCard extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      listLoadding: true,
      current: 0,
      all: 0,
      active: 0,
      past: 0
    }
  }

  config = {
    navigationBarTitleText: "我的听课卡"
  };

  componentDidMount() {
    // let timer = setTimeout(() => {
    //   this.setState({
    //     listLoadding: false
    //   });
    //   clearTimeout(timer);
    // }, 1000);

    this.getList()
  }

  // 获取各状态列表数
  getList() {
    fetch('getListenCountByParams',{token: Taro.getStorageSync('token')}).then(res => {
      this.setState({
        all: res.totalCount,
        active: res.onActiveCount,
        past: res.offActiveCount,
        listLoadding: false
      })
    })
  }
  
  handleClick (value) {
    this.setState({
      current: value
    })
  }

  render() {
    if (this.state.listLoadding) {
      return <Loading />;
    }
    const { all, active, past } = this.state

    const tabList = [{ title: `全部(${all})` }, { title: `已激活(${active})` }, { title: `已失效(${past})` }]
    return (
      <View className={styles.listenCard}>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            {
              all === 0? <NoListenCard />:<AllListenCard />
            }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            {
              active === 0? <NoListenCard />:<ActiveListenCard />
            }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            {
              past === 0? <NoListenCard />:<PastListenCard />
            }
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
} 