import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const res = await fetch(`${API_BASE}/driftory/shared/${params.token}`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Fetch failed" }, { status: 500 })
  }
}
