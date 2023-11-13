import aliyunOSS from 'ali-oss'
import { aliyunConfig } from '../constants/index.js'

const { STS } = aliyunOSS

function getAliyunSTS() {
  return new Promise((resolve, reject) => {
    let sts = new STS({
      accessKeyId: aliyunConfig.accessKeyId,
      accessKeySecret: aliyunConfig.accessKeySecret
    })
    sts.assumeRole(aliyunConfig.roleArn, aliyunConfig.policy, aliyunConfig.expiration, aliyunConfig.sessionName)
      .then((result) => {
        console.log('Sts: ', result)
        resolve(result)
      }).catch((err) => {
        console.log(err)
        reject(new Error('Aliyun sts exception.'))
      })
  })
}

async function getAliyunAuth(ctx) {
  try {
    const result = await getAliyunSTS()
    ctx.status = 200
    ctx.message = 'OK'
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-METHOD', 'GET')
    ctx.body = {
      AccessKeyId: result.credentials.AccessKeyId,
      AccessKeySecret: result.credentials.AccessKeySecret,
      SecurityToken: result.credentials.SecurityToken,
      Expiration: result.credentials.Expiration
    }
  } catch (error) {
    ctx.status = 502
    ctx.message = error.message
    ctx.body = {}
  }
}

export default getAliyunAuth
