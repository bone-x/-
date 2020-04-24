export default {
  //课程详情
  queryCourseInfo: {
    url: 'learningCenter/hangjia/queryCourseInfo',
    interFaceType: "lj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'get',
    hasToken:'SSOTOKEN'
  },

  //互联网大学课程目录
  queryCourseRecord: {
    url: 'learningCenter/hangjia/getCourseRecordByCourseId',
    interFaceType: "lj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'get',
    hasToken:'SSOTOKEN'
  },
  // 商品评价-根据商品Id-查询整体评价，评价数和好评率
  queryEvaluationInfo: {
    url: 'goods/api/h5/goodsEvaluation/getEvaluationInfo',
    interFaceType: "hj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'get',
  },
  // 商品评价-查看自己的课程信息评价
  queryMyGoodsEvaluation: {
    url: 'goods/api/h5/auth/goodsEvaluation/myGoodsEvaluation',
    interFaceType: "hj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'get',
  },
  
  //商品评价-根据商品Id-查询评价详情列表
  queryEvaluationList: {
    url: 'goods/api/h5/goodsEvaluation/getEvaluationList',
    interFaceType: "hj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'get',
  },
  // 商品评价-新增
  addGoodsEvaluation: {
    url: 'goods/api/h5/auth/goodsEvaluation/add',
    interFaceType: "hj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'post',
  },
  // 商品评价-修改
  editGoodsEvaluation: {
    url: 'goods/api/h5/auth/goodsEvaluation/update',
    interFaceType: "hj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'put',
  },
  // 根据商品id和用户id判断是否收藏该商品
  queryExistCollection: {
    url: 'goods/api/h5/v1/collection/existCollection',
    interFaceType: "hj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'get',
    hasToken: 'token'
  },
  // 添加或取消收藏
  addRemoveCollection: {
    url: 'goods/api/h5/v1/collection/add',
    interFaceType: "hj",
    header: {
      key: "Content-Type",
      value: "application/json"
    },
    method: 'post',
    hasToken: 'token'
  },
  //介绍
  goodLesson: {
    url: 'operate/api/frontend/goodLessonList',
    interFaceType: 'hj',
    header: {
      key: 'Content-Type',
      value: 'application/json'
    },
    method: 'get',
    hasToken: 'token'
  }, 
  //录播间打卡信息接口
  queryRecordAttendanceInfo: {
    url: 'learningCenter/hangjia/queryRecordAttendanceInfo',
    interFaceType: 'lj',
    header: {
      key: 'Content-Type',
      value: 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  },

  // 考勤打卡接口
  service: {
    url: 'http://10.0.98.83:8888/attendance/service',
    header: {
      key: 'Content-Type',
      value: 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  },

   // 考勤打卡接口
   client: {
    url: 'http://10.0.98.83:8888/attendance/client',
    header: {
      key: 'Content-Type',
      value: 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  },
}
