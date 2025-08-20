export type Result<T, E> = Success<T> | Failure<E>;

class Success<T> {
    readonly ok = true;
    constructor(
        public readonly value: T,
        public message: string = 'Operación exitosa'
    ) {}
}

class Failure<E> {
    readonly ok = false;
    value = undefined as never;

    constructor(
        public readonly error: E,
        public message: string = 'Ocurrió un error'
    ) {}
}

//* Helpers
export function success<T>(value: T, message?: string): Result<T, never> {
    return new Success(value, message);
}

export function failure<E>(error: E, message?: string): Result<never, E> {
    return new Failure(error, message);
}

export function asFailure<E>(result: Result<unknown, E>): Failure<E> {
    if(result.ok) throw new Error('The result is not a failure');
    return result as Failure<E>;
}