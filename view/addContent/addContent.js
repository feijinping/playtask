// view/addContent/addContent.js
var ctype = 0;
var path = [];
var id = -1;
var period = ["day","week","common"];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{ value: "每日", checked: true }, { value: "每周", checked: false }, { value: "普通", checked: false }],
    task:{},
    optype:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    if (type == 'update'){
      path = options.id.split("-");
      var types = wx.getStorageSync(path[0]);
      var cont = types[path[1]][path[2]-0];
      id = cont.id;
      var items = this.data.items;
      if(cont.period == "day"){
        items[0].checked = true;
        ctype = 0;
      } else if (cont.period == "week"){
        items[1].checked = true;
        ctype = 1;
      }else{
        items[2].checked = true;
        ctype = 2;
      }
      this.setData({items:items});
      this.setData({ task:cont});
      this.setData({ optype: type + " " + path[0] });
    }else{
      path[0] = options.ctype;
      this.setData({ optype: type + options.ctype});
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
      url: '/view/' + path[0] + '/' + path[0]
    });
  },
  formSubmit : function(e){
    var cont = e.detail.value;
    cont.period = period[ctype];
    cont.isdiaplay=false;
    cont.id = id;
    cont.complated =0;
    var types = wx.getStorageSync(path[0]);
    if(this.data.optype.split(" ")[0] == "update"){
      if (path[0] == "task"&&cont.period !== path[1]) {
        var arr = [];
        for (var i = 0; i < types[path[1]].length; i++) {
          if (id == types[path[1]][i].id) {
            continue;
          }
          arr.push(types[path[1]][i]); 
        }
        types[path[1]] = arr;
        types[cont.period].push(cont);
      } else {
        types[path[1]][path[2] - 0] = cont;
      }
    }else{
      types[cont.period].push(cont);
    }
    wx.setStorageSync(path[0], types);
    wx.switchTab({
      url: '/view/' + path[0] + '/' + path[0]
    });
  },
  radioChange : function(e){
    ctype = e.detail.value - 0;
  }
})