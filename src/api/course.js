export default {
    // 获取课程类目
    getCourseCategoryList: {
      url: 'goods/api/h5/v1/goodscategory/listAll',
      interFaceType: "hj",
      header: {
        'Content-Type': 'application/json'
      },
      method: 'get',
    },
    // 根据id获取下一级子类目
    getCourseChildrenCategoryListById: {
      url: 'goods/api/goodscategory/getChildrenList',
      interFaceType: "hj",
      header: {
        'Content-Type': 'application/json'
      },
      method: 'get',
    },
    // 根据id获取父级类目
    getCourseParentCategoryListById: {
      url: 'goods/api/h5/v1/goodscategory/getListById',
      interFaceType: "hj",
      header: {
        'Content-Type': 'application/json'
      },
      method: 'get',
    },
    // 获取搜索记录
    getRecentSearchKeyword: {
      url: 'goods/api/h5/auth/es/searchRecord',
      interFaceType: "hj",
      header: {
        'Content-Type': 'application/json'
      },
      method: 'get',
    },
    // 清空搜索记录
    clearAllRecentSearchKeyword: {
      url: 'goods/api/h5/auth/es/clearSearchRecord',
      interFaceType: "hj",
      header: {
        'Content-Type': 'application/json'
      },
      method: 'delete',
    },
    // 获取搜索提示
    getSearchTips: {
      url: 'goods/api/h5/es/searchTips',
      interFaceType: "hj",
      header: {
        'Content-Type': 'application/json'
      },
      method: 'post',
    },
    // 通过关键字搜索
    getCourseListByKeyword: {
      url: 'goods/api/h5/es/search',
      interFaceType: "hj",
      header: {
        'Content-Type': 'application/json'
      },
      method: 'post',
    }
}