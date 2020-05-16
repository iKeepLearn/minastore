// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "kefu-714hv"
})
const db = cloud.database()

let order = {}

order.get = async function ({
  orderState
}) {
  let {
    data
  } = await db.collection('orders').where({
    payment_state: orderState
  }).orderBy("order_time", "desc").get()

  return data
}

order.update = async function ({
  orderId,
  orderState
}) {
  let result = await db.collection('orders').doc(orderId).update({
    data: {
      payment_state: orderState
    }
  })

  return result
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    orderId,
    method,
    orderState
  } = event
  let result = await order[method](event)

  return result


  // result = await db.collection('orders').where({
  //   payment_state: orderState
  // }).get()

  // let data = result.data
  // return {
  //   event,
  //   data,
  // }
}