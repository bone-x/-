export default {
    getIntegral: {//获取積分
      url: 'stu/api/h5/auth/v1/student/getIntegral',
      interFaceType: "hj",
      header: {
        key: "Content-Type",
        value: "application/json"
      },
      method: 'get'
    },
    score:{//積分兌換
        url: 'operate/api/h5/activity/list/index',
        interFaceType: "hj",
        header: {
          key: "Content-Type",
          value: "application/json"
        },
        method: 'get'
      }
  }
  