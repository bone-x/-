/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @LastEditors: 邓达
 * @Date: 2019-04-17 09:02:38
 * @LastEditTime: 2019-05-09 14:18:16
 */

import Taro, { Component } from "@tarojs/taro";
import { View ,ScrollView} from "@tarojs/components";
import GlobalTabBar from '@/components/global-tabbar'
import LoadMore from '@/components/load-more'

// import { connect } from '@tarojs/redux'
import Loading from "@/components/loading";
import NewsCard from "@/components/newsCard";
import CustomTabs from "@/components/customTabs";
import NewsTag from "@/components/newsTag";
import fetch from "api/request";

// import classNames from "classnames";
import styles from "./index.module.scss";

class NewsList extends Component {
  config = {
    navigationBarTitleText: "行家"
  };

  state = {
    loading: false,
    dataList: [],
    categoryIndex: -1,
    categoryList: [
      {
        id: -1,
        name: "全部"
      },
      { id: 0, name: "热门" }
    ],
    tagsList: [],
    activeValue: 0,
    pageNum:1,
    pageSize:10,
    loadBtn:false,
  };

  // 慎用
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }

  componentDidMount() {
    this.getNewsCategory();
    this.getNewsList()
  }


  onScrolltoupper =()=>{
    const {pageNum} = this.state;
    this.setState({
      pageNum:pageNum+1
    },()=>{
      this.getNewsList();
    })
  }
  tabClick = (item, index) => {
    const { categoryList, tagsList, activeValue, categoryIndex,pageNum} = this.state;
    if (categoryIndex != item.id) {
      let list = [];
      if (
        categoryList[index].subInfCategoryVOList &&
        categoryList[index].subInfCategoryVOList.length != 0
      ) {
        list = [
          {
            name: "全部",
            id: 0
          },
          ...categoryList[index].subInfCategoryVOList
        ]
      }
      this.setState({
        pageNum:1,
        activeValue: 0,
        categoryIndex: item.id,
        tagsList: list,
        dataList:[]
      },()=>{
        this.getNewsList();
      });
    }
  };

  getNewsCategory() {
    const { categoryList } = this.state;
    fetch("getNewsCategory").then(res => {
      this.setState({
        categoryList: [...categoryList, ...res]
      });
    });
  }

  getNewsList(){
    this.setState({
      loadBtn:true
    })
    const { pageSize, pageNum, activeValue, categoryIndex,dataList} = this.state;

      fetch('getNewsList',{
          pageSize,
          pageNum,
          infParCategoryId:categoryIndex,
          infCategoryId:activeValue
        }).then(res =>{
          if(res.list.length>0){
              this.setState({
                pageNum:res.currPage,
                dataList:[...dataList,...res.list],
                loadBtn:false
              })  
          }else{
            this.setState({
              pageNum:pageNum-1,
              loadBtn:false
            })
          }      
        }).catch(error =>{
            console.log(error);
            this.setState({
              loadBtn:false
            })
        })
    
  }

  tagClick = (item, index) => {
    const { activeValue } = this.state;
    if(activeValue != item.id){
      this.setState({
        pageNum:1,
        activeValue:item.id,
        dataList:[]
      },()=>{
        this.getNewsList();
      })
    }
    // const { value } = item;
  };

  render() {
    const { dataList, categoryList, tagsList, categoryIndex,activeValue,loadBtn} = this.state;
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <View className={styles.newsList}>
        <View className={styles.tabsBox}>
        {/* tabs */}
        <CustomTabs
          categoryList={categoryList}
          onClick={this.tabClick}
          activeKeyName='id'
        />
        {categoryIndex != -1 && categoryIndex != 0 ? (
          <NewsTag
            categoryList={tagsList}
            onClick={this.tagClick}
            activeValue={activeValue}
          />
        ) : null}
        </View>
        <View className={styles.contentBox}>
         <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            scrollTop='0'
            lowerThreshold='20'
            upperThreshold='20'
            onScrollToLower={this.onScrolltoupper}
          >
            <View className={styles.listBox}>
              {dataList.map((news, index) => (
                <NewsCard news={news} key={index} />
              ))}
            </View>
            <LoadMore loadMore={loadBtn}></LoadMore>
          </ScrollView>
        </View>
        <View></View>
        <GlobalTabBar current={2} />
      </View>
    );
  }
}

export default NewsList;
