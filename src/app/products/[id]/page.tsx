'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCartFavorites } from '../../../context/CartFavoritesContext';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // For UI quantity selection
  const { addToCart } = useCartFavorites();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() } as Product);
        } else {
          toast.error('Produto não encontrado.');
          router.push('/todos');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Erro ao carregar o produto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    // Add the product to the cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product); // Let addToCart handle adding the quantity
    }
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-12">
          <div className="container mx-auto px-4 text-center">
            Carregando...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-12">
          <div className="container mx-auto px-4 text-center">
            Produto não encontrado.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatPrice(product.currentPrice)}
                </p>
                <p className="text-sm text-gray-600">
                  ou {formatPrice(product.pixPrice)} via Pix
                </p>
                <p className="text-sm text-gray-600">
                  12x de {formatPrice(product.installmentPrice)}
                </p>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={handleAddToCart}
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Tamanho:</strong> {product.size}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Descrição:</strong> {product.description}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Acessórios:</strong> {product.accessories}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Características:</strong> {product.features}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}