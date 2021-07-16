const util = require('../../../utils/util.js')
const app = getApp()
Component({
    properties: {
        roomID: {
            type: Number,
            value: ''
        },
        roomTitle: {
            type: String,
            value: ''
        },
        schoolLogo: {
            type: String,
            value: ''
        },
        roomPeoples: {
            type: Number,
            value: ''
        },
        onLineNumber: {
            type: Number,
            value: ''
        },
    },
    data: {
        dialogShow: false,
        dialogType: "121212",
        dialogTitle: '',
        scrollHeight: app.globalData.windowHeight - 140,
        height: app.globalData.statusBarHeight + 'px',
    },
    methods: {
        show(type) {
            var that = this
            var name = '学校介绍';
            if (type == 0) {
                name = '学校介绍';
                wx.request({
                    url: app.globalData.requestUrl + '/live/index_column',
                    data: {
                        "type": app.globalData.liveType
                    },
                    method: 'post',
                    success: function (res) {
                        // that.setData({
                        //     menuList: res.data.list
                        // })
                    },
                    fail: function (e) {
                        wx.showToast({
                            title: '网络异常！',
                            duration: 2000
                        });
                    },
                })
            }
            else if (type == 1) {
                name = '历届分数';
            }
            else if (type == 2) {
                name = '院系专业';
            }
            else if (type == 3) {
                name = '录取概率';
            }
            that.setData({
                dialogShow: true,
                dialogType: type,
                dialogTitle: name,
            })
        },
        hide() {
            this.setData({
                dialogShow: false
            })
        },
        _close() {
            this.triggerEvent("close")
        },
    },
})
