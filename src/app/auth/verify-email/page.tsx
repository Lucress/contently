import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-primary" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Vérifiez votre email
      </h1>
      
      <p className="text-muted-foreground mb-6">
        Nous vous avons envoyé un email de confirmation. Cliquez sur le lien dans l'email pour activer votre compte.
      </p>

      <div className="bg-muted/50 rounded-lg p-4 mb-6 text-sm text-muted-foreground">
        <p>
          Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam.
        </p>
      </div>

      <Button variant="outline" asChild>
        <Link href="/auth/login">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la connexion
        </Link>
      </Button>
    </div>
  )
}
