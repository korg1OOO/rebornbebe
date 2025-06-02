'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    try {
      const success = await register(name, email, phone, password);
      if (success) {
        router.push('/account');
      } else {
        setError('Erro ao registrar. Tente novamente.');
      }
    } catch (error: unknown) { // Fix: Replace any with unknown
      const errorMessage = (error as { message?: string }).message || 'Erro ao registrar. Tente novamente.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Registrar</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                required
              />
            </div>
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <Input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              Registrar
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-pink-600 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}