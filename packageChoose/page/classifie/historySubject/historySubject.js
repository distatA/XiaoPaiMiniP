const app = getApp();
const util = require('../../../../utils/util.js');
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
        index: 0,
        policyList: [], //历年真题列表数据
        schoolLists: [], //校考题库学校列表数据
        page:1,
        cateId:"",
        name:"",
        provinceId:0
    },
    // 点击一级导航
    selectMenu(e) {
        var that = this;
        var id = e.currentTarget.dataset.item.id;
        var item = e.currentTarget.dataset.item;
        var index = e.currentTarget.dataset.index;
        if (item.child.length === 0) {//安徽
            that.setData({
                firstNavId: id,
                secondNavId: id,
                bottomNav: item.child,
                index: index
            })
        } else {//江苏
            let secondNavId = item.child[0].id
            that.setData({
                firstNavId: id,
                secondNavId: secondNavId,
                bottomNav: item.child,
                index: 0
            })

            this.fetchPolicyList(secondNavId);
        }
        //选择安徽的一级
        if (item.name === "考试大纲") {
            this.fetchPolicyList(id);
        }
        if (item.name === "校考题库") {
            this.fetchSchoolBank(id);
        }
        if (item.name === "文化测试真题") {
            this.fetchPolicyList(id);
        }
        this.setData({
            cateId: id,
            name:item.name
        })
        
    },
    // 点击二级导航
    choose(e) {
        var that = this;
        var id = e.currentTarget.dataset.item.id;
        var item = e.currentTarget.dataset.item;
        var index = e.currentTarget.dataset.index;
        that.setData({
            secondNavId: id,
            index: index
        });
        that.fetchPolicyList(id)
        this.setData({
            cateId: id,
            name: item.name
        })
    },

    goSearch() {
        wx.navigateTo({
            url: '../search/index?go=' + 2,
        })
    },
    goSchoolSubjectLIst(e) {
        var sid = e.currentTarget.dataset.item.sid;
        wx.navigateTo({
            url: '/packageChoose/page/classifie/hostdetail/itemBnak/itemBank?sid=' + sid,
        })
    },
    // 点击跳转到详情
    goSchoolSubject(e) {
        var sid = e.currentTarget.dataset.item.id;
        wx.navigateTo({
            url: './subjectDetail/subjectDetail?sid=' + sid,
        })
    },

    // 获取历年真题分类菜单数据
    fetchCate() {
        var that = this;
        util.request({
            url: '/api/classifie/question_cate',
            data: {
                'province': app.globalData.province.id,
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    // res.data.list.map((item) => {
                        that.setData({
                            bottomNav: res.data.list[0].child,
                            firstNavId: res.data.list[0].id
                        })
                    // })

                    if (that.data.bottomNav.length > 0) {//江苏
                        that.setData({
                            lists: res.data.list,
                            secondNavId: that.data.bottomNav[0].id
                        })
                        that.fetchPolicyList(that.data.secondNavId);
                    } else {//安徽
                        that.setData({
                            lists: res.data.list,
                            firstNavId: res.data.list[0].id,
                        })
                        that.fetchPolicyList(that.data.firstNavId);
                    }

                }
            }
        })
    },

    //获取历年真题列表数据
    fetchPolicyList(cate_id) {
        var that = this;
        util.request({
            url: '/api/classifie/question_list',
            data: {
                'province': app.globalData.province.id,
                'cate_id': cate_id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    that.setData({
                        policyList: res.data.list,
                    })
                }else{
                    let empty = []
                    that.setData({
                        policyList: empty,
                    })
                }
            }
        })
    },
    //获取校考题库学校列表数据
    fetchSchoolBank(cate_id) {
        var that = this;
        util.request({
            url: '/api/classifie/question_school',
            data: {
                'province': app.globalData.province.id,
                'cate_id': cate_id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        schoolLists: res.data.list,
                    })
                } else {
                    let empty = []
                    that.setData({
                        policyList: empty,
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            provinceId: app.globalData.province.id
        })
        this.fetchCate();
        wx.setNavigationBarTitle({
            title: app.globalData.topTitle+'历年真题'
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
            objectId: 105
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut:1,
            objectId: 105
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
            objectId: 105
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
        // 上拉加载事件
        var that = this;
        let page = that.data.page + 1;
        if (this.data.name =="校考题库"){
        util.request({
            url: '/api/classifie/question_school',
            data: {
                'province': app.globalData.province.id,
                'cate_id': this.data.cateId,
                'page': page,
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    if (that.data.schoolLists.length < res.data.all_num) {
                        var schoolLists = that.data.schoolLists.concat(res.data.list)
                        that.setData({
                            schoolLists: schoolLists,
                            page: page
                        })
                        wx.showToast({
                            title: '加载中...',
                            icon: 'loading'
                        })
                    }
                } else {
                    wx.showToast({
                        title: '没有更多',
                        icon: 'none'
                    })
                }

            }
        })
        }
        if (this.data.name == "考试大纲"||this.data.name=="文化测试真题") {
            util.request({
                url: '/api/classifie/question_list',
                data: {
                    'province': app.globalData.province.id,
                    'cate_id': this.data.cateId,
                    'page': page,
                },
                method: 'post',
                success: (res) => {
                    if (res.data.code === 1) {
                        if (that.data.policyList.length < res.data.all_num) {
                            var policyList = that.data.policyList.concat(res.data.list)
                            that.setData({
                                policyList: policyList,
                                page: page
                            })
                            wx.showToast({
                                title: '加载中...',
                                icon: 'loading'
                            })
                        }
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
    onShareAppMessage: function() {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.share({
            objectType: 3,
            objectId: 105
        })
        return{
            title:app.globalData.topTitle+'历年真题',
            path:'/packageChoose/page/classifie/historySubject/historySubject'
        }
    }
})