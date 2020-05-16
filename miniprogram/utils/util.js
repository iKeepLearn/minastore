const formatTime = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  // return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const orderState = [{
  "name": "未付款",
  "color": "bg-green"
}, {
  "name": "待发货",
  "color": "bg-red"
}, {
  "name": "待收货",
  "color": "bg-orange"
}, {
  "name": "待评价",
  "color": "bg-blue"
}, {
  "name": "已完成",
  "color": "bg-green"
}, {
  "name": "已关闭",
  "color": "bg-grey"
}]


module.exports = {
  formatTime,
  orderState,
}