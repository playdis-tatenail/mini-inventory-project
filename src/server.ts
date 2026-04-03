import { Elysia, t } from 'elysia'
import { PrismaClient } from "@prisma/client"
import { cors } from "@elysiajs/cors"
import * as dotenv from 'dotenv'

dotenv.config()

// กลับมาใช้แบบมาตรฐาน ไม่ต้อง Hard-code URL แล้ว!
const prisma = new PrismaClient()

const PORT = Number(process.env.PORT ?? 3000);

const app = new Elysia()
  .use(cors())
  .get('/inventory', async ({ query }) => {
    const isLowStock = query.low_stock === 'true'
    return await prisma.product.findMany({
      where: isLowStock ? { quantity: { lte: 10 } } : {},
      orderBy: { name: 'asc' }
    })
  })
  .post('/inventory', async ({ body }) => {
    return await prisma.product.create({
      data: {
        name: body.name,
        sku: body.sku,
        zone: body.zone,
        quantity: Number(body.quantity)
      }
    })
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      sku: t.String({ minLength: 1 }),
      zone: t.String({ minLength: 1 }),
      quantity: t.Optional(t.Numeric({ default: 0 }))
    })
  })
  .listen(PORT);

console.log(`🚀 Server is running at http://localhost:${PORT}`);
export type App = typeof app;