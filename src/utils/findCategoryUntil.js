/**
 * @Description: 传入类目列表和id，找到相应的类目列表
 * @params {Array|Object} item
 * @params {Number} id
 * @return {Array | undefined}
 * @LastEditors: 蔡江旭
 * @LastEditTime: Do not edit
 * @Date: 2019-04-26 14:12:31
 */
function findCategoryListById(item, id, parList) {
    if (Array.isArray(item)) {
        let returnList;
        for (let index = 0; index < item.length; index++) {
            const ele = item[index];
            returnList = findCategoryListById(ele, id, item);
            if (returnList) {
                break;
            }
        }
        return returnList;
    } else {
        const curChildList = item.childList || [];
        if (item.id === id) {
            return (curChildList.length === 0) ? parList : curChildList;
        } else {
            return findCategoryListById(curChildList, id, item)
        }
    }
}

export default findCategoryListById;