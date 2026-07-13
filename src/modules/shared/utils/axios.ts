import { getRequestHeaders } from "@tanstack/react-start/server"
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

const createInstanceConfig = (
  authorization: string,
  userTimezone?: string,
  userAgent?: string,
) => ({
  baseURL: baseApiURL,
  headers: {
    Authorization: authorization,
    ...(userAgent && {
      "User-Agent": userAgent,
    }),
    "X-User-Timezone": userTimezone ?? "UTC",
  },
  withCredentials: true,
})

export const instanceFactory = async () => {
  const session = await getSession()
  const userTimezone = getUserTimezone()
  const headers = getRequestHeaders()
  const userAgent = headers.get("user-agent") ?? undefined

  if (!session) {
    return axios.create(createInstanceConfig("", userTimezone, userAgent))
  }

  if (session.accessToken) {
    return axios.create(
      createInstanceConfig(
        `Bearer ${session.accessToken}`,
        userTimezone,
        userAgent,
      ),
    )
  }

  const response = await Effect.runPromiseExit(
    refreshAccessToken({
      refresh: session.refreshToken,
    }),
  )

  if (response._tag === "Failure") {
    deleteSession()

    return axios.create(createInstanceConfig("", userTimezone, userAgent))
  }

  const tokens = {
    accessToken: response.value.access.token,
    refreshToken: response.value.refresh.token,
  }

  await updateTokens(tokens)

  return axios.create(
    createInstanceConfig(
      `Bearer ${tokens.accessToken}`,
      userTimezone,
      userAgent,
    ),
  )
}
