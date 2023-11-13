import urllib from 'urllib'
import { Duplex } from 'stream'
import aliyunOSS from 'ali-oss'

import { aliyunConfig } from '../constants/index.js'
import { getRandomFileName } from '../utils/index.js'

export function uploadWebStreamFile(webStreamUrl) {
  const client = new aliyunOSS({
    region: aliyunConfig.region,
    accessKeyId: aliyunConfig.accessKeyId,
    accessKeySecret: aliyunConfig.accessKeySecret,
    bucket: aliyunConfig.bucket
  })
  return new Promise((resolve, reject) => {
    // 指定网络流URL
    const url = webStreamUrl
    // 导入双工流
    // stream参数可以是任何实现了Readable Stream的对象，包含文件流，网络流等
    // 实例化双工流
    let stream = new Duplex()

    console.log('webStreamUrl: ', webStreamUrl);

    urllib.request(url, (err, data, res) => {
      if (!err) {
        // 通过双工流接收数据
        stream.push(data)
        stream.push(null)

        // 填写Object完整路径，例如example.png。Object完整路径中不能包含Bucket名称
        const objectPath = aliyunConfig.storagePath + getRandomFileName()

        client.putStream(objectPath, stream).then((res) => {
          console.log('putStream result: ', res)
          resolve(res)
        }).catch(e => {
          console.log('error', e)
          resolve(false)
          // reject(new Error('Aliyun upload file exception.'))
        })
      }
    })
  })
}

export default uploadWebStreamFile
