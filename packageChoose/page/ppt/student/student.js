var WxParse = require('../../../../wxParse/wxParse.js');
const util = require('../../../../utils/utils_old_live.js')
const app = getApp();
var socketOpen = false;
var SocketTask;
Page({
  data: {
    height: app.globalData.statusBarHeight + 'px',
    roomID: 0,
    liveStatus: 0, // 直播是否已开始 直播状态 0未开始 1已开始 2已结束
    liveType: 0, // 直播间类型
    roomName: '',
    shareImg: '', // 分享图片
    roomTitle: '校派直播间',
    schoolLogo: '',
    roomPeoples: 0, // 观看人数
    teacherTime: '',
    liveEndTime: '',
    playURL: null,
    playerActive: false,
    showSider: false,
    inputFocus: false,
    inputInfo: '说点什么...',
    limit: 0, // 重连次数
    comment: [],
    isForbidden: false, // 是否被禁言
    showDialog: false,
    showBarrageInput: false,
    isPlayingMusic: false,//是否播放音乐
    musicUrl: "",//背景音乐链接
    pptimgs: [],
    ppt_play_img: '',
    ppt_play_id: 0,
    danmuIsOpen: true,
    shipinIsOpen: true,
    pptGap: 0,//非全屏时左右间隔
    isVideo: false,//显示精彩视频
    videoUrl: ''
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        that.setData({
          pptGap: (res.windowWidth - 627)
        })
        console.log((res.windowWidth - 627))
      }
    })
    that.setData({
      roomID: options.id,
    })
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },
  onShow: function () {
    var that = this;
    that.setData({
      lockReconnect: false
    })
    util.request({
      url: '/api/live/ppt_student',
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
            teacherTime: res.data.data.teacher_time,
            liveEndTime: res.data.data.live_end_time,
            liveType: res.data.data.live_type,
            isForbidden: res.data.data.is_forbidden,
            shareImg: res.data.data.share_img,
            liveStatus: res.data.data.live_status,
            musicUrl: res.data.data.music,
            videoUrl: res.data.data.wait_video
          })
          that.setData({
            pptimgs: res.data.data.imgs,
            ppt_play_img: res.data.data.imgs[0].thumb,
            ppt_play_id: res.data.data.imgs[0].id,
          })

          for (var i = 0; i < res.data.data.imgs.length; i++) {
            if (res.data.data.imgs[i].selecton == 1) {
              that.setData({
                ppt_play_img: res.data.data.imgs[i].thumb,
                ppt_play_id: res.data.data.imgs[i].id,
              })
            }
          }
          that.initWebSocket(); // 开启websocket

          // 如果直播已开始
          if (that.data.liveStatus == 1) {
            console.log('直播早已开始', that.data.liveStatus);
            setTimeout(function () {
              if (!that.playContext) {
                that.playContext = wx.createLivePlayerContext('player', that);
              }
              that.start()
            }, 2000)
          } else {
            that.playMusic()
          }
        }
      }
    })
  },
  onHide: function () {
    console.log('onHide');
    if (this.data.liveStatus == 1) {
    }
    if (socketOpen) {
      this.setData({
        limit: 0,
        lockReconnect: true
      })
      SocketTask.close();
    }
    this.shopMusic();
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
    this.shopMusic();
  },
  start() {
    this.getPlayURL();
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
  },
  getPlayURL: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    util.request({
      url: '/api/live/rtmp',
      data: {
        type: 'play',
        room_id: that.data.roomID,
      },
      success: function (data) {
        that.setData({ 
          playURL: data.data.url 
          }, () => {
          that.playContext.play({
            success: function () {
              wx.hideLoading();
              console.log('play success');
            },
            fail: function (e) {
              console.log(e)
              console.log('play fail');
            },
            complete: function () {
              console.log('complete');
            }
          });
        });
      },
    });
  },
  //播放音乐
  playMusic() {
    let isPlayingMusic = this.data.isPlayingMusic
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      //play 
      wx.playBackgroundAudio({
        dataUrl: this.data.musicUrl,
      })
      this.setData({
        isPlayingMusic: true
      })
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
      else if (data.cmd == 3) { // 老师进场开始直播
        that.setData({
          liveStatus: 1
        })
        if (!that.playContext) {
          that.playContext = wx.createLivePlayerContext('player', that);
        }
        that.start()
        that.shopMusic();
      }
      else if (data.cmd == 5) { // 收到直播结束命令
        wx.showModal({
          title: '提示',
          content: '直播已结束',
          showCancel: false,
        })
        that.setData({
          liveStatus: 2,
          liveEndTime: data.data
        })
      }
      else if (data.cmd == 80) { // 切换幻灯片
        for (let i = 0; i < that.data.pptimgs.length; i++) {
          if (that.data.pptimgs[i].id == data.data.pptid) {
            that.setData({
              ppt_play_id: data.data.pptid,
              ppt_play_img: that.data.pptimgs[i].thumb,
            })
          }
        }
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
      } else if (data.cmd == 40) {
        that.setData({
          myIntegral: data.data
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
  statechange(e) {
    console.log(e.detail.code);
    switch (e.detail.code) {
      case 2004:
        this.setData({ startPlay: true });
        break;
      case 2103:
        wx.showToast({ title: '断开连接，正在重连', icon: 'none' });
        break;
      case -2301:
        wx.showToast({ title: '和远程服务断开连接', icon: 'none' });
        break;
    }
  },
  //点击发送弹幕
  sendBarrage() {
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
    this.setData({
      inputFocus: true,
      inputInfo: '',
      showBarrageInput: true,
      liveHeight: systemInfo.windowHeight - 45
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data.roomName,
      path: '../../detail/detail?id=' + this.data.roomID,
      imageUrl: this.data.shareImg,
    }
  },
  bindPlayback() {
    wx.navigateTo({
      url: '../playback/playback?id=' + this.data.roomID,
    })
  },
  shopMusic() {
    var that = this;
    let isPlayingMusic = that.data.isPlayingMusic
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      that.setData({
        isPlayingMusic: false
      })
    }
  },
  onBack: function () {
    var that = this;
    wx.showModal({
      content: '您确定要退出直播间嘛？',
      cancelText: '取消',
      confirmText: '确定',
      success: function (sm) {
        if (sm.confirm) {
          wx.navigateBack({ delta: 1 })
          that.shopMusic();
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
  // 打开精彩视频
  showVideo() {
    wx.pauseBackgroundAudio();
    this.setData({
      isPlayingMusic: false,
      isVideo: true,
    })
  },
  quitVideo() {
    wx.pauseBackgroundAudio();
    this.setData({
      isPlayingMusic: true,
      isVideo: false,
    })
    wx.playBackgroundAudio({
      dataUrl: this.data.musicUrl,
    })
  }
})