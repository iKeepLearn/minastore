// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "kefu-714hv"
})

const logger = cloud.logger()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const {
    outTradeNo,
    resultCode,
    returnCode,
    subAppid,
    subIsSubscribe,
    subOpenid
  } = event

  const result = await db.collection('orders').where({
    order_no: outTradeNo
  }).update({
    data: {
      payment_state: 1
    }
  })

  logger.info({
    event,
    result
  })

  return {

  }
}