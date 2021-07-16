//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
const count = require('../../../utils/count.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        showLogin: false,
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        currentTab: 0,
        menuList: ['双一流', '口碑院校', '中外合作', '热门专业', '本科资讯'],
        bannerList: [], //轮播图
        schoolList: [], //全国百强
        praiseList: [], //口碑院校
        zhwaiList: [], //中外合作
        majorList: [], //专业列表
        newsList: [], //新闻
        page: 1, //分页
        type: 1,

    },
    //详情
    goDetail(e) {
        var id = e.currentTarget.dataset.id;
        var praise = e.currentTarget.dataset.praise;
        if (praise === 1) {
            wx.navigateTo({
                url: '../public/index/index?id=' + id,
            })
        } else {
            wx.navigateTo({
                url: '/pages/tabBar/school/details/details?id=' + id,
            })
        }
    },
    // 轮播跳转
    goOther: function(e) {
        var that = this;
        let link = e.currentTarget.dataset.link;
        var media = e.currentTarget.dataset.type;
        var id = e.currentTarget.dataset.id; 
        count.calEnterTime(); //统计埋点-记录进入时间
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/ad/rotation_graduate',
            data: {
                "province": app.globalData.province.id,
            },
            method: 'post',
            success: function(res) {

                that.setData({
                    bannerList: res.data.banlist,
                })
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
        // 
       
    },
    onShow() {
        var that=this;
        util.request({
            url: '/api/optimi/index',
            data: {
                'key': 1,
                "uid": app.globalData.userInfo.id,
                "province": app.globalData.province.id,
            },
            success: function(res) {
                var newsList = res.data.news;
                for (var i = 0; i < newsList.length; i++) {
                    newsList[i].isThumb = false;
                }
                that.setData({
                    // bannerList: res.data.ad,
                    schoolList: res.data.school,
                    praiseList: res.data.praise,
                    zhwaiList: res.data.zhwai,
                    majorList: res.data.major,
                    newsList: newsList,
                    page: 1
                })
                if (wx.pageScrollTo) {
                    wx.pageScrollTo({
                     scrollTop: 0,
                     duration: 0
                    })
                }
                // console.log(that.data.schoolList)
                // console.log(that.data.page)
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            objectId: 301
        })
    },
    //收藏全国百强学校
    favorite(e) {
        var that = this;
        var schoolList = that.data.schoolList;
        var zhwaiList = that.data.zhwaiList;
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/usercell/school_cell',
                data: {
                    'school_id': e.currentTarget.dataset.schoolid,
                    'uid': app.globalData.userInfo.id
                },
                method: 'post',
                success: function(res) {
                    if (e.currentTarget.dataset.status) {
                        for (var i = 0; i < zhwaiList.length; i++) {
                            if (e.currentTarget.dataset.index == i) {
                                if (zhwaiList[i].cell == 1) {
                                    wx.showToast({
                                        title: '取消收藏',
                                        duration: 2000
                                    });
                                    zhwaiList[i].cell = 0;
                                } else {
                                    wx.showToast({
                                        title: '收藏成功',
                                        duration: 2000
                                    });
                                    zhwaiList[i].cell = 1;
                                }
                            }
                        }
                        that.setData({
                            zhwaiList: zhwaiList
                        })
                    } else {
                        for (var i = 0; i < schoolList.length; i++) {
                            if (e.currentTarget.dataset.index == i) {
                                if (schoolList[i].cell == 1) {
                                    wx.showToast({
                                        title: '取消收藏',
                                        duration: 2000
                                    });
                                    schoolList[i].cell = 0;
                                } else {
                                    wx.showToast({
                                        title: '收藏成功',
                                        duration: 2000
                                    });
                                    schoolList[i].cell = 1;
                                }
                            }
                        }
                        that.setData({
                            schoolList: schoolList
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
        } else {
            that.setData({
                showLogin: true
            })
        }

    },
    thumb(e) {
        var that = this;
        var newsid = e.currentTarget.dataset.newsid;
        var newsList = that.data.newsList;
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/optimi/zan',
                data: {
                    'id': newsid,
                },
                success: function(res) {
                    for (var i = 0; i < newsList.length; i++) {
                        if (e.currentTarget.dataset.index == i && newsList[i].isThumb == false) {
                            newsList[i].isThumb = true;
                            newsList[i].zan = res.data.zan;
                        }
                    }
                    that.setData({
                        newsList: newsList
                    })
                },
                fail: function(e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            });
        } else {
            that.setData({
                showLogin: true
            })
        }

    },
    //选择菜单
    selectMenu(e) {
        var index = e.currentTarget.dataset.current;
        if (index == 0) {
            this.setData({
                type: 1
            })

        }
        if (index == 1) {
            this.setData({
                type: 3
            })
            //口碑
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                objectId: 302
            })
        }
        if (index == 2) {
            this.setData({
                type: 2
            })
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                objectId: 303
            })
        }
        if (index == 3) {
            this.setData({
                type: 4
            })
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                objectId: 304
            })
        }
        if (index == 4) {
            this.setData({
                type: 5
            })
            //双一流/口碑
            count.calLeaveTime(); //统计埋点-记录离开时间
            count.statistics({
                objectType: 0,
                objectId: 305
            })
        }
        this.setData({
            currentTab: index,
            page: 1
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut:1,
            objectId: 301
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
            objectId: 301
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;
        if (that.data.type == 1 || that.data.type == 2 || that.data.type == 3) {
            util.request({
                url: '/api/optimi/more_school',
                data: {
                    type: that.data.type,
                    key: 1,
                    uid: app.globalData.userInfo.userid,
                    page: that.data.page,
                    province: app.globalData.province.id
                },
                success(res) {
                    if (res.data.code == 1) {
                        if (that.data.type == 1) {
                            var schoolList = that.data.schoolList.concat(res.data.data)
                            that.setData({
                                schoolList: schoolList,
                                page: that.data.page + 1
                            })
                        }
                        if (that.data.type == 2) {
                            var zhwaiList = that.data.zhwaiList.concat(res.data.data)
                            that.setData({
                                zhwaiList: zhwaiList,
                                page: that.data.page + 1
                            })
                        }
                        if (that.data.type == 3) {
                            var praiseList = that.data.praiseList.concat(res.data.data)
                            that.setData({
                                praiseList: praiseList,
                                page: that.data.page + 1
                            })
                        }
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
        }
        if (that.data.type == 4) {
            util.request({
                url: '/api/optimi/more_major',
                data: {
                    key: 1,
                    uid: app.globalData.userInfo.userid,
                    page: that.data.page
                },
                success(res) {
                    if (res.data.code == 1) {
                        var majorList = that.data.majorList.concat(res.data.data)
                        that.setData({
                            majorList: majorList,
                            page: that.data.page + 1
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
        }
        if (that.data.type == 5) {
            util.request({
                url: '/api/optimi/news',
                data: {
                    key: 1,
                    uid: app.globalData.userInfo.userid,
                    page: that.data.page,
                    province: app.globalData.province.id
                },
                success(res) {
                    if (res.data.code == 1) {
                        var newsList = that.data.newsList.concat(res.data.data)
                        that.setData({
                            newsList: newsList,
                            page: that.data.page + 1
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
        }

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
        count.share({
            objectType: 0,
            objectId: 301
        })
    }
})