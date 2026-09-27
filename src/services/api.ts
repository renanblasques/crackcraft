import { fetchAuthSession } from 'aws-amplify/auth'

const API_URL =
  import.meta.env.VITE_API_URL

export async function apiRequest<T = unknown>(
  path: string,
  method = 'GET',
  body?: unknown,
): Promise<T> {
  const session =
    await fetchAuthSession()

  const token =
    session.tokens
      ?.accessToken
      ?.toString()

  if (!token) {
    throw new Error(
      'Sessão não autenticada',
    )
  }

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        method,

        headers: {
          Authorization:
            `Bearer ${token}`,

          'Content-Type':
            'application/json',
        },

        body:
          body === undefined
            ? undefined
            : JSON.stringify(
                body,
              ),
      },
    )

  const text =
    await response.text()

  let data: unknown = null

  if (text) {
    try {
      data =
        JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    let message =
      `Erro ${response.status}`

    if (
      data &&
      typeof data === 'object'
    ) {
      const errorData =
        data as {
          error?: string
          message?: string
        }

      message =
        errorData.error ??
        errorData.message ??
        message
    }

    throw new Error(
      message,
    )
  }

  return data as T
}