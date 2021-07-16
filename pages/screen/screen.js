//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({
    data: {
        sclist: [],
        schooltype: [],
        reogin: [],
        xzsf: 0,
        xztype: 0,
        xzpc: 0,
        page: 0,
        diqu: '',
        bkpc: '',
        yxname: '',
        province: [],
        city: [],
        emptydata: "正在加载...",
        pici: [{
            'id': 1,
            'name': '一本'
        },
        {
            'id': 2,
            'name': '二本'
        },
        {
            'id': 4,
            'name': '专科'
        }
        ],
        dqArea: false,
        yxArea: false,
        pcArea: false
    },
    onPullDownRefresh: function () {
        this.onLoad()
    },
    onLoad: function (option) {
        var that = this;
        var dqArea = false;
        var yxArea = false;
        var pcArea = false;
        var pici = that.data.pici;
        that.setData({
            pici: pici,
            dqArea: dqArea,
            yxArea: yxArea,
            pcArea: pcArea,
        });

        util.request({
            url:'/api/School/get_school',
            data: {
                'name': option.name,
                'institution_type': option.institution_type,
                'province': option.province,
                'city': option.city,
                'disciplinary_level': option.disciplinary_level,
                'labe_id': option.labe_id,
            },
            method: 'post',
            success: function (res) {
                
                if (res.data.code == 1) {
                    var sclist = res.data.list;
                    var xztype = res.data.sc_type;
                    var xzpc = res.data.pici;
                    var xzsf = res.data.province;
                    var xzcity = res.data.city;

                    that.setData({
                        sclist: sclist,
                        xzsf: xzsf,
                        xzcity: xzcity,
                        xztype: xztype,
                        emptydata: ''
                    });
                } else {
                    var xzsf = res.data.province;
                    var xztype = res.data.sc_type;
                    var xzpc = res.data.pici;
                    that.setData({
                        sclist: [],
                        xzsf: xzsf,
                        xztype: xztype,
                        xzpc: xzpc,
                        emptydata: "暂无数据",
                    });
                }
            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            }
        });

        //院校类型
        wx.request({
            url: app.globalData.hostNewApiUrl + '/school/get_school_type',
            method: 'post',
            success: function (res) {
                var schooltype = res.data.list;
                that.setData({
                    schooltype: schooltype,
                });

            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            }
        });
        //地区
        wx.request({
            url: app.globalData.hostNewApiUrl + '/school/get_reogin2',
            method: 'post',
            data: {
                'province': option.province,
                'city': option.city,
            },
            success: function (res) {
                var province = [];
                var city = [];
                var type = res.data.type;
                var proname = res.data.province

                if (type == "province") {
                    province = res.data.list;
                } else {
                    city = res.data.list;
                }
                that.setData({
                    proname: proname,
                    province: province,
                    city: city
                });

            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            }
        });
    },
    //前往学校详情
    goDetail(e) {
        var select = e.currentTarget.dataset.select;
        var id = e.currentTarget.dataset.id;
        // if (select == 0) {
            wx.navigateTo({
                url: '../tabBar/school/details/details?id=' + id,
            })
        // }
        //本科优选
    //     if (select == 1) {
    //         app.globalData.schoolid = id
    //         wx.navigateTo({
    //             url: '../../../packageChoose/page/public/index/index?id=' + id,
    //         })
    //     }
    //     //专科优选
    //     if (select == 2) {
    //         app.globalData.schoolid = id
    //         wx.navigateTo({
    //             url: '../../../packageChoose/page/public/index/index?id=' + id,
    //         })
    //     }
     },
    //点击切换隐藏和显示
    toggleBtn: function (event) {
        var that = this;
        var toggleBtnVal = that.data.uhide;
        var itemId = event.currentTarget.id;
        if (toggleBtnVal == itemId) {
            that.setData({
                uhide: 0
            })
        } else {
            that.setData({
                uhide: itemId
            })
        }
    },
    dqtoggle: function () {
        var that = this
        var dqArea = !that.data.dqArea;
        that.setData({
            dqArea: dqArea,
            yxArea: false,
            pcArea: false,
        })
    },

    yxtoggle: function () {
        var that = this
        var yxArea = !that.data.yxArea;
        that.setData({
            yxArea: yxArea,
            dqArea: false,
            pcArea: false,
        })
    },

    pctoggle: function () {
        var that = this
        var pcArea = !that.data.pcArea;
        that.setData({
            pcArea: pcArea,
            dqArea: false,
            yxArea: false,
        })
    },
    //筛选
    screen: function (e) {
        var that = this;
        var xzsf = e.currentTarget.dataset.aid;
        var xzcity = e.currentTarget.dataset.cityid;
        var proname = e.currentTarget.dataset.diqu;
        var xztype = e.currentTarget.dataset.scid;
        var yxname = e.currentTarget.dataset.yxname;
        var xzpc = e.currentTarget.dataset.pcid;
        var bkpc = e.currentTarget.dataset.bkpc;
        that.setData({
            xzpc: xzpc
        })
        wx.request({
            url: app.globalData.hostNewApiUrl + '/school/get_school',
            data: {
                'institution_type': xztype,
                'province': xzsf,
                'city': xzcity,
                'disciplinary_level': xzpc,
            },
            method: 'post',
            success: function (res) {
                if (res.data.code == 1) {
                    var sclist = res.data.list;
                    var xzsf = res.data.province;
                    var xzcity = res.data.city;
                    var xztype = res.data.sc_type;
                    // var xzpc = res.data.pici;
                    that.setData({
                        sclist: sclist,
                        xzsf: xzsf, //省份
                        xzcity: xzcity, //城市
                        xztype: xztype,
                        xzpc: xzpc,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false
                    });

                } else {
                    var xzsf = res.data.province;
                    var xztype = res.data.sc_type;
                    var xzpc = res.data.pici;
                    that.setData({
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                        sclist: [],
                        xzsf: xzsf,
                        xztype: xztype,
                        xzpc: xzpc,
                        emptydata: "抱歉，没有找到相关学校",
                    });
                }
                that.setData({
                    proname: proname,
                    yxname: yxname,
                    bkpc: bkpc
                });
            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            }
        });
    },
    addduibi: function (e) {
        var that = this;
        var ssid = e.currentTarget.dataset.ssid;
        var ssids = ',' + ssid;
        if (app.globalData.school_strid.indexOf(ssids) > 0) {
            wx.showToast({
                title: '已添加',
                duration: 2000
            });
            return;
        }
        app.globalData.school_strid = app.globalData.school_strid + ssids;

        wx.navigateTo({
            url: '../volist/volist',
        })
    },
})