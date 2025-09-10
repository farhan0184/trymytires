import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccess() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your payment has been processed successfully. Thank you for your purchase!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}