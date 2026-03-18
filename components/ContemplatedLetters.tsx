import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, Mail, Info, CheckCircle2, X, FileText, Filter, SlidersHorizontal } from 'lucide-react';
import { ContemplatedLetter } from '../types';
import { db, auth } from '../firebase';
import { PROFILE } from '../constants';
import { collection, getDocs, doc, runTransaction } from 'firebase/firestore';
import EmailCapture from './EmailCapture';
import CartaFicha from './CartaFicha';
import defaultLettersData from '../data/defaultLetters.json';
import WhatsappVipModal from './WhatsappVipModal';

const LOCAL_LETTERS = defaultLettersData as ContemplatedLetter[];

const ContemplatedLetters: React.FC = () => {
  const [letters, setLetters] = useState<ContemplatedLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<ContemplatedLetter | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [pendingReserveId, setPendingReserveId] = useState<string | null>(null);
  const [adminSearch, setAdminSearch] = useState('');
  const [situationFilter, setSituationFilter] = useState<'all' | 'available' | 'reserved' | 'sold'>('all');
  const [creditRange, setCreditRange] = useState<string>('all');
  const [parcelRange, setParcelRange] = useState<string>('all');
  const [fundoRange, setFundoRange] = useState<string>('all');
  const [refRange, setRefRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(true);
  const [fichaLetter, setFichaLetter] = useState<ContemplatedLetter | null>(null);
  
  // Ficha Email Gate
  const [showFichaEmailGate, setShowFichaEmailGate] = useState(false);
  const [fichaLeadEmail, setFichaLeadEmail] = useState('');
  const [pendingFichaLetter, setPendingFichaLetter] = useState<ContemplatedLetter | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // WhatsApp VIP Modal - show after user engages
  const [showWhatsappVipCta, setShowWhatsappVipCta] = useState(false);

  // Derive unique administrators
  const uniqueAdmins = Array.from(new Set(letters.map(l => l.administrator).filter(Boolean))).sort();

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contemplated_letters'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContemplatedLetter));
        setLetters(data.length > 0 ? data : (LOCAL_LETTERS as ContemplatedLetter[]));
      } catch (error) {
        console.error('Error fetching letters:', error);
        setLetters(LOCAL_LETTERS as ContemplatedLetter[]);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  const user = auth.currentUser;
  const isLogged = !!user;

  // Email wall gate
  const [isUnlocked, setIsUnlocked] = useState(
    !!auth.currentUser || localStorage.getItem('letters_unlocked') === 'true'
  );
  const [unlockEmail, setUnlockEmail] = useState('');

  // Show VIP modal after user unlocks
  useEffect(() => {
    if (isUnlocked) {
      const timer = setTimeout(() => setShowWhatsappVipCta(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  const filteredLetters = letters.filter(letter => {
    const matchesCategory = filter === 'all' || letter.category === filter;
    const matchesSearch = (letter.group || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (letter.administrator || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (letter.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAdminSearch = adminSearch.trim() === '' || (letter.administrator || '').toLowerCase().includes(adminSearch.toLowerCase());
    const matchesSituation = situationFilter === 'all' || letter.status === situationFilter;
    const checkRange = (val: number, rangeLabel: string) => {
      if (rangeLabel === 'all') return true;
      if (rangeLabel === '0-100k') return val <= 100000;
      if (rangeLabel === '100k-300k') return val > 100000 && val <= 300000;
      if (rangeLabel === '300k-500k') return val > 300000 && val <= 500000;
      if (rangeLabel === '500k+') return val > 500000;

      if (rangeLabel === '0-100') return val <= 100;
      if (rangeLabel === '100-150') return val > 100 && val <= 150;
      if (rangeLabel === '150-200') return val > 150 && val <= 200;
      if (rangeLabel === '200+') return val > 200;

      if (rangeLabel === 'com-fundo') return val > 0;
      if (rangeLabel === 'sem-fundo') return val === 0;

      return true;
    };

    const matchesCredit = checkRange(letter.credit, creditRange);
    const matchesParcel = checkRange(letter.installmentsCount, parcelRange);
    const matchesFundo = checkRange(letter.fundoComum || 0, fundoRange);
    const matchesRef = checkRange(letter.refGarantia || 0, refRange);

    return matchesCategory && matchesSearch && matchesAdminSearch && matchesSituation && matchesCredit && matchesParcel && matchesFundo && matchesRef;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, adminSearch, situationFilter, creditRange, parcelRange, fundoRange, refRange]);

  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage);
  const paginatedLetters = filteredLetters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedLetters = letters.filter(l => selectedIds.includes(l.id));
  const totalCredit = selectedLetters.reduce((acc, l) => acc + l.credit, 0);
  const totalEntry = selectedLetters.reduce((acc, l) => acc + l.entry, 0);
  const totalInstallment = selectedLetters.reduce((acc, l) => acc + l.installmentValue, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const reserveLetter = async (letterId: string) => {
    const letter = letters.find(l => l.id === letterId);
    if (!letter) return;

    if (!isLogged) {
      setPendingReserveId(letterId);
      setShowEmailCapture(true);
      return;
    }

    try {
      const letterRef = doc(db, 'contemplated_letters', letterId);
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(letterRef as any);
        if (!snap.exists()) throw new Error('Carta não encontrada');
        const data: any = snap.data();
        if (data.status !== 'available') throw new Error('Carta já reservada');
        transaction.update(letterRef, { status: 'reserved', userId: auth.currentUser?.uid || null });
      });
      setLetters(prev => prev.map(l => l.id === letterId ? { ...l, status: 'reserved', userId: auth.currentUser?.uid } : l));
    } catch (e) {
      console.error('Error reserving letter:', e);
      alert('Não foi possível reservar esta carta. Talvez já tenha sido reservada.');
    }
  };

  const reserveSelection = async () => {
    if (selectedIds.length === 0) return;
    if (!isLogged) {
      setShowEmailCapture(true);
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        for (const id of selectedIds) {
          const ref = doc(db, 'contemplated_letters', id);
          const snap = await transaction.get(ref as any);
          if (!snap.exists()) continue;
          const data: any = snap.data();
          if (data.status === 'available') {
            transaction.update(ref, { status: 'reserved', userId: auth.currentUser?.uid || null });
          }
        }
      });
      setLetters(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, status: 'reserved', userId: auth.currentUser?.uid } : l));
      setSelectedIds([]);
    } catch (e) {
      console.error('Error reserving selection:', e);
      alert('Erro ao reservar seleção. Tente novamente.');
    }
  };

  const handleOpenFicha = (letter: ContemplatedLetter) => {
    if (isLogged || localStorage.getItem('ficha_lead_email')) {
      setFichaLetter(letter);
    } else {
      setPendingFichaLetter(letter);
      setShowFichaEmailGate(true);
    }
  };

  const handleFichaEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fichaLeadEmail.trim()) {
      localStorage.setItem('ficha_lead_email', fichaLeadEmail.trim());
      setShowFichaEmailGate(false);
      setFichaLetter(pendingFichaLetter);
    }
  };

  const openWhatsAppSummary = () => {
    if (selectedIds.length === 0) return;
    if (!isLogged) {
      setShowEmailCapture(true);
      return;
    }

    const msg = `Olá, tenho interesse nas cartas: ${selectedIds.join(', ')}. Crédito total: ${formatCurrency(totalCredit)}, Entrada total: ${formatCurrency(totalEntry)}.`;
    const phone = PROFILE?.whatsapp?.replace(/\D/g, '') || '';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`relative space-y-6 pt-20 sm:pt-24 pb-28 px-3 sm:px-6 max-w-7xl mx-auto ${!isUnlocked ? 'h-screen overflow-hidden' : ''}`}>

      {/* Email Wall Modal */}
      <AnimatePresence>
        {!isUnlocked && !loading && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-md bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 pt-10 pb-8 px-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[40px] opacity-20" />
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic relative z-10">Acesso Exclusivo</h2>
                <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-widest mt-2 relative z-10">
                  Insira seu e-mail para ver as cartas contempladas
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (unlockEmail.trim()) {
                    localStorage.setItem('letters_unlocked', 'true');
                    localStorage.setItem('last_simulation_email', unlockEmail.trim().toLowerCase());
                    setIsUnlocked(true);
                  }
                }}
                className="p-8 space-y-6"
              >
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Seu melhor e-mail"
                    value={unlockEmail}
                    onChange={(e) => setUnlockEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
                >
                  Ver Cartas Disponíveis
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-300 ${!isUnlocked ? 'filter blur-sm opacity-40 pointer-events-none select-none' : ''}`}>
      {/* Page header */}
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            CARTAS DISPONÍVEIS
          </h2>
          <p className="text-slate-500 font-medium text-sm">Oportunidades exclusivas com crédito imediato</p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {filteredLetters.length} {filteredLetters.length === 1 ? 'Carta Disponível' : 'Cartas Disponíveis'}
            </span>
          </div>
        </div>

        {/* Category filter removed as only Imóvel is available */}

        {/* Search + filter toggle row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por administradora ou grupo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 sm:py-4 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(p => !p)}
            className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 rounded-2xl border text-sm font-black transition-all ${showFilters ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <select
            aria-label="Filtro de situação"
            value={situationFilter}
            onChange={(e) => setSituationFilter(e.target.value as any)}
            className="hidden sm:block flex-shrink-0 px-3 py-3 rounded-2xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Todas</option>
            <option value="available">Disponível</option>
            <option value="reserved">Reservada</option>
            <option value="sold">Vendida</option>
          </select>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <select
                aria-label="Situação"
                value={situationFilter}
                onChange={(e) => setSituationFilter(e.target.value as any)}
                className="sm:hidden px-3 py-2.5 rounded-xl border border-slate-200 text-sm col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Todas as situações</option>
                <option value="available">Disponível</option>
                <option value="reserved">Reservada</option>
                <option value="sold">Vendida</option>
              </select>
              <select
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Todas as Administradoras</option>
                {uniqueAdmins.map(admin => (
                  <option key={admin} value={admin}>{admin}</option>
                ))}
              </select>
              <select value={creditRange} onChange={(e) => setCreditRange(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="all">Filtre por Crédito</option>
                <option value="0-100k">Até R$ 100.000</option>
                <option value="100k-300k">R$ 100.000 a R$ 300.000</option>
                <option value="300k-500k">R$ 300.000 a R$ 500.000</option>
                <option value="500k+">Acima de R$ 500.000</option>
              </select>
              <select value={parcelRange} onChange={(e) => setParcelRange(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="all">Filtre por Parcelas</option>
                <option value="0-100">Até 100x</option>
                <option value="100-150">100x a 150x</option>
                <option value="150-200">150x a 200x</option>
                <option value="200+">Acima de 200x</option>
              </select>
              <select value={fundoRange} onChange={(e) => setFundoRange(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="all">Filtre por Fundo Comum</option>
                <option value="sem-fundo">Sem Fundo Comum</option>
                <option value="com-fundo">Com Fundo Comum</option>
              </select>
              <select value={refRange} onChange={(e) => setRefRange(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="all">Filtre por Ref. Garantia</option>
                <option value="sem-fundo">Sem Ref. Garantia</option>
                <option value="com-fundo">Com Ref. Garantia</option>
              </select>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <button onClick={() => { setSearchTerm(''); setAdminSearch(''); setCreditRange('all'); setParcelRange('all'); setFundoRange('all'); setRefRange('all'); setSituationFilter('all'); }} className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-black hover:bg-slate-50">Limpar</button>
                <button onClick={() => setShowFilters(false)} className="flex-1 px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-black">OK</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selection Summary Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] w-[95%] max-w-3xl bg-emerald-600 text-white p-4 sm:p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-400/30 backdrop-blur-xl"
          >
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Crédito Total</p>
                <p className="text-xl font-black">{formatCurrency(totalCredit)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Entrada Total</p>
                <p className="text-xl font-black">{formatCurrency(totalEntry)}</p>
              </div>
              <div className="text-center hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Parcelas</p>
                <p className="text-xl font-black">{formatCurrency(totalInstallment)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                {selectedIds.length} {selectedIds.length === 1 ? 'Carta' : 'Cartas'}
              </span>
              <button 
                onClick={() => setSelectedIds([])}
                aria-label="Limpar seleção"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <button onClick={reserveSelection} className="bg-white text-emerald-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg">
                Reservar Seleção
              </button>
              <button onClick={() => alert('Soma: ' + formatCurrency(totalCredit))} className="bg-white text-slate-700 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                Somar
              </button>
              <button onClick={openWhatsAppSummary} className="bg-emerald-500 text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm">
                WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email capture modal for non-logged users */}
      <AnimatePresence>
        {showEmailCapture && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowEmailCapture(false); setPendingReserveId(null); }} className="absolute inset-0 bg-slate-900/60" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-2xl p-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100">
                <div className="flex justify-end">
                  <button onClick={() => { setShowEmailCapture(false); setPendingReserveId(null); }} className="text-slate-400">Fechar</button>
                </div>
                <EmailCapture />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email capture modal for Ficha */}
      <AnimatePresence>
        {showFichaEmailGate && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFichaEmailGate(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl text-center">
              <button 
                onClick={() => setShowFichaEmailGate(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <Mail size={32} />
              </div>
              
              <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">Ver Informações</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">
                Insira seu melhor e-mail para ter acesso completo a todos os detalhes desta carta.
              </p>
              
              <form onSubmit={handleFichaEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  value={fichaLeadEmail}
                  onChange={(e) => setFichaLeadEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                  ACESSAR DETALHES
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
              <th className="px-6 py-5 w-12"><div className="w-5 h-5 border-2 border-slate-200 rounded" /></th>
              <th className="px-6 py-5">Categoria</th>
              <th className="px-6 py-5">Crédito</th>
              <th className="px-6 py-5">Entrada</th>
              <th className="px-6 py-5">Parcelas</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedLetters.map((letter, i) => (
              <motion.tr
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                key={letter.id}
                onClick={() => handleOpenFicha(letter)}
                className={`cursor-pointer transition-colors group ${selectedIds.includes(letter.id) ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
              >
                <td className="px-6 py-5">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.includes(letter.id) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-200 group-hover:border-slate-300'}`}>
                    {selectedIds.includes(letter.id) && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-slate-900 font-black uppercase text-sm">{letter.category}</span>
                  <div className="text-[10px] text-slate-400 font-bold">{letter.group}</div>
                  {letter.name && <div className="text-[10px] text-slate-400">{letter.name}</div>}
                </td>
                <td className="px-6 py-5 text-emerald-600 font-black text-base">{formatCurrency(letter.credit)}</td>
                <td className="px-6 py-5 text-slate-900 font-bold text-sm">
                  {isLogged ? formatCurrency(letter.entry) : (
                    <button onClick={() => setShowEmailCapture(true)} className="text-[10px] font-black bg-emerald-600 text-white px-3 py-1 rounded-full">Ver</button>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="text-slate-900 font-black text-sm">{letter.installmentsCount}x</div>
                  <div className="text-[10px] text-slate-500">{formatCurrency(letter.installmentValue)}</div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${letter.status === 'available' ? 'bg-emerald-100 text-emerald-700' : letter.status === 'reserved' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                    {letter.status === 'available' ? 'Disponível' : letter.status === 'reserved' ? 'Reservada' : 'Vendida'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); reserveLetter(letter.id); }} aria-label={letter.status === 'available' ? 'Reservar carta' : 'Carta reservada'} className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${letter.status === 'available' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {letter.status === 'available' ? 'Reservar' : 'Reservada'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleOpenFicha(letter); }} aria-label="Ver ficha da carta" className="p-2 bg-slate-50 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-xl border border-slate-200 transition-all">
                      <FileText size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card grid */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedLetters.map((letter, i) => (
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            key={letter.id}
            onClick={() => handleOpenFicha(letter)}
            className={`bg-white border rounded-2xl p-4 shadow-sm cursor-pointer transition-all ${selectedIds.includes(letter.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full">
                  {letter.category}
                </span>
                <p className="font-black text-slate-900 text-sm uppercase mt-1">{letter.group}</p>
                {letter.name && <p className="text-xs text-slate-500">{letter.name}</p>}
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${letter.status === 'available' ? 'bg-emerald-100 text-emerald-700' : letter.status === 'reserved' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                {letter.status === 'available' ? 'Disponível' : letter.status === 'reserved' ? 'Reservada' : 'Vendida'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Crédito</p>
                <p className="font-black text-emerald-600">{formatCurrency(letter.credit)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Entrada</p>
                <p className="font-black text-slate-900">
                  {isLogged ? formatCurrency(letter.entry) : '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Parcelas</p>
                <p className="font-black text-slate-700 text-sm">{letter.installmentsCount}x</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Vlr. Parcela</p>
                <p className="font-black text-slate-700 text-sm">{formatCurrency(letter.installmentValue)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); reserveLetter(letter.id); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${letter.status === 'available' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                {letter.status === 'available' ? 'Reservar' : 'Reservada'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleOpenFicha(letter); }}
                aria-label="Ver ficha"
                className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-600 hover:text-white text-slate-500 transition-all"
              >
                <FileText size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center flex-wrap items-center mt-8 gap-2">
          <button 
            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Anterior
          </button>
          <div className="flex flex-wrap gap-1 justify-center max-w-[60vw]">
            {Array.from({ length: totalPages }).map((_, i) => {
              // Show only a window of pages around current page to avoid huge pagination
              if (
                i === 0 || 
                i === totalPages - 1 || 
                (i >= currentPage - 2 && i <= currentPage) 
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 0); }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {i + 1}
                  </button>
                );
              }
              // Show ellipsis
              if (i === 1 && currentPage > 3) return <span key={i} className="px-1 text-slate-400">...</span>;
              if (i === totalPages - 2 && currentPage < totalPages - 2) return <span key={i} className="px-1 text-slate-400">...</span>;
              return null;
            })}
          </div>
          <button 
            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Email capture modal */}
      <AnimatePresence>
        {showEmailCapture && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowEmailCapture(false); setPendingReserveId(null); }} className="absolute inset-0 bg-slate-900/60" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-lg p-4">
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-100">
                <div className="flex justify-end mb-2">
                  <button onClick={() => { setShowEmailCapture(false); setPendingReserveId(null); }} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
                </div>
                <EmailCapture />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Carta Ficha modal */}
      {fichaLetter && <CartaFicha letter={fichaLetter} onClose={() => setFichaLetter(null)} />}

      {/* WhatsApp VIP Modal - only when unlocked */}
      {showWhatsappVipCta && isUnlocked && (
        <WhatsappVipModal 
          isOpen={showWhatsappVipCta}
          onClose={() => setShowWhatsappVipCta(false)}
        />
      )}
      </div> {/* end blur wrapper */}
    </div>
  );
};

export default ContemplatedLetters;
