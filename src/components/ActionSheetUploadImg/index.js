import Taro, {
  Component
} from "@tarojs/taro";
import {
  View,
  Input,
} from "@tarojs/components";
import styles from "./index.module.scss";
import errorImg from "./error.png";
import { ossSign, upload } from './upload';

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default class ActionSheetUploadImg extends Component {
  state = {
  };

  // 关闭
  onClose = () => {
    this.props.onClose && this.props.onClose();
  }

  // 调用微信小程序api获取图片
  onGetImgBySDK = (e, type) => {
    if (process.env.TARO_ENV === 'weapp') {
      // alert('wechat');
      const sourceType = [];
      if (type === 1) sourceType.push('camera');
      if (type === 2) sourceType.push('album');

      Taro.chooseImage({
        count: 1,
        sourceType,
      }).then(res => {a
        const file = res.tempFiles[0];
        // alert('选择图片：', file.name);
        if (!file) return false;
        const fileSize = Number(file.size) / 4096 / 1000;
        // 文件大小检查
        if (fileSize > 1) {
          Taro.showToast({ title: '图片大小超过2M', image: errorImg });
          return false;
        }

        const splitUrl = String(file.path).split('/');
        const fileName = splitUrl[splitUrl.length - 1];
        // 签名
        Taro.showLoading({ title: '上传中', mask: true });
        ossSign({ key: fileName }).then(signRes => {
          if (signRes.statusCode !== 200) {
            Taro.showToast({ title: '网络异常', icon: 'none' });
            console.error('oss 签名出错', file);
            return false;
          }
          const signObj = signRes.data;

          // 上传
          Taro.uploadFile({
            url: signObj.host,
            filePath: file.path,
            name: 'file',
            header: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST",
              'clientType': Taro.getEnv(),
              'userToken': Taro.getStorageSync("token")
            },
            formData: {
              'key': `${signObj.dir}${fileName}`,
              'policy': signObj.policy,
              'OSSAccessKeyId': signObj.accessid,
              'success_action_status': 200,
              'signature': signObj.signature,
              'callback': signObj.callback,
            }
          }).then(() => {
          Taro.showToast({ title: '上传成功', icon: 'none' });
          Taro.hideLoading();
            // 上传成功
            this.props.onSuccess && this.props.onSuccess(signObj.url);
          }).catch(() => {
          Taro.showToast({ title: '上传失败', icon: 'none' });
          Taro.hideLoading();
            console.error('上传到oss出错', file);
          })
        }).catch(() => {
          Taro.hideLoading();
          Taro.showToast({ title: '网络异常', icon: 'none' });
          console.error('oss 签名出错', file);
        });

      }).catch(err => {
        Taro.showToast({title: '' + err})
      })
    }
  }

  // h5文件上传
  onFileChange = (e, type, target) => {
    // alert('browser');
    const file = e.target.files[0];
    console.log('file', file);
    if (!file) return false;
    const fileSize = Number(file.size) / 4096 / 1000;

    // 文件大小检查
    if (fileSize > 1) {
      Taro.showToast({ title: '图片大小超过2M', image: errorImg });
      target.inputRef.value = '';
      return false;
    }

    const fileName = guid() + file.name.substring(file.name.lastIndexOf("."), file.name.length).toLowerCase();

    Taro.showLoading({ title: '上传中', mask: true });
    // 签名
    ossSign({ key: fileName }).then(res => {
      debugger
      if (res.statusCode !== 200) {
        Taro.showToast({ title: '网络异常', icon: 'none' });
        console.error('oss 签名出错', file);
        return false;
      }
      // Taro.showToast({ title: '签名成功', icon: 'none' });

      const signObj = res.data;

      // 上传
      upload(signObj, file).then(() => {
        Taro.showToast({ title: '上传成功', icon: 'none' });
        Taro.hideLoading();
        // 上传成功
        this.props.onSuccess && this.props.onSuccess(signObj.url);
      }).catch((error) => {
        // alert('上传失败：'+JSON.stringify(error))
        Taro.showToast({ title: '上传失败', icon: 'none' });
        Taro.hideLoading();
        console.error('上传到oss出错', file, error, JSON.stringify(error));
      })
    }).catch(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '网络异常', icon: 'none' });
      Taro.showToast({ title: '签名失败', icon: 'none' });
      console.error('oss 签名出错', file);
    });

  }

  componentDidMount() {
  }

  render() {
    if (!this.props.isShow) {
      return null;
    }

    return (
      <View className={styles.container}>
        <View className={styles.mask} onClick={this.onClose}></View>
        <View className={styles.ul}>
          <View className={styles.camera} onClick={(e) => this.onGetImgBySDK(e, 1)}>拍照
            {process.env.TARO_ENV === 'h5' ?
              <Input ref={(c) => { this.cameraInput = c }} hidden type='file' onchange={(e) => this.onFileChange(e, 1, this.cameraInput)} accept='image/*' capture='camera' className={styles.hiddenFileInput}></Input>
              : null
            }
          </View>
          <View className={styles.photo} onClick={(e) => this.onGetImgBySDK(e, 2)}>相册
            {process.env.TARO_ENV === 'h5' ?
              <Input ref={(c) => { this.photoInput = c }} hidden type='file' onchange={(e) => this.onFileChange(e, 2, this.photoInput)} accept='image/*' className={styles.hiddenFileInput}></Input>
              : null
            }
          </View>
          <View className={styles.cancel} onClick={this.onClose}>取消</View>
        </View>
      </View>
    );
  }
}
