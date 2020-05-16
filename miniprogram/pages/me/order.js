const app = getApp()
const util = require('../../utils/util.js')
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    orderState: util.orderState,
    hasOrderList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    db.collection("orders").where({
      _openid: "{openid}"
    }).get().then(res => {
      let orderList = res.data
      for (let item of orderList) {
        item.order_time = util.formatTime(item.order_time)
      }
      this.setData({
        orderList: res.data,
        hasOrderList: true
      })
      wx.hideLoading()
    })

  },

  viewDetail(e) {
    let id = e.currentTarget.dataset.id
    let url = `/pages/order/viewDetail?id=${id}`
    wx.navigateTo({
      url: url
    })
  },

  toPay(e) {
    let orderList = this.data.orderList
    let index = e.currentTarget.dataset.index * 1
    let order = orderList[index]
    const prepay = order.payment.payment
    this.pay(prepay)
  },


  pay(prepay) {
    const {
      timeStamp,
      nonceStr,
      signType,
      paySign,
    } = prepay
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: prepay.package,
      signType,
      paySign,
      success(res) {
        console.log('pay success', res)
      },
      fail(err) {
        console.error('pay fail', err)
      }
    })
  },



  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})