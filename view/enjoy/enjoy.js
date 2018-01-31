// view/enjoy/enjoy.js
var compont = require("../template/compont.js");
var tils = ["good", "bad"];
var index = 0,front_id = -1;
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: getApp().globalData.height,
    score: wx.getStorageSync("totalscore"),
    enjoys: wx.getStorageSync("enjoy"),
    enjoy:[],
    index:0,
    complateCheck:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var init = (enjoys)=>{
      this.setData({ enjoys: enjoys })
      this.setData({ enjoy: enjoys[tils[0]] });
    }
    var initScore = (data)=>{
      this.setData({ score: data.banlance});
    }
    wx.request({
      url: config.allEnjoy,
      success:function(result){
        var enjoys = result.data;
        var enjoyOfGood=[],enjoyOfBad = [];
        for (let i = 0; i < enjoys.length; i ++){
          var enjoy = enjoys[i];
          enjoy.display = true;
          enjoy.opdisplay = false;
          if(enjoy.tag === "good"){
            enjoyOfGood.push(enjoy);
          }else{
            enjoyOfBad.push(enjoy);
          }
        }
        init({
          good:enjoyOfGood,
          bad:enjoyOfBad
        })
      },
      fail:function(err){
        console.log(err);
      }
    })
    wx.request({
      url: config.queryScore,
      success:function(re){
        initScore(re.data)
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
    if (!this.onload) {
      this.onLoad();
    }
    this.onload = false;
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
  switchmemu: function (e) {
    var id = e.target.id.split("_")[1] - 0;
    index = id;
    this.setData({ complateCheck: false });
    this.setData({ index: id });
    this.setData({ enjoy: this.data.enjoys[tils[id]] });
  },
  addContent: function (e) {
    var url = "../addContent/addContent?op=add&cType=enjoy"
    wx.navigateTo({
      url: url,
    })
  },
  updateTask(e) {
    var id = e.target.id.split("_")[1];
    var enjoy = this.data.enjoy[id];
    console.log(enjoy);
    var url = "../addContent/addContent?op=update&cType=enjoy&cont=" + JSON.stringify(enjoy);
    wx.navigateTo({
      url: url,
    })
  },
  updateOrDelete: function (e) {
    var id = e.currentTarget.id.split("_")[1] - 0;
    if (front_id !== -1) {
      this.data.enjoy[front_id].opdisplay = false;
    }
    this.data.enjoy[id].opdisplay = true;
    front_id = id;
    this.setData({ enjoy: this.data.enjoy });
  },
  deleteContent: function (e) {
    var id = e.target.id.split("_")[1] - 0;
    var enjoy = this.data.enjoy;
    wx.request({
      url: config.deleteTask + "?id=" + enjoy[id].id,
    })
    enjoy.splice(id, 1);
    var enjoys = this.data.enjoys;
    enjoys[tils[index]] = enjoy;
    this.setData({ enjoys: enjoys });
    this.setData({ enjoy: enjoy });
  },
  complateCont: function (e) {
    var id = e.currentTarget.id.split("_")[1] - 0;
    var enjoy = this.data.enjoy;
    var score = this.data.score;
    var ts = enjoy[id];
    if (this.data.complateCheck) {
      ts.complated -= 1;
      if (ts.complated == 0) {
        ts.display = false;
      }
      score += ts.score - 0;
      this.setData({
        score
      });
      wx.request({
        url: config.undoEnjoy + "?id=" + ts.id,
      })
    } else {
      ts.complated += 1;
      if (ts.totalTime == -1){
        ts.display = true;
      }else if (ts.complated >= ts.totalTime) {
        ts.display = false;
      }
      score -= ts.score - 0;
      this.setData({
        score
      });
      wx.request({
        url: config.doEnjoy + "?id=" + ts.id,
      })
    }

    var enjoys = this.data.enjoys;
    enjoys[tils[index]] = enjoy;
    this.setData({ enjoy: enjoy });
    this.setData({ enjoys: enjoys });
  },
  showComplate: function (e) {
    //true 是勾选，显示已完成的
    var zx = !this.data.complateCheck;
    var enjoy = this.data.enjoy;
    for (let i = 0; i < enjoy.length; i++) {
      if (zx) {
        if (enjoy[i].complated > 0) {
          enjoy[i].display = true;
        } else {
          enjoy[i].display = false;
        }
      } else {
        if (enjoy[i].totalTime === -1) {
          enjoy[i].display = true;
        } else if (enjoy[i].complated < enjoy[i].totalTime) {
          enjoy[i].display = true;
        } else {
          enjoy[i].display = false;
        }
      }
    }
    this.setData({ enjoy: enjoy });
    this.setData({ complateCheck: zx });
  },
  menuClick(e) {
    if ( front_id != -1) {
      var enjoy = this.data.enjoy;
      enjoy[front_id].opdisplay = false;
      this.setData({ enjoy })
    }
  },
})