import { CodeErrorEnum } from '../../../core/domain/enums/code-error.enum';
import DomainError from '../../../core/domain/errors/domain.error';

export default class ProductNotFoundError extends DomainError {
  readonly codeError: CodeErrorEnum = CodeErrorEnum.PRODUCT_NOT_FOUND;
  readonly message: string = 'Não foi possível encontrar o produto.';
}
