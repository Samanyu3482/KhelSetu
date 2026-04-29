"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Trophy, Mail, Lock, User, Eye, EyeOff, ArrowRight, Github } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "Please agree to the terms and conditions"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)

    // Handle success (redirect to dashboard)
    console.log(isLogin ? "Login successful" : "Signup successful")
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
      agreeToTerms: false,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Auth Section */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-primary rounded-full animate-float"></div>
          <div
            className="absolute top-40 right-32 w-24 h-24 border-2 border-secondary rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-32 left-40 w-40 h-40 border-2 border-accent rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-md mx-auto">
            <Card className="shadow-2xl animate-fade-in-up">
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Join SportIndia"}</CardTitle>
                  <CardDescription className="text-base">
                    {isLogin ? "Sign in to access your fitness dashboard" : "Start your journey to athletic excellence"}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Social Login */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full group hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full group hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 bg-transparent"
                    onClick={() => handleSocialLogin("GitHub")}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Continue with GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2 animate-fade-in-up">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          className={`pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                            errors.name ? "border-destructive focus:ring-destructive/20" : ""
                          }`}
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                      {errors.name && <p className="text-sm text-destructive animate-fade-in-up">{errors.name}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                          errors.email ? "border-destructive focus:ring-destructive/20" : ""
                        }`}
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive animate-fade-in-up">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`pl-10 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                          errors.password ? "border-destructive focus:ring-destructive/20" : ""
                        }`}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive animate-fade-in-up">{errors.password}</p>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="space-y-2 animate-fade-in-up">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className={`pl-10 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                            errors.confirmPassword ? "border-destructive focus:ring-destructive/20" : ""
                          }`}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive animate-fade-in-up">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    {isLogin ? (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                        />
                        <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                          Remember me for 30 days
                        </Label>
                      </div>
                    ) : (
                      <div className="space-y-2 animate-fade-in-up">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                          />
                          <Label htmlFor="agreeToTerms" className="text-sm text-muted-foreground">
                            I agree to the{" "}
                            <a href="#" className="text-primary hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-primary hover:underline">
                              Privacy Policy
                            </a>
                          </Label>
                        </div>
                        {errors.agreeToTerms && (
                          <p className="text-sm text-destructive animate-fade-in-up">{errors.agreeToTerms}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full group transition-all duration-300 hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                      </div>
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Create Account"}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {/* Forgot Password */}
                  {isLogin && (
                    <div className="text-center">
                      <a href="#" className="text-sm text-primary hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                  )}
                </form>

                {/* Switch Mode */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={switchMode}>
                      {isLogin ? "Sign up" : "Sign in"}
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="text-center mt-8 space-y-2 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <p className="text-sm text-muted-foreground">Join over 15,000+ athletes already using SportIndia</p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <span>🔒 Secure & Private</span>
                <span>⚡ Instant Access</span>
                <span>🏆 Trusted by Athletes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
