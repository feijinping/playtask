var config = require("./config.js");
const wafer = require('./vendors/wafer-client-sdk/index');
const lab = require('./lib/lab');
var custReq = require("./resource.js")["request"];
var getDatas = require("./resource.js")["getDatas"];
var resource = require("./resource.js");
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wafer.setLoginUrl(config.loginUrl);
    var that = this;
    wafer.request({
      login: true,
      url: config.requestUrl,
      method: 'GET',
      success: (res) => {
        wx.setStorageSync("userid", res.data.data.userInfo.openId);
        that.globalData.userInfo = that.globalData.userInfo ? that.globalData.userInfo:res.data.data.userInfo;
        getDatas();
        wx.request({
          url: config.saveUser,
          method:'POST',
          data:JSON.stringify(res.data.data.userInfo),
          success(res){
            console.log("save user " + res.data);
          }
        })
      }});
    wx.getSetting({
      success:res=>{
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:res => {
              this.globalData.userInfo = res.userInfo;
              if(this.userInfoReadyCallback){
                this.userInfoReadyCallback(res);
              }
            }
          })
        }
      },
      fail(re){
        console.log(re);
      }
    })
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
    resource.syncData();
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  
  globalData:{
    userInfo:null
  }
})
