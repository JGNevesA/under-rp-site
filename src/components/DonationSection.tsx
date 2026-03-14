import { useState } from 'react';

// === DADOS DOS ITENS ===
interface StoreItem {
  id: string;
  name: string;
  price: string;
  description: string;
  category: 'Doações' | 'Veículos' | 'Personagem' | 'Personalização' | 'Propriedades';
  icon: string;
  image?: string;
  isPopular?: boolean;
  buttonText?: string;
  weeklyPrice?: string;
}

const storeItems: StoreItem[] = [
  // Categoria: Doações
  {
    id: 'doacao-prata',
    name: 'DOAÇÃO PRATA',
    price: 'R$ 40,00',
    description: 'Prioridade + veículo C por 1 mês.',
    category: 'Doações',
    icon: '🥈',
  },
  {
    id: 'doacao-ouro',
    name: 'DOAÇÃO OURO',
    price: 'R$ 80,00',
    description: 'Prioridade + veículo B por 1 mês.',
    category: 'Doações',
    icon: '🥇',
    isPopular: true,
  },
  {
    id: 'doacao-esmeralda',
    name: 'DOAÇÃO ESMERALDA',
    price: 'R$ 110,00',
    description: 'Prioridade + veículo A.',
    category: 'Doações',
    icon: '💚',
  },
  {
    id: 'doacao-platina',
    name: 'DOAÇÃO PLATINA',
    price: 'R$ 260,00',
    description: 'Prioridade + 2 veículos A por 1 mês + 1 placa personalizada.',
    category: 'Doações',
    icon: '👑',
  },
  {
    id: 'doacao-diamante',
    name: 'DOAÇÃO DIAMANTE',
    price: 'R$ 330,00',
    description: 'Prioridade + veículo S por 1 mês + placa personalizada + caixa tier I.',
    category: 'Doações',
    icon: '💎',
    isPopular: true,
  },
  {
    id: 'doacao-under',
    name: 'DOAÇÃO UNDER',
    price: 'R$ 450,00',
    description: 'Prioridade + 2 veículos S por 1 mês + 2 placas personalizadas + caixa tier II.',
    category: 'Doações',
    icon: '🔥',
  },

  // Categoria: Veículos
  {
    id: 'classe-s',
    name: 'CLASSE S',
    price: 'R$ 150,00 / mês',
    weeklyPrice: 'R$ 70,00 / semana',
    description: 'Veículos superesportivos de altíssimo desempenho e design exclusivo.',
    category: 'Veículos',
    icon: '🏎️',
    isPopular: true,
    buttonText: 'Alugar Veículo',
  },
  {
    id: 'classe-a',
    name: 'CLASSE A',
    price: 'R$ 75,00 / mês',
    weeklyPrice: 'R$ 35,00 / semana',
    description: 'Esportivos modernos com excelente balanço entre velocidade e controle.',
    category: 'Veículos',
    icon: '🚘',
    buttonText: 'Alugar Veículo',
  },
  {
    id: 'classe-b',
    name: 'CLASSE B',
    price: 'R$ 50,00 / mês',
    weeklyPrice: 'R$ 20,00 / semana',
    description: 'Veículos urbanos tunados e clássicos reformados para o dia a dia.',
    category: 'Veículos',
    icon: '🚙',
    buttonText: 'Alugar Veículo',
  },
  {
    id: 'moto',
    name: 'MOTOCICLETAS',
    price: 'R$ 60,00 / mês',
    weeklyPrice: 'R$ 25,00 / semana',
    description: 'Motos de alta cilindrada para máxima agilidade em Los Santos.',
    category: 'Veículos',
    icon: '🏍️',
    buttonText: 'Alugar Veículo',
  },

  // Categoria: Personalização
  {
    id: 'livery',
    name: 'LIVERY',
    price: 'R$ 60,00',
    description: 'Aplicação de livery caso o jogador possua o arquivo.',
    category: 'Personalização',
    icon: '🎨',
  },
  {
    id: 'livery-perso',
    name: 'LIVERY PERSONALIZADA',
    price: 'R$ 170,00',
    description: 'Livery criada do zero pelo servidor.',
    category: 'Personalização',
    icon: '🖌️',
    isPopular: true,
  },
  {
    id: 'roupa-perso',
    name: 'ROUPA PERSONALIZADA',
    price: 'R$ 55,00',
    description: 'Roupa personalizada enviada pelo jogador.',
    category: 'Personalização',
    icon: '🧥',
  },
  {
    id: 'skin-arma-perso',
    name: 'SKIN DE ARMA PERSONALIZADA',
    price: 'R$ 110,00',
    description: 'Sistema liberado para aplicar skin por link.',
    category: 'Personalização',
    icon: '🔫',
  },
  {
    id: 'placa-perso',
    name: 'PLACA PERSONALIZADA',
    price: 'R$ 25,00',
    description: 'Placa personalizada por veículo.',
    category: 'Personalização',
    icon: '🚘',
  },

  // Categoria: Personagem
  {
    id: 'ped',
    name: 'PED',
    price: 'R$ 80,00',
    description: 'Inclusão de ped fornecido pelo jogador.',
    category: 'Personagem',
    icon: '🧍',
  },
  {
    id: 'att-ped',
    name: 'ATUALIZAÇÃO DE PED',
    price: 'R$ 30,00',
    description: 'Atualização visual do seu ped.',
    category: 'Personagem',
    icon: '🛠️',
  },
  {
    id: 'slot-personagem',
    name: 'SLOT PERSONAGEM EXTRA',
    price: 'R$ 35,00',
    description: 'Libera um slot adicional de personagem.',
    category: 'Personagem',
    icon: '🎭',
  },

  // Categoria: Propriedades
  {
    id: 'mansoes-perso',
    name: 'MANSÕES PERSONALIZADAS',
    price: 'R$ 1.100,00',
    description: 'Escolha entre 3 mansões nas colinas de Vinewood.',
    category: 'Propriedades',
    icon: '🏛️',
    image: '/mansao.webp',
    isPopular: true,
  },
];

const categories = ['Doações', 'Veículos', 'Personagem', 'Personalização', 'Propriedades'] as const;
type Category = typeof categories[number];

const DonationSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('Doações');

  // Filtra os itens baseado na categoria ativa
  const filteredItems = storeItems.filter(item => item.category === activeCategory);

  return (
    <section id="doacoes" className="py-24 bg-[#080b16] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* === HEADER === */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 mb-6">
            <span className="text-amber-400 text-xl">💎</span>
            <span className="text-amber-300 font-semibold tracking-wide uppercase text-xs">Apoie o Servidor</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">
            Loja de <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Doações</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Adquira vantagens exclusivas e apoie o crescimento do UNDER RP.
          </p>
        </div>

        {/* === SISTEMA DE FILTROS (ABAS) === */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 border ${activeCategory === category
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                : 'bg-[#101827] border-white/5 text-slate-400 hover:bg-[#1f2937] hover:border-white/10 hover:text-white'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* === GRID DE CARDS PREMIUM === */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl p-[1px] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
                style={{
                  background: item.isPopular
                    ? 'linear-gradient(135deg, rgba(234,179,8,0.4), rgba(59,130,246,0.4), rgba(234,179,8,0.4))'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(59,130,246,0.15), rgba(255,255,255,0.08))',
                }}
              >
                {/* Glow externo no hover */}
                <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
                  style={{
                    background: item.isPopular
                      ? 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(59,130,246,0.15))'
                      : 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                  }}
                />

                {/* Card interno */}
                <div className={`relative bg-[#0c1322]/95 backdrop-blur-xl rounded-2xl flex flex-col h-full overflow-hidden shiny-card ${item.isPopular ? 'popular' : ''}`}>
                  
                  {/* Shines & Tiles Background */}
                  <div className="shine" />
                  <div className="background">
                    <div className="tiles">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className={`tile tile-${i + 1}`} />
                      ))}
                    </div>
                    <div className="line line-1" />
                    <div className="line line-2" />
                    <div className="line line-3" />
                  </div>

                  {/* Card Content wrapper to sit above background */}
                  <div className="relative z-10 flex flex-col h-full p-5">

                    {/* Linha de brilho no topo */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

                  {/* === IMAGEM (mantida intacta) ou ÍCONE === */}
                  {item.image ? (
                    <div className="-mx-5 -mt-5 mb-5 h-44 overflow-hidden relative flex-shrink-0 rounded-t-2xl">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-transparent to-transparent opacity-60" />
                      {item.isPopular && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1.5 rounded-full shadow-lg shadow-yellow-500/30 animate-pulse">
                            ⭐ Popular
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-between items-start mb-5">
                      {/* Ícone com glow */}
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1a2744] to-[#0f1a2e] border border-white/10 flex items-center justify-center text-2xl shadow-lg transition-all duration-300 group-hover:shadow-blue-500/20 group-hover:border-blue-500/30">
                          {item.icon}
                        </div>
                        <div className="absolute -inset-1 rounded-xl bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      {item.isPopular && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-yellow-400/15 to-amber-500/15 text-yellow-400 border border-yellow-500/25 px-3 py-1.5 rounded-full animate-pulse">
                          ⭐ Popular
                        </span>
                      )}
                    </div>
                  )}

                  {/* Título */}
                  <h3 className="text-base font-extrabold text-white mb-3 tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-300 transition-all duration-300">
                    {item.name}
                  </h3>

                  {/* Bloco de Preço Inovador */}
                  <div className="relative mb-4 p-3.5 rounded-xl bg-gradient-to-br from-[#111d35] to-[#0a1120] border border-white/5 group-hover:border-blue-500/20 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-600" />
                    <div className="pl-3">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Valor</span>
                      <p className="text-2xl font-black bg-gradient-to-r from-emerald-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent mt-0.5">
                        {item.price}
                      </p>
                      {item.weeklyPrice && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="w-1 h-1 rounded-full bg-blue-400/60" />
                          <p className="text-[11px] font-semibold text-blue-300/70">
                            ou {item.weeklyPrice}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Descrição com ícone */}
                  <div className="flex items-start gap-2 mb-6 flex-grow">
                    <span className="text-blue-400/40 mt-0.5 text-xs">▸</span>
                    <p className="text-[13px] text-slate-400/90 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Botão premium */}
                  <a
                    href="https://discord.gg/VWXkSt3Y"
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`btn-${item.id}`}
                    className="relative w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden active:scale-95 group/btn text-center block"
                    style={{
                      background: item.isPopular
                        ? 'linear-gradient(135deg, #2563eb, #7c3aed, #2563eb)'
                        : 'linear-gradient(135deg, #1e40af, #2563eb)',
                      backgroundSize: '200% 200%',
                    }}
                  >
                    {/* Shimmer */}
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative z-10 text-white drop-shadow-sm">
                      {item.buttonText || '💜 Doar'}
                    </span>
                  </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#101827] border border-white/5 rounded-xl">
            <span className="text-4xl block mb-4">🛑</span>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum item encontrado</h3>
            <p className="text-slate-400">Não há itens disponíveis nesta categoria no momento.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default DonationSection;
