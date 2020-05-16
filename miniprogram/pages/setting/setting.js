const util = require('../../utils/util.js')
Page({
  data: {
    isComplete: ['', 'cuIcon-roundclosefill text-red', 'cuIcon-timefill text-zyg', 'cuIcon-timefill text-zyg', 'cuIcon-roundcheckfill text-pink', 'cuIcon-roundclosefill text-red'],
    orderState: util.orderState,
    chargeType: [{
      "name": "全部",
      "type": "single"
    }],
    TabCur: 0,
    scrollLeft: 0,
    index: 0,
    typeIndex: 0,
    stateIndex: 2
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中...',
    })
    this.getOrders(0)

  },

  tabSelect(e) {

    let state = e.currentTarget.dataset.state * 1
    console.log(state)
    this.setData({
      TabCur: state,
      scrollLeft: (state - 1) * 60
    })
    this.getOrders(state)
  },


  getOrders(state) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.cloud.callFunction({
      name: "getOrders",
      data: {
        method: "get",
        orderState: state
      }
    }).then(res => {
      wx.hideLoading()
      let orderList = res.result
      if (orderList.length) {
        for (let item in orderList) {
          let date = new Date(orderList[item].order_time)
          orderList[item].order_time = util.formatTime(date)
        }
        this.setData({
          hasOrderList: true,
          orderList
        })
      } else {
        this.setData({
          hasOrderList: false
        })
      }
    })


  },

  ship(e) {
    let id = e.currentTarget.dataset.id
    let orderState = this.data.TabCur
    wx.cloud.callFunction({
      name: "getOrders",
      data: {
        method: "update",
        orderId: id,
        orderState: 2
      }
    }).then(res => {
      this.getOrders(orderState)
    })

  },

  closeOrder(e) {
    let index = e.currentTarget.dataset.index * 1
    let orderList = this.data.orderList
    let order = orderList[index]
    let orderState = this.data.TabCur
    wx.cloud.callFunction({
      name: "wechatPay",
      data: {
        method: "closeOrder",
        orderId: order._id,
        orderNo: order.order_no
      }
    }).then(res => {
      console.log(res)
      this.getOrders(orderState)
    })

  },

  queryOrder(e) {
    let orderNo = e.currentTarget.dataset.orderno
    wx.cloud.callFunction({
      name: "wechatPay",
      data: {
        method: "queryOrder",
        orderNo
      }
    }).then(res => {
      if (res.result.returnCode === "SUCCESS") {
        wx.showToast({
          title: res.result.tradeStateDesc,
          icon: "none"
        })
      } else {
        wx.showToast({
          title: '未查到该订单支付信息',
          icon: "none"
        })
      }
    })
  },



  onPullDownRefresh: function () {
    this.onLoad()

  },

})