export type User = {
  userId: number
  email: string
  createdAt?: string
  updatedAt?: string
}

export type AuthResponse = {
  access_token: string
  user: User
}

export type UploadedFile = {
  fileId: number
  token: string
  name: string
  type: string | null
  size: number
  expireAt: string
  hasPassword: boolean
  tags: string[]
}

export type FileHistoryItem = {
  fileId: number
  token: string
  name: string
  type: string | null
  size: number
  uploadedAt: string
  expireAt: string
  hasPassword: boolean
  tags: string[]
  status: 'valid' | 'expired'
}

export type FileMetadata = {
  name: string
  type: string | null
  size: number
  expire_at: string
  hasPassword: boolean
  expired: boolean
}

export type ApiErrorBody = {
  message?: string | string[]
  statusCode?: number
  error?: string
}
