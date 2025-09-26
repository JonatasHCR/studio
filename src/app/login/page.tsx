'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('adm@example.com');
  const [password, setPassword] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: 'Usuário ou senha inválidos. Se você ainda não tem uma conta, por favor, registre-se.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <LogIn className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline text-2xl">Acessar Painel</CardTitle>
            <CardDescription>Use seu e-mail e senha para entrar. (adm@example.com / 123456)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="adm@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
            <Button variant="link" asChild>
                <Link href="/signup">Não tem uma conta? Cadastre-se</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
