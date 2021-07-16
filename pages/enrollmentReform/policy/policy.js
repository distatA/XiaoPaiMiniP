//获取应用实例
const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
const util = require('../../../utils/util.js');
Page({
    data: {
        showLogin: false,
        article_id: 0,//文章id
        info: {}, //文章详情
        commentList: [], //文章评论
        replyList: [], //评论别人
        // 键盘收起弹出
        focusInput: false,
        isInput: false,
        maxTextLen: 100, //最大输入长度
        length: 0, //当前输入内容长度
        value: '', //评论内容
        isReply: false, //回复
        replyName: '', //被回复昵称
    },
    inputFocus(e) {
        var that = this;
        that.setData({
            isInput: true
        })
    },
    inputBlur() {
        var that = this;
        that.setData({
            isInput: false,
            isReply: false,
        })
    },
    focusButn: function() {
        var that = this;
        that.setData({
            focusInput: true,
            isInput: true
        })
    },
    length(e) {
        var that = this;
        let maxTextLen = that.data.maxTextLen;
        let length = e.detail.value.length
        that.setData({
            maxTextLen: maxTextLen,
            length: length,
            value: e.detail.value
        })
    },
    onLoad: function(option) {
        var that = this;
        that.setData({
            article_id: option.id
        })
        util.request({
            url: '/api/reform/policy_details',
            data: {
                id: option.id
            },
            success: function(res) {
                if (res.data.code == 1) {
                    var content = util.format(res.data.data.content)
                    WxParse.wxParse('txtNew', 'html', content, that, 5);
                    that.setData({
                        info: res.data.data,
                    });
                }
            }
        });
    },
    onShow() {
        this.discuss();

    },
    //评论列表
    discuss() {
        var that = this;
        util.request({
            url: '/api/reform/comment_list',
            data: {
                id: that.data.article_id,
                uid: app.globalData.userInfo.id,
            },
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        commentList: res.data.list,
                    });
                }
            },
        });
    },
    //提交评论
    comment: function(e) {
        var that = this;
        var value = that.data.value;
        let id = that.data.id //上一级评论内容id
        let touserid = that.data.touserid
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/reform/add_comment',
                data: {
                    aid: that.data.article_id,
                    pid: id,
                    content: value,
                    uid: app.globalData.userInfo.id,
                    touser_id: touserid,
                },
                success: function(res) {
                    if (res.data.code == 1) {
                        that.setData({
                            value: '',
                            touserid: ''
                        })
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000
                        });
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            });
        } else {
            that.setData({
                showLogin: true
            })
        }
        setTimeout(function() {
            that.discuss();
        }, 100)
    },
    // 回复
    reply(e) {
        var that = this;
        var touserid = e.currentTarget.dataset.touserid;
        var id = e.currentTarget.dataset.id;
        var replyName = e.currentTarget.dataset.name;
        that.setData({
            id: id,
            touserid: touserid,
            isReply: true,
            replyName: replyName,
        })
        that.focusButn();
    },
    // 刷新
    onPullDownRefresh() {
        this.discuss();
    },
    onShareAppMessage: function(ops) {
        var that=this;
        var shareObj = {
            title: that.data.info.title,
            path: '/pages/enrollmentReform/policy/policy?id=' + that.data.article_id,
        };
        if (ops.from === 'button') {
            shareObj.title = that.data.info.title;
            shareObj.path = '/pages/enrollmentReform/policy/policy?id=' + that.data.article_id;
        }
        return shareObj;
    },
})