import { Elysia, t } from 'elysia'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient(
  
)

const app = new Elysia()
  .get('/inventory', async ({ query }) => {
    // 1. ตรวจสอบเงื่อนไขสินค้าใกล้หมดสต็อก [cite: 187, 198]
    const isLowStock = query.low_stock === 'true'

    // 2. กำหนด Sorting [cite: 188, 201]
    // ใช้ค่าจาก query ตรงๆ ได้เลยเพราะเราจะทำ Validation ที่ Schema ด้านล่างแล้ว
    const sortBy = query.sortBy || 'name'
    const sortOrder = query.order || 'asc'

    return await prisma.product.findMany({
      where: isLowStock 
        ? { quantity: { lte: 10 } } // กรอง quantity <= 10 [cite: 198]
        : {},
      orderBy: {
        [sortBy]: sortOrder,
      }
    })
  }, {
    // 3. Built-in Validation: ใช้เกราะป้องกันข้อมูล (TypeBox) [cite: 74, 75]
    query: t.Object({
      low_stock: t.Optional(t.String()),
      // จำกัดให้เลือกได้เฉพาะ field ที่เราอนุญาตเท่านั้น
      sortBy: t.Optional(t.Union([t.Literal('name'), t.Literal('quantity')])),
      order: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')]))
    })
  })
  .listen(3000)

console.log(`🦊 Server is running at http://localhost:3000`)