export default {
  // 意见反馈
  feedbackCommit:{
    url: '/ag/api/h5/webFeedback/saveFeedBack',
    interFaceType: "hj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'post'
  },
  // 获取用户信息
  getMineInfo: {
    url: 'api/userInfo',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    hasToken: 'token',
    method: 'get'
  },
   // 修改用户信息
   changeUserInfo: {
    url: 'api/userInfo',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'put'
  },
  // 新修改用户信息
  currectUserInfo: {
    url: 'api/modifyUserInfoBasic',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },
  // 绑定邮箱
  addEmailInfo: {
    url: 'api/bindingEmail',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },
  // 获取邮箱验证码
  getEmailCode: {
    url: 'api/otpMail',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'get'
  },
  // 最新修改邮箱 
  updateEmailInfo: {
    url: '/api/emailHj',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },
  // 修改邮箱 
  currectEmailInfo: {
    url: 'api/modifyEmail',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },
  // 修改密码
  changeUserPassWord: {
    url: 'api/passWord',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    method: 'put'
  },
  // 退出登录
  logout: {
    url: 'api/logout_hangjia',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    hasToken: 'token',
    method: 'post'
  },
  fsSignature: {
    url: 'api/fsSignature',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'get'
  },
  getMailCode: {
    url: 'api/otpMail',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'get'
  },
  // 获取手机验证码
  getMobileCode: {
    url: 'api/otpSMS',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'get'
  },
  findByMobile: {
    url: 'api/otpSMS',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },

  findByMail: {
    url: 'api/otpMail',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },

  findPwdPhone: {
    url: 'api/passwordPhone',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },
  findPwdEmail: {
    url: 'api/passWordMail',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },
  updateUserInfo: {
    url: 'api/modifyUserInfoBasic',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },
  bindMail: {
    url: 'api/bindingEmail',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },
  modifyMail: {
    url: 'api/modifyEmail',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'post'
  },
  updatePwd: {
    url: 'api/passWord',
    interFaceType: "jq",
    header: {
      "Content-Type": "application/json"
    },
    method: 'put'
  }
}