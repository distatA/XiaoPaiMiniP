//获取应用实例
const app = getApp();
const until = require('../../../../utils/util.js');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({
    data: {
       id:1,
       lists:{}
    },
    // 获取详情数据
    fetchDetailData(id){
        var that=this;
        until.request({
            url: '/api/classifie/policy_details',
            data: {
                'id': id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    var value = res.data.list.content;
                    var currentValue = value.replace(/&amp;/g, '&');// 去除空格
                    var endValue = currentValue.replace(/&nbsp;/g,"\xa0")
                    WxParse.wxParse('txtNew', 'html', endValue, that, 5);
                    this.setData({
                      lists:res.data.list
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.list.name,
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
    onLoad: function (option) {
        this.fetchDetailData(option.id);
        this.setData({
            id:option.id
        })
        
    },
    onShow() {
        
    },
    onShareAppMessage(){
        return{
            title: this.data.lists.name,
            path:'/packageChoose/page/classifie/policydetail/index?id='+this.data.id
        }
    }
})