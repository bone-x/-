import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import fetch from 'api/request'
import URI from 'urijs'
import "./index.scss";

class DirectoryList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      menuDatas: [],
    };
    this.listDomKnob = ref => {this.listDom = ref};
    this.clickHandler = this.clickHandler.bind(this)
  }

  static defaultProps = {
    goods: ''
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    this.getCourseRecordList(this.props.goods)
  }

  // 获取商品课程目录
  getCourseRecordList(params) {
    fetch('getCourseRecord', {goodsId: params}).then(res => {
      if (res) {
        res.map((v, k) => {
          if(k === 0) {
            v.rotate = true
          } else {
            v.rotate = false
          }
        })
        this.setState({
          menuDatas: res
        })
      } else {
        return false;
      }
    }).then(error => {
      console.log(error)
    })
  }

  clickHandler(item) {
    if (process.env.TARO_ENV === 'weapp') {
      this.state.menuDatas.map((v) => {
        if(v.recordId === item.recordId) {
          v.rotate = !v.rotate
        }
      })
      this.setState()
    } else if (process.env.TARO_ENV === 'h5') {
      item.rotate = !item.rotate
      this.setState()
    }
  }

  checkListIndex(key) {
    return key === this.state.currentIndex? 'knobList active': 'knobList';
  }

  goToCenterStudy(v) {
    const token = Taro.getStorageSync('token');
    if(token) {
      if (v.isListen === 0) {
        return false;
      }
      // 试看
      fetch('toRecord', {recordId: v.recordId}).then(res => {
        let uri = new URI(res.recordUrl)
        uri.addSearch('cover', v.firstImage)
        uri.addSearch('id', this.props.goods)
        let query = uri.query()
        let target = new URI('/learnCenter/pages/learningCenterDetail/index')
        Taro.navigateTo({
          url: target.query(query).toString()
        })
      })     
    } else {
      Taro.navigateTo({
        url: '/pages/loginPage/index'
      })
    } 
  }

  render() {

    const { menuDatas } = this.state
    var crtCmp = this;
    var menusDataDom = menuDatas.map((item, key) => {
      return (
        <View className='chapter' id='chapter' key={item.id}>
          <View
            className='chapterBox'
            onClick={crtCmp.clickHandler.bind(this, item, key)}
          >
            <View className='chapterNameBox'>
              <Text className='chapterName'>
                {item.name}
              </Text>
              <Text style={item.list == 0?'display:none':'display:block'} className={`iconfont icondown chapterIcon ${item.rotate ? 'iconRotate' : ""}`}></Text>
            </View>
          </View>
          <View style={item.rotate ?'max-height:3000px':''} className='knobList'>
            {
              item.list?item.list.map((v) => {
                return (
                  <View className='knob' key={v.id} onClick={this.goToCenterStudy.bind(this, v)}>
                    <Text className='knobName'>{v.polyvName}</Text>
                    {
                      v.isListen === 0? <Text className='knobIconBox'><Text className='iconfont iconlock-line knobIcon'></Text></Text>: <Text className='knobTag'>试看</Text>
                    }
                    <Text className='knobTime'>{v.duration}</Text>
                  </View>
                )
              }): ''
            }
          </View>
        </View>
      );
    });
    return <View className='directoryList'>{menusDataDom}</View>;
  }
}

export default DirectoryList;

