import Koa from 'koa'
import mount from 'koa-mount'
import { koaBody } from 'koa-body'

import getData from './api/get-data.js'
import { authenticate } from './utils/verify-token.js'
import generateImage from './api/generate-image.js'
import getAliyunAuth from './api/get-aliyun-auth.js'
import uploadWebStreamFile from './api/upload-web-stream-file.js'

// const hostname = '192.168.1.3'
const hostname = '127.0.0.1'
const port = 9000

const app = new Koa()
app.use(koaBody())
app.use(authenticate)

app.use(mount('/sts', getAliyunAuth))
app.use(mount('/generate', generateImage))
app.use(mount('/upload-web-stream-file', uploadWebStreamFile))
app.use(mount('/get-data', getData))

app.on('error', (err, ctx) => {
  console.log('server error', err)
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

// Error: listen EADDRINUSE: address already in use 127.0.0.1:9000
// cd src
// npx kill-port 9000