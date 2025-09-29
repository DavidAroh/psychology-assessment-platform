import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    console.log("[LOGIN] Starting login process")
    
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("[LOGIN] JWT_SECRET environment variable is not set")
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 })
    }

    const { email, password } = await request.json()
    console.log("[LOGIN] Received login request for email:", email)

    if (!email || !password) {
      console.log("[LOGIN] Missing email or password")
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    console.log("[LOGIN] Attempting to find user in database")
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log("[LOGIN] User not found for email:", email)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log("[LOGIN] User found, verifying password")
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log("[LOGIN] Invalid password for user:", email)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log("[LOGIN] Password valid, generating token")
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    console.log("[LOGIN] Login successful for user:", email)
    return NextResponse.json({ message: "Login successful", token }, { status: 200 })
  } catch (error) {
    console.error("[LOGIN] Login error:", error)
    console.error("[LOGIN] Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    })
    return NextResponse.json({ 
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    }, { status: 500 })
  }
}