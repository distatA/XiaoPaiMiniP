// packageChoose/page//classifie/fractionDetail/fractionDetail.js
const app = getApp();
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        details: [],
        item1: {},
        item2: {},
        item3: {},
        item4: {},
        index: 0,
        year: '',
        name:''
    },
    // 点击年份切换
    choose(e) {
        var that =this;
        var item1 = e.currentTarget.dataset.item.child1 || that.data.item1;
        var item2 = e.currentTarget.dataset.item.child2 || that.data.item2;
        var item3 = e.currentTarget.dataset.item.child3 || that.data.item3;
        var item4 = e.currentTarget.dataset.item.child4 || that.data.item4;
        var year = e.currentTarget.dataset.item.year;
        that.setData({
            year: year,
            item1: item1,
            item2: item2,
            item3: item3,
            item4: item4
        })

    },
    //获取历年数据
    // fetchhistoryData(sid, year) {

    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: app.globalData.province.id,
            name:options.name,
            // year: year
        })
        wx.setNavigationBarTitle({
            title: options.name+'历年数据',
        })
        app.globalData.schoolid = options.sid;
        util.request({
            url: '/api/classifie/score_list',
            data: {
                'sid': options.sid,
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        details: res.data.list,
                        year: res.data.list[0].year,
                        item1: res.data.list[0].child1,
                        item2: res.data.list[0].child2,
                        item3: res.data.list[0].child3,
                        item4: res.data.list[0].child4
                    })
                    // var list = res.data.list[0];
                    // list.forEach(item => {
                    //     if (item.year === year) {
                    //         this.setData({
                    //             item1: item.child1,
                    //             item2: item.child2,
                    //             item3: item.child3,
                    //             item4: item.child4
                    //         })
                    //     }
                    // })

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
            schoolId: app.globalData.schoolid,
            objectId: 109
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
            schoolId: app.globalData.schoolid,
            objectId: 109
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut: 1,
            schoolId: app.globalData.schoolid,
            objectId: 109
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
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        count.share({
            objectType: 3,
            schoolId: app.globalData.schoolid,
            objectId: 109
        })
        return{
            title: this.data.name + '历年数据',
            path:'/packageChoose/page/classifie/fractionDetail/fractionDetail?sid='+app.globalData.schoolid
        }
    }
})