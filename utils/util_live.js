const request_get = options => {
  const app = getApp();
  wx.request({
    url: app.globalData.zbhostUrl + options.url,
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': app.globalData.liveToken
    },
    success: options.success || function () { },
    fail: options.fail || function () { },
    complete: options.complete || function () { }
  })
}

const request_post = options => {
  const app = getApp();
  wx.request({
    url: app.globalData.zbhostUrl + options.url,
    data: options.data || {},
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'token': app.globalData.liveToken
    },
    success: options.success || function () { },
    fail: options.fail || function () { },
    complete: options.complete || function () { }
  })
}

const request_put = options => {
  const app = getApp();
  wx.request({
    url: app.globalData.zbhostUrl + options.url,
    data: options.data || {},
    method: 'PUT',
    header: {
      'content-type': 'application/json',
      'token': app.globalData.liveToken
    },
    success: options.success || function () { },
    fail: options.fail || function () { },
    complete: options.complete || function () { }
  })
}

module.exports = {
  request_get: request_get,
  request_post: request_post,
  request_put: request_put
}
