'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCartFavorites } from '../../context/CartFavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Define CartItem type for type safety
interface CartItem {
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
  quantity: number; // Quantity is required
}

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateCartQuantity } = useCartFavorites();
  const { user } = useAuth();
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const pixKey = "ec7ae346-7074-4e1f-9960-3ebf3a329a86";
  const qrCodeImageUrl = "https://res.cloudinary.com/dqknds48u/image/upload/v1748818838/WhatsApp_Image_2025-06-01_at_19.36.55_srkzxg.jpg";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item: CartItem) => total + item.currentPrice * item.quantity, 0);
  };

  const calculatePixTotal = () => {
    return cart.reduce((total, item: CartItem) => total + item.pixPrice * item.quantity, 0);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartQuantity(productId, newQuantity);
    toast.success('Quantidade atualizada!');
  };

  const handleBuyWithPix = async () => {
    if (!user) {
      toast.error('Por favor, faça login para completar a compra.');
      return;
    }

    try {
      const orderData = {
        userId: auth.currentUser?.uid,
        userEmail: user.email,
        items: cart,
        total: calculateTotal(),
        pixTotal: calculatePixTotal(),
        status: 'Pendente',
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'orders'), orderData);

      setShowPixPayment(true);
      setOrderPlaced(true);
      setCopied(false);
      clearCart();
      toast.success('Pedido realizado com sucesso!');
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Erro ao processar o pedido. Tente novamente.');
    }
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey).then(() => {
      setCopied(true);
      toast.success('Chave Pix copiada!');
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemCount={cart.length} />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Carrinho</h1>
          {cart.length > 0 ? (
            <div className="space-y-6">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <Link href={`/products/${item.id}`}>
                        <p className="text-sm font-medium text-gray-800 hover:underline">{item.name}</p>
                      </Link>
                      <p className="text-xs text-gray-500">{item.sku}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x {formatPrice(item.currentPrice)}
                      </p>
                      <p className="text-xs text-gray-600">
                        (Pix: {formatPrice(item.pixPrice)} por unidade)
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                          }
                          className="w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold text-gray-800">
                        Total: {formatPrice(item.currentPrice * item.quantity)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success(`${item.name} removido do carrinho.`);
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-600">Total (à vista): {formatPrice(calculateTotal())}</p>
                    <p className="text-green-600 font-semibold">
                      Total com Pix (10% de desconto): {formatPrice(calculatePixTotal())}
                    </p>
                  </div>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4"
                    onClick={handleBuyWithPix}
                  >
                    Comprar com Pix
                  </Button>
                </div>
                {showPixPayment && (
                  <div className="mt-4 p-4 bg-green-100 rounded-lg">
                    <p className="text-gray-800 mb-4">
                      Escaneie o QR Code abaixo para realizar o pagamento via Pix:
                    </p>
                    <div className="flex justify-center mb-4">
                      <Image
                        src={qrCodeImageUrl}
                        alt="QR Code para pagamento via Pix"
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                    <p className="text-gray-800 mb-2">
                      Ou copie a chave Pix abaixo:
                    </p>
                    <div className="flex items-center space-x-2 mb-4">
                      <Input
                        value={pixKey}
                        readOnly
                        className="bg-white"
                      />
                      <Button
                        onClick={handleCopyPixKey}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {copied ? 'Copiado!' : 'Copiar Chave'}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Após realizar o pagamento, envie o comprovante para nosso WhatsApp: (41) 98530-8460.
                    </p>
                    {orderPlaced && (
                      <p className="text-green-600 mt-4">
                        Pedido realizado com sucesso! Aguarde a confirmação do pagamento.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Seu carrinho está vazio.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}