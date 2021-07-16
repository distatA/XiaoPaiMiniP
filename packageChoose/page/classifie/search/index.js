const app = getApp();
const until = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchList:[],
        recommend:[],//推荐
        hostList:[],//热搜
        name:"",
        go:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    
   
    //用户失去焦点触发
    blur() {
        this.setData({
            // inputShow: false
            searchList:[]
        })
    },
    //用户键盘输入时触发
    searchSchool: function (e) {
        var keyword = e.detail.value;
        var that = this;
        
        until.request({
            url: '/api/classifie/search_list',
            method: 'post',
            data: {
                'province': app.globalData.province.id,
                'name': keyword
            },
            success: function (res) {
                if (res.data.code == 1 && res.data.list.length > 0) {
                    that.setData({
                        searchList: res.data.list
                    });
                } else {
                    that.setData({
                        searchList: []
                    });
                }
            }
        })
    },
    // 进入学校详情
    searchSchoolName: function (e) {
        var that=this;
        var id = e.currentTarget.dataset.item.sid;
        var sid = e.currentTarget.dataset.item.sid;
        if (that.data.go==1) {
            wx.navigateTo({
                url: '../hostdetail/index?id=' + id,
            })
        } else if (that.data.go == 2){
            wx.navigateTo({
                url: '../historySubject/SchoolBank/SchoolBank?sid=' + sid,
            })
        } else if (that.data.go == 3) {
            wx.navigateTo({
                url: '../fractionDetail/fractionDetail?sid=' + sid
            })
        }
        this.setData({
            searchShow: true,
            searchList: []
        })    
    },
    
    //用户点击完成时触发或者搜索按钮
    formSubmit: function (e) {
        var name = e.detail.value;
        // var id=e.currentTarget.dataset
        wx.navigateTo({
            url: '../hostdetail/index?name=' + name,
        })
        this.setData({
            searchList: []
        });
    },
    // 进入详情
    goDetail(e) {
        var name = e.currentTarget.dataset.item.name;
        wx.navigateTo({
            url: '../hostdetail/index?name=' + name,
        })
    },
    //搜索接口数据
    fetchSearch(){
        until.request({
            url: '/api/classifie/search',
            data: {
                'province': app.globalData.province.id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        recommend: res.data.list1,
                        hostList:res.data.list2
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
    onLoad: function (options) {
        this.fetchSearch();
       this.setData({
           go: options.go
       })
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