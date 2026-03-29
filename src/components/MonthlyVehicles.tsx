import { useState } from 'react';

interface VehicleClass {
    id: string;
    name: string;
    price: string;
    description: string;
    icon: string;
    color: 'gold' | 'silver' | 'bronze' | 'emerald';
}

const vehicleClasses: VehicleClass[] = [
    {
        id: 'classe-s',
        name: 'Classe S',
        price: 'R$ 150,00',
        description: 'Veículos superesportivos de altíssimo desempenho e design exclusivo.',
        icon: '🏎️',
        color: 'gold',
    },
    {
        id: 'classe-a',
        name: 'Classe A',
        price: 'R$ 75,00',
        description: 'Esportivos modernos com excelente balanço entre velocidade e controle.',
        icon: '🚘',
        color: 'silver',
    },
    {
        id: 'classe-b',
        name: 'Classe B',
        price: 'R$ 50,00',
        description: 'Veículos urbanos tunados e clássicos reformados para o dia a dia.',
        icon: '🚙',
        color: 'bronze',
    },
    {
        id: 'moto',
        name: 'Motocicletas',
        price: 'R$ 60,00',
        description: 'Motos de alta cilindrada para máxima agilidade em Los Santos.',
        icon: '🏍️',
        color: 'emerald',
    },
];

const colorConfig = {
    gold: {
        gradient: 'from-yellow-300 via-amber-400 to-yellow-500',
        glow: 'rgba(251, 191, 36, 0.45)',
        border: 'border-yellow-400/50 hover:border-yellow-300/80',
        badge: 'bg-yellow-400/20 text-yellow-200',
    },
    silver: {
        gradient: 'from-slate-300 via-gray-300 to-slate-400',
        glow: 'rgba(203, 213, 225, 0.35)',
        border: 'border-slate-400/30 hover:border-slate-300/60',
        badge: 'bg-slate-300/20 text-slate-200',
    },
    bronze: {
        gradient: 'from-orange-400 via-amber-500 to-orange-600',
        glow: 'rgba(245, 158, 11, 0.35)',
        border: 'border-orange-500/30 hover:border-orange-400/60',
        badge: 'bg-orange-500/20 text-orange-200',
    },
    emerald: {
        gradient: 'from-emerald-400 via-green-400 to-emerald-600',
        glow: 'rgba(16, 185, 129, 0.35)',
        border: 'border-emerald-500/30 hover:border-emerald-400/60',
        badge: 'bg-emerald-500/20 text-emerald-200',
    },
};

const MonthlyVehicles = () => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <section id="veiculos" className="py-24 bg-[#050810] relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop')] opacity-[0.03] mix-blend-overlay bg-cover bg-center" />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 mb-6">
                        <span className="text-blue-400 text-xl">🏎️</span>
                        <span className="text-blue-300 font-semibold tracking-wide uppercase text-xs">Concessionária VIP</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
                        Veículos{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                            Mensais
                        </span>
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Assine um pacote mensal e garanta o carro dos seus sonhos na garagem todos os dias no servidor.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vehicleClasses.map((vehicle) => {
                        const config = colorConfig[vehicle.color];
                        const isHovered = hoveredId === vehicle.id;
                        const isPremium = vehicle.id === 'classe-s';

                        return (
                            <div
                                key={vehicle.id}
                                onMouseEnter={() => setHoveredId(vehicle.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={`group relative overflow-hidden rounded-2xl border ${config.border} bg-[#0a0f1c]/90 backdrop-blur-xl p-6 flex flex-col transition-all duration-500 transform ${isPremium
                                        ? 'lg:-translate-y-4 scale-105 z-10 shadow-[0_0_30px_-5px_rgba(251,191,36,0.15)] ring-1 ring-yellow-400/20'
                                        : 'hover:-translate-y-2 hover:scale-[1.02]'
                                    }`}
                                style={{
                                    boxShadow: isHovered
                                        ? `0 0 40px ${config.glow}, 0 20px 40px rgba(0,0,0,0.6)`
                                        : isPremium
                                            ? '0 10px 30px rgba(0,0,0,0.5)'
                                            : '0 4px 20px rgba(0,0,0,0.3)',
                                }}
                            >
                                {/* Visual Effects */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/30 opacity-80" />
                                <div className={`absolute -top-px left-4 right-4 h-[2px] bg-gradient-to-r ${config.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-full`} />
                                {isPremium && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent pointer-events-none" />
                                )}

                                {/* Header */}
                                <div className="relative z-10 flex items-center justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] shadow-lg`}>
                                        {vehicle.icon}
                                    </div>
                                    {isPremium && (
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-900 bg-gradient-to-r from-yellow-300 to-amber-400 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                                            MAIS DESEJADO
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-grow">
                                    <h3 className="text-2xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: 'var(--font-subtitle)' }}>
                                        {vehicle.name}
                                    </h3>
                                    <p className="text-sm text-slate-400 leading-relaxed max-w-[250px]">
                                        {vehicle.description}
                                    </p>
                                </div>

                                {/* Pricing & CTA */}
                                <div className="relative z-10 mt-8">
                                    <div className="flex items-end gap-1 mb-5">
                                        <span className={`text-4xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`} style={{ fontFamily: 'var(--font-headline)' }}>
                                            {vehicle.price}
                                        </span>
                                        <span className="text-sm font-medium text-slate-500 mb-1.5">/ mês</span>
                                    </div>

                                    <button
                                        id={`btn-veiculo-${vehicle.id}`}
                                        className={`w-full py-3.5 rounded-xl font-black text-sm transition-all duration-300 bg-gradient-to-r ${config.gradient} opacity-95 hover:opacity-100 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0f1c] ${isPremium ? 'focus:ring-yellow-400 text-yellow-950 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : `text-[#0a0f1c] ${config.border.split(' ')[0].replace('border-', 'focus:ring-')}`
                                            }`}
                                    >
                                        Alugar Veículo
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default MonthlyVehicles;
