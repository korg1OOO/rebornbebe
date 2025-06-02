'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    const success = await login(email, password);
    if (success) {
      router.push('/account');
    } else {
      setError('Email ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Login</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
              Entrar
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-pink-600 hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}