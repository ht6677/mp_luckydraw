// pages/luckydraw/list.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		orderTypeStr:["即将开奖","过期的抽奖"],
    list: [],
		canloadmore: false,
		page: 0,
		type:3
  },
	btnChangeTab: function (e) {
		var that = this;
		that.setData({
			type: e.currentTarget.dataset.type
		});
		that.updateList();
	},
	btnChangeOrder: function () {
		var that = this;
		wx.showActionSheet({
			itemList: that.data.orderTypeStr,
			success: function (res) {
				if (res.tapIndex < that.data.orderTypeStr.length) {
					that.setData({
						type: res.tapIndex+3
					});
					that.updateList();
				}
			}
		})
	},
	btnLoadMore: function () {
		if (this.data.canloadmore) {
			this.data.page += 1;
			this.updateList(this.data.page);
		}
	},
	updateList: function (page = 0) {
		var that = this;
		wx.showLoading({
			title: '请求中',
			mask: true
		})
		wx.request({
			url: app.ServerUrl() + '/api/listluckydraw.php',
			method: 'GET',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data: {
				page: page,
				type:that.data.type,
				limit:10,
				token: app.globalData.token
			},
			complete: function (res) {
				wx.hideLoading();
				wx.stopPullDownRefresh();
			},
			success: function (res) {
				if (parseInt(res.data.err) == 0) {
					var newlist = res.data.result;

					for (var i = 0; i < newlist.length; i++) {
						var item = newlist[i];
						if (item["awardimage"] != "") {
							item["awardimage"] = app.CDNUrl() + "/upload/" + item["awardimage"];
						} else {
							item["awardimage"] = "../../images/defaultawardimage.jpg";
						}
						item["opendatestr"] = util.formatDate(new Date(item["opendate"] * 1000), "MM月dd日 hh:mm");
						item["opentypestr"] = ["自动开奖", "参与者达到 " + item['openneedusers'] + " 人时自动开奖", "发起人手动开奖"][item['opentype']];
					}

					var list = [];
					if (page <= 0) {
						list = newlist;
					} else {
						list = that.data.list.concat(newlist);
					}

					that.setData({
						list: list,
						page: page,
						canloadmore: newlist.length >= 10
					});
				}
			}
		});
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.updateList();
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
		return app.getMainAppShare();
  }
})