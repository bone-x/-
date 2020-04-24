export default {
  //好课推荐
  goodLesson: {
    url: "operate/api/frontend/goodLessonList",
    interFaceType: "hj",
    header: {
      "Content-Type":"application/json"
    },
    method: "get",
    hasToken: "token"
  },
  getAllNotice: {
    //分页获取全部平台消息1
    url: "learningCenter/hangjia/getPlatformMessage",
    interFaceType: "lj",
    header: {
      "Content-Type":"application/json"
    },
    method: "get"
  }
};

// 使用
//   async getList () {
//     const res = await fetch('goodLesson',{})

//     console.log(res)
//   }
// or
// getList () {
//     fetch('goodLesson',{}).then(res=>{
//       console.log(res)
//     }).catch(error=>{
//      console.log(error)
//     })
// }
