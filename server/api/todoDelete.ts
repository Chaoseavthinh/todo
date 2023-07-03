import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (event.req.method === "DELETE") {
    try {
      await prisma.todo.delete({
        where: {
          id: Number(query.id),
        }
      });
      return {
        success: true,
        smg: "Delete success!",
      };
    } catch (err) {
      return {
        success: false,
        data: err,
        smg: "Delete fail!",
      }
    }
  }
})