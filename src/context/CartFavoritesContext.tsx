'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

interface CartItem extends Product {
  quantity: number;
}

interface CartFavoritesContextType {
  cart: CartItem[];
  favorites: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
}

const CartFavoritesContext = createContext<CartFavoritesContextType | undefined>(undefined);

export function CartFavoritesProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCartAndFavorites = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCart(userData.cart || []);
          setFavorites(userData.favorites || []);
        }
      }
    };
    fetchCartAndFavorites();
  }, []);

  const addToCart = async (product: Product) => {
    if (!auth.currentUser) {
      toast.error('Por favor, faça login para adicionar ao carrinho.');
      return;
    }

    const currentUser = auth.currentUser; // Assign to a variable to ensure TypeScript narrowing
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      let newCart: CartItem[];
      if (existingProduct) {
        const newQuantity = existingProduct.quantity + 1;
        newCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(userDocRef, { cart: newCart }, { merge: true });

      return newCart;
    });
  };

  const removeFromCart = async (productId: string) => {
    if (!auth.currentUser) {
      toast.error('Por favor, faça login para remover do carrinho.');
      return;
    }

    const currentUser = auth.currentUser;
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(userDocRef, { cart: newCart }, { merge: true });
      return newCart;
    });
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!auth.currentUser) {
      toast.error('Por favor, faça login para atualizar a quantidade.');
      return;
    }

    const currentUser = auth.currentUser;
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(userDocRef, { cart: newCart }, { merge: true });
      return newCart;
    });
  };

  const clearCart = async () => {
    if (!auth.currentUser) {
      toast.error('Por favor, faça login para limpar o carrinho.');
      return;
    }

    const currentUser = auth.currentUser;
    setCart([]);
    const userDocRef = doc(db, 'users', currentUser.uid);
    setDoc(userDocRef, { cart: [] }, { merge: true });
  };

  const addToFavorites = async (product: Product) => {
    if (!auth.currentUser) {
      toast.error('Por favor, faça login para adicionar aos favoritos.');
      return;
    }

    const currentUser = auth.currentUser;
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((item) => item.id === product.id)) return prevFavorites;
      const newFavorites = [...prevFavorites, product];
      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(userDocRef, { favorites: newFavorites }, { merge: true });
      return newFavorites;
    });
  };

  const removeFromFavorites = async (productId: string) => {
    if (!auth.currentUser) {
      toast.error('Por favor, faça login para remover dos favoritos.');
      return;
    }

    const currentUser = auth.currentUser;
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.filter((item) => item.id !== productId);
      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(userDocRef, { favorites: newFavorites }, { merge: true });
      return newFavorites;
    });
  };

  return (
    <CartFavoritesContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </CartFavoritesContext.Provider>
  );
}

export function useCartFavorites() {
  const context = useContext(CartFavoritesContext);
  if (!context) {
    throw new Error('useCartFavorites must be used within a CartFavoritesProvider');
  }
  return context;
}