'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ShoppingCart, User, Heart, X, MessageCircle, Mail, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '../lib/firebase'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

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

export default function Home() {
  const [showEmailModal, setShowEmailModal] = useState(true);
  const [cartCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() } as Product);
        });
        console.log('Fetched products for home:', productsData); // Debug log
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Erro ao carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Handlers for click events
  const handleEmailSubmit = () => {
    const email = emailInputRef.current?.value;
    if (email) {
      console.log('Email submitted:', email);
      setShowEmailModal(false);
    } else {
      console.log('Please enter an email address');
    }
  };

  const handleSearch = () => {
    const query = searchInputRef.current?.value;
    if (query) {
      console.log('Search query:', query);
      // In a real app, you'd navigate to a search results page or filter products
    }
  };

  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  const handleUserAccountClick = () => {
    router.push('/account');
  };

  const handleFavoritesClick = () => {
    router.push('/favorites');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header>
        {/* Top stripe banner */}
        <div className="reborn-striped h-2"></div>

        {/* Contact info bar */}
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
              <span>Bem-vindo, identifique-se para fazer pedidos</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="bg-white py-4 px-4 shadow-sm">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <div className="relative">
                  <Image
                    src="https://ext.same-assets.com/557114783/56071415.png"
                    alt="Reborn Bebê"
                    width={120}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Digite o que você procura"
                  className="w-full pr-10"
                  ref={searchInputRef}
                />
                <button onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="text-gray-400 w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User actions */}
            <div className="flex items-center space-x-4">
              <button onClick={handleUserAccountClick} className="flex items-center space-x-2 text-sm hover:text-pink-600">
                <User className="w-5 h-5" />
                <span>Minha conta</span>
              </button>
              <button onClick={handleFavoritesClick} className="flex items-center space-x-2 text-sm hover:text-pink-600">
                <Heart className="w-5 h-5" />
                <span>Favoritos</span>
              </button>
              <button onClick={handleCartClick} className="relative flex items-center space-x-2 text-sm hover:text-pink-600">
                <ShoppingCart className="w-5 h-5" />
                <span>Carrinho ({cartCount})</span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white">
                    {cartCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white border-t border-gray-200">
          <div className="container mx-auto px-4">
            <ul className="flex items-center space-x-8 py-3 text-sm font-medium">
              <li>
                <Link href="/pronta-entrega" className="text-pink-600 hover:text-pink-700">
                  PRONTA ENTREGA
                </Link>
              </li>
              <li>
                <Link href="/bebe-menina" className="text-gray-700 hover:text-pink-600">
                  BEBÊ MENINA
                </Link>
              </li>
              <li>
                <Link href="/bebe-menino" className="text-gray-700 hover:text-pink-600">
                  BEBÊ MENINO
                </Link>
              </li>
              <li>
                <Link href="/reborn-hiper-realista" className="text-gray-700 hover:text-pink-600">
                  REBORN HIPER REALISTA
                </Link>
              </li>
              <li>
                <Link href="/promocao-do-dia" className="text-gray-700 hover:text-pink-600">
                  PROMOÇÃO DO DIA
                </Link>
              </li>
              <li>
                <Link href="/silicone-solido" className="text-gray-700 hover:text-pink-600">
                  SILICONE SÓLIDO
                </Link>
              </li>
              <li>
                <Link href="/sob-encomenda" className="text-gray-700 hover:text-pink-600">
                  SOB ENCOMENDA
                </Link>
              </li>
              <li>
                <Link href="/todos" className="text-gray-700 hover:text-pink-600">
                  TODOS(AS)
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Banners */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="bg-pink-100 border-pink-200 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/roupinhas')}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Image
                    src="https://ext.same-assets.com/557114783/77327974.false"
                    alt="Lindas roupinhas"
                    width={200}
                    height={150}
                    className="mx-auto rounded"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">Lindas roupinhas</h3>
                <p className="text-pink-600 font-medium">para Reborn</p>
                <p className="text-sm italic text-gray-600 mt-2">confira</p>
              </CardContent>
            </Card>

            <Card
              className="bg-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/pronta-entrega')}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Image
                    src="https://ext.same-assets.com/557114783/3875511728.png"
                    alt="Pronta Entrega"
                    width={200}
                    height={150}
                    className="mx-auto rounded"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">Receba em poucos dias</h3>
                <p className="text-blue-600 font-medium">Pronta Entrega</p>
                <p className="text-sm italic text-gray-600 mt-2">surpreenda</p>
              </CardContent>
            </Card>

            <Card
              className="bg-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/sob-encomenda')}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Image
                    src="https://ext.same-assets.com/557114783/3621334612.png"
                    alt="Sob Encomenda"
                    width={200}
                    height={150}
                    className="mx-auto rounded"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">Feito com muito carinho</h3>
                <p className="text-green-600 font-medium">Sob Encomenda</p>
                <p className="text-sm italic text-gray-600 mt-2">surpreenda</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <div className="text-pink-600 font-bold">📦</div>
              </div>
              <div>
                <h4 className="font-bold text-pink-600">FRETE GRÁTIS !</h4>
                <p className="text-xs text-gray-600">PARA TODO ESTADO DE SÃO PAULO</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="text-blue-600 font-bold">12x</div>
              </div>
              <div>
                <h4 className="font-bold text-blue-600">12X SEM JUROS !</h4>
                <p className="text-xs text-gray-600">
                  OU ATÉ EM 12X COM JUROS NOS PRINCIPAIS CARTÕES DE CRÉDITO
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="text-green-600 font-bold">PIX</div>
              </div>
              <div>
                <h4 className="font-bold text-green-600">ECONOMIZE COM PIX !</h4>
                <p className="text-xs text-gray-600">DESCONTO DE 10% NA SUA COMPRA !</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="text-purple-600 font-bold">🏍️</div>
              </div>
              <div>
                <h4 className="font-bold text-purple-600">ENTREGA VIA MOTOBOY !</h4>
                <p className="text-xs text-gray-600">SOMENTE PARA BONECAS EM NOSSO ESCRITÓRIO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lançamentos Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">LANÇAMENTOS</h2>
            <Link href="/todos" className="text-pink-600 hover:text-pink-700 text-sm">
              + ver todos(as)
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">Carregando...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={250}
                        height={250}
                        className="w-full h-64 object-cover rounded"
                      />
                      {product.discount > 0 && (
                        <Badge className={`absolute top-2 left-2 discount-badge`}>
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-500 mb-2">{product.sku}</p>

                    {product.rating > 0 && (
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                    )}

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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              Nenhum lançamento disponível no momento.
            </div>
          )}
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            SIGA NOSSO INSTAGRAM{' '}
            <a
              href="https://www.instagram.com/__reborn_bebe?igsh=MWc3am1rOHp3ZDFhbw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700"
            >
              @__reborn_bebe
            </a>
          </h2>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div>
              <Image
                src="https://ext.same-assets.com/557114783/56071415.png"
                alt="Reborn Bebê"
                width={120}
                height={80}
                className="mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                Um berçário repleto de bebês reborn, com preços que cabem no seu bolso. Grande
                parte dos pedidos são enviados no dia seguinte, esse é o nosso grande diferencial.
                Realize seu sonho, compre seu Bebê !
              </p>
            </div>

            {/* Institucional */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Institucional</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/clientes-satisfeitos" className="hover:text-pink-600">
                    CLIENTES SATISFEITOS
                  </Link>
                </li>
                <li>
                  <Link href="/quem-somos" className="hover:text-pink-600">
                    QUEM SOMOS
                  </Link>
                </li>
                <li>
                  <Link href="/prazo-de-entrega" className="hover:text-pink-600">
                    PRAZO DE ENTREGA
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ajuda e Suporte */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Ajuda e Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/fale-conosco" className="hover:text-pink-600">
                    FALE CONOSCO
                  </Link>
                </li>
                <li>
                  <Link href="/como-comprar" className="hover:text-pink-600">
                    COMO COMPRAR
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-privacidade" className="hover:text-pink-600">
                    POLÍTICA DE PRIVACIDADE
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Central de Atendimento</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <Link href="https://wa.me/5541985308460" target="_blank">
                    WHATSAPP: (41) 98530-8460
                  </Link>
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  E-MAIL: CONTATO@REBORNBEBE.COM.BR
                </p>
                <p className="text-xs mt-4">
                  Horário de Atendimento: Segunda a Sexta de 9h às 18h
                </p>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4">Formas de Pagamento</h4>
            <div className="flex flex-wrap items-center space-x-4">
              <Image
                src="https://ext.same-assets.com/557114783/3832675979.png"
                alt="Payment methods"
                width={400}
                height={50}
              />
            </div>

            <h4 className="font-bold text-gray-800 mb-4 mt-6">Segurança</h4>
            <div className="flex items-center space-x-4">
              <Image
                src="https://ext.same-assets.com/557114783/4172236399.png"
                alt="Security"
                width={150}
                height={50}
              />
              <Image
                src="https://ext.same-assets.com/557114783/1584880037.png"
                alt="Google Safe"
                width={100}
                height={50}
              />
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>PRIME EXPRESS COMERCIAL LTDA - CNPJ: 58.312.925/0001-58 © Todos os direitos reservados. 2025</p>
            <p className="mt-2">
              © Todos os direitos reservados. Eventuais promoções, descontos e prazos de pagamento
              expostas aqui são válidos apenas para compras via internet ou telefone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}