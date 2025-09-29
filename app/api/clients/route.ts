import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]

  try {
    verify(token, JWT_SECRET)
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        status: {
          in: ["completed", "flagged"],
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    })
    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}