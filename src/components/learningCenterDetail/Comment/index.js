import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from '@tarojs/components';
import Loading from "@/components/loading/index";
import fetch from "@/api/request";

import GlobalAssessment from "@/components/global-assessment/index";
import AssessmentList from "@/components/assessment-list/index";

import './style.scss';
import { AtRate, AtTag, AtTextarea } from 'taro-ui';

export default class Comment extends Component {

  static options = {
    addGlobalClass: true
  };

  state = {
    loading: true,
    editState: 0, // 编辑状态：0 没有编辑过， 1 编辑过了还可以编辑， 2 已经不能编辑
    editShow: false,
    starsValue: 5,
    starsCourseValue: 5,
    starsLecturerValue: 5,
    textCourseValue: '强烈推荐',
    textLecturerValue: '膜拜',
    globalReview: {},
    myReview: {}, // 我的评价
    goodsInfo: {}, // 商品信息
    subCommentLoading: false,
    tagList: [{
      id: 1,
      text: '实用性强',
      active: false
    }, {
      id: 2,
      text: '案例丰富',
      active: false
    }, {
      id: 3,
      text: '讲课有趣',
      active: false
    }, {
      id: 4,
      text: '资料完善',
      active: false
    }, {
      id: 5,
      text: '经验丰富',
      active: false
    }],
    commentValue: '',
    tagNames: '',

  };

  componentWillMount() {
    this.initFn();
  }

  componentDidMount() {
    console.log(Taro.getEnv());
    console.log(Taro.ENV_TYPE);
  }

  // 初始化
  initFn = () => {
    console.log(123123);
    fetch('queryEvaluationInfo', {
      goodsId: this.props.data.id
    }, {}).then(res => {
      console.log(res, 2222222);
      this.setState({
        globalReview: res
      });
    }).catch(error => {
      console.log(error, 2222222);
    });

    this.queryMyComment();
  };

  // 获取我的评价
  queryMyComment = () => {
    console.log('获取我的评价');

    fetch('queryMyGoodsEvaluation', {
      goodsId: this.props.data.id
    }, {}).then(res => {

      if (!res.overallScore) {
        console.log(res, '没有评价过');
        this.setState({
          myReview: res,
          editState: 0
        });
      } else {
        let arr = res.tagName.split(',');
        let newArr = [];
        arr.pop();

        for (let i = 0; i < arr.length; i++) {
          let item = {};
          item.id = i;
          item.text = arr[i];
          item.active = true;
          newArr.push(item);
        }

        this.setState({
          myReview: res,
          starsCourseValue: res.courseScore,
          starsLecturerValue: res.teacherScore,
          tagList: newArr
        });

        if (res.tagName == '' || res.commentContent == '') {
          console.log(res, '评价过了，但还可以评价');
          this.handleTextCourse(res.courseScore);
          this.handleTextLecturer(res.teacherScore);
          this.setState({
            editState: 1
          });
        } else {
          console.log(res, '评价过了，不能再评价了');
          this.setState({
            editState: 2
          });
        }
      }
    }).catch(error => {
      console.log(error);
    });
  };

  // 判断好坏打星
  ifGoodBad = () => {
    if ((this.state.starsCourseValue + this.state.starsLecturerValue) / 2 >= 3) {
      this.setState({
        tagList: [{
          id: 1,
          text: '实用性强',
          active: false
        }, {
          id: 2,
          text: '案例丰富',
          active: false
        }, {
          id: 3,
          text: '讲课有趣',
          active: false
        }, {
          id: 4,
          text: '资料完善',
          active: false
        }, {
          id: 5,
          text: '经验丰富',
          active: false
        }]
      });
    } else {
      this.setState({
        tagList: [{
          id: 1,
          text: '技术过时',
          active: false
        }, {
          id: 2,
          text: '太理论化',
          active: false
        }, {
          id: 3,
          text: '缺乏案列',
          active: false
        }, {
          id: 4,
          text: '讲课无趣',
          active: false
        }, {
          id: 5,
          text: '资料不全',
          active: false
        }]
      });
    }
  };

  // 课件星星打分
  handleStarsCourseChange = value => {
    this.setState({
      starsCourseValue: value
    }, () => {
      this.handleTextCourse(value);
      this.ifGoodBad();
    });
  };

  // 讲师星星打分
  handleStarsLecturerChange = value => {
    this.setState({
      starsLecturerValue: value
    }, () => {
      this.handleTextLecturer(value);
      this.ifGoodBad();
    });
  };

  // 课程打分标签
  handleTextCourse = value => {
    let str = '';
    switch (value) {
      case 1:
        str = '就是辣鸡';
        break;
      case 2:
        str = '希望改进';
        break;
      case 3:
        str = '一般般啦';
        break;
      case 4:
        str = '是我的菜';
        break;
      case 5:
        str = '强烈推荐';
        break;
      default:
        break;
    }
    this.setState({
      textCourseValue: str
    });
  };
  // 讲师打分标签
  handleTextLecturer = value => {
    let str = '';
    switch (value) {
      case 1:
        str = '呵呵';
        break;
      case 2:
        str = '好吧';
        break;
      case 3:
        str = '秀儿';
        break;
      case 4:
        str = '带飞';
        break;
      case 5:
        str = '膜拜';
        break;
      default:
        break;
    }
    this.setState({
      textLecturerValue: str
    });
  };

  // tag 选择 
  handleTagClick = value => {
    let str = '';
    let list = this.state.tagList;
    list[value.name].active = !value.active;
    this.setState({
      tagList: [...list]
    }, () => {

      this.state.tagList.map(item => {
        if (item.active) {
          str += item.text + ',';
        }
      });

      this.setState({
        tagNames: str
      }, () => {
        console.log(this.state.tagNames, 111);
      });
    });
  };

  // 文本框change
  handleCommentChange = event => {
    this.setState({
      commentValue: event.target.value
    });
  };

  // 开启编辑
  openEditFn = () => {

    if(!this.props.onInspectTime()) return

    this.setState({
      editShow: true
    });
    // 获取商品信息
    fetch('queryCourseInfo', {
      courseId: this.props.data.courseId,
      orderId: this.props.data.orderId
    }, {}).then(res => {
      console.log(res);
      this.setState({
        goodsInfo: res
      });
    }).catch(error => {
      console.log(error);
    });
  };

  // 提交评价
  subCommentFn = () => {
    const { editState, editShow, commentValue, starsCourseValue, starsLecturerValue, goodsInfo, myReview, tagNames } = this.state;
    const { courseId, id } = this.props.data;

    this.setState({
      subCommentLoading: true
    });

    if (editState == 0) {
      fetch('addGoodsEvaluation', {
        commentContent: commentValue, // 评价内容
        courseId, // 课程 ID
        courseScore: starsCourseValue, //课程评分
        duration: goodsInfo.watchRecordNum, // 时长
        goodsId: id, // 商品ID
        goodsName: goodsInfo.courseName, // 商品名称
        tagName: tagNames, // 标签名称
        teacherScore: starsLecturerValue //讲师 评分
      }, {}).then(res => {
        console.log('评价成功');
        this.setState({
          subCommentLoading: false,
          editShow: false

        }, () => {
          this.queryMyComment();
        });
      }).catch(error => {
        console.log(error);
        this.setState({
          subCommentLoading: false
        });
      });
    } else {
      fetch('editGoodsEvaluation', {
        commentContent: commentValue, // 评价内容
        courseId, // 课程 ID
        courseScore: starsCourseValue, //课程评分
        goodsId: id, // 商品ID
        goodsName: goodsInfo.courseName, // 商品名称
        tagName: tagNames, // 标签名称
        teacherScore: starsLecturerValue, //讲师 评分
        id: myReview.id
      }, {}).then(res => {
        console.log('修改成功');
        this.setState({
          subCommentLoading: false,
          editShow: false
        }, () => {
          this.queryMyComment();
        });
      }).catch(error => {
        console.log(error);
        this.setState({
          subCommentLoading: false
        });
      });
    }
  };

  render() {
    const {
      editState,
      editShow,
      myReview,
      starsValue,
      starsCourseValue,
      textLecturerValue,
      textCourseValue,
      subCommentLoading,
      starsLecturerValue,
      globalReview,
      tagList,
      commentValue
    } = this.state;

    return <View>
				<View className="my-comment">
					<View className="title-box">
						<View className="title">我的评价</View>
						{editState == 1 && <View className="action" onClick={this.openEditFn}>
								<View className="iconfont iconbianji"></View>
								编辑
							</View>}
					</View>
					{editShow && <View className="eidt-box">
							<View className="stars-box">
								<Text className="tit">课程评价</Text>
								<View className="right-box">
									<AtRate value={starsCourseValue} onChange={this.handleStarsCourseChange} />
									<Text className="current">{textCourseValue}</Text>
								</View>

							</View>

							<View className="stars-box">
								<Text className="tit">讲师评价</Text>
								<View className="right-box">
									<AtRate value={starsLecturerValue} onChange={this.handleStarsLecturerChange} />
									<Text className="current">{textLecturerValue}</Text>
								</View>
							</View>

							{tagList && tagList.length ? <View className="tag-box">
									<Text className="tit">评价内容</Text>
									<View className="right-box">
										{tagList.map((item, index) => {
                return <AtTag key={item.id} name={index.toString()} active={item.active} onClick={this.handleTagClick}>
														{item.text}
													</AtTag>;
              })}
									</View>
								</View> : null}

							<View className="comment-box">
								<AtTextarea value={commentValue} onChange={this.handleCommentChange} maxLength={200} count={false} height={180} placeholder="床前明月光，吐槽不用慌，举头望明月，小行等亲来..." />
							</View>

							<View className="action-box">
								<Button loading={subCommentLoading} disabled={subCommentLoading} onClick={this.subCommentFn} className="sub-btn" type="primary" size="small">
									提交
								</Button>
							</View>
						</View>}

					{editState == 0 && !editShow && <View className="no-comment-box" onClick={this.openEditFn}>
							<Text className="tit">马上评价</Text>
							<AtRate size={16} margin={10} value={0} />
						</View>}

					{editState !== 0 && !editShow && <View className="eidt-box read-only">
							<View className="stars-box">
								<Text className="tit">综合评价</Text>
								<View className="right-box">
									<AtRate value={myReview.overallScore} />
									<Text className="current">{myReview.overallScore}分</Text>
									<Text className="total">共5分</Text>
								</View>
							</View>

							{tagList && tagList.length ? <View className="tag-box">
									<Text className="tit">综合评价</Text>
									<View className="right-box">
										{tagList.map((item, index) => {
                return <AtTag key={item.id} name={index.toString()} active={item.active}>
														{item.text}
													</AtTag>;
              })}
									</View>
								</View> : null}

							
							<View className="comment-box comment-read-only">{myReview.commentContent}</View>
						</View>}
				</View>

				<View className="review">
					{/* 整体评价 */}
					<GlobalAssessment globalReview={{ goodsId: this.props.data.id }} />
					{/* 评论列表 */}
					<AssessmentList reviewListParms={{ goodsId: this.props.data.id }} />
				</View>
			</View>;
  }
}