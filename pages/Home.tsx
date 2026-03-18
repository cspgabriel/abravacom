import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Users, Star, TrendingUp, Home as HomeIcon, DollarSign, Leaf, Award, FileText, CheckCircle, Mail } from 'lucide-react';
import { PROFILE } from '../constants';
import ElisBioSection from '../components/ElisBioSection';
import PartnerMarquee from '../components/PartnerMarquee';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const Home: React.FC = () => {
  const [recentSimulations, setRecentSimulations] = useState<any[]>([]);
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const simQuery = query(collection(db, 'simulations'), orderBy('createdAt', 'desc'), limit(6));
    const campQuery = query(collection(db, 'campaigns'), orderBy('date', 'desc'), limit(6));

    const unsubSims = onSnapshot(simQuery, snap => {
      setRecentSimulations(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    const unsubCamps = onSnapshot(campQuery, snap => {
      setRecentCampaigns(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });

    return () => { unsubSims(); unsubCamps(); };
  }, []);

  const formatCurrency = (value: any) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = typeof value === 'number' ? value : Number(String(value).replace(/[R$\s.]/g, '').replace(',', '.'));
    if (!Number.isFinite(num)) return String(value);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  return (
    <div className="space-y-0">
      {/* Pre-intro selection hero: escolha de fluxo */}
      <section className="relative min-h-[65vh] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-slate-900 w-full">
        {/* Soft background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 opacity-100 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-navy-800 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-navy-700 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="space-y-8 py-20 flex flex-col items-center"
          >

            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-300 text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              Assessoria Financeira Premium
            </motion.div>

            <motion.h1 variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[1.1] max-w-4xl">
              Multiplique Seu Patrimônio com <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">Inteligência</span>
            </motion.h1>

            <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="text-white text-lg sm:text-xl font-medium max-w-2xl leading-relaxed">
              Acesso exclusivo às melhores cartas contempladas do país. Estratégias sofisticadas de alavancagem de capital, 100% isentas de juros.
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full max-w-xl">
              <Link to="/cartas" className="w-full sm:w-auto relative group overflow-hidden bg-white text-navy-900 px-8 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Cartas Disponíveis
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link to="/simulacao" className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all">
                Simular Novo Crédito
              </Link>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="pt-8 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Plataforma homologada pelas maiores administradoras do Brasil</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 
        NEW ORDER:
        1. Partner Marquee
        2. Elis Bio Section (right after Marquee)
        3. Home Features
        4. Featured Cards (Cartas Contempladas / Área do Parceiro)
      */}
      <div className="w-full">
        <PartnerMarquee />
      </div>

      <div className="w-full">
        <ElisBioSection />
      </div>

      <HomeQuickBoardsSection
        simulations={recentSimulations}
        campaigns={recentCampaigns}
        formatCurrency={formatCurrency}
      />

      <div className="w-full py-12 space-y-0">
        <HomeFeaturesSection />
      </div>

      {/* WhatsApp VIP CTA Section */}
      <HomeWhatsappCtaSection />

      {/* Testimonials Section */}
      <HomeTestimonialsSection />

    </div>
  );
};

// ─── NEW HIGH-CONVERSION SECTIONS ───────────────────────────────────────────

const HomeFeaturesSection = () => {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-slate-900 uppercase italic tracking-tighter"
          >
            Por que escolher a <span className="text-amber-400">ABRACON</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium max-w-2xl mx-auto"
          >
            Nossa plataforma conecta você às melhores oportunidades do mercado secundário de consórcios, garantindo segurança, agilidade e isenção total de juros abusivos.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Agilidade Premium", desc: "Acesso imediato a cartas já contempladas. Pule a fila de espera dos consórcios tradicionais e adquira seu bem." },
            { icon: ShieldCheck, title: "Transação Segura", desc: "Processo 100% homologado pelas maiores administradoras do país, com assessoria jurídica e financeira especializada." },
            { icon: DollarSign, title: "Alavancagem Inteligente", desc: "Fuja dos juros compostos dos financiamentos bancários. Multiplique seu patrimônio de forma inteligente e matemática." }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-400">
                <feat.icon size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomeQuickBoardsSection = ({ simulations, campaigns, formatCurrency }: any) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Painel Rápido</h2>
            <p className="text-sm text-slate-500">Últimas simulações e campanhas enviadas</p>
          </div>
          <Link to="/crm?view=campaign-new" className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 flex items-center gap-2">
            <Mail size={16} />
            Nova Campanha
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Simulações Recentes</h3>
              <Link to="/crm" className="text-xs text-amber-400 hover:underline">Ver CRM</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold uppercase">Cliente</th>
                    <th className="px-4 py-3 font-semibold uppercase">Crédito</th>
                    <th className="px-4 py-3 font-semibold uppercase">Tipo</th>
                    <th className="px-4 py-3 font-semibold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {simulations.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Nenhuma simulação encontrada.</td></tr>
                  )}
                  {simulations.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800 truncate">{s.userName || s.userEmail || s.id}</td>
                      <td className="px-4 py-3 text-slate-600">{formatCurrency(s.creditAmount)}</td>
                      <td className="px-4 py-3 text-slate-600">{s.type || '-'}</td>
                      <td className="px-4 py-3 text-slate-600">{s.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Campanhas Enviadas</h3>
              <Link to="/crm" className="text-xs text-amber-400 hover:underline">Ver Histórico</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {campaigns.length === 0 && (
                <div className="px-4 py-6 text-center text-slate-400 text-xs">Nenhuma campanha registrada.</div>
              )}
              {campaigns.map((c: any) => (
                <div key={c.id} className="px-4 py-3 hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800 truncate">{c.subject}</p>
                    <span className="text-[10px] text-slate-400">{c.date?.seconds ? new Date(c.date.seconds * 1000).toLocaleDateString('pt-BR') : '-'}</span>
                  </div>
                  <div className="text-xs text-slate-500">Responsável: {c.responsible || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomeTestimonialsSection = () => {
  const testimonials = [
    {
      name: "Roberto Almeida",
      role: "Empresário",
      text: "A Eliana conseguiu uma carta para ampliação da minha frota em tempo recorde. Assessoria impecável, sem falsa promessa.",
      rating: 5,
      date: "Há 2 meses"
    },
    {
      name: "Mariana Costa",
      role: "Médica",
      text: "Tentava o financiamento da minha clínica e os juros eram absurdos. Com a carta que a Elis encontrou, economizei mais de 40%.",
      rating: 5,
      date: "Há 1 semana"
    },
    {
      name: "Carlos Eduardo",
      role: "Investidor",
      text: "Hoje eu não uso outro caminho para aquisição de imóveis. A inteligência matemática por trás dessa assessoria é de outro nível.",
      rating: 5,
      date: "Há 3 meses"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-center gap-1 mb-4 text-amber-400"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} fill="currentColor" />
            ))}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-slate-900 uppercase italic tracking-tighter"
          >
            O que dizem nossos <span className="text-amber-400">Clientes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium max-w-2xl mx-auto"
          >
            Histórias reais de quem escolheu alavancar patrimônio com inteligência e segurança.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-navy-900/5 transition-all duration-300 relative group"
            >
              <div className="absolute top-8 right-8 text-slate-200 group-hover:text-amber-100 transition-colors">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21L16.41 14H10.5V3H21V14.1L18.441 21H14.017ZM3.517 21L5.91 14H0V3H10.5V14.1L7.941 21H3.517Z" />
                </svg>
              </div>
              <div className="flex items-center gap-1 text-amber-400 mb-6">
                {[...Array(test.rating)].map((_, j) => (
                  <Star key={j} size={16} fill="currentColor" />
                ))}
                <span className="text-xs font-bold text-slate-400 ml-2">{test.date}</span>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed mb-6 italic">
                "{test.text}"
              </p>
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight">{test.name}</h4>
                <p className="text-sm font-bold text-amber-400 tracking-widest uppercase mt-1">{test.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomeWhatsappCtaSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy-600 rounded-full blur-[80px] opacity-20 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="w-20 h-20 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-md"
        >
          <svg className="w-10 h-10 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black text-white uppercase italic tracking-tighter mb-6"
        >
          Acesso Exclusivo às Melhores Ofertas
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-white text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Participe do nosso <span className="font-black">Grupo VIP no WhatsApp</span> e receba em primeira mão cartas contempladas com descontos e condições que não chegam ao público geral.
        </motion.p>

        <motion.a
          href="https://wa.me/YOUR_WHATSAPP_NUMBER_HERE" // <-- Replace with actual link
          target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="inline-flex items-center justify-center gap-3 bg-white text-navy-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 hover:shadow-navy-900/50"
        >
          Entrar no Grupo VIP
          <ArrowRight size={20} />
        </motion.a>
      </div>
    </section>
  );
};

export default Home;

