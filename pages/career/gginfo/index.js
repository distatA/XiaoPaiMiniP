const app = getApp()
const util = require('../../../utils/util.js');
Page({
    data: {
        ksinfo: [],
        propArray: [], //省份
        proid: 0,
        isDown: true,
        total_score: 0, //总分
        total_number: 0, //总人
        info: '',
        wenli: 1, //0理科1文科
        pici: 1, //1本一批2本二批3专科批  
        kename: '政治',
        first_choose_grade: 'A+',
        second_choose_grade: 'A+',
        pname: '',
        wxname: '',
        pcname: '',
        sort: '',
        selectShow: false, //初始option不显示
        nowText: "请选择", //初始内容
        animationData: {}, //右边箭头的动画 
        count: 0,
        isJiangsu: false,
        guName: '历史',
        countnum: 0, // 设置 计数器 初始为0,为0，调用函数执行动画
        countTimer: null, // 设置 定时器 初始为null
        isClick: false,
        user_points: {},
        user_gailv: {}, //冲刺稳妥保底院校数
        points: 0, //分数
        popup: false, //弹框的判断
        has_volunteer: 0,
        //显示计算中
    },
    onShow() {
        var that = this;
        if (app.globalData.userInfo.id == 0) {
            that.setData({
                showLogin: true
            })
        } else {
            // 判断是否有分数
            util.request({
                url: '/api/reckon/user_points',
                data: {
                    uid: app.globalData.userInfo.id
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code == 1) {
                        if (res.data.user_points.province == 10808) {
                            that.setData({
                                isJiangsu: true
                            });
                        } else {
                            that.setData({
                                isJiangsu: false
                            });
                        };
                        that.setData({
                            popup: false,
                            user_gailv: res.data.user_gailv,
                            user_points: res.data.user_points,
                            points: res.data.user_points.score,
                            total_score: res.data.user_points.total_score,
                            sort: res.data.user_points.sort,
                            has_volunteer: res.data.has_volunteer
                        })
                        wx.hideLoading();
                        that.countInterval();
                        that.countIntervalR();
                    } else {
                        that.setData({
                            popup: true,
                        });
                    }
                },
            });
            // 获取省份
            util.request({
                url: '/api/reckon/condition_points',
                method: 'post',
                success: function(res) {
                    if (res.data.code == 1) {
                        that.setData({
                            propArray: res.data.region
                        });
                    }
                },
            });
        }
    },
    onLoad: function() {

    },
    editinfo: function() {
        var that = this;
        var popup = !that.data.popup;
        that.setData({
            popup: popup
        });
    },
    selectToggle: function() {
        var that = this;
        var nowShow = that.data.selectShow; //获取当前option显示的状态
        //创建动画
        var animation = wx.createAnimation({
            timingFunction: "ease"
        })
        that.animation = animation;
        if (nowShow) {
            animation.rotate(0).step();
            that.setData({
                animationData: animation.export(),
                selectShow: true
            })
        } else {
            animation.rotate(180).step();
            that.setData({
                animationData: animation.export(),
                selectShow: false
            })
        }
        this.setData({
            selectShow: !nowShow
        })
    },
    //设置内容
    setText: function(e) {
        var that = this;
        var nowText = e.target.dataset.pname;
        var proid = e.target.dataset.pid;
        var pname = e.target.dataset.pname;
        if (proid == 10808) {
            that.setData({
                isJiangsu: true
            })
        } else {
            that.setData({
                isJiangsu: false
            })
        }
        this.setData({
            selectShow: false,
            nowText: nowText,
            proid: proid,
            pname: pname
        })
    },
    //选择文理
    szwenli: function(e) {
        var that = this
        var wenli = e.target.dataset.type;
        var wxname = '';
        var guName = '';
        if (wenli == 1) {
            wxname = "文科";
            guName = "历史";
        } else {
            wxname = "理科";
            guName = "物理";
        }
        that.setData({
            wenli: wenli,
            wxname: wxname,
            guName: guName
        })
    },
    //选择pici
    szpc: function(e) {
        var that = this
        var pici = e.target.dataset.type;
        var pcname = '';
        if (pici == 3) {
            pcname = " 专科批"
        } else if (pici == 2) {
            pcname = " 本二批"
        } else {
            pcname = " 本一批"
        }
        that.setData({
            pici: pici,
            pcname: pcname
        })
    },
    formSubmit: function(e) {
        var that = this;
        var proid = e.target.dataset.pid;
        var pname = that.data.pname;
        var wxname = that.data.wxname;
        var pcname = that.data.pcname;
        var points = e.detail.value.points;
        if (!points || points<1) {
            wx.showToast({
                title: '请填写高考成绩',
                duration: 2000,
                icon: 'none'
            });
            return
        }
        if (!that.data.proid) {
            wx.showToast({
                title: '请选择省份',
                duration: 2000,
                icon: "none"
            });
            return
        }
        var first_choose_grade = that.data.first_choose_grade;
        var second_choose_grade = that.data.second_choose_grade;
        that.setData({
            isClick: true,
            calculate: true,
        })
        util.request({
            url: '/api/reckon/add_points',
            cachetime: "0",
            data: {
                uid: app.globalData.userInfo.id,
                province: that.data.proid,
                score: e.detail.value.points,
                sort: e.detail.value.sort,
                batch: that.data.pici,
                course: that.data.wenli,
                choose_a: first_choose_grade,
                choose_b: that.data.second_choose_grade
            },
            method: 'POST',
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        user_gailv: res.data.user_gailv,
                        user_points: res.data.user_points,
                        points: res.data.user_points.score,
                        total_score: res.data.user_points.total_score,
                        total_number: res.data.user_points.total_number,
                        sort: res.data.user_points.sort,
                        countnum: 0,
                        isClick: false,
                        popup: false,
                        calculate: false,
                    });
                    wx.hideLoading();
                    that.countInterval();
                    that.countIntervalR();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                    that.setData({
                        isClick: false,
                        calculate:false
                    })
                }
                that.setData({
                    pcname: pcname,
                    wxname: wxname,
                    pname: pname,
                });
            },
            fail: function(e) {
                wx.showToast({
                    title: '省份获取异常！',
                    duration: 2000
                });
            },
        })
    },
    goGailv: function(e) {
        var that = this;
        let chongci = that.data.user_gailv.chongci;
        let baodi = that.data.user_gailv.baodi;
        let wentuo = that.data.user_gailv.wentuo;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/career/gailv/gailv?id=' + id + '&chongci=' + chongci + '&baodi=' + baodi + '&wentuo=' + wentuo,
        })
    },
    // 江苏
    selectAB(e) {
        var that = this;
        var toggleBtnVal = that.data.isShow;
        var itemId = e.currentTarget.id;
        if (toggleBtnVal == itemId) {
            that.setData({
                isShow: 0
            })
        } else {
            that.setData({
                isShow: itemId
            })
        }
    },
    setContent(e) {
        var that = this;
        var kename = e.currentTarget.dataset.kename;
        that.setData({
            kename: kename
        })
    },
    setContentA(e) {
        var that = this;
        var level = e.currentTarget.dataset.level;
        that.setData({
            first_choose_grade: level
        })
    },
    setContentB(e) {
        var that = this;
        var level = e.currentTarget.dataset.level;
        that.setData({
            second_choose_grade: level
        })
    },
    // 底层  ctx 分数 ctxR 名次 
    drawProgressbg: function() {
        // 使用 wx.createContext 获取绘图上下文 context
        var ctx = wx.createCanvasContext('canvasProgressbg');
        ctx.setLineWidth(2); // 设置圆环的宽度
        ctx.setStrokeStyle('#eeeeee'); // 设置圆环的颜色
        ctx.setLineCap('round') // 设置圆环端点的形状
        ctx.beginPath(); //开始一个新的路径
        ctx.arc(50, 50, 44, 0, 2 * Math.PI, false);
        //设置一个原点(44,44)，半径为40的圆的路径到当前路径
        ctx.stroke(); //对当前路径进行描边
        ctx.draw();
        var ctxR = wx.createCanvasContext('canvasProgressbgR');
        ctxR.setLineWidth(2);
        ctxR.setStrokeStyle('#eeeeee');
        ctxR.setLineCap('round');
        ctxR.beginPath();
        ctxR.arc(50, 50, 44, 0, 2 * Math.PI, false);
        ctxR.stroke();
        ctxR.draw();
    },
    // 彩色圆环
    drawCircle: function(step) {
        var context = wx.createCanvasContext('canvasProgress');
        // 设置渐变
        var gradient = context.createLinearGradient(200, 100, 100, 200);
        gradient.addColorStop("0", "#5cef7d");
        gradient.addColorStop("0.5", "#49df98");
        gradient.addColorStop("1.0", "#37d0b1");
        context.setLineWidth(3);
        context.setStrokeStyle(gradient);
        context.setLineCap('round')
        context.beginPath();
        // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
        context.arc(50, 50, 44, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw();
    },
    // 彩色圆环
    drawCircleR: function(step) {
        var context = wx.createCanvasContext('canvasProgressR');
        // 设置渐变
        var gradient = context.createLinearGradient(200, 100, 100, 200);
        gradient.addColorStop("0", "#5cef7d");
        gradient.addColorStop("0.5", "#49df98");
        gradient.addColorStop("1.0", "#37d0b1");
        context.setLineWidth(3);
        context.setStrokeStyle(gradient);
        context.setLineCap('round')
        context.beginPath();
        // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
        context.arc(50, 50, 44, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw();
    },
    // 分数动画
    countInterval: function() {
        var that = this;
        var points = that.data.points;
        var total_score = that.data.total_score;
        var step = points * 2 / total_score;
        // 设置倒计时 定时器 每100毫秒执行一次，计数器countnum+1 ,耗时6秒绘一圈
        that.countTimer = setInterval(() => {
            if (that.data.countnum <= 60) {
                /* 绘制彩色圆环进度条  
                注意此处 传参 step 取值范围是0到2，
                所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
                */
                that.drawCircle(that.data.countnum / (60 / step))
                that.data.countnum++;
            } else {
                clearInterval(that.countTimer);
            }
        }, 100)
    },
    // 名次动画
    countIntervalR: function() {
        var that = this;
        var sort = that.data.sort;
        var total_number = that.data.total_number;
        var step = sort * 2 / total_number;
        // 设置倒计时 定时器 每100毫秒执行一次，计数器countnum+1 ,耗时6秒绘一圈
        that.countTimer = setInterval(() => {
            if (that.data.countnum <= 60) {
                /* 绘制彩色圆环进度条  
                注意此处 传参 step 取值范围是0到2，
                所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
                */
                that.drawCircleR(that.data.countnum / (60 / step))
                that.data.countnum++;
            } else {
                clearInterval(that.countTimer);
            }
        }, 100)
    },
    onReady: function() {
        var that = this;
        that.drawProgressbg();
    },
})