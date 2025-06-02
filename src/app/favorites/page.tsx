'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartFavorites } from '../../context/CartFavoritesContext';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  pixPrice: number;
  installmentPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  size: string;
  description: string;
  accessories: string;
  features: string;
}

export default function Favorites() {
  const { favorites, removeFromFavorites, addToCart } = useCartFavorites();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product); // Let addToCart handle adding the quantity
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Favoritos</h1>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <Card key={product.id} className="group">
                  <CardContent className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <div className="relative mb-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={250}
                          height={250}
                          className="w-full h-64 object-cover rounded"
                        />
                        {product.discount > 0 && (
                          <Badge className="absolute top-2 left-2 discount-badge">
                            {product.discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                    <div className="space-y-1">
                      <p className="price-installment">
                        12x de {formatPrice(product.installmentPrice)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="text-lg font-bold price-cash">
                          {formatPrice(product.currentPrice)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        ou {formatPrice(product.pixPrice)} via Pix
                      </p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                        onClick={() => handleAddToCart(product)}
                      >
                        Adicionar ao Carrinho
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          removeFromFavorites(product.id);
                          toast.success(`${product.name} removido dos favoritos.`);
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Você ainda não tem produtos favoritos.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}