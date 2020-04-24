import pageList from '@/constants/pageList.js'

export default () => {
    let href = window.location.href
    pageList.find((page, index) => {
        const keys = []
        let reg = page.mp.replace(/\{(.+?)\}/g, (...res) => {
            keys.push(res[1])
            return ('(.*)')
        })
        reg = new RegExp(reg)
        let isCurrentPage = reg.test(href)
        if (isCurrentPage) {
            // 查询规则表
            let currPageItem = pageList[index]
            let query = href.match(reg)
            const reuslt = currPageItem.pc.replace(/\{(.+?)\}/g, (...res) => {
                let val = keys.findIndex(key => {
                    return (key === res[1])
                })
                return query[val + 1]
            })
            var is_mobi = navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
            if (is_mobi) {
                // window.location.href = "手机端";
            } else {
                window.location.href = "http://hengqihj.com/" + reuslt;

            }
        }
        return reg.test(href)
    })
}