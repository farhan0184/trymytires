import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-4">
          <Loader2 className="h-16 w-16 text-gray-500 animate-spin" />
          <CardTitle className="text-3xl font-bold">Processing Payment...</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Please wait while we process your transaction. Do not close this window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Optional: Add a progress bar or more detailed status here */}
        </CardContent>
      </Card>
    </div>
  )
}