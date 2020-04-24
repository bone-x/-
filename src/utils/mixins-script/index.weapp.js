import Taro from '@tarojs/taro'
// 设置title
export const setTitle = (title) => {
  Taro.setNavigationBarTitle({
    title
  })
}