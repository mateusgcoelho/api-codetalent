export enum CodeErrorEnum {
  PRODUCT_NOT_FOUND = 1,
  SUPERMARKET_NOT_FOUND = 2,
  SALE_PRICE_ALREADY_EXISTS = 3,
  EMPTY_DESCRIPTION_PRODUCT = 4,
  LIMIT_DESCRIPTION_SIZE = 5,
  UNMAPPED_ERROR = 6,
  SALE_PRICE_NOT_FOUND = 7,
}

export namespace CodeErrorEnum {
  export function getStatusCode(codeError: CodeErrorEnum): number {
    switch (codeError) {
      case CodeErrorEnum.EMPTY_DESCRIPTION_PRODUCT:
      case CodeErrorEnum.LIMIT_DESCRIPTION_SIZE:
        return 400;

      case CodeErrorEnum.PRODUCT_NOT_FOUND:
      case CodeErrorEnum.SUPERMARKET_NOT_FOUND:
      case CodeErrorEnum.SALE_PRICE_NOT_FOUND:
        return 404;

      case CodeErrorEnum.SALE_PRICE_ALREADY_EXISTS:
        return 409;

      default:
        return 500;
    }
  }
}
