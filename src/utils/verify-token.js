// 模拟一个简单的 Token 验证函数
function verifyToken(token) {
  const expiration = token.slice(token.indexOf('_') + 1)
  const currentTimeInMilliseconds = new Date().getTime()
  const currentTimeInSeconds = Math.floor(currentTimeInMilliseconds / 1000)
  return expiration > currentTimeInSeconds;
}

// 中间件，用于验证请求头中的 Token
export async function authenticate(ctx, next) {
  const token = ctx.headers.authorization;

  if (ctx.url === '/get-data') {
    await next();
    return
  }

  // 如果请求头中没有 Token，返回 401 Unauthorized
  if (!token) {
    ctx.status = 401;
    ctx.body = 'Unauthorized';
    return;
  }

  // 如果 Token 无效，返回 403 Forbidden
  if (!verifyToken(token)) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  // Token 验证通过，继续处理请求
  await next();
}
