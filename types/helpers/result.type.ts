export type Result<T, E> = Success<T> | Failure<E>;

class Success<T> {
    readonly ok = true;
    constructor(
        public readonly value: T,
        public message: string = 'Operación exitosa'
    ) {}

    withMessage(msg: string): this {
        this.message = msg;
        return this;
    }
}

class Failure<E> {
    readonly ok = false;
    value = undefined as never;

    constructor(
        public readonly error: E,
        public message: string = 'Ocurrió un error'
    ) {}

    withMessage(msg: string): this {
        this.message = msg;
        return this;
    }
}

// Helpers
export function success<T>(value: T, message?: string): Result<T, never> {
    return new Success(value, message);
}

export function failure<E>(error: E, message?: string): Result<never, E> {
    return new Failure(error, message);
}