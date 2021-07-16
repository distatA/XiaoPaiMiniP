const app = getApp();

const util = require('../../utils/util.js');
Page({
    data: {
        imgsrc: '',
        timer: null,
        time: 3,
    },
    onLoad: function (option) {
        var that = this;
        //获取经纬度，进行定位
        wx.getLocation({
            success: function (res) {
                let longitude = res.longitude;
                let latitude = res.latitude;
                that.loadArea(longitude, latitude); //获取定位到的城市
            },
        })
    },
    //加载地区
    loadArea(longitude, latitude) {
        var that = this;
        util.request({
            url: '/api/login/prefecture',
            data: {
                longitude: longitude,
                latitude: latitude
            },
            success: function (res) {
                app.globalData.province = res.data.list; 
            },
        })
    },
    onShow: function() {
        this.setData({
            imgsrc: app.globalData.apiUrl + '/attach/splash_' + app.globalData.province.id + '.jpg',
        })
        this.bindLoad();
    },
    //预加载倒计时
    bindLoad() {
        var that = this;
        let timer = setInterval(function() {
            that.setData({
                time: --that.data.time
            })
        }, 1000);
        that.setData({
            timer: timer
        })
        setTimeout(function() {
            clearInterval(that.data.timer);
            that.goIndex();
        }, 3000)
    },
    goIndex() {
        wx.switchTab({
            url: '/pages/tabBar/index/index',
        })
    }
})