// view/setting/setting.js
var config = require("../../config.js");
var resource = require("../../resource.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    hours: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点'],
    timeindex:0,
    dayindex:0,
    good:"",
    bad:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var configs = wx.getStorageSync("configs");
      if (configs){
        var timeStr = configs["daystart"];
        var day = configs["weekstart"];
        var good = configs["enjoyofgood"];
        var bad = configs["enjoyofbad"];
        var timeindex = timeStr.split(":")[0] - 0;
        var dayindex = day - 0;
        this.setData({ dayindex, timeindex, bad, good});
      }
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
  
  },
  setSetting(e){
    var data = e.detail.value;
    var timeindex = this.data.timeindex + ":00";
    if(timeindex.length < 5){
      timeindex = "0" + timeindex;
    }
    data.daystart = timeindex;
    data.weekstart = this.data.dayindex + "";
    resource.request({
      url: config.setConfigs,
      data,
      method:"POST"
    });
    wx.setStorageSync("configs", data);
    wx.navigateBack();
  },
  cancel(){
    wx.navigateBack();
  },
  timetap(e){
    this.setData({
      timeindex: e.detail.value
    })
  },
  daytap(e){
    this.setData({
      dayindex: e.detail.value
    })
  }
})