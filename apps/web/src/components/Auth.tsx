import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@repo/ui/Card'
import { Button } from '@repo/ui/Button'
import { Input } from '@repo/ui/Input'
import { Select } from '@repo/ui/Select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/Tabs'
import { Skeleton } from '@repo/ui/Skeleton'
import { LegalDisclaimerModal } from './LegalDisclaimerModal'
import { ThemeToggle } from './ThemeToggle'

type AuthView = 'signin' | 'signup'

interface AuthFormData {
  email: string
  password: string
  name?: string
  licenseType?: string
}

export function Auth() {
  const [view, setView] = useState<AuthView>('signin')
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    licenseType: '',
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}

    if (!formData.email) {
      newErrors.email = true
    }
    if (!formData.password) {
      newErrors.password = true
    }

    if (view === 'signup') {
      if (!formData.name) {
        newErrors.name = true
      }
      if (!formData.licenseType) {
        newErrors.licenseType = true
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Simulate loading state
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setShowDisclaimer(true)
      }, 1200)
    }
  }

  const handleDisclaimerAgree = () => {
    setShowDisclaimer(false)
    // Reset form for demo
    setFormData({
      email: '',
      password: '',
      name: '',
      licenseType: '',
    })
    setView('signin')
  }

  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 py-8 transition-colors">
        {/* Theme Toggle - Positioned at top-right */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Elevated Card with soft shadow */}
        <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-xl shadow-blue-900/5 dark:shadow-black/20">
          <CardHeader className="text-center pb-4">
            {/* Logo Section */}
            <div className="flex items-center justify-center mb-6">
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Maneho AI</span>
            </div>

            {/* Tab Switcher */}
            <Tabs value={view} onValueChange={(val) => setView(val as AuthView)}>
              <TabsList className="w-full mb-2 bg-zinc-100 dark:bg-zinc-800">
                <TabsTrigger value="signin" className="flex-1 dark:text-zinc-400">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex-1 dark:text-zinc-400">
                  Create Account
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {view === 'signin'
                ? 'Welcome back to your legal assistant'
                : 'Get started with Maneho.ai'}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field - only in signup */}
              {view === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-200/60 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus-visible:ring-offset-0 transition-colors ${
                      errors.name ? 'border-red-500/50' : ''
                    }`}
                  />
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-200/60 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus-visible:ring-offset-0 transition-colors ${
                    errors.email ? 'border-red-500/50' : ''
                  }`}
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-200/60 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus-visible:ring-offset-0 transition-colors ${
                    errors.password ? 'border-red-500/50' : ''
                  }`}
                />
              </div>

              {/* License Type - only in signup */}
              {view === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="licenseType" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    License Type
                  </label>
                  <Select
                    id="licenseType"
                    name="licenseType"
                    value={formData.licenseType || ''}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-200/60 dark:border-zinc-700 dark:text-zinc-100 focus-visible:ring-offset-0 transition-colors ${
                      errors.licenseType ? 'border-red-500/50' : ''
                    }`}
                  >
                    <option value="">Select a license type</option>
                    <option value="student">Student</option>
                    <option value="non-professional">Non-Professional</option>
                    <option value="professional">Professional</option>
                  </Select>
                </div>
              )}

              {/* Primary Action Button with Loading State */}
              <Button
                type="submit"
                className="w-full h-10 mt-6 font-medium"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    Processing...
                  </span>
                ) : view === 'signin' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Social Auth */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200/60 dark:border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 mt-4 border-zinc-200/60 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => {
                // Simulate Google sign in validation
                if (validateForm()) {
                  setIsLoading(true)
                  setTimeout(() => {
                    setIsLoading(false)
                    setShowDisclaimer(true)
                  }, 1200)
                }
              }}
              disabled={isLoading}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.868 19.4c-1.771 0-3.360-.913-4.236-2.281h1.463c.645.861 1.681 1.416 2.793 1.416 1.112 0 2.148-.555 2.793-1.416h1.463c-.876 1.368-2.465 2.281-4.236 2.281zm4.868-3.868h-9.736c.868-1.281 2.229-2.078 3.868-2.078s3-0.797 3.868-2.078h9.736c.09.648.132 1.321.132 2.078s-.042 1.43-.132 2.078zm0-6.924h-9.736c-.868-1.281-2.229-2.078-3.868-2.078s-3 0.797-3.868 2.078h-9.736c-.09-.648-.132-1.321-.132-2.078s.042-1.43.132-2.078h9.736c.868 1.281 2.229 2.078 3.868 2.078s3-0.797 3.868-2.078h9.736c.09.648.132 1.321.132 2.078s-.042 1.43-.132 2.078z" />
              </svg>
              Continue with Google
            </Button>
          </CardContent>

          {/* Footer with Micro-copy */}
          <CardFooter className="flex flex-col gap-4 border-t border-zinc-200/60 dark:border-zinc-800 pt-6">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic text-center">
              Assisting Filipino motorists with LTO compliance.
            </p>
          </CardFooter>
        </Card>
      </div>

      <LegalDisclaimerModal
        open={showDisclaimer}
        onOpenChange={setShowDisclaimer}
        onAgree={handleDisclaimerAgree}
      />
    </>
  )
}
