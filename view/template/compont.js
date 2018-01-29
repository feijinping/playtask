function displayItem(target) {
  
  var query = wx.createSelectorQuery();
  var node = query.select("#" + target.id);
  console.log(node);
}
function complateCont(id,ctype,index) {
  var ctypedata = wx.getStorageSync(ctype);
  var totalscore = wx.getStorageSync("totalscore")-0;
  var item = ctypedata[index][id];
  if (item.time !== -1){
    item.complated = item.complated + 1;
  }
  
  // if(item.time == 0){
  //   item.isdisplay = false;
  // }
  if (ctype == "enjoy" || index=="badhabit"){
    totalscore = totalscore - item.score;
  }else{
    totalscore = totalscore + (item.score - 0);
  }
  ctypedata[index][id] = item;
  wx.setStorageSync(ctype, ctypedata);
  wx.setStorageSync("totalscore", totalscore);
}
var showComplate = function(){
  showComplate
}
module.exports.displayItem = displayItem;
exports.complateCont = complateCont;