//获取应用实例
const app = getApp();
const util = require('../../../utils/util.js');
Page({
    data: {
        testList: [1, 2, 3, 4, 5],
        banlist: [],
        scdqlist: [],
        institution: [],
        labe: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        beforeColor: "white",
        afterColor: "coral",
        showView: false,
        gaoxiao: 0,
        lexing: 0,
        select_area_hidden: true,
        select_area_name: '',
        select_area_aid: 0,
        imgurl: '',
        isKan: false,
        province:[],//省份列表
    },
    onLoad: function (options) {
        var that = this;
        util.request({
            url: '/api/School/condition_school',
            success: function (res) {
                // res.data.region 省信息
                // institution_type 筛选信息中的高校
                // region 筛选信息中的类型
                var institution = res.data.institution_type;
                var labe = res.data.feature_label;
                that.setData({
                    province: res.data.region,
                    institution: institution,
                    labe: labe,
                });
            }
        })
        wx.getLocation({
            success: function (res) {
                let longitude = res.longitude;
                let latitude = res.latitude;
                util.request({
                    url: '/api/login/prefecture',
                    data: {
                        longitude: longitude,
                        latitude: latitude
                    },
                    success: function (res) {
                        that.setData({
                            select_area_name: res.data.list.province,
                            select_area_aid: res.data.list.id
                        })
                        //轮播图广告
                        util.request({
                            url: '/api/ad/rotation_school',
                            data: {
                                province: res.data.list.id
                            },
                            success: function (res) {
                                var banlist = res.data.banlist;
                                that.setData({
                                    banlist: banlist,
                                    showView: false
                                });
                            },
                        });
                        // 筛选
                        util.request({
                            url: '/api/School/list_school',
                            data: {
                                province: res.data.list.id
                            },
                            success: function (res) {
                                var scdqlist = res.data.hotlist;
                                that.setData({
                                    scdqlist: scdqlist,
                                });
                            },
                        })
                    },
                })
            },
        })
    },
    onShow: function(options) {
        var that = this;

    },
    //前往学校详情
    goDetail(e) {
        var select = e.currentTarget.dataset.select;
        var id = e.currentTarget.dataset.id;
        if (select == 0) {
            wx.navigateTo({
                url: 'details/details?id=' + id,
            })
        }
        //本科优选
        if (select == 1) {
            app.globalData.schoolid = id
            wx.navigateTo({
                url: '../../../packageChoose/page/public/index/index?id=' + id,
            })
        }
        //专科优选
        if (select == 2) {
            app.globalData.schoolid = id;
            wx.navigateTo({
                url: '../../../packageChoose/page/public/index/index?id=' + id,
            })
        }
    },

    onChangeShowState: function() {
        var that = this;
        if (that.data.showView) {
            that.setData({
                showView: false
            })
        } else {
            that.setData({
                showView: true,
                select_area_hidden: true
            })
        }

    },
    screengx: function(e) {
        var that = this;
        var gaoxiao = e.currentTarget.dataset.gxid
        that.setData({
            gaoxiao: gaoxiao
        })
    },
    screenlx: function(e) {
        var that = this;
        var lexing = e.currentTarget.dataset.lxid
        that.setData({
            lexing: lexing
        })
    },
    formSubmit: function(e) {
        var name = e.detail.value.name
        wx.navigateTo({
            url: './screen/screen?name=' + name,
        })
    },


    formtype: function(e) {
        var that = this;
        var lexing = that.data.lexing;
        var gaoxiao = that.data.gaoxiao;
        var province = that.data.select_area_aid
        that.setData({
            showView: false
        });
        wx.navigateTo({
            url: './screen/screen?institution_type=' + gaoxiao + '&labe_id=' + lexing + '&province=' + province,
        });
    },

    formReset: function() {
        var that = this;
        that.setData({
            lexing: 0,
            gaoxiao: 0,
        })
    },
    // 轮播图
    openAdlink: function(e) {
        var that = this;
        let link = e.currentTarget.dataset.link;
        var media = e.currentTarget.dataset.type;
        var id = e.currentTarget.dataset.id;
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
    chooseAreas: function(e) {
        var that = this;
        if (that.data.select_area_hidden) {
            that.setData({
                select_area_hidden: false
            })
        } else {
            that.setData({
                select_area_hidden: true,
                showView: false
            })
        }
    },
    chooseAreaVal: function(e) {
        var that = this;
        var name = e.currentTarget.dataset.name;
        var aid = e.currentTarget.dataset.aid;
        that.setData({
            select_area_hidden: true,
            select_area_name: name,
            select_area_aid: aid
        })
        wx.showLoading({
            title: '加载中...',
        })
        util.request({
            url: '/api/School/list_school',
            data: {
                province: aid
            },
            success: function(res) {
                var scdqlist = res.data.hotlist;
                that.setData({
                    scdqlist: scdqlist,
                });
                wx.hideLoading();
            },
        })
    }
})