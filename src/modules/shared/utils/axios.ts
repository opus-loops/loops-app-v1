import axios from "axios"
import { Effect } from "effect"
import { refreshAccessToken } from "../api/auth/refresh"
import {
  deleteSession,
  getSession,
  updateTokens,
} from "../shell/session/session"

export const instanceFactory = async () => {
  const session = await getSession()

  if (!session) {
    return axios.create({
      headers: { Authorization: "" },
      baseURL: baseApiURL,
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
      withCredentials: true,
    })
  }

  const tokens = {
    accessToken: response.value.access.token,
    refreshToken: response.value.refresh.token,
  }

  await updateTokens(tokens)

  return axios.create({
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
    baseURL: baseApiURL,
    withCredentials: true,
  })
}

export const baseApiURL = import.meta.env.VITE_API_URL
