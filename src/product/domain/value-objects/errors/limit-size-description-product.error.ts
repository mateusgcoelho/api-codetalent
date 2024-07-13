import { CodeErrorEnum } from '@core/domain/enums/code-error.enum';
import DomainError from '@core/domain/errors/domain.error';
import DescriptionProductVo from '../description-product.vo';

export class LimitSizeDescriptionProductError extends DomainError {
  readonly codeError: CodeErrorEnum = CodeErrorEnum.LIMIT_DESCRIPTION_SIZE;
  readonly message: string = `A descrição do produto deve conter no máximo ${DescriptionProductVo.MAX_LENGTH} de caractere(s).`;
}
