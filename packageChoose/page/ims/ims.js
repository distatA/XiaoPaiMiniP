const app = getApp();
const util = require('../../../utils/util.js');
var socketOpen = false;
var SocketTask;
Page({
    data: {
        gId: 0,
        groupId: '', // 群密钥
        groupCreateUserId: 0, // 群主ID
        groupName: '', // 群名称
        groupTitle: '', // 群标题（分享）
        groupCover: '', // 群封面（分享）
        myUserId: 0, // 登陆用户ID 
        scrollHeight: '100vh',
        toView: 'msg',
        msgList: [], // 消息列表
        systemMsg: [], // 系统消息（头部通知）
        showSendBtn: true,
        inputVal: '', // 输入消息
        systemMsgTimer: null, // 系统消息计时器
        pageCount: 0, // 历史消息分页
        isLoadHistoy: false, // 是否加载历史消息 
        showApps: false,
        handClose: false, // 是否手动关闭IM
    },
    onLoad: function (options) {
        var that = this;
        that.setData({
            groupId: options.groupId,
            myUserId: app.globalData.userInfo.id, //用户id
        })
    },
    onShow: function () {
        var that = this;
        wx.showLoading({
            title: '初始中...',
        })
        util.request({
            url: '/api/group/info.html',
            data: {
                groupid: that.data.groupId,
            },
            success: function (res) {
                wx.hideLoading()
                if (res.data.code == 1) {
                    that.setData({
                        gId: res.data.data.group.id,
                        groupCreateUserId: res.data.data.group.uid,
                        groupName: res.data.data.group.name,
                        groupTitle: res.data.data.group.title,
                        groupCover: res.data.data.group.cover,
                        msgList: res.data.data.msgList.reverse(),
                    })
                    that.setData({
                        toView: 'msg-' + (that.data.msgList.length - 1)
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.data.group.name
                    })
                    if (!socketOpen) {
                        that.initWebSocket()
                    }
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '连接失败，参数错误或群不存在。',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack()
                            }
                        }
                    })
                }
                return;
            },
        })
    },
    onHide() {
        this.setData({
            handClose: true,
        })
        wx.closeSocket(function (close) {
            console.log('关闭 WebSocket 连接。', close)
        })
    },
    onUnload() {
        this.setData({
            handClose: true,
        })
        wx.closeSocket(function (close) {
            console.log('关闭 WebSocket 连接。', close)
        })
    },
    onShareAppMessage: function () {
        return {
            title: this.data.groupTitle,
            imageUrl: this.data.groupCover,
            path: '/packageChoose/page/ims/ims?groupId=' + this.data.groupId,
        }
    },
    initWebSocket: function () {
        var that = this;
        wx.connectSocket({
            url: "wss://g.schoolpi.net:9191/?groupid=" + that.data.groupId + "&userid=" + that.data.myUserId,
            method: 'get',
            success: function (res) {
                console.log('WebSocket connect', res);
            },
            fail: err => {
                console.log('出现错误啦！！' + err);
                wx.showToast({
                    title: '网络异常！',
                })
            }
        })
        wx.onSocketOpen(res => {
            console.log('监听 WebSocket 连接打开事件。', res)
            socketOpen = true
            wx.sendSocketMessage({
                data: JSON.stringify({
                    "cmd": 1,
                    "data": {
                        "groupid": that.data.groupId,
                        "userid": that.data.myUserId
                    }
                }),
            })
        })
        wx.onSocketClose(onClose => {
            console.log('监听 WebSocket 连接关闭事件。', onClose)
            socketOpen = false
            if (!that.data.handClose) that.initWebSocket()
        })
        wx.onSocketError(onError => {
            console.log('监听 WebSocket 错误。错误信息', onError)
            socketOpen = false
        })
        wx.onSocketMessage(onMessage => {
            console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
            var message = JSON.parse(onMessage.data)
            if (message.cmd == 1) { // 系统消息
                let systemMsgTimer = setTimeout(function () {
                    that.setData({
                        systemMsg: [],
                    })
                    clearTimeout(that.data.systemMsgTimer)
                }, 1000 * 30)
                that.setData({
                    systemMsg: {
                        nickName: message.data.nickName,
                        message: message.data.message,
                        time: message.time,
                    },
                    systemMsgTimer: systemMsgTimer,
                })
            }
            else if (message.cmd == 501) { // 验证登陆信息
                wx.showModal({
                    title: '提示',
                    content: '请先登陆',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                        }
                    }
                })
            }
            else if (message.cmd == 502) { // 验证群密钥信息
                wx.showModal({
                    title: '提示',
                    content: '参数错误',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) { }
                    }
                })
            } else { // 用户信息
                that.setData({
                    msgList: that.data.msgList.concat({
                        userId: message.data.userId,
                        nickName: message.data.nickName,
                        headImg: 'https://new.schoolpi.net' + message.data.headImg,
                        msgType: message.data.msgType,
                        message: message.data.message,
                    }),
                })
                that.setData({
                    toView: 'msg-' + (that.data.msgList.length - 1)
                })
            }
        })
    },
    bindKeyInput: function (e) {
        var inputVal = e.detail.value;
        this.setData({
            inputVal: inputVal
        })
        // if (inputVal.length > 0) {
        //     this.setData({
        //         showSendBtn: true
        //     })
        // } else {
        //     this.setData({
        //         showSendBtn: false
        //     })
        // }
    },
    sendSocketMessage: function (msg) {
        var that = this;
        if (that.data.inputVal.length > 255) {
            wx.showToast({
                title: '消息内容限255字',
            })
            return;
        }
        if (that.data.inputVal != '') {
            wx.sendSocketMessage({
                data: JSON.stringify({ "cmd": 2, "data": { "groupid": that.data.groupId, "userid": that.data.myUserId, "msgtype": 0, "message": that.data.inputVal } }),
            }, function (res) {
                console.log('已发送', res)
            })
            setTimeout(function () {
                that.setData({
                    inputVal: '',
                })
            }, 500)
        }
    },
    loadHistory: function () {
        var that = this;
        var msgList = that.data.msgList;
        var pageCount = that.data.pageCount;
        if (that.data.isLoadHistoy) return
        that.setData({
            isLoadHistoy: true,
        })
        util.request({
            url: '/api/group/msglist.html',
            data: {
                groupid: that.data.gId,
                page: ++pageCount,
            },
            success: function (res) {
                if (res.data.code == 1) {
                    var msgList = res.data.data.concat(msgList)
                    that.setData({
                        msgList: msgList,
                        isLoadHistoy: false,
                        pageCount: pageCount,
                        toView: 'msg-20',
                    })
                }else{
                    that.setData({
                        isLoadHistoy: false,
                    })
                }
            },
        });
    },
    openApps() {
        this.setData({
            showApps: !this.data.showApps
        })
    },
    sendImage: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.uploadFile({
                    url: "https://new.schoolpi.net/api/upload/images",
                    filePath: res.tempFilePaths[0],
                    name: 'img',
                    success: function (res) {
                        console.log("=========="+res)
                        var res = JSON.parse(res.data);
                        if (res.code == 1) {
                            console.log("++++++++++++++++")
                            wx.sendSocketMessage({
                                data: JSON.stringify({ "cmd": 2, "data": { "groupid": that.data.groupId, "userid": that.data.myUserId, "msgtype": 1, "message": res.data.all_path } }),
                            }, function (res) {
                                console.log('已发送', res)
                            });
                            setTimeout(function () {
                                that.setData({
                                    showApps: false,
                                })
                            }, 500)
                        }
                    }
                })
            }
        })
    },
})