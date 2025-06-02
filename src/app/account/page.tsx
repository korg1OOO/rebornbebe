'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    currentPrice: number;
  }>;
  total: number;
  pixTotal: number;
  status: string;
  createdAt: Timestamp | null;
}

export default function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user && auth.currentUser) {
        const q = query(collection(db, 'orders'), where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(ordersData);
      }
    };
    fetchOrders();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Você saiu da sua conta.');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao sair da conta.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate(); // Always use toDate() to convert Timestamp to Date
    return date.toLocaleDateString('pt-BR');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Minha Conta</h1>
            <p className="text-gray-600 mb-4">Por favor, faça login para acessar sua conta.</p>
            <Link href="/login">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">Fazer Login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Minha Conta</h1>
            <Button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Sair
            </Button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Usuário</h2>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Pedidos</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-600">
                        Pedido #{order.id} - {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">{order.status}</p>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} x {formatPrice(item.currentPrice)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {formatPrice(item.currentPrice * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-gray-600">
                        Total: {formatPrice(order.total)}
                      </p>
                      <p className="text-sm text-green-600">
                        Total com Pix: {formatPrice(order.pixTotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Você ainda não tem pedidos.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}