import React, { useState, useEffect } from 'react';
import './BanHistory.css';
import { Link } from 'react-router-dom';

interface Ban {
  id: number;
  reason: string;
  status: 'active' | 'expired' | 'revoked';
  appeal_status: 'pending' | 'accepted' | 'rejected' | null;
  banned_at: string;
  banned_until: string | null;
  server_name: string;
}

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://underrp-api.onrender.com';

const BanHistory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appealTarget, setAppealTarget] = useState<{ banId: number; targetName: string; reason: string }>({ banId: 0, targetName: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bans, setBans] = useState<Ban[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchBans = async () => {
      try {
        const response = await fetch(`${API_URL}/api/bans`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Erro ao buscar bans. Verifique seu login.');
        }
        
        const data = await response.json();
        setBans(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBans();
  }, [token]);

  const openAppealModal = (banId: number, targetName: string, reason: string) => {
    setAppealTarget({ banId, targetName, reason });
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const closeAppealModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const submitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const rulesChecked = (document.getElementById('rulesCheck') as HTMLInputElement)?.checked;
    const reasonInput = (document.getElementById('appealReason') as HTMLTextAreaElement)?.value;
    const proofInput = (document.getElementById('appealProofs') as HTMLInputElement)?.value;
    
    if (!rulesChecked) {
      alert("Você deve confirmar que leu as regras!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/bans/${appealTarget.banId}/appeal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: reasonInput,
          proof_link: proofInput
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar apelo');
      }

      alert(`Apelo enviado com sucesso para o banco de dados!\nAguarde a análise da Staff.`);
      
      // Update local state to show pending appeal
      setBans(bans.map(ban => {
        if (ban.id === appealTarget.banId) {
          return { ...ban, appeal_status: 'pending' };
        }
        return ban;
      }));
      
      closeAppealModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusConfig = (ban: Ban) => {
    if (ban.status === 'active') {
      return { label: 'Ban Ativo', color: '#4ade80', bg: 'bg-[#4ade80]' };
    }
    if (ban.status === 'revoked') {
      return { label: 'Revogado', color: '#36c0ff', bg: 'bg-[#36c0ff]' };
    }
    return { label: 'Expirado', color: '#71717a', bg: 'bg-[#71717a]' };
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[#f4f4f5] font-sans antialiased">
      <div className="max-w-[1000px] mx-auto px-5 py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <Link to="/" className="inline-block mb-8 text-[#71717a] hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider">
            &larr; Voltar para a Home
          </Link>
          <h1 
            className="font-poppins text-4xl md:text-5xl font-extrabold uppercase tracking-tight"
            style={{ 
              color: '#4ade80', 
              textShadow: '0 0 30px rgba(74, 222, 128, 0.2)' 
            }}
          >
            VOCÊ ESTÁ BANIDO :(
          </h1>
        </header>

        {/* Loading / Error States */}
        {!token && (
          <div className="text-center bg-[#18181b] border border-white/10 p-10 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Você precisa estar logado</h2>
            <p className="text-[#a1a1aa] mb-6">Conecte-se com sua conta do Discord ou Steam para ver seu histórico de bans.</p>
            <Link to="/" className="bg-[#f59e0b] text-black px-6 py-3 rounded-lg font-bold">Voltar ao Início</Link>
          </div>
        )}

        {token && isLoading && (
          <div className="text-center py-20 text-[#a1a1aa] animate-pulse">
            Carregando seu histórico de bans...
          </div>
        )}

        {token && error && (
          <div className="text-center bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-2xl">
            Ops! {error}
          </div>
        )}

        {/* Bans List */}
        {token && !isLoading && !error && (
          <main className="flex flex-col gap-8">
            {bans.length === 0 ? (
              <div className="text-center bg-[#18181b] border border-white/10 p-10 rounded-2xl">
                <span className="text-4xl block mb-4">🎉</span>
                <h2 className="text-2xl font-bold mb-2">Seu histórico está limpo!</h2>
                <p className="text-[#a1a1aa]">Não encontramos nenhum ban associado a esta conta.</p>
              </div>
            ) : (
              bans.map((ban) => {
                const config = getStatusConfig(ban);
                return (
                  <article key={ban.id} className="bg-[#18181b] border border-white/10 rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-1 shadow-2xl">
                    <div className={`absolute top-0 left-0 w-1 h-full ${config.bg}`}></div>
                    
                    <div className="flex justify-between items-center mb-6 pb-5 border-b border-white/10">
                      <h2 className="font-poppins text-2xl font-bold" style={{ color: config.color }}>{config.label}</h2>
                      {ban.status === 'active' && !ban.appeal_status && (
                        <button 
                          className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:border-[#f59e0b] hover:text-[#facc15]"
                          onClick={() => openAppealModal(ban.id, config.label, ban.reason)}
                        >
                          Criar Apelo
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-4">
                      <div className="md:col-span-4">
                        <span className="block text-xs font-semibold text-[#71717a] uppercase tracking-wide mb-2">Motivo</span>
                        <p className="text-[#a1a1aa] font-medium">{ban.reason}</p>
                      </div>
                      
                      {ban.appeal_status && (
                        <div>
                          <span className="block text-xs font-semibold text-[#71717a] uppercase tracking-wide mb-2">Estado do Apelo</span>
                          {ban.appeal_status === 'pending' && <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold text-[#36c0ff] bg-[#36c0ff]/10 border border-[#36c0ff]/20">Em análise</span>}
                          {ban.appeal_status === 'accepted' && <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20">Aceito</span>}
                          {ban.appeal_status === 'rejected' && <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20">Rejeitado</span>}
                        </div>
                      )}

                      <div className="hidden md:block md:col-span-2"></div>
                      
                      <div>
                        <span className="block text-xs font-semibold text-[#71717a] uppercase tracking-wide mb-2">Banido Em</span>
                        <p className="font-mono text-sm">{new Date(ban.banned_at).toLocaleString()}</p>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-[#71717a] uppercase tracking-wide mb-2">Banido Até</span>
                        <p className="font-mono text-sm">{ban.banned_until ? new Date(ban.banned_until).toLocaleString() : 'Permanente'}</p>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-[#71717a] uppercase tracking-wide mb-2">Servidor</span>
                        <p className="text-sm">{ban.server_name}</p>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </main>
        )}
      </div>

      {/* MODAL DE APELO */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex justify-center items-center z-50 p-5 transition-all"
          onClick={closeAppealModal}
        >
          <div 
            className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-2xl p-10 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-5 right-6 text-[#71717a] hover:text-white text-3xl font-light leading-none"
              onClick={closeAppealModal}
            >
              &times;
            </button>
            
            <div className="mb-8">
              <h2 className="font-poppins text-3xl text-white mb-2">Criar Apelo</h2>
              <p className="text-[#a1a1aa] text-sm">
                Criando apelo para: <strong className="text-[#facc15]">{appealTarget.targetName}</strong> <br/>
                <span className="text-xs text-[#71717a]">Motivo registrado: {appealTarget.reason}</span>
              </p>
            </div>

            <form onSubmit={submitAppeal}>
              <div className="mb-6">
                <label htmlFor="appealReason" className="block text-sm font-medium text-white mb-2">Motivo do apelo (Explicação detalhada)</label>
                <textarea 
                  id="appealReason" 
                  rows={5} 
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white text-sm focus:outline-none focus:border-[#eab308] focus:ring-2 focus:ring-[#f59e0b]/20 transition-all"
                  placeholder="Explique por que seu banimento foi injusto ou por que você merece uma segunda chance..." 
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="appealProofs" className="block text-sm font-medium text-white mb-2">Link de provas (Vídeos, prints, etc)</label>
                <input 
                  type="url" 
                  id="appealProofs" 
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white text-sm focus:outline-none focus:border-[#eab308] focus:ring-2 focus:ring-[#f59e0b]/20 transition-all"
                  placeholder="https://youtube.com/... ou https://imgur.com/..." 
                />
              </div>

              <div className="flex items-start gap-3 my-8 p-4 bg-[#f59e0b]/5 border border-dashed border-[#f59e0b]/30 rounded-lg">
                <input 
                  type="checkbox" 
                  id="rulesCheck" 
                  required
                  className="mt-1 w-4 h-4 accent-[#f59e0b] cursor-pointer"
                />
                <label htmlFor="rulesCheck" className="text-sm text-[#a1a1aa] leading-relaxed cursor-pointer select-none">
                  Eu entendo as regras do servidor e confirmo que as informações acima são verdadeiras.
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-5 border-t border-white/10">
                <button 
                  type="button" 
                  className="px-6 py-3 text-[#a1a1aa] hover:text-white hover:bg-white/5 rounded-lg font-semibold text-sm transition-all"
                  onClick={closeAppealModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#f59e0b] hover:bg-[#facc15] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm transition-all"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Apelo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanHistory;
