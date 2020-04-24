import Taro, { Component } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from "taro-ui";
import CourseIntroducton from "../courseIntroduction/index";
import DirectoryList from "../directoryList/index";
import ReviewComponent from "../review/index";

export default class TabComponent extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
    };
  }

  static defaultProps = {
    goodsDetail: {},
    goods: ''
  }

  static options = {
    addGlobalClass: true
  }

  handleClick(value) {
    this.setState({
      current: value
    });
  }

  render() {
    const tabList = [
      {
        title: "课程介绍"
      },
      {
        title: "目录"
      },
      {
        title: "评论"
      }
    ];

    return (
      <AtTabs
        current={this.state.current}
        tabList={tabList}
        onClick={this.handleClick.bind(this)}
      >
        <AtTabsPane current={this.state.current} index={0}>
          <CourseIntroducton goods={this.props.goodsDetail[0]} />
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          <DirectoryList goods={this.props.goodsDetail[1]} />
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={2}>
          <ReviewComponent goods={this.props.goodsDetail[1]} />
        </AtTabsPane>
      </AtTabs>
    )
  }
}