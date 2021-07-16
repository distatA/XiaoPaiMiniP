// packageChoose/page//famousteach/recommend/recommend.js
const app = getApp()
const util = require('../../../../utils/util.js');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        autoplay: true,
        currentData: 0, //当前页面
        currentCourse: {}, //页面课程内容
        courseList: [], //推荐课程列表
        courseCatalog: [], //课程目录
        collected: false, //收藏
        page: 1,
        isFold: true, //课程介绍隐藏
    },
    //查看更多
    seeMore() {
        var that = this;
        that.setData({
            isFold: !this.data.isFold,
        })
    },
    // 点击切换
    tabClick: function(e) {
        var that = this;
        if (that.data.currentData === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentData: e.target.dataset.current
            });
        }
        if (that.data.currentData != 0) {
            util.request({
                url: '/api/course/directory',
                data: {
                    'pid': app.globalData.key,
                    'uid': app.globalData.userInfo.id,
                },
                method: 'post',
                success(res) {
                    if (res.data.code == 1) {
                        that.setData({
                            courseCatalog: res.data.data,
                            page:1
                        })
                    }
                }
            })
        }
    },
    // 课程目录点击切换 课程章节视频
    chapter: function(e) {
        var that = this;
        let cid = e.currentTarget.dataset.cid
        util.request({
            url: '/api/course/catalogue_view',
            data: {
                'cid': cid,
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        currentCourse: res.data.row
                    })

                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var key = options.key
        app.globalData.key = key
        var that = this;
        util.request({
            url: '/api/course/course_view',
            data: {
                'id': key,
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    var description = util.format(res.data.row.description)
                    WxParse.wxParse('txtNew', 'html', description, that, 5);
                    that.setData({
                        currentCourse: res.data.row,
                        courseList: res.data.list
                    })

                }
                if (res.data.cell == 1) {
                    that.setData({
                        collected: true
                    })
                }
            }
        })
    },
    //跳转视频
    goCourse: function(e) {
        var key = e.currentTarget.dataset.key;
        wx.navigateTo({
            url: '../recommend/recommend?key=' + key,
        })
    },
    // 视频结束判断
    endVedio(e) {
        var that = this;
        let cid = e.currentTarget.dataset.cid;
        util.request({
            url: '/api/course/callback',
            data: {
                'cid': cid,
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({

                    })

                }
            }
        })
    },
    // 视频收藏
    collect(e) {
        var that = this;
        var key = e.currentTarget.dataset.key
        util.request({
            url: '/api/usercell/course_cell',
            data: {
                'id': key,
                'uid': app.globalData.userInfo.id
            },
            method: 'post',
            success: function(res) {
                const collected = that.data.collected;
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
        var that = this
        let page = that.data.page + 1
        util.request({
            url: '/api/course/directory',
            data: {
                'uid': app.globalData.userInfo.id,
                'pid': app.globalData.key,
                'page': page,
            },
            success(res) {
                if (res.data.code == 1) {
                    var courseCatalog = that.data.courseCatalog.concat(res.data.data)
                    that.setData({
                        courseCatalog: courseCatalog,
                        page: page
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

            }
        })
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