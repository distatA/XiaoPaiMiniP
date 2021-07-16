// pages/search/index.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        inputShow:false,
        inputVal: "",
        searchShow: true,
        searchList: [],
        hostList:[],
    },
    //用户失去焦点触发
    blur(){
        this.setData({
            inputShow: false,
            searchShow: false,
        })  
    },
    //用户键盘输入时触发
    searchSchool: function (e) {
        var keyword = e.detail.value;
        var that = this;
        this.setData({
            inputShow: true,
            searchShow: false
        });
        // if (keyword.length >= 2) {
           util.request({
               url:'/api/index/search',
                method: 'post',
                data: {
                    'keyword': keyword
                },
                success: function (res) {
                    if (res.data.code == 1 && res.data.list.length > 0) {
                        that.setData({
                            searchShow: false,
                            searchList: res.data.list
                        });
                    } else {
                        that.setData({
                            searchShow: true,
                            searchList:[]
                        });
                    }
                }
            })
        // }
    },
    searchSchoolName: function (e) {
        var name = e.currentTarget.dataset.name;
        this.setData({
            searchShow: true,
            searchList: []
        });
        wx.navigateTo({
            url: '../tabBar/school/screen/screen?name=' + name,
        })
    },
    //用户点击完成时触发
    formSubmit: function (e) {
        var name = e.detail.value;
        this.setData({
            searchShow: true,
            searchList: []
        });
        wx.navigateTo({
            url: '../tabBar/school/screen/screen?name=' + name,
        })
    },
    //获取热门搜索数据
     fetchHostList(){
         util.request({
             url: '/api/index/search_list',
             method: 'post',
             data: {
                 'province': app.globalData.province.id
             },
             success: (res)=>{
                 if(res.data.code==1){
                     this.setData({
                         hostList: res.data.list
                     })
                 }
             }
         })
     },
     //进入热门搜索学习详情
    goDetail(e){
      let name=e.target.dataset.name;
        wx.navigateTo({
            url: '../tabBar/school/screen/screen?name=' + name,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchHostList();  
                                 
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})