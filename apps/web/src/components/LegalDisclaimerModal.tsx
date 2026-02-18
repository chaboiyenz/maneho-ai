import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@repo/ui/Dialog'
import { Button } from '@repo/ui/Button'

interface LegalDisclaimerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgree: () => void
}

export function LegalDisclaimerModal({
  open,
  onOpenChange,
  onAgree,
}: LegalDisclaimerModalProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => onOpenChange(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div
              className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-lg shadow-2xl shadow-black/10 dark:shadow-black/50 p-8 w-full max-w-md transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Legal Disclaimer
                </h2>
                <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
              </div>

              {/* Content */}
              <div className="mb-8">
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Maneho.ai</span> is an
                  <span className="font-medium"> AI-powered legal assistant </span>
                  and does <span className="font-semibold text-zinc-900 dark:text-zinc-100">not constitute official legal counsel</span>.
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4">
                  Always consult with a qualified attorney for legal matters and official guidance.
                </p>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border-zinc-300/50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Decline
                </Button>
                <Button
                  variant="default"
                  onClick={onAgree}
                  className="flex-1 font-medium"
                >
                  I Agree & Enter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
