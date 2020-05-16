// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "kefu-714hv"
})

const config = require("./config.json")

const db = cloud.database()

const logger = cloud.logger()

let wechatPay = {}

async function getProduct(productId) {
  let {
    data
  } = await db.collection('product').doc(productId).get()
  logger.info({
    "product": data
  })
  return data
}

async function getOrder(orderId) {
  const {
    data
  } = await db.collection('orders').doc(orderId).get()
  return data
}

wechatPay.unifiedOrder = async function ({
  productId,
  openid
}) {
  const product = await getProduct(productId)
  const now = Date.now()
  const orderNo = `cc${now}`
  const price = product.price * 100

  const res = await cloud.cloudPay.unifiedOrder({
    "body": product.name,
    "outTradeNo": orderNo,
    "spbillCreateIp": "127.0.0.1",
    "subMchId": config.mchid,
    "totalFee": price,
    "envId": "kefu-714hv",
    "functionName": "updatePaymentState"
  })

  const {
    _id
  } = await db.collection('orders').add({
    data: {
      product_id: productId,
      _openid: openid,
      order_time: now,
      order_no: orderNo,
      product_image: product.image,
      product_name: product.name,
      product_price: product.price,
      payment_state: 0,
      payment: res
    }
  })


  return res
}

wechatPay.closeOrder = async function ({
  orderId
}) {
  const order = await getOrder(orderId)

  const result = await cloud.cloudPay.closeOrder({
    "sub_mch_id": config.mchid,
    "out_trade_no": order.order_no,
    "nonce_str": order._id,
    "envId": "kefu-714hv",
    "functionName": "updatePaymentState"
  })

  if (result.errCode === 0) {
    await db.collection('orders').doc(orderId).update({
      data: {
        payment_state: 5
      }
    })
  }

  return result

}

wechatPay.queryOrder = async function ({
  orderNo
}) {
  const result = await cloud.cloudPay.queryOrder({
    "sub_mch_id": config.mchid,
    "out_trade_no": orderNo,
    "nonce_str": "order._id",
    "envId": "kefu-714hv",
    "functionName": "updatePaymentState"
  })

  logger.info({
    result
  })

  return result
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = wxContext.OPENID
  const method = event.method
  event.openid = _openid

  const result = await wechatPay[method](event)

  return result

}