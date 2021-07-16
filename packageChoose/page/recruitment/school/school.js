// packageChoose/page//recruitment/school/school.js
const app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        currentTab: 0,
        schoolInfo: {},
        enrollmentInfo: {},
        school_id: '',
        bannerList: [],
        menuList: ['学校概况', '招生简章', '开设专业'],
        schoolList: [],
        majorList: [],
        isretrue: 0,

    },
    showMore(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var majorList = that.data.majorList;
        for (var i = 0; i < majorList.length; i++) {
            if (i == index) {
                if (majorList[i].isOpen) {
                    majorList[i].isOpen = false
                } else {
                    majorList[i].isOpen = true
                }
            }
        }
        that.setData({
            majorList: majorList
        })
    },
    //选择菜单
    selectMenu(e) {
        var index = e.currentTarget.dataset.current;
        var that = this;
        if (index === 1) {
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 206
            })
            util.request({
                url: '/api/vocational/school_enrollment',
                data: {
                    "sid": that.data.school_id
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code === 1) {
                        that.setData({
                            enrollmentInfo: res.data.info
                        })
                        var enrollment_content = util.format(res.data.info.enrollment_content);
                        WxParse.wxParse('description1', 'html', enrollment_content, that, 5);
                        //WxParse.wxParse('enrollment-description', 'html', res.data.info.enrollment_content, that, 5);
                    }
                },
                fail: function(e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            });
        }
        if (index === 2) {
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 207
            })
            util.request({
                url: '/api/vocational/school_career',
                data: {
                    "sid": that.data.school_id
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code === 1) {
                        var majorList = res.data.list;
                        for (var i = 0; i < majorList.length; i++) {
                            majorList[i].isOpen = false;
                        }
                        that.setData({
                            majorList: majorList
                        })
                        //WxParse.wxParse('enrollment-description', 'html', res.data.info.enrollment_content, that, 5);
                    }
                },
                fail: function(e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            });
        }

        this.setData({
            currentTab: index,
            page: 1
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if (options.isretrue) {
            that.setData({
                isretrue: 1
            });
        }
        that.setData({
            school_id: options.id
        });
        app.globalData.schoolid = options.id;
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
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 205
        })
        util.request({
            url: '/api/vocational/school_details',
            data: {
                "sid": app.globalData.schoolid
            },
            method: 'post',
            success: function(res) {
                if (res.data.code === 1) {
                    that.setData({
                        schoolInfo: res.data.info,
                    })
                    WxParse.wxParse('description', 'html', res.data.info.description, that, 5);
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut:1,
            schoolId: app.globalData.schoolid,
            objectId: 205
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut: 1,
            schoolId: app.globalData.schoolid,
            objectId: 205
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    returnHome: function(e) {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var that = this;
        count.share({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 205
        })
        util.request({
            url: '/api/vocational/school_share',
            data: {
                "sid": that.data.school_id
            },
            method: 'post',
            success: function(res) {

            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
        var shareObj = {
            title: '校派',
            path: '/packageChoose/page/recruitment/school/school?id=' + app.globalData.schoolid + '&isretrue=1',
            success: function(res) {
                if (res.errMsg == 'shareAppMessage:ok') {
                }
            },
            fail: function(res) {
            }
        };
        return shareObj;
    }
})