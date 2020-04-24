/*
 * @Author: 蔡江旭
 * @Description: 课程列表页，搜索页
 * @props: 
 * @event: 
 * @LastEditors: 邓达
 * @Date: 2019-04-02 16:23:03
 * @LastEditTime: 2019-05-26 16:18:38
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, RichText, ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import Qs from 'qs'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '@/actions/counter'
import Loading from '@/components/loading'
import SearchBar from '@/components/customSearchBar'
import SortFilterBar from '@/components/sortFilterBar'
import CourseCardNoTitle from '@/components/courseCardNoFixedTitle'
import CustomTabs from '@/components/customTabs'
import LoadMore from '@/components/load-more'

import fetch from 'api/request';
import findCategoryUntil from '@/utils/findCategoryUntil';
import KeywordHighLight from '../../utils/keywordHighLight';

import logoImage from '@/assets/logo.png'
import styles from './index.module.scss'

@connect(state => state.counter, {add, minus, asyncAdd})
class CourseList extends Component {
  constructor(props) {
    super(props);
    // this.requestCourseListPending = false;
  }

  config = {
    navigationBarTitleText: '全部课程'
  }

  state = {
    loading: false,
    searchFocus: false,
    searchTipsVisible: false,
    requestCourseListPending: false,
    fixedHeadStyle: {
      height: 0,
    },
    sortInfo: {
    },
    filterInfo: [0],
    sortOptions: [{
      name: '综合',
      value: 1,
    }, {
      name: '最热',
      value: 2,
      canOrder: true,
    }, {
      name: '最新',
      value: 3,
      canOrder: true,
    }, {
      name: '价格',
      value: 5,
      canOrder: true,
    }],
    filterOptions: [
      // [{
      //   name: '全部价格',
      //   value: 0,
      // }, {
      //   name: '付费',
      //   value: 1,
      // }, {
      //   name: '免费',
      //   value: 2,
      // }],
      [{
        name: '全部状态',
        value: 0,
      }, {
        name: '积分',
        value: 1,
      }, {
        name: '秒杀',
        value: 2,
      }, {
        name: '抢购',
        value: 3,
      }, {
        name: '拼团',
        value: 4,
      }]
    ],
    courseList: [],
    searchRecentWord: [],
    searchTipsWord: [],
    searchInputValue: '',
    categoryList: [],
    activeCategoryValue: null,
    reqParams: {
      activityTypeList: undefined,
      text: undefined,
      goodsCategoryId: undefined,
      pageNum: 1,
      pageSize: 10,
      sortType: '1',
      sortOrder: 'desc',
    },
    isShowFilter: false,
  }

  // 慎用
  componentWillReceiveProps (nextProps) {
    // console.log('courseList ==== ', this.props, nextProps)
  }

  componentDidMount() {
    // console.log(Taro.getEnv(), this)
    // console.log(Taro.ENV_TYPE)
    console.log('ss')
    const { reqParams } = this.state;
    const mountedState = {};
    // 路由参数
    const { params = {} } = this.$router;
    console.log('query.search: ', params);
    const { keyword, searchFocus = 0, id: goodsCategoryId } = params
    mountedState.searchInputValue = keyword && decodeURIComponent(keyword) || '';
    mountedState.searchFocus = searchFocus > 0;
    mountedState.activeCategoryValue = Number(goodsCategoryId);
    if ('keyword' in params) {
      this.config.navigationBarTitleText = '搜索页'
      // 搜索记录
      fetch('getRecentSearchKeyword', {
      }).then(res => {
        console.log('getRecentSearchKeyword res: ', res)
        this.setState({
          searchRecentWord: res,
        })
      }).catch(err => {
        console.log('getRecentSearchKeyword err: ', err)
      })
    }

    // 请求数据
    const newParams = {
      ...reqParams,
      goodsCategoryId,
    };
    if (keyword && keyword.length) {
      newParams.text = keyword && decodeURIComponent(keyword);
    } else {
      this.getCourseCategoryList(Number(goodsCategoryId));
    }
    this.getCourseList(newParams);

    this.setState({
      ...mountedState,
    })

    // H5环境
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      // 当筛选框出现时，禁止滚动事件，兼容ios
      document.body.addEventListener('touchmove', (e) => {
        if (this.state.isShowFilter) {
          // e.preventDefault();
          document.body.style.position = 'fixed'
        }
      }, {
        passive: false // 兼容ios
      })
    }
  }

  /**
   * @Description: 获取课程类目
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-24 14:43:38
   */
  getCourseCategoryList (goodsCategoryId) {
    fetch('getCourseCategoryList', {})
    .then(allCategoryList => {
      let categoryList = [];
      if (goodsCategoryId > 0) {
        categoryList = findCategoryUntil(allCategoryList, goodsCategoryId) || [];
        categoryList = [{
          name: '全部',
          id: categoryList[0] && categoryList[0].parentId,
        },
          ...categoryList,
        ];
      } else {
        categoryList = [{
          name: '全部',
          id: goodsCategoryId
        },
          ...allCategoryList,
        ];
      }

      this.setState({
        categoryList,
      })
    })
    .catch((error) => {
      console.log('网络请求异常', error);
    })

  }
  /**
   * @Description: 获取课程公共函数
   * @params {Object} reqParams
   * @params {Boolean} toConcat
   * @params {Function} callback
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-24 14:43:19
   */
  getCourseList (reqParams, toConcat = false, callback) {
    // this.requestCourseListPending = true;
    return fetch('getCourseListByKeyword', reqParams).then(res=> {
      console.log('getCourseListByKeyword res: ', res);
      const { courseList = [] } = this.state;
      const stateData = {
        loading: false,
        // reqParams,
        requestCourseListPending: false,
      };
      // 处理课程数据
      if (toConcat) {
        stateData.courseList = courseList.concat(res.list);
      } else {
        stateData.courseList = res.list;
      }
      // 当有数据才更改请求参数变量
      if (res.list && res.list.length) {
        stateData.reqParams = reqParams
      }

      this.setState(stateData, () => {
        callback && callback();
      })
    }).catch(err => {
      console.log('getCourseListByKeyword err: ', err, reqParams)
      // this.requestCourseListPending = false;
      this.setState({
        // reqParams,
        requestCourseListPending: false,
      }, () => {
        callback && callback(err);
      })
    })
  }

  /**
   * @Description: 搜索框获得焦点
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-10 18:21:26
   */
  searchInputFocus = () => {
    this.setState({
      searchFocus: true,
    })
  }

  /**
   * @Description: 搜索框失去焦点
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-10 18:26:46
   */
  searchInputBlur = () => {
    this.setState({
      searchFocus: false,
    })
  }

  /**
   * @Description: 搜索框值改变时
   * @params {String} searchInputValue 输入值
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-10 18:27:07
   */
  searchInputChange = (searchInputValue) => {
    this.setState({
      searchInputValue,
      searchTipsVisible: true,
    })
    // 请求后台拿提示
    console.log('searchInputChange: ', searchInputValue)
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      fetch('getSearchTips', {
        text: searchInputValue,
        pageNum: 1,
        pageSize: 20,
      }).then(res => {
        console.log('getSearchTips res: ', res)
        const { list } = res;
        if (Array.isArray(list) && list.length) {
          this.setState({
            searchTipsWord: list,
          })
        }
      })
    }, 500);
  }

  /**
   * @Description: 清除所有最近搜索
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-10 18:28:00
   */
  clearRecentSearch = () => {
    fetch('clearAllRecentSearchKeyword').then(res => {
      console.log('clearAllRecentSearchKeyword', res);
      this.setState({
        searchRecentWord: [],
      })
    })
  }

  /**
   * @Description: 取消按钮点击事件
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-28 18:28:36
   */
  searchCancel = () => {
    console.log('searchCancel');
    Taro.navigateBack();
  }

  /**
   * @Description: 搜索框回车事件触发
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-10 18:28:21
   */
  searchInputSubmit = (keyword) => {
    this.searchInputBlur();
    this.setState({
      searchTipsVisible: false,
    })

    // 请求后台拿数据
    const { path, params } = this.$router;
    params.keyword = keyword;
    delete params.searchFocus;

    const url = `${(path || '/')}?${Qs.stringify(params)}`;

    // 跳转到搜索关键字页
    Taro.navigateTo({
      url,
    })
  }

  /**
   * @Description: 点击搜索提示
   * @params {String} searchInputValue
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-10 18:28:42
   */
  clickSearchTip = (searchInputValue) => {
    this.setState({
      searchInputValue,
      searchTipsVisible: false,
    })
    const { path, params } = this.$router;
    params.keyword = searchInputValue;
    delete params.searchFocus;

    const url = `${(path || '/')}?${Qs.stringify(params)}`;

    // 跳转到搜索关键字页
    Taro.navigateTo({
      url,
    })
  }

  /**
   * @Description: 点击看看其他课程
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-11 15:28:07
   */
  gotoOtherCourse = () => {
    console.log('goto');
    const { path, params } = this.$router;
    delete params.keyword
    delete params.searchFocus;
    delete params.id;

    const url = `/pages/courseList/index?${Qs.stringify(params)}`;
    Taro.navigateTo({
      url,
    })
  }

  /**
   * @Description: 类目tab点击事件
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-17 11:42:05
   */
  tabClick = (item, index) => {
    console.log('tabClick', item, index);
    const { id: activeCategoryValue, childList = [] } = item;
    const { reqParams, categoryList } = this.state;

    // 判断是否有children
    if (childList && childList.length) {
      categoryList[0].id = activeCategoryValue;
      categoryList.splice(1, categoryList.length, ...childList);
    }
    // 设置状态
    this.setState({
      activeCategoryValue,
      categoryList,
      sortInfo: {},
      filterInfo: [],
    });

    // 请求获取数据
    reqParams.sortType = '1';
    reqParams.sortOrder = 'desc';
    delete reqParams.activityTypeList;
    this.getCourseList({
      ...reqParams,
      goodsCategoryId: activeCategoryValue,
    })
  }

  /**
   * @Description: 排序筛选点击事件
   * @params {Object} sortInfo 排序对象
   * @params {Array} filterInfo 排序对象
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-24 15:31:10
   */
  sortFilterBarChange = (sortInfo, filterInfo) => {
    console.log('sortFilterBarChange: ====', sortInfo, filterInfo)
    const { item = {}, order: sortOrder } = sortInfo;
    const [ filterType ] = filterInfo;
    const { reqParams } = this.state;
    const sortType = `${item.value || 1}`;

    reqParams.pageNum = 1;
    this.setState({
      courseList: [],
      sortInfo,
      filterInfo,
      isShowFilter: false,
    }, () => {
      // 请求数据
      this.getCourseList({
        ...reqParams,
        sortType,
        sortOrder,
        activityTypeList: filterType > 0 ? filterType + '' : undefined,
      });
    })
  }

  /**
   * @Description: 最近搜索的tag点击事件
   * @params {String} keyword
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-18 16:59:03
   */
  recentKeywordClick = (keyword) => {
    console.log('recentKeywordClick: ', keyword, this);
    const { path, params } = this.$router;
    params.keyword = keyword;
    delete params.searchFocus;

    const url = `${(path || '/')}?${Qs.stringify(params)}`;
    console.log(url);

    // 跳转到搜索关键字页
    Taro.navigateTo({
      url,
    })
  }

  /**
   * @Description: 滚动到底部/右边 触发事件
   * @params {event} e
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-25 11:22:31
   */
  onScrolltolower = (e) => {
    console.log('onScrolltolower', e);
    const { reqParams, requestCourseListPending } = this.state;
    // 请求新的数据
    if (!requestCourseListPending) {
      this.setState({
        requestCourseListPending: !requestCourseListPending,
      })

      this.getCourseList({
        ...reqParams,
        pageNum: reqParams.pageNum + 1,
      }, true).catch(err => {
        console.log('onScrolltolower', err);
      })
    }
  }

  /**
  * @Description: 滚动到顶部/左边 触发事件
  * @params {event} e
  * @return: 
  * @LastEditors: 蔡江旭
  * @LastEditTime: Do not edit
  * @Date: 2019-04-25 11:22:59
  */
  onScrolltoupper = (e) => {
    console.log('onScrolltoupper', e);
  }

  /**
   * @Description: 微信小程序获得元素rect
   * @params {Object} ref 元素的ref
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-28 17:26:32
   */
  getWeChatClientRect = (ref) => {
    return new Promise((resolve, reject) => {
      ref.boundingClientRect(rect => {
        // console.log('bouding: ', rect);
        resolve(rect);
      }).exec();
    })
  }
  /**
   * @Description: 滚动触发事件
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-25 14:29:41
   */
  onScroll = (e) => {
    const { fixedHeadStyle, searchTipsVisible } = this.state;
    // console.log('onScroll:   this.headerRefthis.headerRef', this.headerRef);
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    let timerTime = 100;
    // 当出现搜索提示时，不控制吸顶
    if(!searchTipsVisible) {
      const { scrollTop } = e.detail;
      this.scrollTimer = setTimeout(() => {
        console.log('scrollTimer');
        // let headerRect = {};
        // 微信环境
        if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
          // headerRect = await this.getWeChatClientRect(this.headerRef);
          this.getWeChatClientRect(this.fixedEleRef).then(fixedRect => {
            this.setFixedHeadStyle(scrollTop, fixedRect, fixedHeadStyle)
          });
        }
        // H5环境
        if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
          // const headerEle = this.headerRef.vnode.dom;
          const fixedEle = this.fixedEleRef.vnode.dom;
          // headerRect = headerEle.getBoundingClientRect();
          const fixedRect = fixedEle.getBoundingClientRect();
          // console.log('onScroll', scrollTop);
          // console.log('onScroll: ', headerRect, fixedRect, fixedHeadStyle.height);
          this.setFixedHeadStyle(scrollTop, fixedRect, fixedHeadStyle)
        }
      }, timerTime)
    }
  }

  /**
   * @Description: 设置工具栏的fixedStyle
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-05-08 09:55:03
   */
  setFixedHeadStyle = (scrollTop, fixedRect, fixedHeadStyle) => {
     // 设置fixed
     if (scrollTop > fixedRect.top && Number(fixedHeadStyle.height || 0) < fixedRect.height) {
      this.setState({
        fixedHeadStyle: {
          height: fixedRect.height,
          position: 'fixed',
          top: 0,
          left: 0,
        }
      })
    }

    // 去掉fixed
    if (scrollTop < fixedRect.top && Number(fixedHeadStyle.height || 0) !== 0) {
      this.setState({
        fixedHeadStyle: {
          height: 0,
        }
      })
    }
  }

  /**
   * @Description: 卡片点击
   * @params {Object} course
   * @params {Number} index
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-25 15:10:23
   */
  cardClick = (course, index) => {
    console.log('cardClick', course, index, this.$router);

    // 跳转
    const { params } = this.$router;
    delete params.keyword;
    delete params.searchFocus;
    params.id = course.id;
    const path = '/learnCenter/pages/courseDetail/index'
    const url = `${(path || '/')}?${Qs.stringify(params)}`;
    Taro.navigateTo({
      url,
    })
  }

  /**
   * @Description: 显示搜索页面
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-04-28 18:10:57
   */
  showSearchPage = () => {
    const { path, params } = this.$router;
    params.keyword = '';
    params.searchFocus = 1;

    const url = `${(path || '/')}?${Qs.stringify(params)}`;
    Taro.navigateTo({
      url,
    })
  }

  /**
   * @Description: 筛选显示隐藏事件
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-05-09 16:07:48
   */
  filterShowHandler = (isShowFilter) => {
    this.setState({
      isShowFilter,
    })
    // document.querySelector('body').style.overflowY = isShowFilter ? 'hidden' : '';
  }

  /**
   * @Description: 跳转回首页
   * @params: 
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-05-06 15:46:38
   */
  gotoHomePage = () => {
    const { params } = this.$router;
    const url = `${'/pages/home/index'}?${Qs.stringify(params)}`;
    Taro.navigateTo({
      url,
    })
  }

  /**
   * @Description: 课程活动
   * @params {Object} course
   * @return: 
   * @LastEditors: 蔡江旭
   * @LastEditTime: Do not edit
   * @Date: 2019-05-14 09:00:54
   */
  renderActivitePointOrPrice = (course) => {
    const { activiteType, activitePoint, activitePrice } = course;
    switch (activiteType) {
      case 1:
        return activitePoint + '积分';
      case 2:
        return '￥' + activitePrice;
      case 3:
        return '￥' + activitePrice;
      default:
        return null;
    }
  }

  gotoDownload = ()=>{
    Taro.navigateTo({
      url: '/pages/downLoad/index'
    })
  }

  render () {
    const {
      sortInfo = {},
      sortOptions,
      filterInfo = [],
      filterOptions,
      courseList,
      searchRecentWord,
      searchFocus,
      searchTipsWord = [],
      searchTipsVisible,
      searchInputValue = '',
      categoryList,
      activeCategoryValue,
      requestCourseListPending,
      fixedHeadStyle,
      isShowFilter,
    } = this.state;


    // courseList = courseList.slice(0, 4);
    const hasKeywordProperty = this.$router.params.hasOwnProperty('keyword');
    return (
      <ScrollView
        className={styles.courseList}
        scrollY
        lowerThreshold='400'
        scrollWithAnimation
        onScroll={this.onScroll}
        onScrollToUpper={this.onScrolltoupper}
        onScrollToLower={this.onScrolltolower}
        style={{
          overflowY: isShowFilter ? 'hidden' : ''
        }}
      >
        {/* 类目、搜索框等头部 */}
        <View
          ref={el => this.headerRef = el}
          className={styles.courseListHeader}
        >
          <View className={styles.searchBarBox}>
            {/* 搜索框 */}
            <View
              className={styles.searchBar}
            >
              {/* 搜索框 */}
              {hasKeywordProperty &&
                <SearchBar
                  focus={searchFocus}
                  value={searchInputValue || ''}
                  onFocus={this.searchInputFocus}
                  onBlur={this.searchInputBlur}
                  onChange={this.searchInputChange}
                  onCancel={this.searchCancel}
                  onSubmit={this.searchInputSubmit}
                />
              }
              {/* 展示头部 */}
              {!hasKeywordProperty &&
                <View className={styles.topNavBox}>
                  <Image
                    className={styles.logoBox}
                    mode='scaleToFill'
                    src={logoImage}
                    onClick={this.gotoHomePage}
                  />
                  <View className={styles.topNavSearchInput} onClick={this.showSearchPage}>
                    <View className='iconfont iconsousuo'></View>
                    <View className={styles.inputBox}>
                      <Text>搜索感兴趣的课程</Text>
                    </View>
                  </View>
                  <View className={styles.Btn}></View>
                  {/* <View className={styles.actionBtn} onClick={this.gotoDownload}>打开APP</View> */}
                </View>
                
              }
              
            </View>
            {/* 最近搜索 */}
            <View className={styles.recentSearch} style={{ display: searchFocus ? 'block' : 'none' }}>
              <View className={styles.titleBox}>
                <Text className={styles.title}>最近搜索</Text>
                <Text className={classNames('iconfont', 'iconshanchu1', styles.clearAll)} onClick={this.clearRecentSearch}></Text>
              </View>
              <View className={styles.recentWordList}>
                {searchRecentWord.map((ele, index) => (
                  <View className={styles.wordTag} key={index} onClick={() => this.recentKeywordClick(ele)}>
                    {ele}
                  </View>
                ))}
              </View>
            </View>
            {/* 搜索提示 */}
            <View
              className={styles.searchTipsBox}
              style={{ display: searchTipsVisible && searchInputValue.length && searchTipsWord.length ? 'block' : 'none' }}
            >
              <View className={styles.tipsList}>
                {searchTipsWord.map((ele, index) => (
                  <RichText
                    className={styles.tips}
                    key={index}
                    onClick={() => this.clickSearchTip(ele)}
                    nodes={KeywordHighLight(ele, searchInputValue, '<span class="high-light-text">{{{text}}}</span>')}
                  />
                ))}
              </View>
            </View>
          </View>

          <View
            className={styles.toolsBarBox}
            ref={el => this.fixedEleRef = el}
          >
            <View
              style={{
                paddingBottom: fixedHeadStyle.height || 0,
              }}
            ></View>
            <View
              className={styles.toolsBar}
              style={{
                ...fixedHeadStyle,
                height: undefined,
              }}
            >
              {/* 类目列表 */}
              {!hasKeywordProperty &&
                <CustomTabs
                  activeKeyName='id'
                  activeValue={activeCategoryValue}
                  categoryList={categoryList}
                  onClick={this.tabClick}
                ></CustomTabs>
              }

              {/* 排序筛选 */}
              <View className={styles.sortFilterBox}>
                <SortFilterBar
                  isShowFilter={isShowFilter}
                  sortInfo={sortInfo}
                  filterInfo={filterInfo}
                  sortOptions={sortOptions}
                  filterOptions={filterOptions}
                  onChange={this.sortFilterBarChange}
                  filterShowHandler={this.filterShowHandler}
                />
              </View>
            </View>
          </View>
        </View>

        {/* 课程列表 */}
        <View
          className={styles.listBox}
          style={{
            display: searchTipsVisible ? 'none' : '',
          }}
        >
          {/* 有数据 */}
          {(courseList && courseList.length > 0) &&
            <View>
              {courseList && courseList.map((course, index) => (
                <CourseCardNoTitle
                  onClick={() => this.cardClick(course, index)}
                  course={course}
                  key={index}
                  coverImage={course.coverPicture}
                >
                  <RichText nodes={KeywordHighLight(course.name, searchInputValue, '<span class="high-light-text">{{{text}}}</span>')} />
                  <View className={styles.descBox}>
                      <Text className={styles.teacherBox}>{course.teacherName}老师</Text>
                      <Text className={styles.totalBuyBox}>{course.totalBuyCount}人学过</Text>
                  </View>
                  <View className={styles.tagPriceBox}>
                      {course.activiteTypeName &&
                        <View className={styles.tag}>{course.activiteTypeName.replace('限时', '')}</View>
                      }
                      {course.activiteType > 0 &&
                        <Text className={styles.activePrice}>{this.renderActivitePointOrPrice(course)}</Text>
                      }
                      <Text
                        className={classNames(styles.price, {
                          'line-through': course.activiteType > 0,
                        })}
                      >￥{course.price}</Text>
                  </View>
                </CourseCardNoTitle>
              ))}
              <LoadMore loadMore={requestCourseListPending} />
            </View>
          }

          {/* 无数据时 */}
          {(!courseList || courseList && courseList.length === 0) &&
            <View className={styles.emptyList}>
              <View className={styles.imgBox}>
                <Image
                  className={styles.img}
                  mode='widthFix'
                  src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/empty-shopcar.png'
                />
              </View>
              <View>暂无相关搜索结果</View>
              <View>
                <Text className={styles.gotoOther} onClick={this.gotoOtherCourse}>看看其他课程</Text>
              </View>
            </View>
          }
        </View>
      </ScrollView>
    )
  }
}

export default CourseList
