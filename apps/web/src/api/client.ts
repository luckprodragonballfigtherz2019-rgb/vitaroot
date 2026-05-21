import { z } from 'zod'

const API_BASE = '/api/v1'

/**
 * Error HTTP custom con código de estado.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Cliente HTTP tipado con validación Zod.
 *
 * Devuelve el tipo de OUTPUT del schema (con defaults aplicados).
 */
export async function request<S extends z.ZodTypeAny>(
  path: string,
  schema?: S,
  options?: RequestInit,
): Promise<z.output<S>> {
  const url = `${API_BASE}${path}`

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  } catch (error) {
    throw new ApiError(0, 'Network error: no se pudo conectar al servidor', error)
  }

  if (!response.ok) {
    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = null
    }
    throw new ApiError(response.status, `HTTP ${response.status}`, body)
  }

  // 204 No Content: no hay body que parsear
  if (response.status === 204) {
    return undefined as z.output<S>
  }

  const data: unknown = await response.json()

  if (schema) {
    const result = schema.safeParse(data)
    if (!result.success) {
      throw new ApiError(
        response.status,
        'Respuesta del servidor no coincide con el schema esperado',
        result.error.flatten(),
      )
    }
    return result.data
  }

  return data as z.output<S>
}
