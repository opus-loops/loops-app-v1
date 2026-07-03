import axios from "axios"
import { Effect } from "effect"

import { refreshAccessToken } from "../api/auth/refresh"
import {
  deleteSession,
  getSession,
  getUserTimezone,
  updateTokens,
} from "../shell/session/session"

export const baseApiURL = import.meta.env.VITE_API_URL

const appUserAgent = "loops-client/1.0.0"

const createInstanceConfig = (
  authorization: string,
  userTimezone?: string,
) => ({
  baseURL: baseApiURL,
  headers: {
    Authorization: authorization,
    "X-User-Timezone": userTimezone ?? "UTC",
    ...(typeof window === "undefined" && { "User-Agent": appUserAgent }),
  },
  withCredentials: true,
})

export const instanceFactory = async () => {
  const session = await getSession()
  const userTimezone = getUserTimezone()

  if (!session) {
    return axios.create(createInstanceConfig("", userTimezone))
  }

  if (session.accessToken) {
    return axios.create(
      createInstanceConfig(`Bearer ${session.accessToken}`, userTimezone),
    )
  }

  const response = await Effect.runPromiseExit(
    refreshAccessToken({ refresh: session.refreshToken }),
  )

  if (response._tag === "Failure") {
    deleteSession()

    return axios.create(createInstanceConfig("", userTimezone))
  }

  const tokens = {
    accessToken: response.value.access.token,
    refreshToken: response.value.refresh.token,
  }

  await updateTokens(tokens)

  return axios.create(
    createInstanceConfig(`Bearer ${tokens.accessToken}`, userTimezone),
  )
}
