import React from 'react';
import { SOCIAL_LINKS } from '../constants';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mt-32 pt-20 pb-12 relative z-10 w-full bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-white font-black text-2xl italic shadow-lg shadow-black/20">
                A
              </div>
              <span className="text-2xl font-black text-amber-300 tracking-tighter uppercase italic"><span className="text-amber-300">ABRACON</span></span>
            </div>
            <p className="text-white/70 text-sm max-w-sm leading-relaxed font-medium">
              Especialistas em soluções financeiras, consórcios e crédito. Ajudamos você a conquistar seus bens com as melhores taxas do mercado e consultoria personalizada.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-4 rounded-2xl bg-white/15 text-white border border-white/20 hover:bg-white/30 hover:text-white hover:border-white/30 transition-all duration-300 transform hover:scale-110 shadow-sm"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Links Rápidos</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-white/70 hover:text-white text-sm font-bold transition-colors">Início</Link></li>
              <li><Link to="/cartas" className="text-white/70 hover:text-white text-sm font-bold transition-colors">Cartas Contempladas</Link></li>
              <li><Link to="/portal" className="text-white/70 hover:text-white text-sm font-bold transition-colors">Portal do Cliente</Link></li>
              <li><Link to="/sobre" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Sobre o Projeto</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Contato</h4>
            <ul className="space-y-4">
              <li className="text-white/70 text-sm font-medium">contato@ABRACON.com.br</li>
              <li className="text-white/70 text-sm font-medium">(51) 98927-2794</li>
              <li className="text-white/70 text-sm font-medium">Porto Alegre, RS</li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} ABRACON. Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white/70 hover:text-white text-[10px] uppercase tracking-widest font-black transition-colors">Privacidade</a>
            <a href="#" className="text-white/70 hover:text-white text-[10px] uppercase tracking-widest font-black transition-colors">Termos de Uso</a>
            <Link to="/sobre" className="text-white/70 hover:text-white text-[10px] uppercase tracking-widest font-black transition-colors">Sobre o Projeto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

