
const util = require('../../../utils/utils_old_live.js')
var WxParse = require('../../../wxParse/wxParse.js');

const app = getApp()
Page({
  data: {
    loading: false,
    showLoginDialog: false,
    room: [],
    btnValue: '',
    tapTime: '', // 防止两次点击操作间隔太快
    code: '',
    // height: (app.globalData.statusBarHeight + 44) + 'px',
    id: ''
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
    
    console.log("跳转打印")

    console.log(options)

  },
  onShow: function () {
    var that = this;
    let userid = 0;
    if (app.globalData.userInfo != null) {
      userid = app.globalData.userInfo.id;
    }
   
    that.initData(that.data.id, userid);
  },
  // 打开视频
  openVideo(e) {
    var video = e.currentTarget.dataset.video;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/video/video?video=' + video + '&id=' + this.data.room.room_id + '&name=' + name,
    })
  },
  initData: function (room_id, userid) {
    var that = this;
    that.setData({
      loading: true
    })
    util.request({
      url: '/api/room/detail',
      data: {
        room_id: room_id,
        user_id: userid
      },
      success: function (res) {
        if (res.data.code == 1) {
          var state = '进入直播间';
          if (res.data.data.state == 0) {
            state = '我要预约';
          } else if (res.data.data.state == 2) {
            state = '进入直播间';
          }
          that.setData({
            room: res.data.data,
            btnValue: state
          });
          wx.setNavigationBarTitle({
            title: res.data.data.room_name,
          })
          WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
          that.setData({
            loading: false
          })
        }
      }
    })
  },
  joinRoom: function (e) {
    var that = this;
    if (app.globalData.userInfo == null) {
      that.setData({
        showLoginDialog: true
      });
      wx.login({
        success: function (ret) {
          let code = ret.code;
          that.setData({
            code: code
          })
        }
      })
      return;
    }

    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - that.data.tapTime < 1000) {
      return;
    }
    that.setData({
      tapTime: nowTime
    });
    util.request({
      url: '/api/room/check_room_state',
      data: {
        room_id: that.data.room.room_id,
        user_id: app.globalData.userInfo.id,
      },
      success: function (res) {
        if (res.data.state == 0) { // 预约中
          wx.requestSubscribeMessage({
            tmplIds: ['mbzbyz0XnU8omRuxjMl9YJazis6Q3E3RSy9cd5Q1z98'],
            success(res) {
              if (res['mbzbyz0XnU8omRuxjMl9YJazis6Q3E3RSy9cd5Q1z98'] == 'accept') {
                wx.request({
                  // url: '/api/room/order',
                  // data: {
                  //   room_id: that.data.room.room_id,
                  //   user_id: app.globalData.userInfo.id,
                  // }, //临时修改的，具体可问post注释的部分是老版直播的接口。
                  url: 'https://new.schoolpi.net/api2/live/adduser',
                  data: {
                    id: that.data.room.room_id,
                    uid: app.globalData.userInfo.id,
                    type:2
                  },
                  method: 'post',
                  success: function (rs) {
                    if (rs.data.code == 1) {
                      let room = that.data.room;
                      room.orders = rs.data.orders;
                      that.setData({
                        room: room
                      });
                      wx.showToast({
                        title: rs.data.msg,
                        icon: 'none',
                        duration: 2000
                      });
                      //模板消息

                    } else {
                      wx.showToast({
                        title: rs.data.msg,
                        icon: 'none',
                        duration: 2000
                      });
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '订阅失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          })
        } else if (res.data.state == 1) { // 直播中
          if (that.data.room.is_ppt == 0) {
            if (that.data.room.admin_id == app.globalData.userInfo.id) {
              wx.navigateTo({
                url: '../teacher/index?id=' + that.data.room.room_id + '&name=' + that.data.room.room_name + '&logo=' + that.data.room.school_logo + '&title=' + that.data.room.room_title,
              });
            } else if (that.data.room.zhuli_id == app.globalData.userInfo.id) {
              app.globalData.isZhuli = true
              wx.navigateTo({
                url: '../student/index?id=' + that.data.room.room_id,
              });
            } else {
              wx.navigateTo({
                url: '../student/index?id=' + that.data.room.room_id,
              });
            }
          } else {
            if (that.data.room.admin_id == app.globalData.userInfo.id) {
              wx.navigateTo({
                url: '../ppt/teacher/teacher?id=' + that.data.room.room_id + '&name=' + that.data.room.room_name + '&logo='+ that.data.room.school_logo + '&title=' + that.data.room.room_title,
              });
            } else if (that.data.room.zhuli_id == app.globalData.userInfo.id) {
              app.globalData.isZhuli = true
              wx.navigateTo({
                url: '../ppt/student/student?id=' + that.data.room.room_id,
              });
            } else {
              wx.navigateTo({
                url: '../ppt/student/student?id=' + that.data.room.room_id,
              });
            }
          }
        } else if (res.data.state == 2) { // 已结束 
          if (that.data.room.is_ppt == 0) {
            wx.navigateTo({
              url: '../gameover/gameover?id=' + that.data.room.room_id,
            });
          } else {
            wx.navigateTo({
              url: '../ppt/gameover/gameover?id=' + that.data.room.room_id,
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '很抱歉，你无权访问！'
          })
        }
      }
    })
  },
  collectBtn: function (e) {
    var that = this;
    if (app.globalData.userInfo == null) {
      that.setData({
        showLoginDialog: true
      });
      return;
    }
    util.request({
      url: '/api/room/collect',
      data: {
        room_id: that.data.room.room_id,
        user_id: app.globalData.userInfo.id
      },
      success: function (res) {
        if (res.data.code == 1) {
          let room = that.data.room;
          room.is_collect = (res.data.is_collect == 1) ? true : false;
          room.collects = res.data.collects;
          that.setData({
            room: room,
          });
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  getUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo !== undefined) {
      let nickName = e.detail.userInfo.nickName;
      let gender = e.detail.userInfo.gender;
      let avatarUrl = e.detail.userInfo.avatarUrl;
      wx.request({
        url: 'https://new.schoolpi.net/api/login/live_login',
        data: {
          code: that.data.code
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (resp) {
          if (resp.data.code == 1) {
            wx.setStorage({
              key: "LOGIN_USERINFO",
              data: resp.data.info
            });
            app.globalData.userInfo = resp.data.info;
            that.setData({
              showLoginDialog: false,
            });
            wx.showToast({
              title: '登陆成功',
              icon: 'none',
              duration: 2000
            });
            that.initData(that.data.room.room_id, resp.data.info.id);
          } else if (resp.data.code == 2) {
            that.setData({
              showLoginDialog: true,
            });
          }
        }
      })
    } else {
      wx.showModal({
        title: '登陆失败',
        showCancel: false,
        content: '登陆失败,请授权！'
      })
    }
  },
  loginCansel() {
    var that = this;
    that.setData({
      showLoginDialog: false
    })
  },
  onShareAppMessage: function () {
    console.log(this.data.room.room_name,)
    return {
      title: this.data.room.room_name,
      path: '/packageChoose/page/detail/detail?id=' + this.data.room.room_id,
      imageUrl: this.data.room.share_img,
    }
  },
})