import axios, { AxiosInstance } from "axios"

import { getAuthorizationHeader } from "@/lib/utils"

export class AuthService {
  protected readonly instance: AxiosInstance
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
  }

  login = (email: string, password: string, newPassword?: string) => {
    if (newPassword) {
      return this.instance.post("/change_password", {
        email,
        password,
        new_password: newPassword,
      })
    }

    return this.instance.post("/login", {
      email,
      password,
    })
  }

  logout = () => {
    return this.instance.post(
      "/logout",
      {},
      {
        headers: {
          ...getAuthorizationHeader(),
        },
      }
    )
  }
}
