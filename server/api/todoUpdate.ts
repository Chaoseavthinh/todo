import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body = await readBody(event);

  if (event.req.method === "PUT") {
    try {
      await prisma.todo.update({
        where: {
          id: Number(query.id),
        },
        data: body,
      });
      return {
        success: true,
        smg: "Update success!",
      };
    } catch (err) {
      return {
        success: false,
        data: err,
        smg: "Update fail!",
      };
    }
  }
});