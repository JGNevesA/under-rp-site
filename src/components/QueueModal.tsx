import { useEffect } from 'react';

interface QueueModalProps {
  onClose: () => void;
}

const QueueModal = ({ onClose }: QueueModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-orange-400"></div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Fila do Servidor</h3>
              <p className="text-sm text-gray-400">Você está na fila de espera para entrar.</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-black/50 border border-white/5 rounded-xl p-6 text-center mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 mb-2">
              42
            </div>
            <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Sua Posição
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Tempo estimado:</span>
              <span className="text-white font-medium">~15 minutos</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Jogadores online:</span>
              <span className="text-white font-medium">1024 / 1024</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-orange-500 h-1.5 rounded-full w-1/3 animate-pulse"></div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2"
          >
            Sair da Fila
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueModal;
