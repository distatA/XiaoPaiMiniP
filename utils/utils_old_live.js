const request = options => {
  const app = getApp();

  wx.request({
    url: app.globalData.hostUrlOld + options.url,
    data: options.data || {},
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: options.success || function () { },
    fail: options.fail || function () { },
    complete: options.complete || function () { }
  })
}
const request_new = options => {
  const app = getApp();

  wx.request({
    url: app.globalData.requestUrl_new + options.url,
    data: options.data || {},
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: options.success || function () { },
    fail: options.fail || function () { },
    complete: options.complete || function () { }
  })
}


module.exports = {
  request_new: request_new,
  request: request
}
