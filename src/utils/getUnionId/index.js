export default function (encryptedData, appId, sessionKey, iv) {
	var WXBizDataCrypt = require('./WXBizDataCrypt')

	// var appId = 'wx4f4bc4dec97d474b'
	// var sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
	// var iv = 'r7BXXKkLb8qrSNn05n0qiA=='
	
	var pc = new WXBizDataCrypt(appId, sessionKey)
	
	var data = pc.decryptData(encryptedData , iv)
	return data
}