import Taro, { Component } from '@tarojs/taro'

const obj = {
  hj: '/hjBaseUrl', // mock 、production、test
  jq: '/authBaseUrl',
  lj: '/ljBaseUrl',
}

console.log('env: ', Taro.getEnv(), Taro.ENV_TYPE.WEAPP)
if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  // obj.hj = 'http://10.0.98.218:10030/expert',
  // obj.hj = 'http://hengqihj-gateway.beta.hqjy.com/expert'
  // obj.lj = 'http://lctesthangjia.beta.hqjy.com',
  // obj.jq = 'http://hangjiah5.beta.hqjy.com'
  // obj.jq = 'http://10.0.19.212:8082'
  obj.hj = 'https://mpbeta.hqjy.com/gw'
  obj.lj = 'https://mpbeta.hqjy.com/lctesthangjia'
  obj.jq = 'https://mpbeta.hqjy.com/hangjiah5'
}

export default {
  obj
}
