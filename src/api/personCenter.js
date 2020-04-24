// import fetch from './request.js'

// // 获取详情
// // export const getDemoDetail = (id) => fetch({url: '', data: {id}})
// // 获取关于我们列表
// export const getWithUsList = (data) => fetch({url: 'http://10.0.98.218:10030/expert/ag/api/h5/agreement', data}); // 服務協議
// export const getServiceProList = (data) => fetch({url: 'http://10.0.98.218:10030//expert/ag/api/h5/copyright', data}); // 版權說明
export default {
    //服务协议
    getWithUsList: {
      url: 'ag/api/h5/agreement',
      interFaceType: "hj",
      header: {
        "Content-Type": "application/json"
      },
      method: 'get'
    },
     //版权说明
     getServiceProList: {
        url: 'ag/api/h5/copyright',
        interFaceType: "hj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
       //新手指南
     getGuideWays: {
        url: 'ag/api/h5/{type}',
        interFaceType: "hj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
       //平台消息
     getplatformMsg: {
        url: 'learningCenter/hangjia/getPlatformMessage',
        interFaceType: "lj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
      // 课程消息
     getCourseMsg: {
        url: 'learningCenter/hangjia/getCourseMessage',
        interFaceType: "lj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
      // 课程消息总数
     getCourseAllMsg: {
        url: 'learningCenter/hangjia/getCourseMessageCount',
        interFaceType: "lj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
      // 平台消息总数
     getPlatfromAllMsg: {
      url: 'learningCenter/hangjia/getPlatformMessageCount',
      interFaceType: "lj",
      header: {
        "Content-Type": "application/json"
      },
      method: 'get'
    },
    // 平台消息未读总数
    getMsgUnReadCount: {
      url: 'learningCenter/hangjia/getPlatformUnreadMessageCount',
      interFaceType: "lj",
      header: {
        "Content-Type": "application/json"
      },
      method: 'get'
    },
      // 课程消息未读GET 
      getCourseUnReadMsg: {
        url: 'learningCenter/hangjia/getCourseMessageUnreadCount',
        interFaceType: "lj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
      // 设置课程消息已读
      getCourseReadMsg: {
        url: 'learningCenter/hangjia/setCourseMessageReaded',
        interFaceType: "lj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'post'
      },
      // 平台消息已读
      getPlatformNewsReadMsg: {
        url: 'learningCenter/hangjia/setPlatformMessageReaded',
        interFaceType: "lj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'post'
      },
      // 平台消息详情
      getPlatefromDetails: {
        url: 'learningCenter/hangjia/getPlatformMessageDetail',
        interFaceType: "lj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
      // 课程消息查看详情
      getCourseDetails: {
        url: 'learningCenter/hangjia/getPlatformMessageDetail',
        interFaceType: "lj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
      //秒杀页时间
      getShowTime: {
        url: 'operate/api/h5/activity/time',
        interFaceType: "hj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
      // 秒杀内容
      getShowContent: {
        url: 'operate/api/h5/activity/list/index',
        interFaceType: "hj",
        header: {
          "Content-Type": "application/json"
        },
        method: 'get'
      },
}