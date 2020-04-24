/**
 * @Description: 字符串高亮处理函数
 * @params {String} originText 原来文本
 * @params {String} keyword 高亮关键字
 * @params {String | Function} highLightTemplate 高亮结果html // <span>{{{text}}}</span> {{{text}}}目前是固定
 * @return: 
 * @LastEditors: 蔡江旭
 * @LastEditTime: Do not edit
 * @Date: 2019-04-15 15:38:17
 */

export default function keywordHighLight (originText = '', keyword = '', highLightTemplate = '') {
    const keywordRegExp = new RegExp(keyword, 'g');
    if (typeof highLightTemplate === 'function') {
        let curCharStart = 0;
        let curCharLen = 0;
        const result = originText.split(keywordRegExp);

        // Apply fn to all odd elements
        for (let i = 1, length = result.length; i < length; i += 2) {
            curCharLen = result[i].length;
            curCharStart += result[i - 1].length;
            result.splice(i, 0, highLightTemplate(keyword, i, curCharStart));
            curCharStart += curCharLen;
        }

        return result;
    } else if (keyword !== '' && highLightTemplate !== '') {
        return originText.replace(keywordRegExp, function (match) {
            const tempRegExp = /{{{text}}}/g;
            const hasTempStr = tempRegExp.test(highLightTemplate);
            return hasTempStr ? highLightTemplate.replace(tempRegExp, match) : match;
        });
    } else {
        return originText;
    }
}