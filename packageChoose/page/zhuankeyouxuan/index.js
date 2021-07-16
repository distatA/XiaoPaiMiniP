// pages/benkeyouxuan/index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
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
        menuList: ['全国百强', '口碑院校', '中外合作', '热门专业', '专科资讯'],
        bannerList: [1, 2, 3, 4], //轮播图数组
        schoolList: [], //全国百强
        praiseList: [], //口碑院校
        zwaiList: [], //中外合作
        majorList: [], //专业列表
        newsList: [], //新闻
        page: 1, //分页
        type: 1,
        showLogin: false,
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
                url: '../../../pages/tabBar/school/details/details?id=' + id,
            })
        }
    },
    // 轮播跳转
    goOther: function(e) {
        var that = this;
        let link = e.currentTarget.dataset.link;
        var media = e.currentTarget.dataset.type;
        var id = e.currentTarget.dataset.id;
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
            url: '/api/ad/rotation_specialty',
            method: 'post',
            data: {
                "province": app.globalData.province.id,
            },
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
      
    },
    onShow() {
        var that=this;
        util.request({
            url: '/api/optimi/index',
            data: {
                'key': 2,
                "uid": app.globalData.userInfo.id,
                "province": app.globalData.province.id,
            },
            success: function(res) {
                var newsList = res.data.news;
                for (var i = 0; i < newsList.length; i++) {
                    newsList[i].isThumb = false;
                }
                that.setData({
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
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
    },
    //收藏学校
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
    //点赞收藏（有bug）
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
        }
        if (index == 2) {
            this.setData({
                type: 2
            })
        }
        if (index == 3) {
            this.setData({
                type: 4
            })
        }
        if (index == 4) {
            this.setData({
                type: 5
            })
        }
        this.setData({
            currentTab: index,
            page: 1
        })
    },

    //口碑院校详情
    goPublicIndex() {
        wx.navigateTo({
            url: '../public/index/index',
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },


    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        // this.setData({
        //     page:1
        // })
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
        wx.showToast({
            title: '正在刷新',
            icon: 'loading'
        })
        var that = this;
        if (that.data.type == 5) {
            util.request({
                url: '/api/optimi/more_news',
                data: {
                    key: 2,
                    id: that.data.newsList[0].id,
                    province: app.globalData.province.id
                },
                success(res) {
                    if (res.data.code == 1) {
                        var newsList = res.data.data.concat(that.data.newsList)
                        that.setData({
                            newsList: newsList,
                            page: that.data.page + 1
                        })

                    }
                }
            })
        }
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 2000)
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
                    key: 2,
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
                    key: 2,
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
                    key: 2,
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
                            icon: ''
                        })
                    }
                }
            })
        }
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