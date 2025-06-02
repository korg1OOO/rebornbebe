'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MessageCircle, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartFavorites } from '../context/CartFavoritesContext';
import { Button } from '@/components/ui/button';

export default function Header({ cartItemCount }: { cartItemCount?: number }) {
  const { user, logout } = useAuth();
  const { cart } = useCartFavorites();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const itemCount = cartItemCount !== undefined ? cartItemCount : cart.length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.currentPrice * item.quantity, 0);
  };

  return (
    <header>
      <div className="reborn-striped h-2"></div>
      <div className="bg-gray-100 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>FALE CONOSCO</span>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <Link href="https://wa.me/5541985308460" target="_blank">
                <span>WHATSAPP: (41) 98530-8460</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <span>Bem-vindo, {user.name}</span>
                <Button
                  variant="link"
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-pink-600"
                >
                  Sair
                </Button>
              </>
            ) : (
              <span>Bem-vindo, identifique-se para fazer pedidos</span>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white py-4 px-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="https://ext.same-assets.com/557114783/56071415.png"
              alt="Reborn Bebê"
              width={120}
              height={80}
              className="object-contain"
            />
          </Link>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Digite o que você procura"
                className="w-full pr-10 border border-gray-300 rounded-md py-2 px-3"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="text-gray-400 w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/account" className="flex items-center space-x-2 text-sm hover:text-pink-600">
              <User className="w-5 h-5" />
              <span>Minha conta</span>
            </Link>
            <Link href="/favorites" className="flex items-center space-x-2 text-sm hover:text-pink-600">
              <Heart className="w-5 h-5" />
              <span>Favoritos</span>
            </Link>
            <div
              className="relative flex items-center space-x-2 text-sm hover:text-pink-600"
              onMouseEnter={() => setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <Link href="/cart" className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Carrinho ({itemCount})</span>
              </Link>
              {isCartOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-10">
                  {cart.length > 0 ? (
                    <>
                      <div className="space-y-4 max-h-60 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="object-cover rounded"
                            />
                            <div className="flex-1">
                              <Link href={`/products/${item.id}`}>
                                <p className="text-sm font-medium text-gray-800 hover:underline">
                                  {item.name}
                                </p>
                              </Link>
                              <p className="text-xs text-gray-600">
                                {item.quantity} x {formatPrice(item.currentPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 mt-4 pt-4">
                        <p className="text-sm font-semibold text-gray-800">
                          Total: {formatPrice(calculateTotal())}
                        </p>
                        <Link href="/cart">
                          <Button className="w-full mt-2 bg-pink-600 hover:bg-pink-700 text-white">
                            Ver Carrinho
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600">Seu carrinho está vazio.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <nav className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex items-center space-x-8 py-3 text-sm font-medium">
            <li><Link href="/products" className="text-pink-600 hover:text-pink-700">PRODUTOS</Link></li>
            <li><Link href="/pronta-entrega" className="text-gray-700 hover:text-pink-600">PRONTA ENTREGA</Link></li>
            <li><Link href="/bebe-menina" className="text-gray-700 hover:text-pink-600">BEBÊ MENINA</Link></li>
            <li><Link href="/bebe-menino" className="text-gray-700 hover:text-pink-600">BEBÊ MENINO</Link></li>
            <li><Link href="/reborn-hiper-realista" className="text-gray-700 hover:text-pink-600">REBORN HIPER REALISTA</Link></li>
            <li><Link href="/promocao-do-dia" className="text-gray-700 hover:text-pink-600">PROMOÇÃO DO DIA</Link></li>
            <li><Link href="/silicone-solido" className="text-gray-700 hover:text-pink-600">SILICONE SÓLIDO</Link></li>
            <li><Link href="/sob-encomenda" className="text-gray-700 hover:text-pink-600">SOB ENCOMENDA</Link></li>
            <li><Link href="/todos" className="text-gray-700 hover:text-pink-600">TODOS(AS)</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}