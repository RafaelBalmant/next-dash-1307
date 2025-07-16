import client from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, historyMessages } = await req.json();
  historyMessages.push({
    role: 'user',
    content: prompt,
  });
  console.log(historyMessages);
  const response = await client.responses.create({
    model: 'o4-mini',
    input: historyMessages,
  });

  return NextResponse.json({ message: response.output_text }, { status: 200 });
}
