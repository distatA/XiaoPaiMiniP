const app = getApp();
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        days: "",
        num: 12,
        page: 1,
        hostList: [], //热门学校
        policyList: [], //报考政策
        cheer_id: "0", //分类的id
        banlist:[],
        showExam:1,//0 不显示 1显示
        province: 0,
    },
    goExam(){
        wx.navigateTo({
          url: '../exam/index/index',
        })
    },
    goAd(e){
        let media = e.currentTarget.dataset.media;
        let link = e.currentTarget.dataset.link;
        let id = e.currentTarget.dataset.id;
        let schoolId = e.currentTarget.dataset.school_id;
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 1,
            objectId: id,
            schoolId: schoolId
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
    // 进入搜索页面
    goSearch(e) {
        // console.log(e);
        wx.navigateTo({
            url: '../search/index?go=' + 1,
        })
    },
    //进入热门院校详情
    goHostSchool(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../hostdetail/index?id=' + id,
        })
    },
    //进入历年真题share
    gohistorySubject() {
        var id = app.globalData.province.id;
        //   console.log(id)
        wx.navigateTo({
            url: '../historySubject/historySubject?id=' + id,
        })
    },
    //获取首页图片数据
    fetchbanner() {
        util.request({
            url: '/api/classifie/index',
            data: {
                'province': app.globalData.province.id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        days: res.data.list.str,
                        showExam: res.data.list.is_djs,
                    })
                    app.globalData.topTitle = res.data.list.fenlei_name
                }
                wx.setNavigationBarTitle({
                    title: res.data.list.fenlei_name
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

    //获取热门院系数据
    fetchHostSchool() {
        util.request({
            url: '/api/classifie/school_hot',
            data: {
                'province': app.globalData.province.id,
                'page': this.data.page,
                'num': this.data.num
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        hostList: res.data.list,
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(app.globalData.province.id)
        // console.log(this.data.province)
        this.setData({
            province: app.globalData.province.id
        })
        this.fetchbanner();
        this.fetchHostSchool();
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
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            objectId: 101
        })
        util.request({
            url: '/api/ad/rotation_class',
            data: {
                'province': app.globalData.province.id,
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        banlist: res.data.banlist,
                    })
                }
            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
            
    }, 

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut: 1,
            objectId: 101
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
            objectId: 101
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
        // 上拉加载事件
        var that = this;
        let page = that.data.page + 1;
        util.request({
            url: '/api/classifie/school_hot',
            data: {
                'province': app.globalData.province.id,
                'page': page,
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    if (that.data.hostList.length < res.data.all_num) {
                        var hostList = that.data.hostList.concat(res.data.list)
                        that.setData({
                            hostList: hostList,
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
            objectId: 101
        })
        return{
            title: app.globalData.topTitle,
            path:'/packageChoose/page/classifie/index/index'
        }
    }
})