"use client";

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NavbarShell } from "@/components/shared/navbar-shell"
import { Footer } from "@/components/shared/footer"
import { SITE_CONFIG } from "@/lib/site-config"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-slate-50 text-slate-900">
      <NavbarShell />
      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[2rem] border border-teal-100 bg-white p-8 shadow-xl sm:p-10"
        >
          <Link
            href="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-teal-800 hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>

          {!isSubmitted ? (
            <>
              <div className="mb-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-800">
                Account security
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reset your password</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Enter the email you use for {SITE_CONFIG.name}. We will send a reset link if we find a match.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-800">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-600/70" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-teal-100 bg-slate-50/80 pl-10 focus-visible:ring-teal-500/30"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full rounded-full bg-teal-600 text-base font-semibold hover:bg-teal-500" disabled={isLoading}>
                  {isLoading ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <CheckCircle className="h-8 w-8 text-teal-700" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
              <p className="mt-3 text-sm text-slate-600">
                If an account exists for <strong className="text-slate-900">{email}</strong>, you will receive reset instructions shortly.
              </p>
              <Button asChild variant="outline" className="mt-8 w-full rounded-full border-teal-200 text-teal-900 hover:bg-teal-50">
                <Link href="/login">Back to sign in</Link>
              </Button>
              <p className="mt-6 text-sm text-slate-500">
                Did not receive anything?{" "}
                <button type="button" onClick={() => setIsSubmitted(false)} className="font-semibold text-teal-700 hover:underline">
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
