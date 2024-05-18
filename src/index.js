import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import manifest from '__STATIC_CONTENT_MANIFEST'

const app = new Hono()

app.get('/*', serveStatic({ root: '/', manifest }))

app.get('/api/tracked', async c => {
  const value = c.req.query('value')
  if (!value || !(value.includes('b23.tv') || value.includes('xhslink.com')))
    return c.text('请发送带有正确跟踪短链的参数', 404)
  const res = await fetch(value, { redirect: 'manual' })
  const location = res.headers.get('location') ?? null
  if (!location) return c.text('没有完整的跟踪链接，请查找输入是否正确', 404)
  const source = new URL(location)
  return c.text(source.origin + source.pathname)
})

export default app
