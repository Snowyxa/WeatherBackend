const NOT_FOUND = 'NOT_FOUND';
const VALIDATION_ERROR = 'VALIDATION_ERROR';
const FORBIDDEN = 'FORBIDDEN';
const UNAUTHORIZED = 'UNAUTHORIZED';

class ServiceError extends Error {

  constructor(message, code, details = {} ) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'ServiceError';
  }
 
    static notFound(message, details) {
        return new ServiceError(message, NOT_FOUND, details);
    }

    static validationError(message, details) {
        return new ServiceError(message, VALIDATION_ERROR, details);
    }

    static forbidden(message, details) {
        return new ServiceError(message, FORBIDDEN, details);
    }

    static unauthorized(message, details) {
        return new ServiceError(message, UNAUTHORIZED, details);
    }

    get isUnauthorized() {
        return this.code === UNAUTHORIZED;
    }
    

    get isForbidden() {
        return this.code === FORBIDDEN;
    }

    get isNotFound() {
        return this.code === NOT_FOUND;
    }

    get isValidationError() {
        return this.code === VALIDATION_ERROR;
    }

}

module.exports = ServiceError;

