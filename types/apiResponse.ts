import type { NextApiResponse } from 'next';

export type ApiResponse<T> = NextApiResponse<T | { error: string }>;
