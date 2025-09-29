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
    // Execute all queries in parallel for better performance
    const [
      totalAssessments,
      completedAssessments,
      activeClients,
      flaggedAssessments,
      recentAssessments,
      highRiskClients
    ] = await Promise.all([
      prisma.assessment.count(),
      prisma.assessment.count({ where: { status: { in: ['completed', 'flagged'] } } }),
      prisma.client.count(),
      prisma.assessment.findMany({ where: { status: 'flagged' } }),
      prisma.assessment.findMany({
        take: 2,
        orderBy: { completedAt: 'desc' },
        where: { status: { in: ['completed', 'flagged'] } }
      }),
      prisma.client.findMany({ where: { riskLevel: 'high' } })
    ])

    const assessmentStats = {
      totalAssessments: completedAssessments,
      activeClients,
      riskFlags: flaggedAssessments.length,
      completionRate: totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0,
    }

    return NextResponse.json({ stats: assessmentStats, recentAssessments, highRiskClients, flaggedAssessments })
  } catch (error) {
    console.error("Dashboard data error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}