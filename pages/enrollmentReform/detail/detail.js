const util = require('../../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        currentIndex: 1, //当前页面
        schoolList: [], //学校列表
        policyList: [], //政策解读列表
        page: 1,
        nav: [{
            id: 1,
            title: '全部高校'
        }, {
            id: 2,
            title: '报考流程'
        }, {
            id: 3,
            title: '政策解读'
        }],
        process: [{
            title: '招生对象及报名条件',
            info: '符合2020年全国普通高等学校招生全国统一考试报名条件，综合素质优秀或基础学科拔尖，并有志于将来从事相关领域科学技术工作的优秀高中生均可报名。'
        }, {
            title: '报名时间',
            info: '2020年5月10日至30日'
        }, {
            title: '报考方式',
            info: '考生可登录各高校强基计划报名平台'
        }, {
            title: '考生统一参加高考',
            info: '考生可登录各高校强基计划报名平台'
        }, {
            title: '高校考核',
            info: '在报考学校指定的地点参加校考'
        }, {
            title: '确认录取名单',
            info: '报考学校公布名单'
        }]
    },
    // 导航切换
    clickTab(e) {
        var that = this;
        that.setData({
            currentIndex: e.currentTarget.dataset.current
        })
    },
    // 学校详情页
    goSchool(e) {
        wx.navigateTo({
            url: '../school/school?id=' + e.currentTarget.dataset.id,
        })
    },
    // 政策解读详情
    goDetail(e) {
        wx.navigateTo({
            url: '../policy/policy?id=' + e.currentTarget.dataset.id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: '加载中···',
        })
        that.setData({
            currentIndex: options.id
        })
        //全部高校
        util.request({
            url: '/api/reform/school',
            data: {
                page: 1
            },
            success: function(res) {
                if (res.data.code == 1) {
                    wx.hideLoading()
                    that.setData({
                        schoolList: res.data.data
                    });
                } else {
                    wx.hideLoading()
                }
                console.log(that.data.schoolList)
            },
        });
        // 政策解读
        util.request({
            url: '/api/reform/policy',
            data: {
                page: 1
            },
            success: function(res) {
                if (res.data.code == 1) {
                    wx.hideLoading()
                    that.setData({
                        policyList: res.data.data
                    });
                } else {
                    wx.hideLoading()
                }
            },
        });
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
        var that = this;
        var page = that.data.page + 1;
        if (that.data.currentIndex == 1) {
            //全部高校
            util.request({
                url: '/api/reform/school',
                data: {
                    page: page
                },
                success: function(res) {
                    if (res.data.code == 1) {
                        if (that.data.schoolList.length < res.data.all_num) {
                            var schoolList = that.data.schoolList.concat(res.data.data)
                            // console.log(schoolList)
                            that.setData({
                                schoolList: schoolList,
                                page: page
                            });
                            console.log(that.data.schoolList)
                            console.log(that.data.page)
                        }
                    } else {
                        wx.showToast({
                            title: '没有更多',
                            icon: 'none'
                        })
                    }
                },
            });
        } else if (that.data.currentIndex == 3) {
            // 政策解读
            util.request({
                url: '/api/reform/policy',
                data: {
                    page: page
                },
                success: function(res) {
                    if (res.data.code == 1) {
                        if (that.data.policyList.length < res.data.all_num) {
                            var policyList = that.data.policyList.concat(res.data.data)
                            that.setData({
                                policyList: res.data.data,
                                page: page
                            });
                        }
                    } else {
                        wx.showToast({
                            title: '没有更多',
                            icon: 'none'
                        })
                    }
                },
            });
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})