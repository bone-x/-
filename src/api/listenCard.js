export default {
  // 获取学员听课卡详情列表
  getListenCardList: {
    url: 'operate/api/h5/opCourseStudent/getCourseStudentCardListByParams',
      interFaceType: "hj",
      method: 'get'
  },
  // 激活听课卡
  getActiveCourseStudentCard: {
    url: 'operate/api/h5/opCourseStudent/activeCourseStudentCard',
      interFaceType: "hj",
      method: 'put'
  },
  // 听课卡各状态数量
  getListenCountByParams: {
    url: 'operate/api/h5/opCourseStudent/getCourseStudentCardListCountByParams',
      interFaceType: "hj",
      method: 'get'
  },
}