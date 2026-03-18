import React from 'react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS } from '../constants';
import BrandLogo from './BrandLogo';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 mt-32 w-full overflow-hidden border-t border-[rgba(217,173,87,0.12)] bg-[linear-gradient(180deg,rgba(7,23,38,0.65)_0%,rgba(5,15,25,0.96)_100%)] pt-20 pb-12 text-[var(--brand-ivory)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,173,87,0.5),transparent)]" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-20 grid grid-cols-1 gap-16 md:grid-cols-4">
          <div className="col-span-1 space-y-8 md:col-span-2">
            <BrandLogo />
            <p className="max-w-sm text-sm font-medium leading-relaxed text-[rgba(244,236,223,0.7)]">
              Consultoria financeira com posicionamento premium, foco em consorcios,
              credito estruturado e aceleracao patrimonial.
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
                    className="rounded-2xl border border-[rgba(217,173,87,0.16)] bg-white/5 p-4 text-[var(--brand-ivory)] transition-all duration-300 hover:scale-110 hover:border-[rgba(217,173,87,0.35)] hover:bg-white/10"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-gold-soft)]">
              Links Rapidos
            </h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm font-bold text-[rgba(244,236,223,0.72)] transition-colors hover:text-white">Inicio</Link></li>
              <li><Link to="/cartas" className="text-sm font-bold text-[rgba(244,236,223,0.72)] transition-colors hover:text-white">Cartas Contempladas</Link></li>
              <li><Link to="/portal" className="text-sm font-bold text-[rgba(244,236,223,0.72)] transition-colors hover:text-white">Portal do Cliente</Link></li>
              <li><Link to="/sobre" className="text-sm font-medium text-[rgba(244,236,223,0.62)] transition-colors hover:text-white">Sobre o Projeto</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-gold-soft)]">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="text-sm font-medium text-[rgba(244,236,223,0.72)]">contato@abravacon.com.br</li>
              <li className="text-sm font-medium text-[rgba(244,236,223,0.72)]">(51) 98927-2794</li>
              <li className="text-sm font-medium text-[rgba(244,236,223,0.72)]">Porto Alegre, RS</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(217,173,87,0.14)] pt-10 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(244,236,223,0.68)]">
            © {new Date().getFullYear()} Abravacon. Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-[rgba(244,236,223,0.68)] transition-colors hover:text-white">Privacidade</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-[rgba(244,236,223,0.68)] transition-colors hover:text-white">Termos de Uso</a>
            <Link to="/sobre" className="text-[10px] font-black uppercase tracking-widest text-[rgba(244,236,223,0.68)] transition-colors hover:text-white">Sobre o Projeto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
