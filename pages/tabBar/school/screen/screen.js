 //index.js
//获取应用实例
const app = getApp()
const util = require('../../../../utils/util.js');
Page({
    data: {
        sclist: [],
        schooltype: [],
        reogin: [],
        xzsf: '',//选择省份
        xztype: '',//院校类型
        xzpc: '',//选择批次
        page: '',
        diqu: '',
        bkpc: '批次',
        yxname: '院校类型',//院校类型名称
        province: [],//省份
        city: [],//城市
        emptydata: "正在加载...",
        pici: [],
        dqArea: false,
        yxArea: false,
        pcArea: false,
        page: 1,
        // 
        proname:'',//当前省份或城市名称
        proname1:'',//无当前省份或城市时显示
        type:'',//省份还是城市
        xzcity:'',
        name:''//搜索的学校名
    },
    onPullDownRefresh: function() {

    },
    onLoad: function(option) {
        var that = this;
        let xzcity = option.city || that.data.xzcity;
        let xzsf= option.province|| that.data.xzsf;
        let institution_type = option.institution_type || that.data.xztype;
        let name = option.name||that.data.name
        util.request({
            url: '/api/School/get_school',
            data: {
                city: xzcity,
                province: xzsf,
                page: 1,
                feature_label: option.labe_id,
                institution_type: institution_type,
                name: name
            },
            success: function(res) {
                if (res.data.code == 1) {
                    // 列表数据
                    var sclist = res.data.list;
                    that.setData({
                        sclist: sclist,
                        xzsf: xzsf,
                        xzcity: xzcity,
                        institution_type: institution_type,
                        name: name
                    });
                } else {
                    that.setData({
                        sclist: [],
                        emptydata: "暂无数据",
                    });
                }
            },
        });
        // 搜索条件 
        // 城市信息
        util.request({
            url: '/api/School/condition_all_school',
            data: {
                city: option.city,
                province: xzsf,
            },
            success: function(res) {
                var type = res.data.type;
                if (res.data.code == 1) {
                    if (type == "province") {
                        that.setData({
                            proname1:'省份',
                            province: res.data.region
                        })
                    } else {
                        that.setData({
                            proname1: '城市',
                            city : res.data.region
                        })
                    }
                    that.setData({
                        schooltype: res.data.institution_type,
                        pici: res.data.arr,
                        proname: res.data.province,
                        type:type
                    });
                }
            }
        })
    },
    //前往学校详情
    goDetail(e) {
        var select = e.currentTarget.dataset.select;
        var id = e.currentTarget.dataset.id;
        if (select == 0) {
            wx.navigateTo({
                url: '../details/details?id=' + id,
            })
        }
        //本科优选
        if (select == 1) {
            app.globalData.schoolid = id
            wx.navigateTo({
                url: '../../../../packageChoose/page/public/index/index?id=' + id,
            })
        }
        //专科优选
        if (select == 2) {
            app.globalData.schoolid = id
            wx.navigateTo({
                url: '../../../packageChoose/page/public/index/index?id=' + id,
            })
        }
    },
    //点击切换隐藏和显示学校信息
    toggleBtn: function(event) {
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
    // 地区选择
    dqtoggle: function() {
        var that = this
        var dqArea = !that.data.dqArea;
        that.setData({
            dqArea: dqArea,
            yxArea: false,
            pcArea: false,
        })
    },
    // 院校类型
    yxtoggle: function() {
        var that = this
        var yxArea = !that.data.yxArea;
        that.setData({
            yxArea: yxArea,
            dqArea: false,
            pcArea: false,
        })
    },
    // 批次
    pctoggle: function() {
        var that = this
        var pcArea = !that.data.pcArea;
        that.setData({
            pcArea: pcArea,
            dqArea: false,
            yxArea: false,
        })
    },
    //筛选
    screen: function(e) {
        var that = this;
        var xzsf = e.currentTarget.dataset.aid || that.data.xzsf;//省份id
        var xzcity = e.currentTarget.dataset.cityid || that.data.xzcity;//城市id
        var proname = e.currentTarget.dataset.diqu || that.data.proname;//导航栏显示名称
        var xztype = e.currentTarget.dataset.scid || that.data.xztype;//院校类型id
        var yxname = e.currentTarget.dataset.yxname||that.data.yxname;//院校类型名称
        var xzpc = e.currentTarget.dataset.pcid || that.data.xzpc;//批次id
        var bkpc = e.currentTarget.dataset.bkpc || that.data.bkpc;//批次名称
        util.request({
            url: '/api/School/get_school',
            data: {
                city: xzcity,
                province: xzsf,
                page: 1,
                disciplinary_level: xzpc,
                institution_type:xztype
            },
            success: function(res) {
                if (res.data.code == 1) {
                    // 列表数据
                    that.setData({
                        sclist: res.data.list,
                        proname: proname,
                        yxname: yxname,
                        bkpc: bkpc,
                        xzsf: xzsf,
                        xzcity: xzcity,
                        xzpc: xzpc,
                        xztype: xztype,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                        name: '',
                        page:1
                    });
                } else {
                    that.setData({
                        proname: proname,
                        yxname: yxname,
                        bkpc: bkpc,
                        xzsf: xzsf,
                        xzcity: xzcity,
                        xzpc: xzpc,
                        xztype: xztype,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                        sclist: [],
                        page: 1,
                        emptydata: "抱歉，没有找到相关学校",
                        name: '',
                    });
                }
            },
        });
    },
    // 筛选全部批次
    screenPici(e){
        var that = this;
        var xzsf = e.currentTarget.dataset.aid || that.data.xzsf;//省份id
        var xzcity = e.currentTarget.dataset.cityid || that.data.xzcity;//城市id
        var proname = e.currentTarget.dataset.diqu || that.data.proname;//导航栏显示名称
        var xztype = e.currentTarget.dataset.scid || that.data.xztype;//院校类型id
        var yxname = e.currentTarget.dataset.yxname || that.data.yxname;//院校类型名称
        //var xzpc = e.currentTarget.dataset.pcid || that.data.xzpc;//批次id
        var bkpc = e.currentTarget.dataset.bkpc || that.data.bkpc;//批次名称
        util.request({
            url: '/api/School/get_school',
            data: {
                city: xzcity,
                province: xzsf,
                page: 1,
                institution_type: xztype
            },
            success: function (res) {
                if (res.data.code == 1) {
                    // 列表数据
                    that.setData({
                        sclist: res.data.list,
                        proname: proname,
                        yxname: yxname,
                        bkpc: bkpc,
                        xzsf: xzsf,
                        xzcity: xzcity,
                        xzpc: 0,
                        xztype: xztype,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                        name: '',
                        page: 1
                    });
                } else {
                    that.setData({
                        proname: proname,
                        yxname: yxname,
                        bkpc: bkpc,
                        xzsf: xzsf,
                        xzcity: xzcity,
                        //xzpc: xzpc,
                        xztype: xztype,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                        sclist: [],
                        page: 1,
                        name: '',
                        emptydata: "抱歉，没有找到相关学校",
                    });
                }
            },
        });
    },
    // 筛选全部院校类型
    screenYx(e){
        var that = this;
        var xzsf = e.currentTarget.dataset.aid || that.data.xzsf;//省份id
        var xzcity = e.currentTarget.dataset.cityid || that.data.xzcity;//城市id
        var proname = e.currentTarget.dataset.diqu || that.data.proname;//导航栏显示名称
        //var xztype = e.currentTarget.dataset.scid || that.data.xztype;//院校类型id
        var yxname = e.currentTarget.dataset.yxname || that.data.yxname;//院校类型名称
        var xzpc = e.currentTarget.dataset.pcid || that.data.xzpc;//批次id
        var bkpc = e.currentTarget.dataset.bkpc || that.data.bkpc;//批次名称
        util.request({
            url: '/api/School/get_school',
            data: {
                city: xzcity,
                province: xzsf,
                page: 1,
                disciplinary_level: xzpc,
            },
            success: function (res) {
                if (res.data.code == 1) {
                    // 列表数据
                    that.setData({
                        sclist: res.data.list,
                        proname: proname,
                        yxname: yxname,
                        bkpc: bkpc,
                        xzsf: xzsf,
                        xzcity: xzcity,
                        xzpc: xzpc,
                        xztype: 0,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                        name: '',
                        page: 1
                    });
                } else {
                    that.setData({
                        proname: proname,
                        yxname: yxname,
                        bkpc: bkpc,
                        xzsf: xzsf,
                        xzcity: xzcity,
                        //xzpc: xzpc,
                        xztype: xztype,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                        sclist: [],
                        name: '',
                        page: 1,
                        emptydata: "抱歉，没有找到相关学校",
                    });
                }
            },
        });
    },
    // 筛选全部城市
    screenCity(e){
        var that = this;
        var xzsf = e.currentTarget.dataset.aid || that.data.xzsf;//省份id
        //var xzcity = e.currentTarget.dataset.cityid || that.data.xzcity;//城市id
        var proname = e.currentTarget.dataset.diqu || that.data.proname;//导航栏显示名称
        var xztype = e.currentTarget.dataset.scid || that.data.xztype;//院校类型id
        var yxname = e.currentTarget.dataset.yxname || that.data.yxname;//院校类型名称
        var xzpc = e.currentTarget.dataset.pcid || that.data.xzpc;//批次id
        var bkpc = e.currentTarget.dataset.bkpc || that.data.bkpc;//批次名称
        util.request({
            url: '/api/School/get_school',
            data: {
                province: xzsf,
                page: 1,
                disciplinary_level: xzpc,
                institution_type: xztype
            },
            success: function (res) {
                if (res.data.code == 1) {
                    // 列表数据
                    that.setData({
                        sclist: res.data.list,
                        proname: proname,
                        yxname: yxname,
                        bkpc: bkpc,
                        xzsf: xzsf,
                        xzcity: 0,
                        xzpc: xzpc,
                        xztype: xztype,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                        name: '',
                        page: 1
                    });
                } else {
                    that.setData({
                        proname: proname,
                        yxname: yxname,
                        bkpc: bkpc,
                        xzsf: xzsf,
                        //xzcity: xzcity,
                        xzpc: xzpc,
                        xztype: xztype,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                        sclist: [], 
                        name: '',
                        page: 1,
                        emptydata: "抱歉，没有找到相关学校",
                    });
                }
            },
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        var xzsf = that.data.xzsf;//省份id
        var xzcity =  that.data.xzcity;//城市id
        var proname =  that.data.proname;//导航栏显示名称
        var xztype = that.data.xztype;//院校类型id
        var yxname =  that.data.yxname;//院校类型名称
        var xzpc = that.data.xzpc;//批次id
        var bkpc =  that.data.bkpc;//批次名称
        util.request({
            url: '/api/School/get_school',
            data: {
                city: xzcity,
                province: xzsf,
                page: that.data.page+1,
                disciplinary_level: xzpc,
                institution_type: xztype,
                name:that.data.name
            },
            success: function (res) {
                if (res.data.code == 1) {
                    // 列表数据
                    var sclist = that.data.sclist.concat(res.data.list)
                    that.setData({
                        sclist: sclist,
                        proname: proname,
                        yxname: yxname,
                        bkpc: bkpc,
                        xzsf: xzsf,
                        xzcity: xzcity,
                        xzpc: xzpc,
                        xztype: xztype,
                        page: that.data.page + 1,
                    })
                    wx.hideLoading()
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
            }
        })
    },
})