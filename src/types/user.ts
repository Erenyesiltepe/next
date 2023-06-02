export interface IUser {
  id: string
  name: string
  email: string
  status: number
  last_login_at: string
  last_login_ip: string
  created_at: any
  updated_at: string
  forceChange: boolean
  objectguid: string
  auth_type: string
  username: string
  locale: string
}

export interface IAccessToken {
  access_token: string
  token_type: string
  expires_in: number
  user: IUser
}
