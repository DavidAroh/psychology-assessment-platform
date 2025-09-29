"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, FileText, Users } from "lucide-react"
import Link from "next/link"

export default function PublicHomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Psychology Assessment Platform</h1>
                <p className="text-muted-foreground">Professional psychological assessment and reporting</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Secure & Professional Assessment Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your psychological assessments with our secure, HIPAA-compliant platform designed for mental health professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                End-to-end encryption and HIPAA compliance ensure patient data remains confidential and secure.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Validated Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Access standardized assessments like PHQ-9, GAD-7, BDI-II, and more with automated scoring.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Time Efficient</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Streamlined workflows and automated reporting save valuable time for both clinicians and patients.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Comprehensive client tracking with risk assessment and progress monitoring capabilities.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>
                Join mental health professionals who trust our platform for their assessment needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Already have an assessment link? You can access it directly without signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Psychology Assessment Platform. All rights reserved.</p>
            <p className="mt-2">HIPAA Compliant • Secure • Professional</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
