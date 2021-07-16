const app = getApp();
const until = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        firstNavId: 0, //第一层id、
        secondNavId: 0, //第二层id
        lists: [],
        bottomNav: [],
        cate_id: 1, //报考政策id,
        index: 0,
        policyList: []
    },
    // 点击一级导航
    selectMenu(e) {
        var that = this;
        var id = e.currentTarget.dataset.item.id;
        var item = e.currentTarget.dataset.item;
        var index = e.currentTarget.dataset.index;
        if (item.child.length === 0) {
            that.setData({
                firstNavId: id,
                // secondNavId: id,
                // bottomNav: item.child,
                index: index
            })
            that.fetchPolicyList(id)
        } else {
            let secondNavId = item.child[0].id;
            that.setData({
                firstNavId: id,
                secondNavId: secondNavId,
                bottomNav: item.child,
                index: 0
            })
            that.fetchPolicyList(secondNavId);
        }
    },
    // 点击二级导航
    choose(e) {
        var that = this;
        var id = e.currentTarget.dataset.item.id;
        var index = e.currentTarget.dataset.index;
        that.setData({
            secondNavId: id,
            index: index
        })

        that.fetchPolicyList(id)
    },
    // 点击跳转到详情
    goPolicyDetail(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../policydetail/index?id=' + id,
        })
    },

    // 获取报考政策分类菜单数据
    fetchCate() {
        var that = this;
        until.request({
            url: '/api/classifie/policy_cate',
            data: {
                'province': app.globalData.province.id,
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    that.setData({
                        firstNavId: res.data.list[0].id
                    })
                    // res.data.list.map((item) => {
                    that.setData({
                        firstNavId: res.data.list[0].id,
                        bottomNav: res.data.list[0].child,
                    })
                    // })
                    if (that.data.bottomNav.length > 0) {
                        that.setData({
                            lists: res.data.list,
                            secondNavId: that.data.bottomNav[0].id
                        })

                        this.fetchPolicyList(that.data.secondNavId);
                    } else {
                        that.setData({
                            lists: res.data.list,
                            firstNavId: res.data.list[0].id,
                        })
                        that.fetchPolicyList(that.data.firstNavId);
                    }

                }
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        })
    },

    //获取报考政策列表数据
    fetchPolicyList(cate_id) {
        var that = this;
        until.request({
            url: '/api/classifie/policy_list',
            data: {
                'province': app.globalData.province.id,
                'cate_id': cate_id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    for (var i = 0; i < res.data.list.length; i++) {
                        WxParse.wxParse(`content[${i}]`, 'html', res.data.list[i].content, that, 5);
                    }
                    that.setData({
                        policyList: res.data.list,
                    })
                } else {
                    that.setData({
                        policyList: [],
                    })
                }
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        })
    },



    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.fetchCate()
        wx.setNavigationBarTitle({
            title: app.globalData.topTitle + '报考政策',
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
        count.calLeaveTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            objectId: 102
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        count.calLeaveTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            isOut: 1,
            objectId: 102
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        count.calLeaveTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            isOut: 1,
            objectId: 102
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        count.share({
            objectType: 3,
            objectId: 102
        })
        return {
            title: app.globalData.topTitle + '报考政策',
            url: '/packageChoose/page/classifie/policy/index'
        }
    }
})