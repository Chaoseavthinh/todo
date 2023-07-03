import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    try{
      const todoList = await prisma.todo.findMany();
      if (todoList.length <= 0) {
        return {
          success: true,
          data: "No data",
        };
      } else {
        return {
          success: true,
          data: todoList,
        };
      }
    }catch(err){
      return {
        success: false,
        data: err,
      };
    };
  }
});