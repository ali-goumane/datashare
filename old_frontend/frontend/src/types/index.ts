export type User = { userId: number; email: string }
export type AuthResponse = { access_token: string; user: User }
export type FileInfo = { fileId?: number; token: string; name: string; type: string | null; size: number; expireAt?: string; expire_at?: string; hasPassword: boolean; expired?: boolean; uploadedAt?: string; status?: 'valid' | 'expired'; tags?: string[] }
