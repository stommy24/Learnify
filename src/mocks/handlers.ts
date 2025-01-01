import { rest } from 'msw'

export const handlers = [
  rest.get('/api/test', (req, res, ctx) => {
    return res(ctx.json({ message: 'Test success' }))
  }),
  
  // Socket.io handler
  rest.get('/socket.io/*', (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  
  rest.post('/socket.io/*', (req, res, ctx) => {
    return res(ctx.status(200))
  })
] 