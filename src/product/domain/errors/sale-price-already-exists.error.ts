import { CodeErrorEnum } from '../../../core/domain/enums/code-error.enum';
import DomainError from '../../../core/domain/errors/domain.error';

export default class SalePriceAlreadyExistsError extends DomainError {
  readonly codeError: CodeErrorEnum = CodeErrorEnum.SALE_PRICE_ALREADY_EXISTS;
  readonly message: string = 'Preço venda de produto ja existe para a loja.';
}
