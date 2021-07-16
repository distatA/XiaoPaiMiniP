//index.js
//获取应用实例
const app = getApp();
const until = require('../../../utils/util.js');
var wxCharts = require("../../../utils/utils/wxcharts-min.js");
var windowW = 0;
Page({
    data: {
        showLogin: false,
        bank: [],
        data: [],
        celled: false, //收藏
        winHeight: "", //窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置  
        xzsf: '', //选择省份
        xztype: '', //院校类型
        xzpc: '', //选择批次
        page: 1,
        pici: [], //导航批次
        schooltype: [], //导航院校类型
        reogin: [], //导航地区
        dqArea: false,
        yxArea: false,
        pcArea: false,
        careerId: 0, //存储专业id
        diqu: '地区', //导航地区名称
        yxname: '院校类型', //导航院校类型名称
        bkpc: '批次', //导航批次名称
    },
    //进入院校详情。
    goDetail(e) {
        var select = e.currentTarget.dataset.selecting;
        var id = e.currentTarget.dataset.id;
        // if (select == 0) {
        wx.navigateTo({
            url: '../../tabBar/school/details/details?id=' + id,
        })
    },
    onLoad: function (options) {
        var that = this;
        that.setData({
            careerId: options.id
        })
    },
    onShow() {
        var that = this;
        //地区，院校类型，批次
        until.request({
            url: '/api/career/condition_school',
            method: 'post',
            success: function (res) {
                that.setData({
                    reogin: res.data.region,
                    schooltype: res.data.institution_type,
                    pici: res.data.arr
                });
            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常',
                    duration: 2000
                });
            }
        });
        //专业详情。
        until.request({
                url: '/api/career/detail',
                method: 'post',
                data: {
                    'id': that.data.careerId,
                    "uid": app.globalData.userInfo.id
                },
                success: function (res) {
                    if (res.data.code == 1) {
                        var data = res.data.detail;
                        var bank = res.data.bank;
                        var wages = res.data.wages;
                        var celled = res.data.bank.is_shoucang;
                        if (res.data.bank.is_shoucang === 0) {
                            celled: false;
                        }
                        else {
                            celled: true;
                        }
                        that.setData({
                            data: data,
                            bank: bank,
                            celled: celled
                        });

                        //折线图数据。
                        new wxCharts({
                            canvasId: 'lineCanvas',
                            type: 'line',
                            categories: ['应届生', '1-3年', '3-5年', '5-10年'],
                            animation: true,
                            background: '#f5f5f5',
                            series: [{
                                name: '薪资',
                                data: res.data.detail.wages,
                                format: function (val, name) {
                                    return val.toFixed(0) + 'K';
                                }
                            }],
                            xAxis: {
                                disableGrid: true
                            },
                            yAxis: {
                                format: function (val) {
                                    return val.toFixed(0);
                                },
                                min: 0
                            },
                            width: (375 * windowW),
                            height: (200 * windowW),
                            dataLabel: false,
                            dataPointShape: true,
                            extra: {
                                lineStyle: 'curve'
                            }
                        });

                    } else {
                        that.setData({
                            data: "",
                            bank: "",
                            celled: false
                        });
                        wx.showToast({
                            title: '努力完善中',
                            duration: 2000
                        });
                    }
                },
                fail: function (e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            }),
            /********/
            //专业，，相关学校数据
            until.request({
                url: '/api/career/career_school',
                method: 'post',
                data: {
                    'cid': that.data.careerId,
                    'page': 1,
                },
                success: function (res) {
                    if (res.data.code === 1) {
                        var school_list = res.data.school_list
                        that.setData({
                            cid: that.data.careerId,
                            school_list: school_list
                        });
                    }
                },
            })
        /*******/
        // wx.getSystemInfo({
        //     success: function (res) {
        //         var clientHeight = res.windowHeight,
        //             clientWidth = res.windowWidth,
        //             rpxR = 750 / clientWidth;
        //         var calc = clientHeight * rpxR - 180;
        //         that.setData({
        //             winHeight: calc
        //         });
        //     }
        // });
        // /*********折现图***********/
        // // 屏幕宽度
        // that.setData({
        //     imageWidth: wx.getSystemInfoSync().windowWidth,
        // });
        // //计算屏幕宽度比列
        // windowW = this.data.imageWidth / 375;
    },
    /*******************/
    //点击地区
    dqtoggle: function () {
        var that = this
        var dqArea = !that.data.dqArea;
        that.setData({
            dqArea: dqArea,
            yxArea: false,
            pcArea: false,
        })
    },
    //点击院校类型
    yxtoggle: function () {
        var that = this
        var yxArea = !that.data.yxArea;
        that.setData({
            yxArea: yxArea,
            dqArea: false,
            pcArea: false,
        })
    },
    //点击批次
    pctoggle: function () {
        var that = this
        var pcArea = !that.data.pcArea;
        that.setData({
            pcArea: pcArea,
            dqArea: false,
            yxArea: false,
        })
    },
    // 滚动切换标签样式
    switchTab: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
        //this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
        var that=this;
        var cur = e.target.dataset.current;
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
        if(this.data.currentTab==1){
            until.request({
                url: '/api/career/detail',
                method: 'post',
                data: {
                    'id': that.data.careerId,
                    "uid": app.globalData.userInfo.id
                },
                success: function (res) {
                    if (res.data.code == 1) {
                        var data = res.data.detail;
                        var bank = res.data.bank;
                        var wages = res.data.wages;
                        var celled = res.data.bank.is_shoucang;
                        if (res.data.bank.is_shoucang === 0) {
                            celled: false;
                        }
                        else {
                            celled: true;
                        }
                        that.setData({
                            data: data,
                            bank: bank,
                            celled: celled
                        });

                        //折线图数据。
                        new wxCharts({
                            canvasId: 'lineCanvas',
                            type: 'line',
                            categories: ['应届生', '1-3年', '3-5年', '5-10年'],
                            animation: true,
                            background: '#f5f5f5',
                            series: [{
                                name: '薪资',
                                data: res.data.detail.wages,
                                format: function (val, name) {
                                    return val.toFixed(0) + 'K';
                                }
                            }],
                            xAxis: {
                                disableGrid: true
                            },
                            yAxis: {
                                format: function (val) {
                                    return val.toFixed(0);
                                },
                                min: 0
                            },
                            width: (375 * windowW),
                            height: (200 * windowW),
                            dataLabel: false,
                            dataPointShape: true,
                            extra: {
                                lineStyle: 'curve'
                            }
                        });

                    } else {
                        that.setData({
                            data: "",
                            bank: "",
                            celled: false
                        });
                        wx.showToast({
                            title: '努力完善中',
                            duration: 2000
                        });
                    }
                }
            })
            wx.getSystemInfo({
                success: function (res) {
                    var clientHeight = res.windowHeight,
                        clientWidth = res.windowWidth,
                        rpxR = 750 / clientWidth;
                    var calc = clientHeight * rpxR - 180;
                    that.setData({
                        winHeight: calc
                    });
                }
            });
            /*********折现图***********/
            // 屏幕宽度
            that.setData({
                imageWidth: wx.getSystemInfoSync().windowWidth,
            });
            //计算屏幕宽度比列
            windowW = this.data.imageWidth / 375;
        }
    },
    //点击收藏
    shoucang: function (e) {
        var that = this;
        var sid = e.target.dataset.id;
        var celled = that.data.celled;
        if (app.globalData.userInfo.id != 0) {
            until.request({
                url: '/api/usercell/career_cell',
                data: {
                    'uid': app.globalData.userInfo.id,
                    'career_id': that.data.careerId,
                },
                method: 'post',
                success: function (res) {
                    if (celled) {
                        that.setData({
                            celled: false
                        })
                        wx.showToast({
                            title: "取消收藏",
                            duration: 2000
                        });
                    } else {
                        that.setData({
                            celled: true
                        })
                        wx.showToast({
                            title: "收藏成功",
                            duration: 2000
                        });
                    }
                },
                fail: function (e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            })
        } else {
            that.setData({
                showLogin: true
            })
        }
    },
    //筛选
    screen: function (e) {
        var that = this;
        var xzsf = e.currentTarget.dataset.aid || that.data.xzsf;
        var diqu = e.currentTarget.dataset.diqu || that.data.diqu;
        var xztype = e.currentTarget.dataset.scid || that.data.xztype;
        var yxname = e.currentTarget.dataset.yxname || that.data.yxname;
        var xzpc = e.currentTarget.dataset.pcid || that.data.xzpc;
        var bkpc = e.currentTarget.dataset.bkpc || that.data.bkpc;
        until.request({
            url: '/api/career/career_school',
            data: {
                "cid": that.data.careerId,
                'institution_type': xztype,
                'province': xzsf,
                'disciplinary_level': xzpc,
                page: 1
            },
            method: 'post',
            success: function (res) {
                var cid = that.data.careerId;
                if (res.data.code == 1) {
                    var school_list = res.data.school_list;
                    that.setData({
                        school_list: school_list,
                        xzsf: xzsf,
                        xztype: xztype,
                        xzpc: xzpc,
                        cid: cid,
                        diqu: diqu,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                    });
                } else {
                    that.setData({
                        school_list: "",
                        xzsf: xzsf,
                        xztype: xztype,
                        xzpc: xzpc,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false
                    });
                }
                that.setData({
                    diqu: diqu,
                    yxname: yxname,
                    bkpc: bkpc
                });

            },
        });
    },
    screenPici(e) {
        var that = this;
        var xzsf = e.currentTarget.dataset.aid || that.data.xzsf;
        var diqu = e.currentTarget.dataset.diqu || that.data.diqu;
        var xztype = e.currentTarget.dataset.scid || that.data.xztype;
        var yxname = e.currentTarget.dataset.yxname || that.data.yxname;
        //var xzpc = e.currentTarget.dataset.pcid || that.data.xzpc;
        var bkpc = e.currentTarget.dataset.bkpc || that.data.bkpc;
        until.request({
            url: '/api/career/career_school',
            data: {
                "cid": that.data.careerId,
                'institution_type': xztype,
                'province': xzsf,
                page: 1
            },
            method: 'post',
            success: function (res) {
                var cid = that.data.careerId;
                if (res.data.code == 1) {
                    var school_list = res.data.school_list;
                    that.setData({
                        school_list: school_list,
                        xzsf: xzsf,
                        xztype: xztype,
                        xzpc: 0,
                        cid: cid,
                        diqu: diqu,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                    });
                } else {
                    that.setData({
                        school_list: "",
                        xzsf: xzsf,
                        xztype: xztype,
                        // xzpc: xzpc,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false
                    });
                }
                that.setData({
                    diqu: diqu,
                    yxname: yxname,
                    bkpc: bkpc
                });

            },
        });
    },
    // 筛选全部院校类型
    screenYx(e) {
        var that = this;
        var xzsf = e.currentTarget.dataset.aid || that.data.xzsf;
        var diqu = e.currentTarget.dataset.diqu || that.data.diqu;
        //var xztype = e.currentTarget.dataset.scid || that.data.xztype;
        var yxname = e.currentTarget.dataset.yxname || that.data.yxname;
        var xzpc = e.currentTarget.dataset.pcid || that.data.xzpc;
        var bkpc = e.currentTarget.dataset.bkpc || that.data.bkpc;
        until.request({
            url: '/api/career/career_school',
            data: {
                "cid": that.data.careerId,
                'province': xzsf,
                'disciplinary_level': xzpc,
                page: 1
            },
            method: 'post',
            success: function (res) {
                var cid = that.data.careerId;
                if (res.data.code == 1) {
                    var school_list = res.data.school_list;
                    that.setData({
                        school_list: school_list,
                        xzsf: xzsf,
                        xztype: 0,
                        xzpc: xzpc,
                        cid: cid,
                        diqu: diqu,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false,
                    });
                } else {
                    that.setData({
                        school_list: "",
                        xzsf: xzsf,
                        // xztype: xztype,
                        xzpc: xzpc,
                        dqArea: false,
                        yxArea: false,
                        pcArea: false
                    });
                }
                that.setData({
                    diqu: diqu,
                    yxname: yxname,
                    bkpc: bkpc
                });

            },
        });
    },
    //分享按钮函数
    onShareAppMessage: function (ops) {
        var that = this;
        var shareObj = {
            title: '校派',
            path: '/pages/career/details/baseinfo?id=' + that.data.careerId,
            success: function (res) {
                // if (res.errMsg == 'shareAppMessage:ok') {
                //     console.log("转发成功:" + JSON.stringify(res));
                // }
            },
            fail: function (res) {
                // console.log("转发失败:" + JSON.stringify(res));
            }
        };
        if (ops.from === 'button') {
            var eData = ops.target.dataset;
            shareObj.title = eData.name;
            shareObj.path = '/pages/career/details/baseinfo?id=' + eData.id;
        }
        return shareObj;
    },
    //上拉加载。
    onReachBottom: function (e) {
        var that = this;
        var xzsf = that.data.xzsf;
        var diqu = that.data.diqu;
        var xztype = that.data.xztype;
        var yxname = that.data.yxname;
        var xzpc = that.data.xzpc;
        var bkpc = that.data.bkpc;
        if (that.data.currentTab == 2) {
            until.request({
                url: '/api/career/career_school',
                data: {
                    "cid": that.data.careerId,
                    'institution_type': xztype,
                    'province': xzsf,
                    'disciplinary_level': xzpc,
                    page: that.data.page + 1
                },
                success: function (res) {
                    if (res.data.code == 1) {
                        var cid = that.data.career_id;
                        var school_list = res.data.school_list
                        var nweArr = (that.data.school_list).concat(school_list);
                        that.setData({
                            cid: cid,
                            page: that.data.page + 1,
                            school_list: nweArr
                        });
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
                },
            })
        }
    }

})