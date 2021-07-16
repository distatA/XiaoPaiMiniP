    const app = getApp();
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        schoolLists: [],
        page: 1,
        num: 10,
        arrs: [],
        id:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    goSearch() {
        wx.navigateTo({
            url: '../search/index?go=' + 1,
        })
    },
    // 进入学校详情
    goschoolDetail(e) {
        var id = e.currentTarget.dataset.item.sid;
        wx.navigateTo({
            url: '../hostdetail/index?id=' + id,
        })
    },
    //获取院校列表数据
    fetchschoolList() {
        util.request({
            url: '/api/classifie/school_list',
            data: {
                'province': app.globalData.province.id,
                'page': this.data.page,
                'num': this.data.num
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        schoolLists: res.data.list,
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
    onLoad: function(options) {
        this.setData({
            id: app.globalData.province.id
        })
        this.fetchschoolList();
        wx.setNavigationBarTitle({
            title: app.globalData.topTitle + '全部院校',
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
            objectId: 103
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
            objectId: 103
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
            objectId: 103
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;
        let page = that.data.page + 1;
        util.request({
            url: '/api/classifie/school_list',
            data: {
                'province': app.globalData.province.id,
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
        count.share({
            objectType: 3,
            objectId: 103
        })
        return{
            title: app.globalData.topTitle + '全部院校',
            path:'/packageChoose/page/classifie/allschool/index'
        }
    }
})