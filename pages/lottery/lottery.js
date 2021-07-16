var interval = null;
var intime = 50; //值越大旋转时间越长  即旋转速度
const app = getApp();
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showPrize:false,//显示奖品
        showLogin: false, //登陆窗口
        images: [
            'https://new.schoolpi.net/attach/small_program/index/lottery1.png',
            'https://new.schoolpi.net/attach/small_program/index/lottery2.png',
            'https://new.schoolpi.net/attach/small_program/index/lottery3.png',
            'https://new.schoolpi.net/attach/small_program/index/lottery4.png',
            'https://new.schoolpi.net/attach/small_program/index/lottery5.png',
            'https://new.schoolpi.net/attach/small_program/index/lottery6.png',
            'https://new.schoolpi.net/attach/small_program/index/lottery7.png',
            'https://new.schoolpi.net/attach/small_program/index/lottery8.png',
            'https://new.schoolpi.net/attach/small_program/index/lottery9.png',
        ],
        checked: [false, false, false, false, false, false, false, false], //为真是选中样式
        lottery: 'lottery',
        luckPosition: 8, //中奖位置
        form: '', //中奖纪录表id
        num: '', //剩余次数
        showMasks: false,
        chance: 1, //1：可以抽奖，0：提示分享获取机会，-2：今日次数用尽(和code数字对应)
        type: 0, //中奖类型 1 口罩 2 会员3 积分 4 谢谢参与
        id: 0, //奖品id
        status:1,//奖品是否领取 1 已领取 0 未领取
        prize:'',//奖品名字
        showStatus:false,
        times:""
    },
    // 未中奖并有次数时点击再抽一次
    again() {
        this.setData({
            showMasks: false,
            type:0
        })
    },
    // 点击抽奖
    lottery() {
        var that = this;
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/draw/lucky',
                data: {
                    uid: app.globalData.userInfo.id
                },
                // code=1可以抽奖，code=0提示分享，code=-2今日次数用尽
                success(res) {
                    if (res.data.code == 1) {
                        //可以抽奖
                        var luckPosition = res.data.data.id - 1
                        that.setData({
                            form: res.data.data.form,
                            luckPosition: luckPosition, //中奖位置
                            type: res.data.data.type,
                            num: res.data.num,
                            id: res.data.data.id,
                            chance:1
                        })
                        clearInterval(interval);
                        var stoptime = 2000;
                        var index = 0;
                        var checked = that.data.checked;
                        interval = setInterval(function() {
                            if (index > 8) {
                                index = 0;
                                checked[8] = false
                            } else if (index != 0) {
                                checked[index - 1] = false
                            }
                            checked[index] = true
                            that.setData({
                                checked: checked,
                            })
                            index++;
                        }, intime);
                        setTimeout(function() {
                            that.stop(that.data.luckPosition);
                        }, stoptime)
                    } else if (res.data.code == 0) {
                        //提示分享
                        that.setData({
                            showMasks: true,
                            chance: 0, 
                            type:0
                        })
                    } else if (res.data.code == -2) {
                        // 抽奖机会用尽
                        that.setData({
                            showMasks: true,
                            chance: -2, //
                            type: 0
                        })
                    }
                }
            });
        } else {
            // 用户登录
            that.setData({
                showLogin: true
            })
        }
    },
    // 抽奖停止
    stop(position) {
        var that = this;
        //清空计数器
        clearInterval(interval);
        //初始化当前位置
        //下标从1开始
        var index = 1;
        that.stopLuck(that.data.luckPosition, index, intime, 30);
    },
    //  position:中奖位置
    //  index:当前位置
    //  time：时间标记
    //  splittime：每次增加的时间 值越大减速越快
    stopLuck: function(position, index, time, splittime) {
        var that = this;
        //值越大出现中奖结果后减速时间越长
        var checked = that.data.checked;
        setTimeout(function() {
            //重置前一个位置
            if (index > 8) {
                index = 0;
                checked[8] = false
            } else if (index != 0) {
                checked[index - 1] = false
            }
            //当前位置为选中状态
            checked[index] = true
            that.setData({
                checked: checked,
            })
            //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
            //直到旋转至中奖位置
            if (time < 400 || index != position) {
                //越来越慢
                splittime++;
                time += splittime;
                //当前位置+1
                index++;
                that.stopLuck(position, index, time, splittime);
            } else {
                //1秒后显示弹窗
                setTimeout(function() {
                    // type=1 口罩 type=2 会员 type=3 积分 type4 谢谢参与（第一次未中奖提示分享再抽）
                    var type = that.data.type
                    if (type != 0) {
                        //中奖
                        that.setData({
                            showMasks: true
                        })
                    } 
                }, 1000);
            }
        }, time);
    },
    close(e) {
        this.setData({
            showMasks: false,
        })
    },
    //领取口罩
    receiveMasks(){
        var that = this;
        var type = that.data.type;
        var form = that.data.form;
        wx.navigateTo({
            url: './identity/identity?type=' + type + '&form=' + form,
        })
        that.setData({
            showMasks: false,
            id: 0,
            type: 0
        })
    },
    // 领取会员
    receiveVirtual(){
        var that = this;
        var type = that.data.type;
        var form = that.data.form;
        wx.navigateTo({
            url: './account/account?type=' + type + '&form=' + form,
        })
        that.setData({
            showMasks: false,
            id: 0,
            type: 0
        })
    },
    // 点击领取积分 
    receive() {
        var that=this;
        var type = that.data.type;
        var form = that.data.form;
        util.request({
            url: '/api/draw/receive',
            data: {
                uid: app.globalData.userInfo.id,
                type: type,
                form: form
            },
            success(res) {
                wx.navigateTo({
                    url: './result/result?type=' + type+'&form='+form,
                })
                that.setData({
                    showMasks:false,
                    id: 0,
                    type:0,
                })
            }
        })
    },
    // 查看奖品
    showPrize(){
        var that=this;
        that.setData({
            showPrize: true
        })
        util.request({
            url: '/api/draw/prize',
            data:{
                uid: app.globalData.userInfo.id,
            },
            success(res){
                if(res.data.code==1){
                    that.setData({
                        status:res.data.data.status,
                        prize: res.data.data.prize,
                        type:res.data.data.prize_type,
                        form: res.data.data.id,
                        showStatus: false
                    })
                }else{
                    that.setData({
                        showStatus:true
                    })
                }
            }
        })
    },
    goReceive(){
        var that=this;
        var type=that.data.type;
        var form = that.data.form;
        that.setData({
            showPrize: false,
            id: 0,
            type: 0
        })
        if(type==1){
            wx.navigateTo({
                url: './identity/identity?type=' + type + '&form=' + form,
            })
        } else if (type == 2){
            wx.navigateTo({
                url: './account/account?type=' + type + '&form=' + form,
            })
        } else if (type == 3){
            wx.navigateTo({
                url: './result/result?type=' + type + '&form=' + form,
            })
        }
    },
    closePrize(){
        this.setData({
            showPrize:false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    //加载抽奖机会
    loadChance() {
        var that = this;
        util.request({
            url: '/api/draw/getnum',
            data: {
                uid: app.globalData.userInfo.id
            },
            success(res) {
                that.setData({
                    num: res.data.data,
                })
            }
        });
    },
    loadTimes(){
        var that = this;
        util.request({
            url: '/api/draw/get_time',
            success(res) {
                that.setData({
                    times: res.data.data,
                })
            }
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        that.loadChance();
        that.loadTimes()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        var that = this;
        util.request({
            url: '/api/draw/share',
            data: {
                uid: app.globalData.userInfo.id
            },
            success(res) {
                that.setData({
                    showMasks:false
                })
            }
        });
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target)

        }
        return {
            title: '助力健康高考，校派在行动',
            imageUrl: 'https://new.schoolpi.net/attach/small_program/index/masks-share.png',
            path: '/pages/lottery/lottery'
        }
    }
})