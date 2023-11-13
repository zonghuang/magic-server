async function getData(ctx) {
  const { client, query = {}, request: { body: params } } = ctx
  
  console.log('query', query)
  console.log('params', params)
  const data = {
    userId: 1,
    userName: 'zonghuang'
  }

  ctx.status = 200
  ctx.message = 'OK'
  // ctx.response.status = 200
  // ctx.response.message = 'OK'
  console.log('ctx', ctx)
  ctx.body = data
}

export default getData
