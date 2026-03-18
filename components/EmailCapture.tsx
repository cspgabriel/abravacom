import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const EmailCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      await addDoc(collection(db, "leads"), {
        email,
        source: 'Newsletter Portal',
        date: new Date().toLocaleString('pt-BR')
      });
      setStatus('success');
      setEmail('');
    } catch (e) {
      console.error("Error saving email lead: ", e);
      setStatus('error');
    }
  };

  return (
    <div className="w-full p-6 rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 transition-all duration-500 modal-panel modal-panel-inner">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
          <Mail size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-lg uppercase tracking-tighter italic">
            Newsletter <span className="text-emerald-600">VIP</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Oportunidades Exclusivas</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
        Cadastre-se para receber avisos de <span className="text-slate-900 font-bold">CARTAS CONTEMPLADAS</span> e oportunidades exclusivas de crédito direto no seu e-mail.
      </p>

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 animate-fade-in">
          <CheckCircle2 className="text-emerald-600 w-12 h-12 mb-4" />
          <p className="text-emerald-700 font-black text-center text-sm uppercase tracking-wider">
            Cadastro realizado!
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 text-[10px] text-slate-400 hover:text-emerald-600 font-black uppercase tracking-widest transition-colors"
          >
            Cadastrar outro e-mail
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            required
            disabled={status === 'loading'}
            className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 outline-none transition-all disabled:opacity-50 font-medium"
          />
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-5 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-70"
          >
            {status === 'loading' ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              <>
                <span className="text-sm">Cadastrar Agora</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default EmailCapture;
