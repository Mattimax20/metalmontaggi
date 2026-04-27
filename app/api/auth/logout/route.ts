import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Disconnesso' });
  response.cookies.delete('mm_token');
  return response;
}
