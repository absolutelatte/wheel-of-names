import { NextResponse } from 'next/server';

interface HealthResponse {
  readonly status: 'ok' | 'error';
  readonly timestamp: string;
  readonly version: string;
}

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  };

  return NextResponse.json(response);
}
