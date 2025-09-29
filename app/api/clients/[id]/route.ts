import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// GET /api/clients/[id] → return a single client with their assessments
export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
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
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        assessments: {
          orderBy: { completedAt: 'desc' },
        },
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error)
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 })
  }
}
