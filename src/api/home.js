export default {
  //好课推荐
  goodLesson: {
    url: "operate/api/h5/frontend/goodLessonList",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  //秒杀和积分兑换
  fastestBuy: {
    url: "operate/api/h5/activity/list/index",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  //一二级类目
  productCategory: {
    url: "goods/api/h5/v1/goodscategory/getRootAndSendLevelList",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  //今日热门
  hotNews: {
    url: "inf/api/infInformation/infInformation/popular",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  //兴趣列表
  getInterestList: {
    url: "goods/api/h5/v1/goodsInterest/getInterestList",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  // 兴趣推荐
  getGoodsByCategoryId: {
    url: "goods/api/h5/v1/goods/getGoodsByCategoryId",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  //添加兴趣
  addInterest: {
    url: "goods/api/h5/v1/goodsInterest/add",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "post"
  },
  //广告位
  getAdsense: {
    url: "operate/api/frontend/advertisementList",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  
  // 商品推荐
  getRecommendation: {
    url: "operate/api/h5/frontend/recommendCategoryList",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  // 轮播
  roundPictureList: {
    url: "operate/api/h5/frontend/roundPictureList",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  // 大家在学
  everyoneLearningList: {
    url: "operate/api/frontend/everyoneLearningList",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  //获取秒杀时间
  getTimeList: {
    url: "operate/api/h5/activity/time",
    interFaceType: "hj",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  

};
