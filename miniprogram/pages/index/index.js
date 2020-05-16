//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {},

  onLoad: function () {
    db.collection('product').get()
      .then(res => {
        this.setData({
          product: res.data
        })
      })
      
  },

  buy(e) {
    let productId = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: "wechatPay",
      data: {
        method:"unifiedOrder",
        productId
      }
    }).then(res => {
      console.log(res)
      let prepay = res.result.payment
      this.pay(prepay)
    })
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
  }

})