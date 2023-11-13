import axios from 'axios'
import { uploadWebStreamFile } from './upload-web-stream-file.js'
import { aistudioConfig, aliyunConfig } from '../constants/index.js'

function getAistudio(params) {
  const { lora = '', qrCodeContent = '', qrCodeImage = '', prompt = '' } = params
  const requestConfig = {
    method: 'POST',
    baseURL: aistudioConfig.baseURL,
    url: aistudioConfig.generateUrl,
    data: {
      ...aistudioConfig.data,
      seed: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
      prompt,
      extraOptions: {
        lora,
        qrCodeContent,
        qrCodeImage,
        // loraList: aistudioConfig.loraList
      }
    },
    headers: aistudioConfig.headers
  }

  return new Promise((resolve, reject) => {
    axios.request(requestConfig).then(res => {
      console.log('Aistudio result: ', res.data)
      resolve(res.data)
    }).catch(err => {
      console.log(err)
      reject(new Error('Aistudio generate exception.'))
    })
  })
}

async function generateImage(ctx) {
  try {
    const { query = {}, request: { body: params } } = ctx

    const res = await getAistudio(params)
    const { errorMsg, result } = res

    if (errorMsg === 'success' && result.imgUrls[0]) {
      let uploadRes = await uploadWebStreamFile(result.imgUrls[0])
      // 再试一次
      if (!uploadRes) {
        console.log('again', result.imgUrls[0]);
        uploadRes = await uploadWebStreamFile(result.imgUrls[0])
      }
      ctx.status = 200
      ctx.message = 'OK'
      ctx.body = { imgUrl: uploadRes.url ? aliyunConfig.storageBaseUrl + uploadRes.name : '' }
    } else {
      ctx.status = 200
      ctx.message = 'Generate fail'
      ctx.body = { imgUrl: '' }
    }

  } catch (error) {
    ctx.status = 200
    ctx.message = 'Generate fail'
    ctx.body = { imgUrl: '' }
  }
}

export default generateImage
