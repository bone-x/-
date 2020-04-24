export default {
  updateUserInfo: {
    url: 'stu/api/h5/auth/v1/student/saveStudent',
    interFaceType: 'hj',
    method: 'get'
  },
  getUserInfo: {
    url: 'api/userInfo',
    interFaceType: "jq",
    header: {
      'Content-Type': "application/json"
    },
    method: 'get'
  },
  login: {
      url: 'api/login_hangjia',
      method: 'post',
      interFaceType: 'jq',
      header: {
        'Content-Type': "application/x-www-form-urlencoded"
      }
  },
  loginByCode: {
    url: '/api/loginByOtp',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/x-www-form-urlencoded"
    }
  },
  getSmS: {
    url: 'api/otpSMS',
    method: 'get',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    },
  },
  getMsgCode:{
    url: 'api/getOtp',
    method: 'get',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  getCode:{
    url: 'api/getOtp',
    method: 'get',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  getCode:{
    url: 'api/getOtp',
    method: 'get',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  validateSmS: {
    url: 'api/otpSMS',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  register: {
    url: 'api/register',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    },
    isStrangePost:true   //为了迎合后端不规范的post请求进行的兼容
  },
  setPassword: {
    url: 'api/installPassword',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    },
    isStrangePost:true
  },
  findPassWord: {
    url: '/api/passwordPhone',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  installPassWord:{
    url: 'api/installPassword',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  getMail: {
    url: 'api/otpMail',
    method: 'get',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  validateMail: {
    url: 'api/otpMail',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  modifyEmail: {
    url: 'api/passWordMail',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  // 绑定微信
  bindWechat: {
    url: 'api/weChatBindMobile',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': "application/json"
    }
  },
  getCaptcha: {
    url: 'api/captcha-image',
    method: 'get',
    interFaceType: 'jq',
    responseType: 'arraybuffer',
    crosFilter: true,
    header: {
      'Content-Type': "application/json;charset=UTF-8"
    }
  },
  loginWechat: {
    url: 'api/loginxcx',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  bindPhone: {
    url: 'api/widgetBinding',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  //报名头部玩家活动
  stuJoinActivity: {
    url: 'stu/api/stuJoinActivity/{activityId}',
    method: 'get',
    interFaceType: 'hj',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  
}