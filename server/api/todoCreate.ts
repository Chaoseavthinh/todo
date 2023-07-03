import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  body.createdAt = new Date().toDateString();
  if ((await event.req.method) === "POST") {
    try {
      const todo = await prisma.todo.findMany();
      const newTodo = todo.filter((item) => item.todo === body.todo);
    
      if (newTodo.length >= 1) {
        return {
          success: true,
          smg: "Todo already exists!",
          reason: true,
        }
      } else {
        await prisma.todo.create({ data: body })
        return {
          success: true,
          smg: "Create success!",
        }
      }
    } catch (err) {
      return {
        success: false,
        data: err,
        smg: "Create fail!",
      }
    }
  }
})
