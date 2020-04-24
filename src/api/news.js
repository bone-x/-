export default {
    // 资讯详情页
    getNewsDetail: {
      url: 'inf/api/h5/information/detail',
      interFaceType: "hj",
      header: {
        'Content-Type': 'application/json'
      },
      method: 'get',
    },
    // 资讯点赞
    postStarNews: {
      url: 'inf/api/h5/information/like',
      interFaceType: "hj",
      header: {
        'Content-Type': 'application/json'
      },
      method: 'post',
    },
    getNewsCategory: {
      url: "inf/api/h5/infcategory/list",
      interFaceType: "hj",
      header: {
        "Content-Type": "application/json"
      },
      method: "get"
    },
    getNewsList: {
      url: "inf/api/h5/information/list",
      interFaceType: "hj",
      header: {
        "Content-Type": "application/json"
      },
      method: "get"
    }
};
