// packageChoose/page//recruitment/index/index.js
const app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0,
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 3000,
        bannerList: [],
        policyinfo: {},
        showInfo1: false,
        showInfo2: false,
        showInfo3: false,
        showInfo4: false,
        showInfo5: false,
        showInfo6: false,
        showInfo7: false,
        showInfo8: false,
        showInfo9: false,
        menuList: ['学校列表', '政策课堂', '热门专业', '报名信息'],
        applyList: [],
        topnewslist: [],
        schoolList: [],
        majorList: [],
        page: 2,
        name: ''
    },
    openAdLink(e) {
        var that = this;
        let link = e.currentTarget.dataset.link;
        var media = e.currentTarget.dataset.type;
        var id = e.currentTarget.dataset.id;
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 1,
            objectId: id
        })
        if (media == 0) {
            return;
        } else if (media == 1) {
            wx.navigateTo({
                url: link,
            })
        } else if (media == 4) {
            wx.navigateTo({
                url: "/pages/webview/index?url=" + link,
            })
        }
    },
    //拨号
    call(e) {
        var phone = e.currentTarget.dataset.phone.split("、");
        wx.makePhoneCall({
            phoneNumber: phone[0],
        })
    },
    //选择菜单
    selectMenu(e) {

        var that = this;
        var index = e.currentTarget.dataset.current;

        if (index === 1) {
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                objectId: 202
            })
        }
        if (index === 2) {
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                objectId: 203
            })
            util.request({
                url: '/api/vocational/index_career',
                data: {
                    "page": 1
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code === 1) {
                        var majorList = res.data.list;
                        for (var i = 0; i < majorList.length; i++) {
                            majorList[i].star = [];
                            majorList[i].star.length = majorList[i].recommend;
                        }

                        that.setData({
                            majorList: res.data.list
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
        }
        if (index === 3) {
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                objectId: 204
            })
            util.request({
                url: '/api/vocational/index_enroll',
                data: {
                    "page": 1,
                    'province': app.globalData.province.id
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code === 1) {
                        var applyList = res.data.list;
                        for (var i = 0; i < applyList.length; i++) {
                            applyList[i].isOpen = false;
                        }

                        that.setData({
                            applyList: applyList
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
        }
        this.setData({
            currentTab: index,
            page: 2
        })
    },
    //搜索
    formSubmit(e) {
        var that = this;
        var name = e.detail.value.name
        util.request({
            url: '/api/vocational/index_school',
            data: {
                'school_name': name,
                'province': app.globalData.province.id,
                "page": 1
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        currentTab: 0,
                        schoolList: res.data.list,
                        name: name
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
    showMore(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var applyList = that.data.applyList;
        for (var i = 0; i < applyList.length; i++) {
            applyList[index].isOpen = !applyList[index].isOpen;
        }
        that.setData({
            applyList: applyList
        })
    },
    showClass(e) {

        var that = this;
        var index = e.currentTarget.dataset.index;
        if (index == 1) {
            var showInfo1 = that.data.showInfo1
            that.setData({
                showInfo1: !showInfo1,
            })
        }
        if (index == 2) {
            var showInfo2 = that.data.showInfo2
            that.setData({
                showInfo2: !showInfo2,
            })
        }
        if (index == 3) {
            var showInfo3 = that.data.showInfo3
            that.setData({
                showInfo3: !showInfo3,
            })
        }
        if (index == 4) {
            var showInfo4 = that.data.showInfo4
            that.setData({
                showInfo4: !showInfo4,
            })
        }
        if (index == 5) {
            var showInfo5 = that.data.showInfo5
            that.setData({
                showInfo5: !showInfo5,
            })
        }
        if (index == 6) {
            var showInfo6 = that.data.showInfo6
            that.setData({
                showInfo6: !showInfo6,
            })
        }
        if (index == 7) {
            var showInfo7 = that.data.showInfo7
            that.setData({
                showInfo7: !showInfo7,
            })
        }
        if (index == 8) {
            var showInfo8 = that.data.showInfo8
            that.setData({
                showInfo8: !showInfo8,
            })
        }
        if (index == 9) {
            var showInfo9 = that.data.showInfo9
            that.setData({
                showInfo9: !showInfo9,
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/ad/rotation_vocational',
            data: {
                'province': app.globalData.province.id,
            },
            method: 'post',
            success: function(res) {
                that.setData({
                    bannerList: res.data.banlist
                })
                // }
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });

        //头条
        util.request({
            url: '/api/vocational/index',
            data: {
                'province': app.globalData.province.id,
                "uid": app.globalData.userInfo.id
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        topnewslist: res.data.topnewslist
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
            url: '/api/vocational/index_school',
            data: {
                'school_name': "",
                'province': app.globalData.province.id,
                "page": 1
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        schoolList: res.data.list
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
    goNews(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../../indexNews/indexNews?id=' + id,
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
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            objectId: 201
        })
        util.request({
            url: '/api/vocational/index_policy',
            data: {
                'province': app.globalData.province.id
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    var enrolment_object = util.format(res.data.data.enrolment_object);
                    var entry_requirements = util.format(res.data.data.entry_requirements);
                    var registration_time = util.format(res.data.data.registration_time);
                    var registration_process = util.format(res.data.data.registration_process);
                    var enrollment_institutions = util.format(res.data.data.enrollment_institutions);
                    var teaching_mode = util.format(res.data.data.teaching_mode);
                    var graduation_certificate = util.format(res.data.data.graduation_certificate);
                    var policy_reduction = util.format(res.data.data.policy_reduction);
                    WxParse.wxParse('enrolment_object', 'html', enrolment_object, that, 5);
                    WxParse.wxParse('entry_requirements', 'html', entry_requirements, that, 5);
                    WxParse.wxParse('registration_time', 'html', registration_time, that, 5);
                    WxParse.wxParse('registration_process', 'html', registration_process, that, 5);
                    WxParse.wxParse('enrollment_institutions', 'html', enrollment_institutions, that, 5);
                    WxParse.wxParse('teaching_mode', 'html', teaching_mode, that, 5);
                    WxParse.wxParse('graduation_certificate', 'html', graduation_certificate, that, 5);
                    WxParse.wxParse('policy_reduction', 'html', policy_reduction, that, 5);
                    that.setData({
                        policyinfo: res.data.data
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut:1,
            objectId: 201
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
            objectId: 201
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
        var that = this;
        if (that.data.currentTab == 0) {
            util.request({
                url: '/api/vocational/index_school',
                data: {
                    'school_name': that.data.name,
                    'province': app.globalData.province.id,
                    "page": that.data.page
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code == 1) {
                        var schoolList = that.data.schoolList.concat(res.data.list)
                        // schoolList.concat(res.data.list)
                        that.setData({
                            page: that.data.page + 1,
                            schoolList: schoolList
                        })
                        wx.showToast({
                            title: '加载中...',
                            icon: 'loading'
                        })
                    } else {
                        wx.showToast({
                            title: '没有更多',
                            icon: 'none'
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
        }
        if (that.data.currentTab == 2) {
            util.request({
                url: '/api/vocational/index_career',
                data: {
                    "page": that.data.page
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code == 1) {
                        var major = res.data.list
                        // var schoolList = that.data.schoolList;
                        for (var i = 0; i < major.length; i++) {
                            major[i].star = [];
                            major[i].star.length = major[i].recommend
                        }
                        var majorList = that.data.majorList.concat(major)
                        // schoolList.concat(res.data.list)
                        that.setData({
                            page: that.data.page + 1,
                            majorList: majorList
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
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        count.share({
            objectType: 3,
            objectId: 201
        })
    }
})