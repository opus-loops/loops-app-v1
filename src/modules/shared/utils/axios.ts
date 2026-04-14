import axios from "axios"
import { Effect } from "effect"

import { publicEnv } from "@/lib/public-env"

import { refreshAccessToken } from "../api/auth/refresh"
import {
  deleteSession,
  getSession,
  getUserTimezone,
  updateTokens,
} from "../shell/session/session"

export const instanceFactory = async () => {
  const session = await getSession()
  const userTimezone = getUserTimezone()

  if (!session) {
    return axios.create({
      baseURL: baseApiURL,
      headers: {
        Authorization: "",
        "X-User-Timezone": userTimezone ?? "UTC",
      },
      withCredentials: true,
    })
  }

  const response = await Effect.runPromiseExit(
    refreshAccessToken({ refresh: session.refreshToken }),
  )

  if (response._tag === "Failure") {
    deleteSession()

    return axios.create({
      baseURL: baseApiURL,
      headers: {
        Authorization: "",
        "X-User-Timezone": userTimezone ?? "UTC",
      },
      withCredentials: true,
    })
  }

  const tokens = {
    accessToken: response.value.access.token,
    refreshToken: response.value.refresh.token,
  }

  await updateTokens(tokens)

  return axios.create({
    baseURL: baseApiURL,
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      "X-User-Timezone": userTimezone ?? "UTC",
    },
    withCredentials: true,
  })
}

export const baseApiURL = publicEnv.apiUrl
