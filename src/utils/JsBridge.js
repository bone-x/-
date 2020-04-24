import Taro from '@tarojs/taro'

/**
 * @Description: 判断是否在原生app
 * @return {Boolean}
 * @LastEditors: 蔡江旭
 * @LastEditTime: Do not edit
 * @Date: 2019-05-16 09:05:28
 */
function isNativeApp() {
  const { params } = Taro._$router || {};
  return !!params.clientType && params.clientType.length > 0;
}

/**
 * @Description: Js bridge的交互函数
 * @params {null} text // 当前为null
 * @params {Object} bridgeData // 交互的数据
 * @params {Array} ...args // 其他参数，暂时用不到，预留
 * @return: 
 * @LastEditors: 蔡江旭
 * @LastEditTime: Do not edit
 * @Date: 2019-05-16 09:05:28
 */
function JsBridge(text, bridgeData, ...args) {
  let returnData = null;
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB && isNativeApp()) {
    returnData = window.prompt(text, JSON.stringify(bridgeData), ...args)
  } else {
    console.warn('不在原生App: ', Taro.getEnv(), ', 交互数据：', bridgeData, ', router: ', Taro._$router);
  }
  return returnData;
}

export {
  JsBridge,
  isNativeApp,
};