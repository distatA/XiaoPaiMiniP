// packageChoose/page//international/index/index.js
const app = getApp();
const until = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots:true,
        // swiperCurrent:0,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        adList:[],
        schoolList:[],
        isretrue:0
    },
    goDetail(e){
        var id = e.currentTarget.dataset.id;
        app.globalData.schoolid = id;
        wx.navigateTo({
            url: '../detail/detail',
        })
    },
    goAd(e) {
        let media = e.currentTarget.dataset.media;
        let link = e.currentTarget.dataset.link;
        console.log(link)
        let id = e.currentTarget.dataset.id;
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
    //分享按钮函数
    onShareAppMessage: function (ops) {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
            return {
                title: '校派',
                path: '/packageChoose/page/international/share/share?isretrue=1',
                imageUrl: 'https://zjnb.720pai.cn/mobile/images/share01.png',  //用户分享出去的自定义图片大小为5:4,
                success: function (res) {
                    // 转发成功
                    wx.showToast({
                        title: "分享成功",
                        icon: 'success',
                        duration: 2000
                    })
                },
                fail: function (res) {
                    // 分享失败
                },
            }
        
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (options.isretrue) {
            that.setData({
                isretrue: 1
            });
        }
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
        var that = this;
        //轮播部分
        until.request({
          url: '/api/ad/rotation_abroad',
            method: 'post',
            data: {
              // "province": that.area.pid,
            },
            success: function (res) {
                that.setData({
                    adList: res.data.banlist,
                })
            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
        //列表部分。
        until.request({
          url:'/api/abroad/index',
            method: 'POST',
            success: function (res) {
                if (res.data.code === 1) {
                    that.setData({
                        // adList: res.data.ad,
                        schoolList: res.data.list
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
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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

    },

    
})