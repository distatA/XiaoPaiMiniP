// pages/credits/mission/mission.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({
    data: {
        userInfo: {}, //用户积分信息
        unsign: '签到',
        sign: '已签到',
        showRule: false, //积分规则显示
        showSign: false, //签到显示
        signInte: 0, //签到成功获得积分
        signList: [], //签到日期
        signShow: false, //已签到图标显示
        signDay: 0, //已签到天数
        signToday: 0, //今日签到
        taskList: [], //任务
        animation: false, //积分动画
        actInte: 0, //动画加分
        // 积分规则
        inte_1: 0,
        inte_2: 0,
        inte_3: 0,
        inte_4: 0,
        inte_5: [],
        inte_6: [],
        inte_7: [],
        inte_8: [],
        inte_9: [],
    },
    // 签到成功
    signBtn: function() {
        var that = this;
        util.request({
            url: '/api/integral/signin',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        showSign: true,
                        signInte: res.data.inte
                    });
                    that.userInfo();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    },
    // 积分说明
    goRule: function() {
        var that = this;
        util.request({
            url: '/api/integral/help',
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        showRule: true,
                        inte_1: res.data.data.inte_1,
                        inte_2: res.data.data.inte_2,
                        inte_3: res.data.data.inte_3,
                        inte_4: res.data.data.inte_4,
                        inte_5: res.data.data.inte_5,
                        inte_6: res.data.data.inte_6,
                        inte_7: res.data.data.inte_7,
                        inte_8: res.data.data.inte_8,
                        inte_9: res.data.data.inte_9,
                    })
                }
            }
        })
    },
    // 返回积分签到
    returnMission: function() {
        var that = this;
        that.setData({
            showRule: false
        });
    },
    // 签到成功后返回我的任务页面
    backMission: function() {
        var that = this;
        util.request({
            url: '/api/integral/daily_sign',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        signShow: true,
                        showSign: false,
                        signList: res.data.list,
                        signDay: res.data.sign_day,
                    });
                }
            }
        })
    },
    draw(e) {
        var that = this;
        // 完善个人资料key=1 首次和每次邀请注册key=2 关注公众号key=3
        let key=e.currentTarget.dataset.key;
        util.request({
            url: '/api/integral/receive',
            data: {
                'uid': app.globalData.userInfo.id,
                'type': e.currentTarget.dataset.type,
                'ids': e.currentTarget.dataset.ids
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.myTask();
                    that.userInfo();
                    that.setData({
                        animation: true,
                        actInte: res.data.inte
                    });
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                } else {
                    if(key==1){
                        that.goUser();
                    }else if(key==2){
                        that.goShare();
                    }else if(key==3){
                        wx.showToast({
                            title: '微信搜索公众号【校派pai】，点击关注即可',
                            icon:'none',
                            duration:2000
                        })
                    }else{
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                    
                }
            }
        })
    },
    // 完成个人资料跳转
    goUser() {
        wx.navigateTo({
            url: '../../userInfo/userInfo',
        })
    },
    // 邀请好友注册
    goShare() {
        wx.navigateTo({
            url: '/pages/user_share/user_share',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    userInfo() {
        var that = this;
        util.request({
            url: '/api/user/userinfo',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        userInfo: res.data.info,
                    })
                }
            }
        })
    },
    myTask() {
        var that = this;
        util.request({
            url: '/api/integral/mytask',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        taskList: res.data.task,
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        that.userInfo();
        that.myTask();
        util.request({
            url: '/api/integral/daily_sign',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        signList: res.data.list,
                        signDay: res.data.sign_day,
                        signToday: res.data.sign_today
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
 

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
    }
})