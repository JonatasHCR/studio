import { NextResponse } from 'next/server';
import { expenses } from '@/lib/data';

export async function GET() {
  // Em um aplicativo real, isso viria de um banco de dados.
  return NextResponse.json(expenses);
}
