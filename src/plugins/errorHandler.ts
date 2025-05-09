import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../utils/AppError";
import { formatAjvErrors } from "../utils/formatAjvError";

// 註冊一個全域錯誤處理器
export function registerErrorHandler(app) {
  app.setErrorHandler(
    (error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
      console.log("Error:", error);
      // 預設錯誤資訊
      let code = "ERR_INTERNAL";
      let statusCode = 500;
      let message = "Internal Server Error";
      let errors;

      // throw new AppError
      if (error instanceof AppError) {
        code = error.code;
        statusCode = error.statusCode;
        message = error.message;
        errors = error.errors;
      }

      // AJV 驗證錯誤
      else if (error.validation) {
        code = "ERR_VALIDATION";
        statusCode = 400;
        message = "資料驗證錯誤";
        errors = formatAjvErrors(error.validation);
      }

      reply.status(statusCode).send({
        success: false,
        code,
        message,
        statusCode,
        ...(errors && { errors }),
      });
    }
  );
}
