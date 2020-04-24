import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Loading from '@/components/loading'
import styles from './index.module.scss'
import CarList from './carList/CarList'
// import fetch from 'api/request'
import Header from '@/components/Header/Header'
// import classNames from "classnames";
class Car extends Component {
  constructor(props){
    super(props);
      this.state={
      loading: true,
      // data:[]
    }
  }
  config = {
    navigationBarTitleText: 'Car'
  }
  componentDidMount() {
    // let {data}=this.state
    //   fetch('getCarList')
    //   .then(res=>{
    //     data=res
    //     this.setState({data})
    //   })
  }
  render () {

    return (
      <View className={styles.car}>
         {/* -------------------头部 ---------------*/}
          <View className={styles.head}>
              <Header title='我的购物车' />
          </View>         
          {/*--------------- 购物车内容--------------------- */}
          <View className={styles.body}>
          {/* {
        
          } */}
          <CarList />
          </View>        
      </View>
    )
  }
}

export default Car
