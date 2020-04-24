import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import styles from "./index.module.scss";

export default class NewsTag extends Component {
  state = {
    activeValue: 0
  };

  // 慎用
  componentWillReceiveProps(nextProps) {
    const {activeValue} = nextProps
    this.setState({
      activeValue
    })
  }

  componentDidMount() {}

  tagClick = (item, index) => {
    const { activeKeyName = "id" } = this.props;
    const value = item[activeKeyName];
    this.setState({
      activeValue: value
    });

    const { onClick } = this.props;
    if (typeof onClick === "function") {
      onClick(item, index);
    }
  };

  render() {
    const {
      categoryList = [],
      activeKeyName = "id",
      scrollOptions = {},
      tabRender
    } = this.props;

    const { activeValue } = this.state;

    return (
      <View className={styles.newsTagListBox}>
        <ScrollView
          className='scroll-view'
          scrollX
          scrollWithAnimation
          // eslint-disable-next-line taro/no-spread-in-props
          // {...scrollOptions}
        >
          {categoryList.map((ele, index) => (
            <View
              className={classNames(
                "tag",
                (activeValue !='undefined' && activeValue === ele[activeKeyName]) ||
                  (!(activeValue !='undefined') && index === 0)
                  ? "active"
                  : ""
              )}
              key={index}
              onClick={() => this.tagClick(ele, index)}
            >
              {(typeof tabRender === "function" && tabRender(ele, index)) ||
                ele.name}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

