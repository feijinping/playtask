// view/addContent/addContent.js
var ctype = 0;
var path = [];
var id = -1;
var period = ["DAILY","WEEKLY","NONE"];
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{ value: "每日", checked: false }, { value: "每周", checked: false }, { value: "普通", checked: false }],
    task:{},
    optype:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var op = options.op;
    if (op == 'update'){
      var cont = JSON.parse(options.task);
      var items = this.data.items;
      if(cont.period === "DAILY"){
        items[0].checked = true;
      } else if(cont.period === "WEEKLY"){
        items[1].checked = true;
      }else{
        items[2].checked = true;
      }
      this.setData({items:items});
      this.setData({ task:cont});
      this.setData({ optype: op});
    }else{
      this.setData({ optype: op});
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
  retfontpage: function () {
    wx.switchTab({
      url: '/view/task/task'
    })
  },
  formSubmit : function(e){
    var task = this.data.task;
    delete task["display"];
    delete task["opdisplay"];
    var va = e.detail.value;
    task.name=va.value;
    task.score = va.score;
    task.period = period[va.period];
    task.totalTime = va.time;
    wx.request({
      url: config.saveTask,
      data: JSON.stringify(task),
      method:"POST",
      success:function(re){
        console.log(re);
        wx.switchTab({
          url: '/view/task/task'
        })
      },
      fail:function(re){
        console.log(re);
      }
    })
  },
  radioChange : function(e){
    ctype = e.detail.value - 0;
  }
})