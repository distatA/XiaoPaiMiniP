//获取应用实例
const app = getApp()
var WxParse = require('../../../../wxParse/wxParse.js');
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({
    data: {
        menu: [{
            id: 1,
            name: "院校信息"
        }, {
            id: 2,
            name: "招生简章"
        }, {
            id: 3,
            name: "开设专业"
        }, {
            id: 4,
            name: "奖助学金"
        }],
        id: 0,
        info: [],
        indata: [],
        currentTab: 0,
        winHeight: "", //窗口高度
        jianzhang: [],
        college_list: [],
        uhide: 0,
        isretrue: 0,
        vr_url: '', //存储全景地址
        collected: false, //收藏
        // groupId: '', // 群密钥
        // chatShow: false, //群聊图标显示
        showLogin: false,
    },
    onLoad: function(option) {
        var that = this;
        if (option.isretrue) {
            that.setData({
                isretrue: 1
            });
        }
        app.globalData.schoolid = option.id
        // 是否开通群聊
        util.request({
            url: '/api/school/group_chat',
            data: {
                'sid': app.globalData.schoolid
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        chatShow: true,
                    })
                } else {
                    chatShow: false
                }
            }
        })
    },
    onShow: function() {
        var that = this;
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 501
        })
        util.request({
                url: '/api/School/details_one',
                data: {
                    id: app.globalData.schoolid,
                    uid: app.globalData.userid,
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code == 1) {
                        var info = res.data.info;
                        var indata = res.data.data;
                        if (indata.description) {
                            var description = indata.description;
                            WxParse.wxParse('description', 'html', description, that, 3);
                        }
                        if (indata.scholarships) {
                            var scholarships = indata.scholarships
                            WxParse.wxParse('scholarships', 'html', scholarships, that, 5);
                        }
                        wx.setNavigationBarTitle({
                            title: res.data.info.name
                        })
                        that.setData({
                            info: info,
                            vr_url: info.linkurl,
                            indata: indata,
                        });
                    }
                    if (res.data.info.is_shoucang == 1) {
                        that.setData({
                            collected: true
                        })
                    }
                },
                fail: function(e) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            }),
            wx.getSystemInfo({
                success: function(res) {
                    var clientHeight = res.windowHeight,
                        clientWidth = res.windowWidth,
                        rpxR = 750 / clientWidth;
                    var calc = clientHeight * rpxR - 200;
                    that.setData({
                        wheight: calc
                    });
                }
            });

        //记录访问记录
        let schoolid = app.globalData.schoolid;
        let pageid = that.data.currentTab + 1;
    },
    /**
     * 监听页面隐藏
     *    当前页面调到另一个页面时会执行
     */
    onHide: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 501,
            isOut: 1,
        })
    },
    onUnload: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 501,
            isOut: 1,
        })
    },
    //点击切换
    clickTab: function(e) {
        var that = this;
        if (that.data.currentTab == 0) {
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 502
            })
        } else if (that.data.currentTab == 1) {
            console.log(that.data.currentTab)
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 503
            })
        } else if (that.data.currentTab == 2) {
            console.log(that.data.currentTab)
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 504
            })
        }
        if (that.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            });
            if (e.target.dataset.current == 2 || e.target.dataset.current == 1) {
                util.request({
                    url: '/api/school/details_two',
                    data: {
                        'id': that.data.info.id,
                    },
                    method: 'post',
                    success: function(res) {
                        if (res.data.code == 1) {
                            var jianzhang = res.data.enrollment;
                            for (var i = 0; i < jianzhang.length; i++) {
                                if (jianzhang[i].content) {
                                    WxParse.wxParse(`enrollment[${i}]`, 'html', jianzhang[i].content, that, 5);
                                }
                            }
                            var career_list = res.data.career_list;
                            that.setData({
                                school_special: career_list,
                                jianzhang
                            });
                            wx.hideLoading();
                        } else {
                            wx.hideLoading();
                        }
                    },
                    fail: function(e) {
                        wx.showToast({
                            title: '网络异常！',
                            duration: 2000
                        });
                    },
                })
            }

        }

        //记录访问记录
        let schoolid = that.data.info.id;
        let pageid = that.data.currentTab + 1;
    },
    shoucang: function(e) { //学校收藏于4.15修改 
        var that = this;
        const collected = that.data.collected;
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/usercell/school_cell',
                data: {
                    'school_id': e.currentTarget.dataset.id,
                    'uid': app.globalData.userid
                },
                method: 'post',
                success: function(res) {
                    if (collected) {
                        that.setData({
                            collected: false
                        })
                        wx.showToast({
                            title: "取消收藏",
                            duration: 2000
                        });
                    } else {

                        that.setData({
                            collected: true
                        })
                        wx.showToast({
                            title: "收藏成功",
                            duration: 2000
                        });
                    }
                },
                fail: function(e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            })
        } else {
            that.setData({
                showLogin: true
            })
        }

    },
    //点击切换隐藏和显示
    toggleBtn: function(event) {
        var that = this;
        var toggleBtnVal = that.data.uhide;
        var itemId = event.currentTarget.id;
        if (toggleBtnVal == itemId) {
            that.setData({
                uhide: 0
            })
        } else {
            that.setData({
                uhide: itemId
            })
        }
    },
    jumpvr: function() {
        var that = this;
        // var vr_url = that.data.info.linkurl;
        var vr_url = that.data.vr_url;
        if (vr_url) {
            if (app.globalData.userInfo.id != 0) {
                wx.navigateTo({
                    url: '../../../../packageChoose/page/public/webview/webview' + '?vr_url=' + vr_url
                })
            } else {
                that.setData({
                    showLogin: true
                })
            }
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 505
            })
        }
        //记录访问记录
        let schoolid = that.data.info.id;
        let pageid = 6;
    },
    //分享按钮函数
    onShareAppMessage: function(ops) {
        var that = this;
        count.share({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 501
        })
        var shareObj = {
            title: that.data.info.name,
            path: '/pages/tabBar/school/details/details?id=' + that.data.info.id + '&isretrue=1',
            success: function(res) {
                if (res.errMsg == 'shareAppMessage:ok') {}
            },
            fail: function(res) {
                // console.log("转发失败:" + JSON.stringify(res));
            }
        };
        if (ops.from === 'button') {
            var eData = ops.target.dataset;
            shareObj.title = eData.name;
            shareObj.path = '/pages/tabBar/school/details/details?id=' + eData.id + '&isretrue=1';
        }
        return shareObj;
    },

    catchTouchMove: function(res) {
        return false
    },
    // 群聊
    // chat(e) {
    //     var that = this;
    //     if (app.globalData.userInfo.id != 0) {
    //         util.request({
    //             url: '/api/school/group_chat',
    //             data: {
    //                 'sid': app.globalData.schoolid
    //             },
    //             method: 'post',
    //             success: function (res) {
    //                 if (res.data.code == 1) {
    //                     that.setData({
    //                         groupId: res.data.accesskey
    //                     })
    //                 }
    //                 wx.navigateTo({
    //                     url: '../../../../packageChoose/page/ims/ims? groupId=' + that.data.groupId,
    //                 })

    //             }
    //         })
    //     } else {
    //         that.setData({
    //             showLogin: true
    //         })
    //     }
    // },
    score() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 506
        })
        wx.navigateTo({
            url: '../scores/scores',
        })
    },
    plan(e) {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 506
        })
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../scores/scores?id=' + id,
        })
    }
});