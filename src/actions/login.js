import {
    LOGIN
} from '../constants/counter'
import Taro from '@tarojs/taro'
import fetch from '@/api/request'
export const login = (res) => {
    return {
        type: LOGIN,
        token: res
    }
}
// 异步的action
export function asyncLogin(formData) {
    return dispatch => {
        return Taro.getUserInfo().then(({userInfo, encryptedData, iv}) => {
            Taro.login().then(info => {
              formData.wxNickname = userInfo.nickName
              formData.encryptedData = encryptedData
              formData.iv = iv
              formData.code = info.code
              fetch('bindPhone', formData).then(res => {
                Taro.login().then(info => {
                  fetch('loginWechat', {
                    code: info.code,
                    versionCode: '114',
                    clientType: 'mp'
                  }).then(res => {
                    dispatch(login(res.token))
                    Taro.setStorageSync('token', res.token)
                    Taro.redirectTo({
                      url: '/pages/home/index'
                    })
                  })
                })
              })
            })
        })
    }
}
