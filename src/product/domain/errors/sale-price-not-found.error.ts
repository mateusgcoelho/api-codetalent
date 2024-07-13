import { CodeErrorEnum } from '../../../core/domain/enums/code-error.enum';
import DomainError from '../../../core/domain/errors/domain.error';

export default class SalePriceNotFound extends DomainError {
  readonly codeError: CodeErrorEnum = CodeErrorEnum.SALE_PRICE_NOT_FOUND;
  readonly message: string =
    'Preço venda de produto para a loja não encontrado.';
}
