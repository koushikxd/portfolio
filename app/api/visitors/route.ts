import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

const VISITOR_KEY = "portfolio:visitors";

export async function POST(_: NextRequest) {
  try {
    const visitors = await redis.incr(VISITOR_KEY);
    return NextResponse.json({ visitors });
  } catch {
    return NextResponse.json(
      { error: "Failed to increment visitors" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const visitors = (await redis.get<number>(VISITOR_KEY)) || 0;
    return NextResponse.json({ visitors });
  } catch {
    return NextResponse.json(
      { error: "Failed to get visitors" },
      { status: 500 }
    );
  }
}
