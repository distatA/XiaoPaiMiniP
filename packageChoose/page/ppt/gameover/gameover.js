const util = require('../../../../utils/utils_old_live.js')
const app = getApp();
var socketOpen = false;
var SocketTask;
Page({
  data: {
    roomID: 0,
    liveType: 0, // 直播间类型
    roomName: '',
    shareImg: '', // 分享图片
    roomTitle: '校派直播间',
    schoolLogo: '',
    roomPeoples: 0, // 观看人数
    areaId: 0,//判断是否是江苏
    liveEndTime: '',
    height: app.globalData.statusBarHeight + 'px',
    comment: [],
    showSider: false,
    inputFocus: false,
    inputInfo: '说点什么...',
    limit: 0, // 重连次数
    isForbidden: false, // 是否被禁言
    showBarrageInput: false,
    liveHeight: 0,
  },
  onLoad: function (options) {
    this.setData({
      roomID: options.id
    })
    var systemInfo = wx.getSystemInfoSync();
    this.setData({
      liveHeight: systemInfo.windowHeight
    });
  },
  onShow: function () {
    var that = this;
    that.setData({
      lockReconnect: false
    })
    util.request({
      url: '/api/room/live_info',
      data: {
        room_id: that.data.roomID,
        userid: app.globalData.userInfo.id,
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            roomName: res.data.data.room_name,
            roomTitle: res.data.data.room_title,
            schoolLogo: res.data.data.school_logo,
            roomPeoples: res.data.data.peoples,
            liveEndTime: res.data.data.live_end_time,
            liveType: res.data.data.live_type,
            areaId: res.data.data.area_id,
            isForbidden: res.data.data.is_forbidden,
            shareImg: app.globalData.loadUrl + res.data.data.share_img,
          })
          that.initWebSocket(); // 开启websocket
        }
      }
    })
  },
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },
  bindPlayback(){
    wx.navigateTo({
      url: '../playback/playback?id=' + this.data.roomID,
    })
  },
  onHide: function () {
    console.log('onHide');
    if (socketOpen) {
      this.setData({
        limit: 0,
        lockReconnect: true
      })
      SocketTask.close();
    }
  },
  onUnload: function () {
    console.log('onUnload');
    if (socketOpen) {
      this.setData({
        limit: 0,
        lockReconnect: true
      })
      SocketTask.close();
    }
  },
  initWebSocket() {
    var that = this;
    SocketTask = wx.connectSocket({
      url: "wss://zb.schoolpi.net:10443/ws/",
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      }
    })
    SocketTask.onOpen(res => {
      socketOpen = true
      console.log('监听 WebSocket 连接打开事件。', res)
      SocketTask.send({
        data: JSON.stringify({ "cmd": 1, "data": { "roomid": that.data.roomID, "userid": app.globalData.userInfo.id, "nickname": app.globalData.userInfo.nickname, "identity": 0 } })
      });
    })
    SocketTask.onMessage(res => {
      console.log('发送了一条消息')
      var data = JSON.parse(res.data)
      console.log(data)
      if (data.cmd == 1) { // 群消息
        that.data.comment.push({
          content: data.data.content,
          name: data.data.formUser,
          type: data.data.type,
        });

        let comment = [];
        if (that.data.comment.length <= 6) {
          that.setData({
            comment: that.data.comment
          });
        } else {
          let len = that.data.comment.length - 6;
          for (let i = len; i < that.data.comment.length; i++) {
            comment.push(that.data.comment[i]);
          }
          that.setData({
            comment: comment
          });
        }
      }
      else if (data.cmd == 2) { // 统计在线人数
        that.setData({
          roomPeoples: data.data
        })
      }
      else if (data.cmd == 11) { // 被踢
        wx.showModal({
          title: '提示',
          content: data.data,
          showCancel: false,
          confirmText: '确定',
          success: function (sm) {
            if (sm.confirm) {
              wx.navigateBack({ delta: 1 })
            }
          }
        })
      }
      else if (data.cmd == 12) { // 禁言
        that.setData({
          isForbidden: true
        })
        wx.showModal({
          title: '提示',
          content: data.data,
          showCancel: false,
        })
      }
      else if (data.cmd == 20) {
        that.setData({
          questionList: data.data
        })
      }
    })
    SocketTask.onClose(res => {
      console.log('关闭 WebSocket 连接。')
      socketOpen = false
      that.onWebsocketReconnect()
    })
    SocketTask.onError(res => {
      console.log('WebSocket 连接错误。')
      socketOpen = false
      that.onWebsocketReconnect()
    })
  },
  onWebsocketReconnect: function () {
    var that = this;
    if (that.data.lockReconnect) return;
    that.setData({
      lockReconnect: true
    })
    clearTimeout(that.data.timer)
    if (that.data.limit <= 10) {//连接10次后不再重新连接
      var timer = setTimeout(() => {
        that.initWebSocket();
        that.setData({
          lockReconnect: false
        })
        console.log("次数:" + that.data.limit)
      }, 5000);//每隔5秒连接一次
      that.setData({
        timer: timer,
        limit: that.data.limit + 1
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '连接失败，请重新打开网络。',
        showCancel: false,
      })
    }
  },
  //点击发送弹幕
  sendBarrage() {
    console.log(this.data.inputInfo)
    if (this.data.isForbidden == false) {
      if (socketOpen && this.data.inputInfo != '') {
        SocketTask.send({
          data: JSON.stringify({ "cmd": 2, "data": { "roomid": this.data.roomID, "userid": app.globalData.userInfo.id, "nickname": app.globalData.userInfo.nickname, "content": this.data.inputInfo } })
        });
        var systemInfo = wx.getSystemInfoSync();
        this.setData({
          liveHeight: systemInfo.windowHeight
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '您已被禁言10分钟。',
        showCancel: false,
      })
    }
    this.setData({
      inputInfo: '说点什么...',
      inputFocus: false,
      showBarrageInput: false
    });
  },
  //监听输入
  bindinput(e) {
    console.log(e.detail.value)
    this.setData({
      inputInfo: e.detail.value,
    });
  },
  //失去焦点
  bindblur(e) {
    var systemInfo = wx.getSystemInfoSync();
    this.setData({
      inputInfo: e.detail.value,
      inputFocus: false,
      showBarrageInput: false,
      liveHeight: systemInfo.windowHeight,
    });
  },
  tapInput() {
    var systemInfo = wx.getSystemInfoSync();
    console.log('live hinght=>', systemInfo.windowHeight - 45);
    this.setData({
      inputFocus: true,
      inputInfo: '',
      showBarrageInput: true,
      liveHeight: systemInfo.windowHeight - 45
    })
  },
  onBack: function () {
    wx.navigateBack({})
  }
})