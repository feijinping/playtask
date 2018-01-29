var config = require("./config.js");
var getData = function(){
  //模拟获取数据
  var taskTitle = ["value","score","time"];
  wx.request({
    url: config.alltask,
    success:function(result){
      console.log(result.data);
    }
  })
  wx.setStorage({
    key: 'totalscore',
    data: 0,
  })
  wx.setStorage({
    key: 'task',
    data: {
      day: getArray(taskTitle, 3, "day"),
      week: getArray(taskTitle, 3, "week"),
      common: getArray(taskTitle, 3, "common"),
      other: getArray(taskTitle, 3, "other")
    },
  })
  wx.setStorage({
    key: 'enjoy',
    data: {
      enjoy1: getArray(taskTitle, 3, "enjoy1"),
      enjoy2: getArray(taskTitle, 3, "enjoy2")
    },
  })
  wx.setStorage({
    key: 'habit',
    data: {
      goobhabit: getArray(taskTitle, 3, "goodhabit"),
      badhabit: getArray(taskTitle, 3, "badhabit")
    }
  })
  wx.setStorage({
    key: 'opHistory',
    data: []
  })
}
var index = 0;
var getArray = function (oj,len,typeName){
    var arr = [];
    for(var i = 0; i < len; i++){
      var o = {};
      o.value = typeName + i;
      o.score = i + 10;
      o.time = i + 1;
      o.period = typeName;
      o.isdisplay=false;
      o.complated = 0;
      o.id = index++;
      arr.push(o);
    }
    return arr;
}
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.login({
      success: res => {
        console.log("login success")
      }
    })
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
      }
    })
    var info = wx.getSystemInfoSync();
    var hg = info.windowHeight;
    this.globalData.height = hg - 66;
    getData();
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
