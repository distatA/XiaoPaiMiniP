//index.js
//获取应用实例
const app = getApp()
var wxCharts = require("../../../utils/utils/wxcharts-min.js");
const util = require('../../../utils/util.js');
const WxParse = require('../../../wxParse/wxParse.js');
Page({
    data: {
        showLogin: false, //登录
        banlist: [],
        ceshiList: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        beforeColor: "#666",
        afterColor: "coral",
        showView: true,
        istestres: 0,
        istestres2: 0,
        jump: 0,
        gxurl: '',
        zyurl: '',
        xinlidata: [],
        xinlizongti: [],
        jobdata: [],
        jobmodel: [],
        intdata: [],
        subdata: [],
        actcolor1: '',
        bgcolor1: '',
        actcolor2: '',
        bgcolor2: '',
        actcolor3: '',
        bgcolor3: '',
        actcolor4: '',
        bgcolor4: '',
        currentTab: 0
    },
    onLoad: function(options) {
        var xinlijump = '';
        var intjump = '';
        var jobjump = '';
        var subjump = '';
        var that = this;
        wx.getStorage({
            key: "isbanad",
            success: function(res) {
                that.setData({
                    isbanad: res.data
                });
            },
        })
        if (that.data.isbanad == 1) {
            // 兴趣
            xinlijump = '../../career/quest/index';
            // 职业
            intjump = '../../career/quest/int';
            // 性格
            jobjump = '../../career/quest/job';
            // 学科强弱
            subjump = '../../career/quest/sub';
        } else {
            xinlijump = '../../career/swiper/index?type=1';
            intjump = '../../career/swiper/index?type=2';
            jobjump = '../../career/swiper/index?type=3';
            subjump = '../../career/swiper/index?type=4';
        }
        var zyurl = '';
        var gxurl = '';
        that.setData({
            zyurl: zyurl,
            gxurl: gxurl,
            xinlijump: xinlijump,
            intjump: intjump,
            jobjump: jobjump,
            subjump: subjump,
        });

        //广告轮播图
        util.request({
            url: '/api/ad/rotation_career',
            data: {
                province: app.globalData.province.id
            },
            success: function(res) {
                var banlist = res.data.banlist;
                that.setData({
                    banlist: banlist
                });
            },
        });
        // 生涯轮播图数据
        util.request({
            url: '/api/test/test_list',
            data: {
                province: app.globalData.province.id
            },
            success: function(res) {
                if (res.data.code == 1) {
                    WxParse.wxParse('xq', 'html', res.data.list[0].explain, that, 5);
                    WxParse.wxParse('xg', 'html', res.data.list[1].explain, that, 5);
                    WxParse.wxParse('zy', 'html', res.data.list[2].explain, that, 5);
                    WxParse.wxParse('xk', 'html', res.data.list[3].explain, that, 5);
                    that.setData({
                        ceshiList: res.data.list
                    });
                }
            },
        })
        wx.getSystemInfo({
            success: function(res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 180;
                that.setData({
                    winHeight: calc
                });
            }
        });

    },
    //前往测试
    goTest(e) {
        if (app.globalData.userInfo.id != 0) {
            var type = e.currentTarget.dataset.type
            if (type == 1) {
                //兴趣测试
                wx.navigateTo({
                    url: this.data.xinlijump,
                })
            }
            if (type == 2) {
                //性格测试
                wx.navigateTo({
                    url: this.data.intjump,
                })
            }
            if (type == 3) {
                //职业倾向测试
                wx.navigateTo({
                    url: this.data.jobjump,
                })
            }
            if (type == 4) {
                //学科强弱测试
                wx.navigateTo({
                    url: this.data.subjump,
                })
            }
        } else {
            this.setData({
                showLogin: true
            })
        }
    },
    //前往结果
    goJieguo(e) {
        if (app.globalData.userInfo.id != 0) {
            var type = e.currentTarget.dataset.type
            if (type == 1) {
                //兴趣测试
                wx.navigateTo({
                    url: '../../career/answer/int?type=' + type,
                })
            }
            if (type == 2) {
                // 职业倾向测试
                wx.navigateTo({
                    url: '../../career/answer/job?type=' + type,
                })
            }
            if (type == 3) {
                // 性格测试
                wx.navigateTo({
                    url: '../../career/answer/index?type=' + type,
                })
            }
            if (type == 4) {
                //学科强弱测试
                wx.navigateTo({
                    url: '../../career/answer/sub?type=' + type,
                })
            }
        } else {
            this.setData({
                showLogin: true
            })
        }

    },
    // onChangeShowState: function() {
    //     var that = this;
    //     that.setData({
    //         showView: (!that.data.showView)
    //     })
    // },

    getdata: function() {
        var that = this;
        // wx.request({
        //   url: app.globalData.hostUrl + '/Reckon/istestres',
        //   method: 'post',
        //   data: {
        //     "user_id": app.globalData.userid
        //   },
        //   success: function (res) {
        //     if (res.data.code == 1) {
        //       that.getxinli();
        //       that.getint();
        //       that.getjob();
        //       that.getsub();
        //       that.setData({
        //         istestres: 1,
        //         istestres2: 1
        //       });
        //     } else {
        //       that.setData({
        //         istestres: 0,
        //         istestres2: 0
        //       });
        //     }
        //   }
        // });        
    },

    /***************/
    // getsub: function() {
    //     var that = this;
    //     wx.request({
    //         url: app.globalData.hostUrl + ansurl,
    //         method: 'post',
    //         data: {
    //             'userid': app.globalData.userid
    //         },
    //         success: function(res) {
    //             if (res.data.code == 1) {
    //                 var data = res.data.data;
    //                 var model = res.data.model;
    //                 var num = res.data.num;
    //                 that.setData({
    //                     subdata: data
    //                 });

    //                 new wxCharts({
    //                     canvasId: 'columnCanvas',
    //                     type: 'column',
    //                     categories: model,
    //                     series: [{
    //                         name: '学科强弱测试',
    //                         data: num
    //                     }],
    //                     yAxis: {
    //                         format: function(val) {
    //                             return val;
    //                         }
    //                     },
    //                     width: 350,
    //                     height: 100,
    //                     dataLabel: false
    //                 });
    //             } else {
    //                 that.setData({
    //                     data: ''
    //                 });
    //                 wx.showToast({
    //                     title: '暂无数据',
    //                     duration: 2000
    //                 });
    //             }
    //         },
    //         fail: function(e) {
    //             wx.showToast({
    //                 title: '网络异常！',
    //                 duration: 2000
    //             });
    //         },
    //     })
    // },
    /***********/
    // getxinli: function() {
    //     var that = this;
    //     var ansurl = 'test/get_jieshou_xinli';
    //     wx.request({
    //         url: app.globalData.hostUrl + ansurl,
    //         method: 'post',
    //         data: {
    //             'userid': app.globalData.userid
    //         },
    //         success: function(res) {
    //             if (res.data.code == 1) {
    //                 var data = res.data.data;
    //                 var zongti = res.data.zongti;
    //                 var actcolor1 = '';
    //                 var bgcolor1 = '';
    //                 var actcolor2 = ''
    //                 var bgcolor2 = ''
    //                 var actcolor3 = ''
    //                 var bgcolor3 = ''
    //                 var actcolor4 = ''
    //                 var bgcolor4 = ''
    //                 if (zongti.E <= zongti.I) {
    //                     actcolor1 = "#e0e0e0",
    //                         bgcolor1 = "#62d9f7"
    //                 } else {
    //                     actcolor1 = "#62d9f7",
    //                         bgcolor1 = "#e0e0e0"
    //                 }

    //                 if (zongti.S <= zongti.N) {
    //                     actcolor2 = "#e0e0e0",
    //                         bgcolor2 = "#f87064"
    //                 } else {
    //                     actcolor2 = "#f87064",
    //                         bgcolor2 = "#e0e0e0"
    //                 }

    //                 if (zongti.T <= zongti.F) {
    //                     actcolor3 = "#e0e0e0",
    //                         bgcolor3 = "#f562f8"
    //                 } else {
    //                     actcolor3 = "#f562f8",
    //                         bgcolor3 = "#e0e0e0"
    //                 }

    //                 if (zongti.J <= zongti.P) {
    //                     actcolor4 = "#e0e0e0",
    //                         bgcolor4 = "#f7c562"
    //                 } else {
    //                     actcolor4 = "#f7c562",
    //                         bgcolor4 = "#e0e0e0"
    //                 }

    //                 that.setData({
    //                     xinlidata: data,
    //                     xinlizongti: zongti,
    //                     actcolor1: actcolor1,
    //                     bgcolor1: bgcolor1,

    //                     actcolor2: actcolor2,
    //                     bgcolor2: bgcolor2,

    //                     actcolor3: actcolor3,
    //                     bgcolor3: bgcolor3,

    //                     actcolor4: actcolor4,
    //                     bgcolor4: bgcolor4,

    //                 });
    //             } else {
    //                 that.setData({
    //                     data: ''
    //                 });
    //                 wx.showToast({
    //                     title: '暂无数据',
    //                     duration: 2000
    //                 });
    //             }


    //         },
    //         fail: function(e) {
    //             wx.showToast({
    //                 title: '网络异常！',
    //                 duration: 2000
    //             });
    //         },
    //     })
    // },
    // /************/
    // getjob: function() {
    //     var that = this;
    //     wx.request({
    //         url: app.globalData.hostUrl + "test/get_jieshou_job",
    //         method: 'post',
    //         data: {
    //             'userid': app.globalData.userid
    //         },
    //         success: function(res) {
    //             if (res.data.code == 1) {
    //                 var jobdata = res.data.data;
    //                 var jobmodel = res.data.model;
    //                 var jobnum = res.data.num;
    //                 that.setData({
    //                     jobdata: jobdata,
    //                     jobmodel: jobmodel
    //                 });

    //                 new wxCharts({
    //                     canvasId: 'columnCanvas',
    //                     type: 'column',
    //                     categories: jobmodel,
    //                     series: [{
    //                         name: '职业测试',
    //                         data: jobnum
    //                     }],
    //                     yAxis: {
    //                         format: function(val) {
    //                             return val;
    //                         }
    //                     },
    //                     width: 300,
    //                     height: 250,
    //                     dataLabel: false
    //                 });
    //             }
    //         },
    //         fail: function(e) {
    //             wx.showToast({
    //                 title: '网络异常！',
    //                 duration: 2000
    //             });
    //         },
    //     })
    // },
    // getint: function() {
    //     var that = this;
    //     var ansurl = 'test/get_jieshou_int';
    //     wx.request({
    //         url: app.globalData.hostUrl + ansurl,
    //         method: 'post',
    //         data: {
    //             'userid': app.globalData.userid
    //         },
    //         success: function(res) {
    //             var data = res.data.data;
    //             var model = res.data.model;
    //             var num = res.data.num;
    //             that.setData({
    //                 intdata: data
    //             });

    //             new wxCharts({
    //                 canvasId: 'radarCanvas2',
    //                 type: 'radar',
    //                 categories: model,
    //                 series: [{
    //                     name: '测评结果',
    //                     data: num
    //                 }],
    //                 width: 300,
    //                 height: 350,
    //                 extra: {
    //                     background: '#cb2431',
    //                     radar: {
    //                         max: 150
    //                     }
    //                 }
    //             });

    //         },
    //         fail: function(e) {
    //             wx.showToast({
    //                 title: '网络异常！',
    //                 duration: 2000
    //             });
    //         }
    //     })
    // },
    // getsub: function() {
    //     console.log("222")
    //     var that = this;
    //     var ansurl = 'test/get_jieshou_sub';
    //     wx.request({
    //         url: app.globalData.hostUrl + ansurl,
    //         method: 'post',
    //         data: {
    //             'userid': app.globalData.userid
    //         },
    //         success: function(res) {
    //             if (res.data.code == 1) {
    //                 var data = res.data.data;
    //                 var submodel = res.data.model;
    //                 var subnum = res.data.num;
    //                 that.setData({
    //                     subdata: data,
    //                     neirong: res.data.neirong
    //                 });

    //                 new wxCharts({
    //                     canvasId: 'columnCanvas',
    //                     type: 'column',
    //                     categories: submodel,
    //                     series: [{
    //                         name: '学科强弱测试',
    //                         data: subnum
    //                     }],
    //                     yAxis: {
    //                         format: function(val) {
    //                             return val;
    //                         }
    //                     },
    //                     width: 350,
    //                     height: 250,
    //                     dataLabel: false
    //                 });
    //             } else {
    //                 that.setData({
    //                     data: ''
    //                 });
    //                 wx.showToast({
    //                     title: '暂无数据',
    //                     duration: 2000
    //                 });
    //             }
    //         },
    //         fail: function(e) {
    //             wx.showToast({
    //                 title: '网络异常！',
    //                 duration: 2000
    //             });
    //         },
    //     })
    // },
    onShow: function(e) {
        var that = this;
        var jump = "";
        that.getdata();
        wx.getStorage({
            key: "isbanad",
            success: function(res) {
                that.setData({
                    isbanad: res.data
                });
            },
        });

        if (that.data.isbanad == 1) {
            jump = '../quest/index';
        } else {
            jump = '../swiper/index';
        }

        that.setData({
            jump: jump
        });
    },
    //点击重新评测
    cxpc: function(e) {
        var that = this;
        var jump = "";
        var istestres = that.data.istestres;
        wx.getStorage({
            key: "isbanad",
            success: function(res) {
                that.setData({
                    isbanad: res.data
                });
            },
        });

        if (that.data.isbanad == 1) {
            jump = '../quest/index';
        } else {
            jump = '../swiper/index';
        }
        if (istestres == 1) {
            istestres = 0;
        } else {
            istestres = 1;
        }

        that.setData({
            istestres: istestres,
            jump: jump
        });
    },
    //点击切换
    clickTab: function(e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    //广告
    openAdlink: function(e) {
        var that = this;
        let link = e.currentTarget.dataset.link;
        var media = e.currentTarget.dataset.type;
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
    }
})