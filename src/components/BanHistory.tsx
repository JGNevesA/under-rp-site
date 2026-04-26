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

interface Ticket {
  id: number;
  title: string;
  category: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  updated_at?: string;
  // Admin-only fields
  owner_username?: string;
  owner_global_name?: string;
  owner_avatar?: string;
}

interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  is_staff: boolean;
  created_at: string;
  username: string;
  avatar: string;
}

// Status config helper
const TICKET_STATUS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  open:        { label: 'Pendente',            color: '#facc15', bg: 'bg-[#facc15]', border: 'border-[#facc15]/30' },
  in_progress: { label: 'Aguardando Resposta', color: '#36c0ff', bg: 'bg-[#36c0ff]', border: 'border-[#36c0ff]/30' },
  closed:      { label: 'Finalizado',          color: '#71717a', bg: 'bg-[#71717a]', border: 'border-[#71717a]/30' },
};

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://under-rp-site.onrender.com';

const BanHistory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appealTarget, setAppealTarget] = useState<{ banId: number; targetName: string; reason: string }>({ banId: 0, targetName: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', category: '', description: '' });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Admin panel state
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [adminTickets, setAdminTickets] = useState<Ticket[]>([]);
  const [adminFilter, setAdminFilter] = useState<'all' | 'open' | 'in_progress' | 'closed'>('all');
  const [adminLoading, setAdminLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const CATEGORIES = ['Dúvidas Gerais', 'Apelo de Punição', 'Problema com Compra', 'Report de Jogador', 'Report de Staff', 'Bug / Erro no Servidor', 'Sugestão', 'Outro'];

  const openNewTicket = () => {
    setNewTicket({ title: '', category: '', description: '' });
    setTicketSuccess(false);
    setIsNewTicketOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeNewTicket = () => {
    setIsNewTicketOpen(false);
    document.body.style.overflow = '';
  };

  const submitNewTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newTicket)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao criar ticket');
      // Add the new ticket to local state immediately
      const created: Ticket = {
        id: data.ticketId,
        title: newTicket.title,
        category: newTicket.category,
        description: newTicket.description,
        status: 'open',
        created_at: new Date().toISOString()
      };
      setTickets(prev => [created, ...prev]);
      setTicketSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTicketSubmitting(false);
    }
  };

  // ---- Ticket Chat View ----
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const openTicketChat = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setLoadingMessages(true);
    try {
      const res = await fetch(`${API_URL}/api/tickets/${ticket.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTicketMessages(data.messages);
        // Update ticket status from server
        setSelectedTicket(data.ticket);
      }
    } catch {
      console.error('Erro ao buscar mensagens');
    } finally {
      setLoadingMessages(false);
    }
  };

  const closeTicketChat = () => {
    setSelectedTicket(null);
    setTicketMessages([]);
    setNewMessage('');
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;
    setSendingMessage(true);
    try {
      const res = await fetch(`${API_URL}/api/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: newMessage })
      });
      if (res.ok) {
        // Refetch messages and ticket (status may have changed if admin replied)
        const msgRes = await fetch(`${API_URL}/api/tickets/${selectedTicket.id}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (msgRes.ok) {
          const data = await msgRes.json();
          setTicketMessages(data.messages);
          setSelectedTicket(data.ticket);
          // Sync status update into lists
          setTickets(prev => prev.map(t => t.id === data.ticket.id ? { ...t, status: data.ticket.status } : t));
          setAdminTickets(prev => prev.map(t => t.id === data.ticket.id ? { ...t, status: data.ticket.status } : t));
        }
        setNewMessage('');
      }
    } catch {
      alert('Erro ao enviar mensagem');
    } finally {
      setSendingMessage(false);
    }
  };
  
  const [bans, setBans] = useState<Ban[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  void error; // suppressed - error hidden from UI intentionally
  
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [bansRes, ticketsRes, meRes] = await Promise.all([
          fetch(`${API_URL}/api/bans`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/tickets`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (bansRes.ok) setBans(await bansRes.json());
        if (ticketsRes.ok) setTickets(await ticketsRes.json());
        if (meRes.ok) {
          const me = await meRes.json();
          setIsAdminMode(Boolean(me.is_admin));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Fetch all tickets for admin panel
  const fetchAdminTickets = async (filter: string = 'all') => {
    if (!token) return;
    setAdminLoading(true);
    try {
      const url = filter === 'all'
        ? `${API_URL}/api/admin/tickets`
        : `${API_URL}/api/admin/tickets?status=${filter}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setAdminTickets(await res.json());
    } catch (e) {
      console.error('Erro ao buscar tickets admin');
    } finally {
      setAdminLoading(false);
    }
  };

  // Update ticket status (admin only)
  const updateTicketStatus = async (ticketId: number, status: string) => {
    if (!token) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`${API_URL}/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const ts = TICKET_STATUS[status] || TICKET_STATUS.open;
        // Update in adminTickets list
        setAdminTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: status as Ticket['status'] } : t));
        // Update in selectedTicket
        setSelectedTicket(prev => prev && prev.id === ticketId ? { ...prev, status: status as Ticket['status'] } : prev);
        // Update in user tickets list too
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: status as Ticket['status'] } : t));
        void ts;
      }
    } catch (e) {
      alert('Erro ao atualizar status');
    } finally {
      setUpdatingStatus(false);
    }
  };

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
        {/* Header - Only show "VOCÊ ESTÁ BANIDO :(" if there are bans */}
        <header className="text-center mb-10 text-left md:text-center">
          <Link to="/" className="inline-block mb-6 text-[#71717a] hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider">
            &larr; Voltar para o Início
          </Link>
          {bans.length > 0 && (
            <h1 
              className="font-poppins text-4xl md:text-5xl font-extrabold uppercase tracking-tight gradient-text pb-1"
              style={{ 
                textShadow: '0 0 30px var(--theme-glow)' 
              }}
            >
              VOCÊ ESTÁ BANIDO :(
            </h1>
          )}
        </header>

        {/* Loading / Error States */}
        {!token && (
          <div className="text-center bg-[#18181b] border border-white/10 p-10 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Você precisa estar logado</h2>
            <p className="text-[#a1a1aa] mb-6">Conecte-se com sua conta do Discord ou Steam para ver seus tickets e punições.</p>
            <Link to="/" className="theme-button text-black px-6 py-3 rounded-lg font-bold">Fazer Login na Tela Inicial</Link>
          </div>
        )}

        {token && isLoading && (
          <div className="text-center py-20 text-[#a1a1aa] animate-pulse">
            Carregando sistema de suporte...
          </div>
        )}


        {/* Bans List / Tickets Panel */}
        {token && !isLoading && (
          <main className="flex flex-col gap-8">
            <div className="bg-[#1c1c1e] border border-white/5 rounded-xl p-8 shadow-2xl">

              {/* === TICKET CHAT VIEW === */}
              {selectedTicket ? (
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="font-poppins text-2xl font-bold gradient-text uppercase tracking-wide mb-1 w-max">
                        TICKET DE SUPORTE
                      </h2>
                      <p className="text-xs text-[#71717a] mt-1">Título</p>
                      <p className="text-white font-semibold">{selectedTicket.title}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-[#71717a]">Criado em</p>
                        <p className="text-sm text-[#a1a1aa]">
                          {new Date(selectedTicket.created_at).toLocaleDateString('pt-BR')} às {new Date(selectedTicket.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#71717a]">Estado</p>
                        {isAdminMode ? (
                          <select
                            value={selectedTicket.status}
                            disabled={updatingStatus}
                            onChange={e => updateTicketStatus(selectedTicket.id, e.target.value)}
                            className="text-sm font-bold bg-[#18181b] border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-[#f59e0b]/50 cursor-pointer disabled:opacity-60"
                          >
                            <option value="open" className="bg-[#18181b]">Pendente</option>
                            <option value="in_progress" className="bg-[#18181b]">Aguardando Resposta</option>
                            <option value="closed" className="bg-[#18181b]">Finalizado</option>
                          </select>
                        ) : (
                          <span className={`text-sm font-bold px-3 py-1 rounded border ${
                            selectedTicket.status === 'open' ? 'text-[#facc15] border-[#facc15]/30 bg-[#facc15]/10' :
                            selectedTicket.status === 'in_progress' ? 'text-[#36c0ff] border-[#36c0ff]/30 bg-[#36c0ff]/10' :
                            'text-[#71717a] border-[#71717a]/30 bg-[#71717a]/10'
                          }`}>
                            {TICKET_STATUS[selectedTicket.status]?.label || 'Pendente'}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={closeTicketChat}
                        className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-md text-sm font-bold transition-all border border-white/10"
                      >
                        Voltar
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-[#18181b] border border-white/5 rounded-lg p-5 mb-6">
                    <p className="text-xs text-[#71717a] uppercase tracking-wider font-bold mb-2">Descrição do Chamado</p>
                    <p className="text-[#a1a1aa] text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>

                  {/* Messages */}
                  <div className="flex flex-col gap-4 mb-6 min-h-[200px]">
                    {loadingMessages ? (
                      <div className="text-center py-10 text-[#a1a1aa] animate-pulse">Carregando mensagens...</div>
                    ) : ticketMessages.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-[#52525b] text-sm">Nenhuma mensagem ainda. Envie a primeira mensagem abaixo.</p>
                      </div>
                    ) : (
                      ticketMessages.map((msg) => (
                        <div key={msg.id} className="bg-[#18181b] border border-white/5 rounded-lg p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={msg.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                              alt={msg.username}
                              className="w-9 h-9 rounded-full"
                            />
                            <div>
                              <span className={`font-bold text-sm ${msg.is_staff ? 'text-[#facc15]' : 'text-[#a1a1aa]'}`}>
                                {msg.is_staff ? '⭐ UnderRP Suporte' : msg.username}
                              </span>
                              <p className="text-xs text-[#52525b]">
                                {new Date(msg.created_at).toLocaleDateString('pt-BR')} às {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <div className={`ml-12 p-4 rounded-lg text-sm whitespace-pre-wrap ${
                            msg.is_staff
                              ? 'bg-[#facc15]/5 border border-[#facc15]/10 text-[#d4d4d8]'
                              : 'bg-white/5 border border-white/5 text-[#a1a1aa]'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Reply box */}
                  {selectedTicket.status !== 'closed' ? (
                    <form onSubmit={sendMessage} className="flex gap-3">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isAdminMode ? 'Responder como ⭐ UnderRP Suporte...' : 'Digite sua mensagem...'}
                        required
                        rows={3}
                        className="flex-1 bg-[#18181b] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#52525b] focus:outline-none focus:border-[#f59e0b]/50 resize-none"
                      />
                      <button
                        type="submit"
                        disabled={sendingMessage || !newMessage.trim()}
                        className="self-end theme-button disabled:opacity-40 text-black px-6 py-3 rounded-lg text-sm font-bold transition-all"
                      >
                        {sendingMessage ? 'Enviando...' : 'Enviar'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-4 bg-[#18181b] border border-white/5 rounded-lg">
                      <p className="text-[#71717a] text-sm">Este ticket está finalizado. {!isAdminMode && 'Se precisar de mais ajuda, abra um novo ticket.'}</p>
                      {isAdminMode && (
                        <button
                          onClick={() => updateTicketStatus(selectedTicket.id, 'open')}
                          className="mt-2 text-xs text-[#facc15] hover:underline font-semibold"
                        >Reabrir ticket</button>
                      )}
                    </div>
                  )}
                </div>

              ) : activeTab === 'user' ? (
                /* === TICKET LIST VIEW (USER) === */
                <>
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <h2 className="font-poppins text-2xl font-bold gradient-text uppercase tracking-wide w-max">
                        TICKETS DE SUPORTE
                      </h2>
                      {isAdminMode && (
                        <button
                          onClick={() => { setActiveTab('admin'); fetchAdminTickets(adminFilter); }}
                          className="ml-2 px-3 py-1 rounded text-xs font-bold bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] hover:bg-[#facc15]/20 transition-all"
                        >
                          🛡️ Painel Admin
                        </button>
                      )}
                    </div>
                    <button onClick={openNewTicket} className="theme-button text-black px-5 py-2 rounded-md text-sm font-bold transition-all">
                      + Novo
                    </button>
                  </div>
                  
                  <div className="flex border-b border-white/10 pb-4 mb-6 text-sm font-bold text-white">
                    <div className="w-44 pl-2">Categoria</div>
                    <div className="flex-1">Titulo</div>
                    <div className="w-36 text-center">Estado</div>
                    <div className="w-40 text-right">Ultima Atualização</div>
                    <div className="w-28 text-center">Ação</div>
                  </div>
                  
                  {tickets.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-[#52525b] font-medium text-sm">Nenhum Chamado de Suporte</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {tickets.map((ticket) => {
                        const ts = TICKET_STATUS[ticket.status] || TICKET_STATUS.open;
                        return (
                          <article key={ticket.id} className="bg-[#18181b] border border-white/5 rounded-lg p-4 flex items-center hover:bg-white/5 transition-colors relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${ts.bg}`}></div>
                            <div className="w-44 pl-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-white/5 text-[#a1a1aa] border border-white/10 whitespace-nowrap">
                                {ticket.category}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-1">{ticket.title.length > 50 ? `${ticket.title.substring(0, 50)}...` : ticket.title}</h3>
                              <p className="text-xs text-[#71717a]">UnderRP</p>
                            </div>
                            <div className="w-36 text-center">
                              <span className="text-sm font-bold" style={{ color: ts.color }}>{ts.label}</span>
                            </div>
                            <div className="w-40 text-right text-sm text-[#a1a1aa]">
                              {new Date(ticket.created_at).toLocaleDateString('pt-BR')}<br/>
                              <span className="text-xs text-[#71717a]">{new Date(ticket.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="w-28 text-center">
                              <button
                                onClick={() => openTicketChat(ticket)}
                                className="bg-white/5 hover:bg-white/10 text-white px-4 py-1.5 rounded text-xs font-bold transition-all border border-white/10"
                              >
                                Visualizar
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                /* === ADMIN PANEL VIEW === */
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab('user')}
                        className="text-[#71717a] hover:text-white text-sm font-semibold transition-colors"
                      >
                        ← Meus Tickets
                      </button>
                      <h2 className="font-poppins text-2xl font-bold text-[#facc15] uppercase tracking-wide w-max">
                        🛡️ PAINEL ADMIN
                      </h2>
                    </div>
                    <button
                      onClick={() => fetchAdminTickets(adminFilter)}
                      disabled={adminLoading}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {adminLoading ? 'Carregando...' : '↻ Atualizar'}
                    </button>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex gap-2 mb-6">
                    {(['all', 'open', 'in_progress', 'closed'] as const).map(f => {
                      const labels: Record<string, string> = { all: 'Todos', open: 'Pendente', in_progress: 'Aguardando Resposta', closed: 'Finalizado' };
                      return (
                        <button
                          key={f}
                          onClick={() => { setAdminFilter(f); fetchAdminTickets(f); }}
                          className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${
                            adminFilter === f
                              ? 'bg-[#facc15]/20 border-[#facc15]/40 text-[#facc15]'
                              : 'bg-white/5 border-white/10 text-[#71717a] hover:text-white'
                          }`}
                        >
                          {labels[f]}
                        </button>
                      );
                    })}
                  </div>

                  {adminLoading ? (
                    <div className="text-center py-10 text-[#a1a1aa] animate-pulse">Carregando tickets...</div>
                  ) : adminTickets.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-[#52525b] font-medium text-sm">Nenhum ticket encontrado</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {adminTickets.map((ticket) => {
                        const ts = TICKET_STATUS[ticket.status] || TICKET_STATUS.open;
                        return (
                          <article key={ticket.id} className="bg-[#18181b] border border-white/5 rounded-lg p-4 flex items-center hover:bg-white/5 transition-colors relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${ts.bg}`}></div>
                            {/* Owner avatar */}
                            <div className="pl-4 pr-3">
                              <img
                                src={ticket.owner_avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                alt={ticket.owner_username || 'User'}
                                className="w-8 h-8 rounded-full border border-white/10"
                                title={ticket.owner_global_name || ticket.owner_username || 'User'}
                              />
                            </div>
                            <div className="w-36">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-white/5 text-[#a1a1aa] border border-white/10 whitespace-nowrap">
                                {ticket.category}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white mb-0.5 truncate">{ticket.title}</h3>
                              <p className="text-xs text-[#52525b]">{ticket.owner_global_name || ticket.owner_username}</p>
                            </div>
                            <div className="w-36 text-center">
                              <span className="text-sm font-bold" style={{ color: ts.color }}>{ts.label}</span>
                            </div>
                            <div className="w-36 text-right text-sm text-[#a1a1aa] pr-2">
                              {new Date(ticket.updated_at || ticket.created_at).toLocaleDateString('pt-BR')}<br/>
                              <span className="text-xs text-[#52525b]">{new Date(ticket.updated_at || ticket.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="w-24 text-center">
                              <button
                                onClick={() => openTicketChat(ticket)}
                                className="bg-[#facc15]/10 hover:bg-[#facc15]/20 text-[#facc15] border border-[#facc15]/30 px-3 py-1.5 rounded text-xs font-bold transition-all"
                              >
                                Responder
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Ban history section */}
            {bans.length > 0 && (
              <div>
                <h3 className="font-poppins text-lg font-bold gradient-text uppercase tracking-wide mb-3 px-1 w-max">Histórico de Punições</h3>
                <div className="flex flex-col gap-3">
                {bans.map((ban) => {
                    const config = getStatusConfig(ban);
                    return (
                      <article key={ban.id} className="bg-[#18181b] border border-white/5 rounded-lg p-4 flex items-center hover:bg-white/5 transition-colors relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bg}`}></div>
                        
                        <div className="w-48 pl-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-white/5 text-[#a1a1aa] border border-white/10">
                            Punição / Ban
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            {ban.reason.length > 50 ? `${ban.reason.substring(0, 50)}...` : ban.reason}
                          </h3>
                          <div className="text-xs text-[#71717a] flex items-center gap-3">
                            <span>Servidor: {ban.server_name}</span>
                            {ban.status === 'active' && !ban.appeal_status && (
                              <button 
                                onClick={() => openAppealModal(ban.id, config.label, ban.reason)}
                                className="text-[#f59e0b] hover:text-[#facc15] underline decoration-dashed underline-offset-2 transition-colors"
                              >
                                Apelar Punição
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="w-32 text-center flex flex-col items-center justify-center gap-1.5">
                          <span className="text-sm font-bold" style={{ color: config.color }}>{config.label}</span>
                          {ban.appeal_status === 'pending' && <span className="text-[10px] uppercase font-bold text-[#36c0ff] bg-[#36c0ff]/10 px-2 py-0.5 rounded border border-[#36c0ff]/20">Em Análise</span>}
                          {ban.appeal_status === 'accepted' && <span className="text-[10px] uppercase font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded border border-[#22c55e]/20">Aceito</span>}
                          {ban.appeal_status === 'rejected' && <span className="text-[10px] uppercase font-bold text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded border border-[#ef4444]/20">Negado</span>}
                        </div>
                        
                        <div className="w-48 text-right pr-2 text-sm text-[#a1a1aa]">
                          {new Date(ban.banned_at).toLocaleDateString('pt-BR')} <br/>
                          <span className="text-xs text-[#71717a]">{new Date(ban.banned_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
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
                  className="theme-button hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm transition-all"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Apelo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL NOVO TICKET */}
      {isNewTicketOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-5"
          onClick={closeNewTicket}
        >
          <div
            className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-xl relative shadow-[0_0_60px_rgba(245,158,11,0.06)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow accent top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/60 to-transparent" />
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-poppins text-xl font-extrabold gradient-text uppercase tracking-widest w-max">
                    Novo Ticket
                  </h2>
                  <p className="text-xs text-[#52525b] mt-0.5">Preencha os campos abaixo. Nossa equipe responderá em breve.</p>
                </div>
                <button
                  onClick={closeNewTicket}
                  className="text-[#52525b] hover:text-white text-2xl font-light leading-none transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
                >
                  &times;
                </button>
              </div>

              {ticketSuccess ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#facc15]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Ticket enviado!</h3>
                  <p className="text-[#71717a] text-sm mb-6">Nossa equipe vai analisar e responder em breve.<br/>Fique de olho no painel de tickets.</p>
                  <button onClick={closeNewTicket} className="theme-button text-black font-bold px-6 py-2.5 rounded-lg transition-colors text-sm">
                    Fechar
                  </button>
                </div>
              ) : (
                <form onSubmit={submitNewTicket} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1.5">Título do ticket</label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={newTicket.title}
                      onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                      placeholder="Ex: Não consigo acessar o servidor..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]/50 focus:ring-1 focus:ring-[#f59e0b]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1.5">Categoria</label>
                    <select
                      required
                      value={newTicket.category}
                      onChange={e => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f59e0b]/50 focus:ring-1 focus:ring-[#f59e0b]/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#111113]">Selecione uma categoria...</option>
                      {CATEGORIES.map((c: string) => <option key={c} value={c} className="bg-[#111113]">{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1.5">Descrição detalhada</label>
                    <textarea
                      required
                      rows={4}
                      value={newTicket.description}
                      onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                      placeholder="Descreva o problema com o máximo de detalhes possível. Inclua horário, jogadores envolvidos, etc."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]/50 focus:ring-1 focus:ring-[#f59e0b]/20 transition-all resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-white/5 mt-2">
                    <button
                      type="button"
                      onClick={closeNewTicket}
                      className="px-5 py-2.5 text-sm text-[#a1a1aa] hover:text-white font-semibold hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={ticketSubmitting}
                      className="theme-button disabled:opacity-60 text-black font-bold px-6 py-2.5 rounded-lg transition-all text-sm"
                    >
                      {ticketSubmitting ? 'Enviando...' : 'Abrir Chamado →'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanHistory;
