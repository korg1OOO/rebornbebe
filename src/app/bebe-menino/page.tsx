import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Mail } from 'lucide-react';

export default function BebeMenino() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header>
        <div className="reborn-striped h-2"></div>
        <div className="bg-gray-100 py-2 px-4">
          <div className="container mx-auto flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>FALE CONOSCO</span>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <Link href="https://wa.me/5541984265842" target="_blank">
                  <span>WHATSAPP: (41) 98426-5842</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span>Bem-vindo, identifique-se para fazer pedidos</span>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Bebê Menino</h1>
          <p className="text-gray-600">Bonecos reborn menino com acabamento realista.</p>
          {/* Add product listing here */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="https://ext.same-assets.com/557114783/56071415.png"
                alt="Reborn Bebê"
                width={120}
                height={80}
                className="mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                Um berçário repleto de bebês reborn, com preços que cabem no seu bolso.
                Grande parte dos pedidos são enviados no dia seguinte, esse é o nosso grande diferencial.
                Realize seu sonho, compre seu Bebê !
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Institucional</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/clientes-satisfeitos" className="hover:text-pink-600">CLIENTES SATISFEITOS</Link></li>
                <li><Link href="/quem-somos" className="hover:text-pink-600">QUEM SOMOS</Link></li>
                <li><Link href="/prazo-de-entrega" className="hover:text-pink-600">PRAZO DE ENTREGA</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Ajuda e Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/fale-conosco" className="hover:text-pink-600">FALE CONOSCO</Link></li>
                <li><Link href="/como-comprar" className="hover:text-pink-600">COMO COMPRAR</Link></li>
                <li><Link href="/politica-de-privacidade" className="hover:text-pink-600">POLÍTICA DE PRIVACIDADE</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Central de Atendimento</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <Link href="https://wa.me/5541984265842" target="_blank">
                    WHATSAPP: (41) 98426-5842
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
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4">Formas de Pagamento</h4>
            <div className="flex flex-wrap items-center space-x-4">
              <Image src="https://ext.same-assets.com/557114783/3832675979.png" alt="Payment methods" width={400} height={50} />
            </div>
            <h4 className="font-bold text-gray-800 mb-4 mt-6">Segurança</h4>
            <div className="flex items-center space-x-4">
              <Image src="https://ext.same-assets.com/557114783/4172236399.png" alt="Security" width={150} height={50} />
              <Image src="https://ext.same-assets.com/557114783/1584880037.png" alt="Google Safe" width={100} height={50} />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>PRIME EXPRESS COMERCIAL LTDA - CNPJ: 58.312.925/0001-58 © Todos os direitos reservados. 2025</p>
            <p className="mt-2">
              © Todos os direitos reservados. Eventuais promoções, descontos e prazos de pagamento expostas aqui são válidos apenas para compras via internet ou telefone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}