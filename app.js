var config = require("./config.js");
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.login({
      success: res => {
        console.log("login success" + res)
      }
    })
    wx.getSetting({
      success:res=>{
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:res => {
              console.log(res);
              this.globalData.userInfo = res.userInfo;
              if(this.userInfoReadyCallback){
                this.userInfoReadyCallback(res);
              }
            }
          })
        }
      }
    })
    var info = wx.getSystemInfoSync();
    var hg = info.windowHeight;
    this.globalData.height = hg - 66;
  },
  

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  
  globalData:{
    userInfo:null,
    score:120,
    height:560
  }
})
