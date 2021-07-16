var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({
    data: {
        tabs: [], //菜单
        activeIndex: 0,
        cf_type: 2, //判断进入是系统介绍还是学院介绍
        college: [], //学院或系部列表
        majorList: [], //专业列表
        isMajor:false,
        page:1
    },
    onLoad: function () {
        var that = this;
        util.request({
            url: '/api/saas/lists',
            data: {
                schoolid: app.globalData.schoolid,
                mark: 4,
            },
            success(res) {
                that.setData({
                    cf_type: res.data.cf_type,
                    tabs: res.data.tags,
                    college: res.data.college,
                    majorList: res.data.major
                })
            }
        })
    },
    tabClick: function (e) {
        if (e.currentTarget.id == 1){
            this.setData({
                isMajor: true
            });
        }else{
            this.setData({
                isMajor: false
            });
        }
        this.setData({
            activeIndex: e.currentTarget.id,
        });
    },
    //前往院系介绍的页面（有判断）
    goIntroduce(e) {
        if (this.data.cf_type === 3){
            var cid = e.currentTarget.dataset.cid;
            app.globalData.courtId = cid;
            //跳至专业介绍（该学校学院下仅有专业的时候）
            wx.navigateTo({
                url: '../majorinfo/majorinfo'
            })
        }
        if (this.data.cf_type === 2) {
            var cid = e.currentTarget.dataset.cid;
            app.globalData.courtId = cid;
            //跳至院介绍
            wx.navigateTo({
                url: '../yuanxiinfo/yuanxiinfo'
            })
        } 
        if (this.data.cf_type === 1) {
            var did = e.currentTarget.dataset.did;
            app.globalData.did = did;
            //跳至系介绍
            wx.navigateTo({
                url: '../xibuinfo/xibuinfo'
            })
        } 
    },
    //前往专业介绍
    goMajorInfo(e) {
        var mid = e.currentTarget.dataset.mid;
        app.globalData.majorId = mid
        var name = e.currentTarget.dataset.major;
        wx.navigateTo({
            url: '../zhuanyinfo/zhuanyinfo?name='+name
        })
    },
    /**
    * 页面上拉触底事件的处理函数
    */
    onReachBottom: function () {
        var that = this;
        if(that.data.isMajor){
            util.request({
                url: '/api/saas/major',
                data: {
                    schoolid: app.globalData.schoolid,
                    page:that.data.page
                },
                success(res) {
                    if (res.data.code == 1) {
                        var majorList = that.data.majorList.concat(res.data.major)
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
       
    },
    onShow() {
        count.calEnterTime(); //统计埋点-记录进入时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 410
            })
        } else {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 310
            })
        }
    },
    onHide() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 410
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 310
            })
        }
    },
    onUnload() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 410
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 310
            })
        }
    },
    onShareAppMessage: function (option) {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 410
            })
        } else {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 310
            })
        }
    },
});