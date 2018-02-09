// view/personal/personal.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasUserInfo:false,
    canIUse:wx.canIUse("button.open-type.getUserInfo")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo){
      this.setData({userInfo:app.globalData.userInfo,
      hasUserInfo:true});
    }else if(this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
            userInfo: app.globalData,
            hasUserInfo: true
        });
      }
    }else{
      wx.getUserInfo({
        success:res=>{
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: app.globalData,
            hasUserInfo: true
          });
        }
      })
    }
  },
  reAuth(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userinfo']) {
          wx.authorize({
            scope: 'scope.userinfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              //wx.startRecord()
              console.log("chengg")
            }
          })
        }
      }
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