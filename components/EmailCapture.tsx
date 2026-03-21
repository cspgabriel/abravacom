import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const EmailCapture: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !email.includes('@') || !phone) return;

    setStatus('loading');
    try {
      await addDoc(collection(db, "leads"), {
        name,
        email,
        phone,
        source: 'Acesso Completo - Cartas',
        date: new Date().toLocaleString('pt-BR')
      });
      setStatus('success');
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      } else {
        setName('');
        setEmail('');
        setPhone('');
      }
    } catch (e) {
      console.error("Error saving lead: ", e);
      setStatus('error');
    }
  };

  return (
    <div className="w-full p-6 pb-8 rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-[#d8ad5b]/20 rounded-2xl text-[#b98532]">
          <Mail size={20} />
        </div>
        <div>
          <h3 className="font-black text-[#0b1a3a] text-lg uppercase tracking-tight italic leading-tight">
            CADASTRE-SE PARA TER O <br/><span className="text-[#b98532]">ACESSO COMPLETO</span>
          </h3>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">
        Preencha seus dados abaixo para liberar o acesso aos detalhes das cartas contempladas com taxas exclusivas.
      </p>

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 animate-fade-in">
          <CheckCircle2 className="text-emerald-600 w-12 h-12 mb-4" />
          <p className="text-emerald-700 font-black text-center text-sm uppercase tracking-wider">
            Acesso Liberado!
          </p>
          {!onSuccess && (
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 text-[10px] text-slate-400 hover:text-emerald-600 font-black uppercase tracking-widest transition-colors"
            >
              Realizar outro cadastro
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            required
            disabled={status === 'loading'}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d8ad5b] outline-none transition-all disabled:opacity-50 font-medium text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            required
            disabled={status === 'loading'}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d8ad5b] outline-none transition-all disabled:opacity-50 font-medium text-sm"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              let formatted = val;
              if (val.length <= 11) {
                formatted = val.replace(/^(\d{2})(\d)/g,"($1) $2").replace(/(\d)(\d{4})$/,"$1-$2");
              }
              setPhone(formatted);
            }}
            maxLength={15}
            placeholder="Seu WhatsApp"
            required
            disabled={status === 'loading'}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d8ad5b] outline-none transition-all disabled:opacity-50 font-medium text-sm"
          />
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-5 px-8 mt-2 rounded-2xl bg-gradient-to-r from-[#0b1a3a] to-[#071226] hover:brightness-110 text-white font-black uppercase tracking-widest active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-70 shadow-lg"
          >
            {status === 'loading' ? (
              <Loader2 className="animate-spin w-6 h-6 text-[#d8ad5b]" />
            ) : (
              <>
                <span className="text-sm">Liberar Acesso</span>
                <ArrowRight size={20} className="text-[#d8ad5b]" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default EmailCapture;
