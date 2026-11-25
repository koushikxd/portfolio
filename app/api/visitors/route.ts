import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

const VISITOR_KEY = "portfolio:visitors";

export async function POST() {
  const visitors = await redis.incr(VISITOR_KEY);
  return NextResponse.json({ visitors });
}

export async function GET() {
  const visitors = (await redis.get<number>(VISITOR_KEY)) ?? 0;
  return NextResponse.json({ visitors });
}
