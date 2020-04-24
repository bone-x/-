export default {
  //获取学习中心课程列表
  getCourseList: {
    url: 'learningCenter/hangjia/courseList',
    interFaceType: 'lj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  },
  //学习中心收藏获取该课程是否已经购买
  addFreeOrder: {
    url: 'order/api/auth/order/addFreeOrder',
    interFaceType: 'hj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    hasToken: 'token'
  },
  //学习中心获取收藏课程列表
  getCollectionList: {
    url: 'goods/api/h5/v1/collection/getCollectionList',
    interFaceType: 'hj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    hasToken: 'token'
  },
  //学习中心取消收藏课程
  getCancelCollection: {
    url: 'goods/api/h5/v1/collection/add',
    interFaceType: 'hj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    hasToken: 'token'
  },
  //获取视频页面的笔记列表
  getNoteList: {
    url: 'learningCenter/web/teachnote/queryNotesByTopic',
    interFaceType: 'lj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  },
  //删除笔记
  getDeleteNote: {
    url: 'learningCenter/web/teachnote/delete',
    interFaceType: 'lj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  },
  //编辑或保存笔记
  postSaveOrUpdateNote: {
    url: 'learningCenter/web/teachnote/saveOrUpdate',
    interFaceType: 'lj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    hasToken: 'SSOTOKEN'
  },
  //删除笔记图片
  getDeletePicture: {
    url: 'learningCenter/web/teachnote/deletePicture',
    interFaceType: 'lj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  },
  //获取图片上传签名
  getPhotoSign: {
    url: 'learningCenter/web/teachnote/getPhotoSign',
    interFaceType: 'lj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  },
  //获取recordId
  getRecordId: {
    url: 'learningCenter/hangjia/queryCourseInfo',
    interFaceType: 'lj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  },
  // 跳转去看视频
  toRecord: {
    url: 'learningCenter/hangjia/record/getAddress',
    interFaceType: 'lj',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    hasToken: 'SSOTOKEN'
  }
}
