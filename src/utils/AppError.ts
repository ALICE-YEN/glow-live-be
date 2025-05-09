export class AppError extends Error {
  statusCode: number;
  code: string;
  errors?: { field: string; message: string }[];

  constructor(
    code: string,
    statusCode: number,
    message: string,
    errors?: { field: string; message: string }[]
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor); // 清理與重設錯誤堆疊追蹤（stack trace）起點為該類別本身
  }
}
