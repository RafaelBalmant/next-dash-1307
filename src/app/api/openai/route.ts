import client from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    const response = await client.responses.create({
        model: "gpt-4.1",
        input: prompt
    });
    
    return NextResponse.json({message: response.output_text}, {status: 200});
}