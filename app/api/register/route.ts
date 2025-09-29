import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    console.log("[REGISTER] Starting registration process")
    
    const { name, email, password } = await request.json()
    console.log("[REGISTER] Received registration request for email:", email)

    if (!name || !email || !password) {
      console.log("[REGISTER] Missing required fields")
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    console.log("[REGISTER] Checking if user already exists")
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("[REGISTER] User already exists for email:", email)
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    console.log("[REGISTER] Hashing password")
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log("[REGISTER] Creating new user in database")
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    console.log("[REGISTER] User created successfully for email:", email)
    return NextResponse.json({ 
      message: "User created successfully", 
      user: { id: user.id, name: user.name, email: user.email } 
    }, { status: 201 })
  } catch (error) {
    console.error("[REGISTER] Registration error:", error)
    console.error("[REGISTER] Error details:", {
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