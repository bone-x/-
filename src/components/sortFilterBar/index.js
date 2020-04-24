/*
 * @Author: 蔡江旭
 * @Description: 排序筛选组件
 * @props {Array} sortOptions 排序tag
 * @props {Array} filterOptions 过滤的tag
 * @props {Object} sortInfo  {} 默认排序的key和方式  // key为索引值
 * @props {Array} filterInfo [0, 0] 默认选择的过滤tag
 * @props {String} activeFilterKeyName 指定数据项的key，控制tab的激活态
 * 
 * @props {function} onChange (sortInfo, filterInfo)点击触发的事件
 * @LastEditors: 蔡江旭
 * @Date: 2019-04-08 10:02:25
 * @LastEditTime: 2019-05-15 09:42:50
 */
import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import isNullOrUndefined from '@/utils/isNullOrUndefined';
import styles from './index.module.scss'

export default class SortFilterBar extends PureComponent {
    defaultProps = {
        filterOptions: [],
        activeFilterKeyName: 'value',
    }
    state = {
        isShowFilter: false,
        sortInfo: {},
        filterInfo: new Array(this.props.filterOptions && this.props.filterOptions.length),
    }

    componentWillReceiveProps(nextProps) {
        // console.log('SortFilterBar props: ', nextProps);
        const newState = {};
        for (const key in this.state) {
            if (this.state[key] && nextProps[key]) {
                const ele = nextProps[key];
                newState[key] = ele;
            }
        }

        this.setState(newState);
    }
    /**
     * @Description: 排序条件触发
     * @params: 
     * @return: 
     * @LastEditors: 蔡江旭
     * @LastEditTime: Do not edit
     * @Date: 2019-04-08 15:05:40
     */
    sortClick = (item, order, index) => {
        console.log('sort click', item, order, index);
        const { filterInfo } = this.state;
        const sortInfo = {
            key: index,
            order,
            item,
        }
        this.setState({
            sortInfo,
        })
        this.onInternalChange(sortInfo, filterInfo);
    }

    /**
     * @Description: filter-tag点击事件
     * @params {Number} index 第几行的索引值
     * @params {Number} value tag的value值
     * @return: 
     * @LastEditors: 蔡江旭
     * @LastEditTime: Do not edit
     * @Date: 2019-04-09 09:09:06
     */
    selectFilterTag = (index, value) => {
        console.log('selectFilterTag', index, value);
        const { sortInfo } = this.state;
        // 数组会直接 === 比较?
        const filterInfo = Array.from(this.state.filterInfo)
        filterInfo[index] = value;
        this.setState({
            filterInfo: Array.from(filterInfo),
        })
        this.onInternalChange(sortInfo, filterInfo);
    }

    /**
     * @Description: 统一处理onChange回调
     * @params: {Array} ...args
     * @return: 
     * @LastEditors: 蔡江旭
     * @LastEditTime: Do not edit
     * @Date: 2019-04-08 15:23:33
     */
    onInternalChange = (...args) => {
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
            onChange(...args);
        }
    }

    /**
     * @Description: 控制filter的显示
     * @params {Boolean} isShowFilter
     * @return: 
     * @LastEditors: 蔡江旭
     * @LastEditTime: Do not edit
     * @Date: 2019-04-09 08:44:04
     */
    showFilter = (isShowFilter) => {
        this.setState({
            isShowFilter,
        })
        const { filterShowHandler } = this.props;
        if (typeof filterShowHandler) {
          filterShowHandler(isShowFilter);
        }
    }

    preventMove = (e) => {
      console.log('preventMove');
      e.preventDefault()
    }

    render () {
        const { className, style } = this.props;
        const { isShowFilter, sortInfo, filterInfo } = this.state;
        const newClassName = classNames(styles.sortFilterBar, className);
        const { sortOptions = [], filterOptions = [], activeFilterKeyName = 'value' } = this.props;

        return (
            <View className={newClassName} style={style}>
                {/* 排序tag */}
                <View className={styles.sortList}>
                    {sortOptions.map((ele, index) => {
                        const isCurrnentSortItem = (sortInfo && sortInfo.key) ?  sortInfo.key === index : index === 0;
                        const toOrder = isCurrnentSortItem ? (sortInfo.order === 'desc' ? 'asc' : 'desc') : 'desc';

                        return (
                        <View className='sort-tag' key={index} onClick={() => isCurrnentSortItem ? ele.canOrder && this.sortClick(ele, toOrder, index) : this.sortClick(ele, toOrder, index)}>
                            <Text
                              className={classNames(!sortInfo.key && isCurrnentSortItem ? 'tag-active' : '')}
                            >{ele.name}</Text>
                            {ele.canOrder &&
                                <View className={'sort-order ' + (isCurrnentSortItem && sortInfo.order ? 'order-' + sortInfo.order : '')}>
                                    <Text className='sort-order-item asc'></Text>
                                    <Text className='sort-order-item desc'></Text>
                                </View>
                            }
                        </View>
                        )
                    }
                    )}
                    <View className='sort-tag filter-btn' onClick={() => this.showFilter(!isShowFilter)}>
                        <Text className='iconfont filter-icon iconshaixuan'></Text>
                    </View>
                </View>
                {/* 过滤tag */}
                {isShowFilter && 
                    <View className={styles.filterBox}>
                        <View className={styles.filterList}>
                            {filterOptions.map((arr, index) => (
                                <View className={styles.filterItem} key={index}>
                                    {arr.map((item, itemIndex) => {
                                        const isNull = isNullOrUndefined(filterInfo && filterInfo[index]);
                                        return (<View
                                          className={classNames('filter-tag', ((isNull ? itemIndex === 0 : filterInfo[index] === item[activeFilterKeyName || 'value']) ? 'active' : ''))}
                                          key={itemIndex}
                                          onClick={() => this.selectFilterTag(index, item.value)}
                                        >
                                            <Text>{item.name}</Text>
                                        </View>
                                    )}
                                    )}
                                </View>
                            )
                            )}
                        </View>
                        <View
                          className={styles.bgCover}
                          onTouchMove={this.preventMove}
                          onClick={() => this.showFilter(false)}
                        ></View>
                    </View>
                }
            </View>
        )
    }
}
