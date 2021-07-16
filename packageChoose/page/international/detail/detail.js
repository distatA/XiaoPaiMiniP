// packageChoose/page//international/detail/detail.js
const app = getApp()
const util = require('../../../../utils/util.js');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLogin: false,
        schoolid: 0,
        celled: false,
        popup: false,
        videoIndex: 0,
        videoList: [],
        currentVideo: '',
        currentVideoTitle: '',
        menuList: [{
            name: '院校简介',
            type: 1,
            icon: 'https://new.schoolpi.net/attach/small_program/abroad/menu-one.png',
            iconOn: "https://new.schoolpi.net/attach/small_program/abroad/menu-one-on.png"
        }, {
            name: '教学环境',
            type: 2,
            icon: 'https://new.schoolpi.net/attach/small_program/abroad/menu-two.png',
            iconOn: "https://new.schoolpi.net/attach/small_program/abroad/menu-two-on.png"
        }, {
            name: '开设专业',
            type: 3,
            icon: 'https://new.schoolpi.net/attach/small_program/abroad/menu-three.png',
            iconOn: "https://new.schoolpi.net/attach/small_program/abroad/menu-three-on.png"
        }, {
            name: '地理位置',
            type: 4,
            icon: 'https://new.schoolpi.net/attach/small_program/abroad/menu-four.png',
            iconOn: "https://new.schoolpi.net/attach/small_program/abroad/menu-four-on.png"
        }, {
            name: '院校特点',
            type: 5,
            icon: 'https://new.schoolpi.net/attach/small_program/abroad/menu-five.png',
            iconOn: "https://new.schoolpi.net/attach/small_program/abroad/menu-five-on.png"
        }, {
            name: '教学特色',
            type: 6,
            icon: 'https://new.schoolpi.net/attach/small_program/abroad/menu-six.png',
            iconOn: "https://new.schoolpi.net/attach/small_program/abroad/menu-six-on.png"
        }, {
            name: '教学设施',
            type: 7,
            icon: 'https://new.schoolpi.net/attach/small_program/abroad/menu-seven.png',
            iconOn: "https://new.schoolpi.net/attach/small_program/abroad/menu-seven-on.png"
        }, {
            name: '联系方式',
            type: 8,
            icon: 'https://new.schoolpi.net/attach/small_program/abroad/menu-eight.png',
            iconOn: "https://new.schoolpi.net/attach/small_program/abroad/menu-eight-on.png"
        }],
        content: 1,
        info: {},
        introduce: [],
        isretrue: 0,
        isHaveVideo: false,
    },
    call(e) {
        var phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone,
            success: function() {

            },
            fail: function() {

            }
        })
    },
    formSubmit(e) {
        var that = this;
        util.request({
            url: '/api/abroad/add_content',
            method: 'POST',
            data: {
                "sid": app.globalData.schoolid,
                "name": e.detail.value.name,
                "mobile": e.detail.value.mobile
            },
            success: function(res) {
                if (res.data.code === 1) {
                    wx.showToast({
                        title: '申请成功',
                        duration: 2000
                    });
                    that.setData({
                        popup: false
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 2000,
                        icon: 'none'
                    });
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
    viewMajor() {
        this.setData({
            content: 3
        })
    },
    goConsult() {
        wx.navigateTo({
            url: '../consult/consult',
        })
    },
    show(e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        var index = e.currentTarget.dataset.index;
        var menuList = that.data.menuList;
        this.setData({
            content: type,
            menuList: menuList
        })
    },
    apply() {
        this.setData({
            popup: true
        })
    },
    close() {
        this.setData({
            popup: false
        })
    },
    fav() {
        var that = this;
        if (app.globalData.userInfo.id == 0) {
            that.setData({
                showLogin: true
            })
        } else {
            util.request({
                url: '/api/usercell/abroad_cell',
                method: 'POST',
                data: {
                    "id": app.globalData.schoolid,
                    "uid": app.globalData.userInfo.id
                },
                success: function(res) {
                    if (res.data.code == 1) {
                        const celled = that.data.celled;
                        if (celled) {
                            that.setData({
                                celled: false
                            })
                            wx.showToast({
                                title: res.data.msg,
                                duration: 2000
                            });
                        } else {
                            that.setData({
                                celled: true
                            })
                            wx.showToast({
                                title: res.data.msg,
                                duration: 2000
                            });
                        }
                    }
                }
            });
        }

    },
    selectVideo(e) {
        var that = this;
        var url = e.currentTarget.dataset.url;
        var title = e.currentTarget.dataset.title;
        var index = e.currentTarget.dataset.index;
        this.setData({
            currentVideo: url,
            currentVideoTitle: title,
            videoIndex: index
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if (options.id) {
            app.globalData.schoolid = options.id;
        }
        if (options.isretrue) {
            that.setData({
                isretrue: 1
            });
        }
        util.request({
            url: '/api/abroad/school_details',
            method: 'POST',
            data: {
                "id": app.globalData.schoolid,
                "uid": app.globalData.userInfo.id
            },
            success: function(res) {
                if (res.data.code === 1) {
                    if (res.data.video.length > 0) {
                        that.setData({
                            currentVideo: res.data.video[0].video_url,
                            currentVideoTitle: res.data.video[0].title,
                            isHaveVideo: true
                        })
                    }
                    if (res.data.info.cell == 1) {
                        that.setData({
                            celled: true
                        })
                    }
                    that.setData({
                        schoolid: app.globalData.schoolid,
                        info: res.data.info,
                        videoList: res.data.video,
                        introduce: res.data.info.introduce
                    })
                    if (that.data.schoolid === 1) {
                        var major = util.format(res.data.info.major)
                        WxParse.wxParse('major', 'html', major, that, 5);
                    }
                    if (that.data.schoolid === 2) {
                        that.setData({
                            info: res.data.info,
                        })
                    }
                    WxParse.wxParse('facility', 'html', res.data.info.facility, that, 5);
                    WxParse.wxParse('contact', 'html', res.data.info.contact, that, 5);
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
    returnHome: function(e) {
        wx.switchTab({
            url: '/pages/index/index',
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
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(ops) {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        if (app.globalData.schoolid === 2) {
            return {
                title: '校派',
                path: '/packageChoose/page/international/share/share-two?isretrue=1',
                imageUrl: 'https://zjnb.720pai.cn/mobile/images/share01.png', //用户分享出去的自定义图片大小为5:4,
                success: function(res) {
                    // 转发成功
                    wx.showToast({
                        title: "分享成功",
                        icon: 'success',
                        duration: 2000
                    })
                },
                fail: function(res) {
                    // 分享失败
                },
            }
        } else {
            return {
                title: '校派',
                path: '/packageChoose/page/international/share/share?isretrue=1',
                imageUrl: 'https://zjnb.720pai.cn/mobile/images/share01.png', //用户分享出去的自定义图片大小为5:4,
                success: function(res) {
                    // 转发成功
                    wx.showToast({
                        title: "分享成功",
                        icon: 'success',
                        duration: 2000
                    })
                },
                fail: function(res) {
                    // 分享失败
                },
            }
        }
    },
})