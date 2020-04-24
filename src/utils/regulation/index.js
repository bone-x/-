export default {
    checkRule(formData, rule) {
        res = Object.entries(formData).filter(([key, item]) => (rule[key])).find(([key, item]) => {
            if (typeof rule[key] === 'function') {
                return rule[key](item)
            } else {
                return rule[key].test(item)
            }
        })
    }
}