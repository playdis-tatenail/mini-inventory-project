import { Elysia, t } from 'elysia'
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { cors } from "@elysiajs/cors"
import * as dotenv from 'dotenv'

dotenv.config()

// ตั้งค่า Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const PORT = Number(process.env.PORT ?? 3000);

const app = new Elysia()
  .use(cors())

  // --- Lab 1: ดึงข้อมูลสินค้า ---
  .get('/inventory', async ({ query }) => {
    const isLowStock = query.low_stock === 'true'
    return await prisma.product.findMany({
      where: isLowStock ? { quantity: { lte: 10 } } : {},
      orderBy: { name: 'asc' }
    })
  }, {
    query: t.Object({
      low_stock: t.Optional(t.String())
    })
  })

  // --- Lab 2: เพิ่มสินค้า (ยุบรวมเหลืออันเดียวแล้ว) ---
  .post('/inventory', async ({ body, set }) => {
    try {
      return await prisma.product.create({
        data: {
          name: body.name,
          sku: body.sku,
          zone: body.zone,
          quantity: Number(body.quantity),
          price: Number(body.price)
        }
      })
    } catch (error: any) {
      if (error.code === 'P2002') {
        set.status = 400
        return { message: 'SKU นี้มีอยู่ในระบบแล้ว' }
      }
      set.status = 500
      return { message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      sku: t.String({ minLength: 1 }),
      zone: t.String({ minLength: 1 }),
      quantity: t.Optional(t.Numeric({ default: 0 })),
      price: t.Optional(t.Numeric({ default: 0 }))
    })
  })

  // --- Lab 3: ปรับสต็อก (Patch) ---
  .patch('/inventory/:id/adjust', async ({ params, body, set }) => {
    try {
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
    } catch (error) {
      set.status = 500
      return { message: 'ไม่สามารถอัปเดตสต็อกได้' }
    }
  }, {
    body: t.Object({
      change: t.Number()
    })
  })

  // --- Lab 4: ลบสินค้า (Delete) ---
  .delete('/inventory/:id', async ({ params, set }) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: params.id }
      })

      if (!product) {
        set.status = 404
        return { message: 'ไม่พบสินค้านี้ในระบบ' }
      }

      // Logic: ห้ามลบถ้ายังมีของ
      if (product.quantity > 0) {
        set.status = 400
        return { message: 'ไม่สามารถลบสินค้าที่ยังมีอยู่ในสต็อกได้' }
      }

      await prisma.product.delete({
        where: { id: params.id }
      })
      
      return { message: 'ลบสินค้าสำเร็จ' }
      
    } catch (error) {
      set.status = 500
      return { message: 'เกิดข้อผิดพลาดในการลบสินค้า' }
    }
  })

  .listen(PORT)

console.log(`🚀 Server is running at http://localhost:${PORT}`);
export type App = typeof app;