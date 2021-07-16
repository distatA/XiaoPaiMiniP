//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({
    data: {
        uid: 0,
        slist: [],
        mlist: [],
        zlist: [],
        alist: [],
        tjcount: [],
        vlist: [],
        abroadlist: [],
        currentTab: 0,
        winHeight: "", //窗口高度    
    },
    onLoad() {

    },
    onShow: function(option) {
        var that = this;
        util.request({
            url: '/api/user/school_cell', //院校收藏
            data: {
                'uid': app.globalData.userInfo.id,
                'page': 1
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        slist: res.data.list,
                    });
                }
            }
        });
        wx.getSystemInfo({
            success: function(res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 180;
                that.setData({
                    wheight: calc
                });
            }
        });
    },
    //滑动切换
    swiperTab: function(e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        });
    },
    //点击切换
    clickTab: function(e) {
        var that = this;
        if (that.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            var index = e.target.dataset.current;
            if (index == 1) {
                var that = this;
                util.request({
                    url: '/api/user/career_cell', //专业收藏
                    data: {
                        'uid': app.globalData.userInfo.id,
                        'page': 1
                    },
                    method: 'post',
                    success: function(res) {
                        if (res.data.code == 1) {
                            that.setData({
                                mlist: res.data.list,
                            });
                        }
                    }
                });
            }
            if (index == 2) {
                var that = this;
                util.request({
                    url: '/api/user/job_cell', //职业收藏
                    data: {
                        'uid': app.globalData.userInfo.id,
                        'page': 1
                    },
                    method: 'post',
                    success: function(res) {
                        if (res.data.code == 1) {
                            that.setData({
                                zlist: res.data.list,
                            });
                        }
                    }
                });
            }
            if (index == 3) {
                var that = this;
                util.request({
                    url: '/api/user/news_cell', //文章收藏
                    data: {
                        'uid': app.globalData.userInfo.id,
                        'page': 1
                    },
                    method: 'post',
                    success: function(res) {
                        if (res.data.code == 1) {
                            that.setData({
                                alist: res.data.list,
                            });
                        }
                    }
                });
            }
            if (index == 4) {
                var that = this;
                util.request({
                    url: '/api/user/course_cell',
                    data: {
                        'uid': app.globalData.userInfo.id,
                        'page': 1
                    },
                    method: 'post',
                    success: function(res) {
                        if (res.data.code == 1) {
                            that.setData({
                                vlist: res.data.list,
                            });
                        }
                    }
                });
            }
            if (index == 5) {
                var that = this;
                util.request({
                    url: '/api/user/abroad_cell',
                    data: {
                        'uid': app.globalData.userInfo.id,
                        'page': 1
                    },
                    method: 'post',
                    success: function(res) {
                        if (res.data.code == 1) {
                            that.setData({
                                abroadlist: res.data.list,
                            });
                        }
                    }
                });
            }
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    bindzyTap: function(e) {
        var id = e.target.dataset.zyid
        wx.navigateTo({
            url: '../career/details/baseinfo?id=' + id,
        })

    },
    goDetails(e) {
        let id = e.currentTarget.dataset.id;
        let type = e.currentTarget.dataset.type;
        // 普通文章
        if (type == 1) {
            wx.navigateTo({
                url: '../../packageChoose/page/indexNews/indexNews?id=' + id,
            })
        }
        // 本专科文章
        if (type == 9) {
            wx.navigateTo({
                url: '../../packageChoose/page/public/newsdetail/newsdetail?id=' + id,
            })
        }

    },
    // 名师课堂
    goCourse(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../packageChoose/page/famousteach/recommend/recommend?key=' + id,
        })
    },
    //留学
    goAbroad(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../packageChoose/page/international/detail/detail?id=' + id,
        })
    },
    // 学校
    goSchool(e) {
        let id = e.currentTarget.dataset.id;
        let optimal = e.currentTarget.dataset.optimal;
        if (optimal==1) {
            wx.navigateTo({
                url: '../../packageChoose/page/public/index/index?id=' + id,
            })
        }else{
            wx.navigateTo({
                url: '../tabBar/school/details/details?id=' + id,
            })
        }

    }
})