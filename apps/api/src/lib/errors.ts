/**
 * Error con statusCode HTTP asociado.
 * El error-handler global lo convierte a la respuesta JSON correcta.
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`)
  }
}
