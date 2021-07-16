//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
Page({
    data: {
        uid: 0,
        mobile: 0,
        userInfo: {},
        hasUserInfo: false, //是否登陆
        integral: 0, //积分
        task: 0, //待完成任务数量
        year:2020,
    },
    onShow() {
        var that = this;
        util.request({
            url: '/api/user/userinfo',
            data: {
                uid: app.globalData.userInfo.id,
                platform_type: 1
            },
            success: function(res) {
              console.log(res)
                if (res.data.code === 1) {
                    var nickName = util.filterEmoji(res.data.info.nickname);
                    that.setData({
                        userInfo: res.data.info,
                        hasUserInfo: true,
                        year: res.data.info.college_year
                    })
                }
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
        util.request({
            url: '/api/user/integral',
            data: {
                uid: app.globalData.userInfo.id,
            },
            success: function(res) {
                if (res.data.code === 1) {
                    that.setData({
                        integral: res.data.integral,
                        task: res.data.task
                    })

                }
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
    },
    goCredits() {
        if (app.globalData.userInfo.id === 0) {
            this.setData({
                showLoginForm: true
            })
        } else {
            wx.navigateTo({
                url: '../../../packageChoose/page/credits/mall/mall',
            })
        }
    },
    //跳转到任务中心
    goMission() {
        if (app.globalData.userInfo.id === 0) {
            this.setData({
                showLoginForm: true
            })
        } else {
            wx.navigateTo({
                url: '../../../packageChoose/page/credits/mission/mission',
            })
        }
    },
    // 点击登录
    denglu() {
        this.setData({
            showLoginForm: true
        })
    },
    // 暂不登录
    showLoginForm() {
        this.setData({
            showLoginForm: false
        })
    },
    // 弹框后点击立即登录
    onGotUserInfo(e) {
        var that = this;
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.login({
                        success: function(res) {
                            var userInfo = e.detail.userInfo;
                            var code = res.code;
                            util.request({
                                url: '/api/login/wx_login',
                                data: {
                                    code: res.code
                                },
                                success: function(res) {

                                  console.log(res)

                                    if (res.data.code === 1) {
                                        app.globalData.userInfo = res.data.info;
                                        app.globalData.isLogin = true;
                                        app.globalData.userid = res.data.info.id;
                                        wx.setStorage({
                                            key: 'userInfo',
                                            data: res.data.info,
                                        })
                                        
                                        that.setData({
                                            showLoginForm: false,
                                            userInfo: app.globalData.userInfo,
                                            hasUserInfo: app.globalData.isLogin,
                                            integral: res.data.info.integral,
                                            year:res.data.info.year
                                        })
                                    } else {
                                        wx.navigateTo({
                                            url: '../../setuserinfo/index?code=' + code + '&nickname=' + userInfo.nickName + '&head_pic=' + userInfo.avatarUrl + '&sex=' + userInfo.gender,
                                        })
                                    }

                                }
                            })
                        }
                    })
                } else {

                }
            }
        })

    },
    //跳转判断
    goInner(e) {
        var type = e.currentTarget.dataset.type;
        if (app.globalData.userInfo.id === 0) {
            // wx.navigateTo({
            //     url: '/pages/setuserinfo/index',
            // })
            //打开登陆（商量）
            this.setData({
                showLoginForm: true
            })
        } else {
            if (type == 1) {
                wx.navigateTo({
                    url: '/pages/collection/index',
                })
            }
            if (type == 2) {
                wx.navigateTo({
                    url: '/pages/user_binding/index',
                })
            }
            if (type == 3) {
                wx.navigateTo({
                    url: '/pages/career/applyfor/index',
                })
            }
            if (type == 4) {
                wx.navigateTo({
                    url: 'user_live/user_live',
                })
            }
        }
    },
    tel: function() {
        wx.makePhoneCall({
            phoneNumber: '0551-66102699',
        })
    },
    onHide() {
        this.setData({
            showLoginForm: false
        })
    },
    // 带参分享
    goShare(){
        if (app.globalData.userInfo.id === 0) {
            this.setData({
                showLoginForm: true
            })
        }else{
            wx.navigateTo({
                url: '../../user_share/user_share',
            })
        }
    },
    // 协议
    agreement(e) {
        var that = this;
        let agreement = e.currentTarget.dataset.agreement
        wx.navigateTo({
            url: '../../agreement/agreement?agreement=' + agreement,
        })
    }
})