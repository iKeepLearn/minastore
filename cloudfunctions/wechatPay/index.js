// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"kefu-714hv"
})

const config = require("./config.json")

const db = cloud.database()

const logger = cloud.logger()

async function getProduct(productId) {
  let {
    data
  } = await db.collection('product').doc(productId).get()
  logger.info({
    "product": data
  })
  return data
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = wxContext.OPENID
  const productId = event.productId

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
      _openid,
      order_time: now,
      order_no:orderNo,
      product_image: product.image,
      product_name: product.name,
      product_price: product.price,
      payment_state: 0,
      payment: res
    }
  })


  return res

}