import { CodeErrorEnum } from '@core/domain/enums/code-error.enum';
import DomainError from '@core/domain/errors/domain.error';

export class EmptyDescriptionProductError extends DomainError {
  readonly codeError: CodeErrorEnum = CodeErrorEnum.EMPTY_DESCRIPTION_PRODUCT;
  readonly message: string = 'Descrição de produto não pode ser vazia.';
}
