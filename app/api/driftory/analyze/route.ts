import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${API_BASE}/driftory/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Analysis failed" }, { status: 500 })
  }
}
