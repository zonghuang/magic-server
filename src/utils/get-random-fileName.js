// 生成文件名
export function getRandomFileName() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let string = ''
  for (let i = 0; i < 10; i++) {
    let randomPoz = Math.floor(Math.random() * chars.length)
    string += chars.substring(randomPoz, randomPoz + 1)
  }

  const time = new Date().getTime()
  return string + time.toString().slice(-8) + '.png'
}
