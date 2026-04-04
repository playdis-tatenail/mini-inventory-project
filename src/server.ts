import { Elysia, t } from 'elysia'
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { cors } from "@elysiajs/cors"
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
  // Lab 3
  .patch('/inventory/:id/adjust', async ({ params, body, set }) => {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      set.status = 404
      return { message: 'ไม่พบสินค้านี้ในระบบ' }
    }

    const newQuantity = product.quantity + body.change

    return await prisma.product.update({
      where: { id: params.id },
      data: { quantity: newQuantity }
    })
  }, {
    body: t.Object({
      change: t.Number()
    })
  })

  // Lab 4
  .delete('/inventory/:id', async ({ params, set }) => {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      set.status = 404
      return { message: 'ไม่พบสินค้านี้ในระบบ' }
    }

    if (product.quantity > 0) {
      set.status = 400
      return { message: 'ไม่สามารถลบสินค้าที่ยังมีอยู่ในสต็อกได้' }
    }

    return await prisma.product.delete({
      where: { id: params.id }
    })
  })
  .listen(PORT) 

console.log(`🚀 Server is running at http://localhost:${PORT}`);
export type App = typeof app;