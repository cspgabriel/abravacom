import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LayoutDashboard, FileText, Home, ShieldCheck,
  MessageCircle, PiggyBank, Building2, Car, Briefcase, Globe,
  Star, Users, Instagram, LogIn, User, LogOut
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LINKS, SOCIAL_LINKS, PROFILE } from '../constants';
import { LinkCategory } from '../types';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === 'admin');
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Prevent body scroll when menu open (class-based to avoid conflicts)
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => { document.body.classList.remove('overflow-hidden'); };
  }, [isOpen]);

  const openAuth = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('open-auth-modal'));
  };

  const internalLinks = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'Simulação', path: '/simulacao', icon: FileText },
    { name: 'Consórcios', path: '/consorcio', icon: FileText },
    { name: 'Cartas Disponíveis', path: '/cartas', icon: FileText },
    { name: 'Portal do Cliente', path: '/portal', icon: LayoutDashboard },
    { name: 'Painel Admin', path: '/admin-public', icon: ShieldCheck },
    { name: 'Acesso Restrito', path: '/acesso', icon: LogIn },
    { name: 'Sobre o Projeto', path: '/sobre', icon: FileText },
  ];

  // navClass with navy blue gradient
  const navClass = 'fixed top-0 left-0 right-0 z-[150] bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-md';

  const linkActive = (path: string) =>
    location.pathname === path
      ? 'text-white'
      : 'text-white/70 hover:text-white';

  return (
    <>
      <nav className={navClass}>
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-navy-900 rounded-lg flex items-center justify-center text-amber-400 font-black text-lg sm:text-xl italic shadow-lg">
            A
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base sm:text-lg font-black text-amber-400 tracking-tighter">
              <span className="text-amber-400">ABRACON</span>
            </span>
            <span className="text-[7px] sm:text-[8px] text-white/80 font-bold uppercase tracking-[0.2em]">
              Crédito &amp; Consórcio
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {[
            { name: 'Início', path: '/' },
            { name: 'Simulação', path: '/simulacao' },
            { name: 'Consórcios', path: '/consorcio' },
            { name: 'Cartas Disponíveis', path: '/cartas' },
            { name: 'Painel Admin', path: '/admin-public' },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all ${linkActive(link.path)}`}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="relative group">
              <Link
                to="/portal"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm"
              >
                <User size={14} />
                Minha Conta
              </Link>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col py-2">
                <Link to="/portal" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-amber-500 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider transition-colors">
                  <LayoutDashboard size={14} />
                  Meu Painel
                </Link>
                <div className="h-px bg-slate-100 my-1 w-full" />
                <button
                  onClick={() => auth.signOut()}
                  className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-colors w-full text-left"
                >
                  <LogOut size={14} />
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={openAuth}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:from-amber-600 hover:to-yellow-500 transition-all shadow-lg whitespace-nowrap"
            >
              Área do Parceiro
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-white/15 transition-colors"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <Menu size={24} className="text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 z-[145] w-[85vw] max-w-sm bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white shadow-2xl flex flex-col lg:hidden overflow-y-auto"
            >
              {/* Menu header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/20 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-white font-black text-sm italic">
                    A
                  </div>
                  <span className="font-black text-amber-400 tracking-tighter">
                    ABRACON
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/15 transition-colors"
                  aria-label="Fechar menu"
                >
                  <X size={22} className="text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {/* Internal navigation */}
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 px-2 pt-2 pb-1">
                  Navegação
                </p>
                {internalLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-bold ${location.pathname === link.path
                      ? 'bg-white/15 text-white shadow-md shadow-black/20'
                      : 'text-white/80 hover:bg-white/10'
                      }`}
                  >
                    <link.icon size={18} className="flex-shrink-0" />
                    <span className="uppercase tracking-widest text-xs">{link.name}</span>
                  </Link>
                ))}

                {/* Divider: External links */}
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 px-2 pt-4 pb-1">
                  Links &amp; Produtos
                </p>
                {LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm ${link.highlight
                        ? 'bg-white/15 text-white font-black border border-white/25'
                        : 'text-white/80 hover:bg-white/10 font-medium'
                        }`}
                    >
                      {Icon && <Icon size={18} className="flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wider truncate">{link.label}</p>
                        {link.subtext && (
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{link.subtext}</p>
                        )}
                      </div>
                    </a>
                  );
                })}

                {/* Social */}
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 px-2 pt-4 pb-1">
                  Redes Sociais
                </p>
                <div className="flex gap-3 px-2 pb-2">
                  {SOCIAL_LINKS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="w-11 h-11 bg-white/15 border border-white/25 rounded-2xl flex items-center justify-center text-white/80 hover:bg-white/30 hover:text-white hover:border-white/40 transition-all"
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="px-4 pb-6 pt-3 flex-shrink-0 space-y-2 mt-auto">
                {user ? (
                  <>
                    <Link
                      to="/portal"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                    >
                      <User size={18} />
                      Minha Conta
                    </Link>
                    <button
                      onClick={() => { setIsOpen(false); auth.signOut(); }}
                      className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-colors active:scale-95"
                    >
                      <LogOut size={18} />
                      Sair
                    </button>
                  </>
                ) : (
                  <button
                    onClick={openAuth}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                  >
                    Área do Parceiro
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

