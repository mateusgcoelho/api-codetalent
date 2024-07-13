import { CodeErrorEnum } from '../enums/code-error.enum';

export default abstract class DomainError extends Error {
  abstract readonly codeError: CodeErrorEnum;
}
