import Taro from "@tarojs/taro";
// OSS 签名
export const ossSign = ({
  dir = 'hangjia-h5/image',
  key
}) => {
  const options = {
    url: 'https://hq-storage.hqjy.com/api/signMapLog/expert',
    method: 'post',
    header: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      'clientType': Taro.getEnv(),
      'userToken': Taro.getStorageSync("token")
    },
    data: {
      dir,
      key,
    }
  };
  return Taro.request(options);
};

// 文件上传
export const upload = (sign = {}, file) => {
  const splitUrl = String(sign.url).split('/');
  const fileName = splitUrl[splitUrl.length - 1];

  const data = new FormData();
  data.append('key', `${sign.dir}${fileName}`);
  data.append('policy', sign.policy);
  data.append('OSSAccessKeyId', sign.accessid);
  data.append('success_action_status', 200);
  data.append('signature', sign.signature);
  data.append('callback', sign.callback);
  data.append('file', file);

  console.log(data);
  // alert('开始上传：', JSON.stringify(data));
  return Taro.request({
    url: sign.host + '?_=' + Date.now(),
    method: 'POST',
    data,
    header: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
      'clientType': Taro.getEnv(),
      'userToken': Taro.getStorageSync("token")
    }
  });
};
