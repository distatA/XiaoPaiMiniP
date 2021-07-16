const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
       url_active:'',//线上活动页地址
      itextnamed:"",
      userId:'',
      
     h5Data:'',
     offShare:'0',//不是分享 1 是分享
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this
    let itextnamed = options.textname
    let linkurl = options.link_url

   console.log(options)

    that.setData({
      url_active: decodeURIComponent(linkurl),
           itextnamed: itextnamed,
           userId: app.globalData.userid
         })

  },

  bindmessage: function (e) {
    this.setData({
      h5Data: JSON.parse(e.detail.data[e.detail.data.length - 1])
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log(options)
    return {
      title: this.data.h5Data.title,
      desc: this.data.h5Data.title,
      path: "/packageChoose/page/webview_active/webview_active?link_url=" + this.data.h5Data.urlh5,
      success:function(res){
        console.log(res)
      
      },fail:function(res){
       
      }
    }
  }
})