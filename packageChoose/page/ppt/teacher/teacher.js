const app = getApp();
const util = require('../../../../utils/utils_old_live.js')
var socketOpen = false;
var SocketTask;
Page({
  data: {
    room: null,
    pptImgs: [],
    pushURL: null,
    pushMode: 'HD',
    magic: true,
    pushState: 'stop', // stop pushing pause pending
    frontCamera: true,
    pptimgurl: '',//当前直播显示图片的地址
    autoHeight: 0,
    valueShow: false,
    currentImg: 0,//默认显示第一张图
    lockReconnect: false, // 锁定重连
    timer: null,
    limit: 0, // 断线后重连次数
    comment: [],
    frontCamera: true,
    share_img: '',
    danmuIsOpen: true,
    shipinIsOpen: true,
    start_time: 0,
    imglistUrl:app.globalData.loadUrl
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      room: {
        roomID: options.id,
        roomName: options.name,
        roomTitle: options.title,
        schoolLogo: options.logo,
      },
      showLiveRoom: true,
    }, function () {
      wx.showShareMenu({
        withShareTicket: true,
      });
      util.request({
        url: '/api/live/ppt_teacher',
        data: {
          room_id: options.id,
        },
        success: (data) => {
          console.log(JSON.stringify(data.data));
          that.setData({
            pptImgs: data.data.imgs,
            pptimgurl: app.globalData.loadUrl + data.data.imgs[0].thumb,
            currentImg: data.data.imgs[0].id,
            share_img: data.data.share_img,
          });
          that.pushContext = wx.createLivePusherContext();
          that.getPushURL();
        }
      });
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.initData();
    this.setData({
      lockReconnect: false
    })
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });
  },
  onHide: function () {
    if (socketOpen) {
      this.setData({
        lockReconnect: true
      })
      SocketTask.close();
    }
    wx.setKeepScreenOn({
      keepScreenOn: false,
    });
  },
  onUnload: function () {
    if (socketOpen) {
      this.setData({
        lockReconnect: true
      })
      SocketTask.close();
    }
    this.pushContext.stop();
  },
  onShareAppMessage: function () {
    return {
      title: this.data.roomName,
      path: '../../detail/detail?id=' + this.data.roomID,
      imageUrl: this.data.share_img,
    }
  },
  start: function () {
    var that = this;
    that.setData({ pushState: 'pending' });
    that.pushContext.start({
      success: () => {
        that.setData({
          pushState: 'pushing',
          start_time: new Date().getTime()
        });
      },
      fail: () => {
        wx.showToast({ title: '推流开始失败' });
        that.setData({ pushState: 'stop' });
      },
    });
  },
  changeCamera: function () {
    var that = this;
    that.pushContext.switchCamera();
    that.setData({
      frontCamera: !that.data.frontCamera
    })
  },
  statechange(e) {
    switch (e.detail.code) {
      case -1307:
        wx.showToast({ title: '和远程服务器失去连接', icon: 'none' });
        break;
      case 3004:
        wx.showToast({ title: '远程服务器主动断开连接', icon: 'none' });
        break;
      default:
        break;
    }
    console.log('live-player code:', e.detail.code)
  },
  getPushURL: function () {
    var that = this;
    util.request({
      url: '/api/live/rtmp',
      data: {
        type: 'publish',
        room_id: that.data.room.roomID,
      },
      success: (data) => {
        // 注意这里必须在setData的回调后才能开始推流
        that.setData({ pushURL: data.data.url }, () => {
          that.start();
        });
      },
      fail: () => {
        wx.showModal({
          title: '推流失败',
          content: '发生错误，无法获取推流地址',
          showCancel: false,
        });
      },
    });
  },
  showFile() {
    this.setData({
      valueShow: !this.data.valueShow
    })
  },
  // 切换课件
  selectCurrent(e) {
    var that = this;
    var currentImg = e.currentTarget.dataset.current
    for (let i = 0; i < that.data.pptImgs.length; i++) {
      if (currentImg == that.data.pptImgs[i].id) {
        that.setData({
          currentImg: currentImg,
          pptimgurl: app.globalData.loadUrl +that.data.pptImgs[i].thumb
        })
        SocketTask.send({
          data: JSON.stringify({ "cmd": 80, "data": { "roomid": that.data.room.roomID, "pptid": currentImg } })
        });

        util.request({
          url: '/api/live/add_ppt_timer',
          data: {
            room_id: that.data.room.roomID,
            pptid: currentImg,
            timer: new Date().getTime() - that.data.start_time
          },
          success: (data) => {
          },
        });

        console.log('开始时间', that.data.start_time);
        console.log('点击时间', new Date().getTime());
        console.log('======>', new Date().getTime() - that.data.start_time);
      }
    }
  },
  initData() {
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
      console.log('websocket login=>', JSON.stringify({ "cmd": 1, "data": { "roomid": that.data.room.roomID, "userid": app.globalData.userInfo.id } }));
      SocketTask.send({
        data: JSON.stringify({ "cmd": 1, "data": { "roomid": that.data.room.roomID, "userid": app.globalData.userInfo.id, "nickname": app.globalData.userInfo.nickname, "identity": 1 } })
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
        if (that.data.comment.length <= 12) {
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
      else if (data.cmd == 2) { // 统计观看人数
        that.setData({
          roomPeoples: data.data
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
    if (that.data.limit < 10) {//连接10次后不再重新连接
      var timer = setTimeout(() => {
        that.initData();
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
  changeCamera: function () {
    var that = this;
    that.pushContext.switchCamera();
    that.setData({
      frontCamera: !that.data.frontCamera
    })
  },
  gameOver: function () {
    var that = this;
    wx.showModal({
      content: '您确定要结束本次直播嘛？',
      cancelText: '取消',
      confirmText: '结束',
      success: function (sm) {
        if (sm.confirm) {
          util.request({
            url: '/api/room/gameover',
            data: {
              room_id: that.data.room.roomID,
              user_id: app.globalData.userInfo.id,
            },
            success: function (res) {
              if (res.data.code == 1) {
                util.request({
                  url: '/api/live/luzhi',
                  data: {
                    room_id: that.data.room.roomID,
                  },
                  success: function (res) { }
                })
                wx.navigateBack({
                  delta: 1
                });
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          })
        }
      }
    })
  },
  onDanmu: function () {
    var that = this;
    that.setData({
      danmuIsOpen: !that.data.danmuIsOpen
    })
  },
  onShipin: function () {
    var that = this;
    that.setData({
      shipinIsOpen: !that.data.shipinIsOpen
    })
  },
})