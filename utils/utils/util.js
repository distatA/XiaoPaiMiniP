const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function errShow(text, duration = 1000, callback = function () { }) {
    const SDKVersion = wx.getSystemInfoSync().SDKVersion || '1.0.0'
    const [MAJOR, MINOR, PATCH] = SDKVersion.split('.').map(Number)
    if ((MAJOR === 1 && MINOR >= 1) || MAJOR > 1) {
        //兼容处理
        wx.showToast({
            title: text,
            icon: 'loading',
            image: '/images/x.png',
            duration: duration
        })
        setTimeout(function () {
            callback()
        }, duration)
    } else {
        wx.showModal({
            title: '提示',
            content: text,
            showCancel: false,
            success: function (res) {
                if (!callback) return
                if (res.confirm) {
                    callback()
                }
            }
        })
    }
}
function noHideShow(content, duration = 1000, callback = function () { }) {
    let _compData = {
        '_toast_.isHide': false,
        '_toast_.icon': '',
        '_toast_.content': ''
    }
    let pages = getCurrentPages()
    pages[pages.length - 1].setData({
        '_toast_.isHide': true,
        '_toast_.icon': 'icon-jinggao',
        '_toast_.content': content
    })
    setTimeout(function () {
        pages[pages.length - 1].setData({
            '_toast_.isHide': false
        })
        callback()
    }, 1500)
}

module.exports = {
    errShow,
    noHideShow,
    formatTime: formatTime
}