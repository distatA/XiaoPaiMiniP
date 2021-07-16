// pages/hotMajor/hotMajor.js
const app = getApp();
const until = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        majorList:[],
        page:1,
        ellipsis: true,
        show:"",
        isShow:-1
    },
    // 点击展开收起
    ellipsis: function (e) {
        // console.log(e);
       var index=e.currentTarget.dataset.index;
       var majorList=this.data.majorList;
        var value = !this.data.ellipsis;
        majorList.map((item,i) => {
            
            if(index==i){
                item.show = false;
            }
            
        })
        this.setData({
            majorList: majorList,
            isShow:index
        })
    },
    //点击开设院校
    goopenSchool(e){
        // console.log(e)
        var cid = e.currentTarget.dataset.cid;
        var name = e.currentTarget.dataset.name
        wx.navigateTo({
            url: '../openSchool/openSchool?cid='+cid+'&name='+name,
        })
    },
    //获取专业数据
    fetchspecialty(){
        until.request({
            url: '/api/classifie/career_list',
            data: {
                'province': app.globalData.province.id
            },
            method: 'post',
            success: (res) => {

                if (res.data.code === 1) {
                    res.data.list.map((item) => {
                        item.show = true;                 
                    })
                    this.setData({
                        majorList: res.data.list
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchspecialty();
        wx.setNavigationBarTitle({
            title: app.globalData.topTitle + '热门专业',
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            objectId: 104
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut:1,
            objectId: 104
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut:1,
            objectId: 104
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var that = this;
        let page = that.data.page + 1;
        until.request({
            url: '/api/classifie/career_list',
            data: {
                'province': app.globalData.province.id,
                'page': page,
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    if (that.data.majorList.length < res.data.all_num) {
                        var majorList = that.data.majorList.concat(res.data.list)
                        that.setData({
                            majorList: majorList,
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
    onShareAppMessage: function () {
        count.share({
            objectType: 3,
            objectId: 104
        })
        return {
            title: app.globalData.topTitle + '热门专业',
            path: '/packageChoose/page/classifie/allschool/index'
        }
    }
})