// packageChoose/page//classifie/detail/index.js
const app = getApp();
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
var WxParse = require('../../../../wxParse/wxParse.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailData: {},
        celled: 0,
        isshow: -1,
        celled: false,
        showLogin: false,
        showInfo: false,
        is_shoucang: 0, //收藏
        description: 0,
        is_show: true, //栏目显示消失，
        groupId: '', //群聊
        chatShow: false, //群聊显示
    },
    // 全景
    jumpvr(e) {
        var that = this;
        var vr_url = e.currentTarget.dataset.link;
        if (app.globalData.userInfo.id != 0) {
            wx.navigateTo({
                url: '../../public/webview/webview' + '?vr_url=' + vr_url
            })
        } else {
            that.setData({
                showLogin: true
            })
        }
    },
    //获取院校数据详情数据
    fetchSchoolDetail(sid, name) {
        var that = this;
        util.request({
            url: '/api/classifie/school_details',
            data: {
                'sid': sid,
                'school_name': name,
                uid: app.globalData.userInfo.id
            },
            method: 'post',
            success: (res) => {
                if (res.data.list.is_hot != 1) {
                    that.setData({
                        is_show: false
                    })
                };
                if (res.data.code === 1) {
                    WxParse.wxParse('txtNew', 'html', res.data.list.description, that, 5);
                    this.setData({
                        detailData: res.data.list,
                        description: res.data.list.description
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.list.name+app.globalData.topTitle+'院校详情',
                    })
                }
                if (res.data.list.is_shoucang == 1) {
                    this.setData({
                        celled: true
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
    isShow(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var showInfo = that.data.showInfo
        if (that.data.isshow == index) {
            this.setData({
                isshow: -1,
                // showInfo: true
            })
        } else {
            this.setData({
                isshow: index,
                // showInfo: true
            })
        }
    },
    // 进入历年数据详情
    gohistoryDetail(e) {
        var sid = e.currentTarget.dataset.detail.sid;
        var year = e.currentTarget.dataset.item.year;
        wx.navigateTo({
            url: '../fractionDetail/fractionDetail?year=' + year + "&sid=" + sid + '&name' + this.data.detailData.name,
        })
    },
    // 进入专业介绍详情
    gozsDetail(e) {
        var id = e.currentTarget.dataset.cid;
        wx.navigateTo({
            url: '/pages/career/details/baseinfo?id=' + id,
        })
    },
    //进入历年数据详
    gocalendarDetail(e) {
        var sid = e.currentTarget.dataset.sid;
        wx.navigateTo({
            url: '../fractionDetail/fractionDetail?sid=' + sid + '&name=' + this.data.detailData.name,
        })
    },
    // 进入学校介绍详情
    goAllDetail(e) {
        var sid = e.currentTarget.dataset.item.sid;
        wx.navigateTo({
            url: './allDetail/allDetail?sid=' + sid,
        })
    },
    // 进入学校环境详情
    goScienceDetail(e) {
        var sid = e.currentTarget.dataset.item.sid;
        wx.navigateTo({
            url: './scienceDetail/scienceDetail?sid=' + sid,
        })
    },
    //进入招生简章
    gogeneralRules(e) {
        var sid = e.currentTarget.dataset.sid;
        wx.navigateTo({
            url: './generalRules/generalRules?sid=' + sid,
        })
    },
    // 进入招生简章详情
    goruleDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: './rulesDetail/rulesDetail?id=' + id,
        })
    },
    // 进入题库详情
    goDetail(e) {
        var id = e.currentTarget.dataset.item.id;
        wx.navigateTo({
            url: '/packageChoose/page/classifie/historySubject/schoolSubjectDetail/schoolSubjectDetail?id=' + id,
        })
    },
    // 进入专业介绍
    goprofessional(e) {

        var sid = e.currentTarget.dataset.sid;
        wx.navigateTo({
            url: './professional/professional?sid=' + sid,
        })
    },
    // 进入校考题库
    goItemBank(e) {
        var sid = e.currentTarget.dataset.sid;
        wx.navigateTo({
            url: './itemBnak/itemBank?sid=' + sid,
        })
    },
    //分享按钮函数
    onShareAppMessage: function(ops) {
        var that = this;
        util.request({
            url: '/api/index/share',
            data: {
                uid: app.globalData.userInfo.id
            }
        });
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.share({
            objectType: 3,
            objectId: 107
        })
        var shareObj = {
            title: that.data.detailData.name + app.globalData.topTitle + '院校详情',
            path: '/packageChoose/page/classifie/hostdetail/index?id=' + app.globalData.schoolid,
            success: function(res) {},
            fail: function(res) {}
        };
        if (ops.from === 'button') {
            shareObj.title = that.data.detailData.name + app.globalData.topTitle + '院校详情';
            shareObj.path = '/packageChoose/page/classifie/hostdetail/index?id=' + app.globalData.schoolid
        }
        return shareObj;
    },
    //关注
    follow: function(e) {
        var that = this;
        // var sid = e.target.dataset.item.sid;
        var celled = that.data.celled;
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/usercell/school_cell',
                data: {
                    'uid': app.globalData.userInfo.id,
                    'school_id': e.target.dataset.item.sid,
                },
                method: 'post',
                success: function(res) {
                    if (celled) {
                        that.setData({
                            celled: false
                        })
                        wx.showToast({
                            title: "取消收藏",
                            duration: 2000
                        });
                    } else {
                        that.setData({
                            celled: true
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.globalData.schoolid = options.id;
        that.fetchSchoolDetail(options.id, options.name);
        //是否打开群聊
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
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 107
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut: 1,
            schoolId: app.globalData.schoolid,
            objectId: 107
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
            objectId: 107
        })
    },
    //    群聊
    chat(e) {
        var that = this;
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/school/group_chat',
                data: {
                    'sid': app.globalData.schoolid
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code == 1) {
                        that.setData({
                            groupId: res.data.accesskey
                        })
                    }
                    wx.navigateTo({
                        url: '../../ims/ims?groupId=' + that.data.groupId,
                    })
                }
            })
        } else {
            that.setData({
                showLogin: true
            })
        }
    }
})