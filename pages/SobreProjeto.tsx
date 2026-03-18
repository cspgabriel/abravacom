import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Database, Smartphone, LayoutDashboard, Users, FileSpreadsheet,
  ShieldCheck, Zap, Globe, BarChart2, CheckCircle2, ChevronDown, ChevronUp,
  DollarSign, Clock, Star, Layers, Lock, RefreshCw, FileText, Building2
} from 'lucide-react';

const fmtBRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);

interface FaqItem { q: string; a: string }
const FAQ: FaqItem[] = [
  { q: 'O sistema funciona em celular?', a: 'Sim. O projeto é 100% responsivo — desenvolvido com abordagem mobile-first usando Tailwind CSS. Todas as telas se adaptam automaticamente a qualquer tamanho de dispositivo.' },
  { q: 'Os dados ficam armazenados onde?', a: 'No Google Firebase (Firestore), um banco de dados NoSQL em nuvem com alta disponibilidade, backups automáticos e conformidade com LGPD. Nenhum dado fica no servidor do desenvolvedor.' },
  { q: 'O cliente pode gerenciar as cartas sem saber programar?', a: 'Sim. O Painel Admin possui interface visual para criar, editar, excluir e importar cartas via planilha Excel, sem nenhum conhecimento técnico necessário.' },
  { q: 'Como funciona o login dos clientes?', a: 'Via Firebase Authentication com e-mail/senha ou Google. O sistema identifica automaticamente se é admin ou cliente e redireciona para a área correta.' },
  { q: 'É possível integrar com WhatsApp?', a: 'Sim. O sistema já possui integração com WhatsApp Web para envio de cotações diretamente do painel, além do botão flutuante de atendimento rápido.' },
  { q: 'O preço inclui hospedagem?', a: 'A estimativa cobre o desenvolvimento. A hospedagem na Vercel é gratuita no plano Hobby (suficiente para esse porte). O Firebase Spark também é gratuito até determinados limites de uso.' },
];

const FEATURES = [
  { icon: Globe, title: 'Landing Pages', desc: 'Páginas de consórcio, simulação e cartas contempladas prontas para uso comercial' },
  { icon: LayoutDashboard, title: 'Painel Admin', desc: '4 abas: dashboard com métricas, simulações, gestão de cartas e usuários' },
  { icon: FileSpreadsheet, title: 'Import/Export Excel', desc: 'Importe e exporte cartas via planilha XLSX com mapeamento automático de colunas' },
  { icon: Users, title: 'Portal do Cliente', desc: 'Área logada onde o cliente vê suas simulações e cartas reservadas' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Layout responsivo para celular, tablet e desktop com menu lateral adaptativo' },
  { icon: Database, title: 'Firebase', desc: 'Auth + Firestore para autenticação segura e banco de dados em nuvem em tempo real' },
  { icon: Zap, title: 'Simulador', desc: 'Formulário de simulação com slider de crédito e salvamento automático no Firebase' },
  { icon: ShieldCheck, title: 'Controle de Acesso', desc: 'Perfis admin e cliente com redirecionamento automático após login' },
  { icon: BarChart2, title: 'Dashboard com Métricas', desc: 'Gráficos de simulações por tipo, status das cartas e envio rápido de cotações' },
  { icon: FileText, title: 'Ficha da Carta', desc: 'Documento formatado para impressão com dados completos de cada carta contemplada' },
  { icon: RefreshCw, title: 'Dados Demo', desc: 'Sistema exibe dados de amostra automaticamente quando o banco está vazio ou sem permissão' },
  { icon: Building2, title: 'Múltiplas Categorias', desc: 'Suporte a Carros, Imóveis, Caminhões e Giro com filtros avançados por crédito e parcelas' },
];

const TECH_STACK = [
  { name: 'React 19', role: 'Interface (Frontend)', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'TypeScript', role: 'Tipagem estática', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { name: 'Vite 6', role: 'Build tool', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Tailwind CSS', role: 'Estilização', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { name: 'Framer Motion', role: 'Animações', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { name: 'Firebase Auth', role: 'Autenticação', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Firestore', role: 'Banco de dados', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  { name: 'ExcelJS', role: 'Import/Export XLSX', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'React Router 7', role: 'Roteamento SPA', color: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Lucide Icons', role: 'Ícones', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { name: 'Vercel', role: 'Hospedagem', color: 'bg-slate-50 text-slate-900 border-slate-300' },
];

interface BudgetItem { label: string; min: number; max: number; note?: string }
const BUDGET_ITEMS: BudgetItem[] = [
  { label: 'Design UI/UX & Identidade Visual', min: 2500, max: 6000, note: 'Figma, paleta, tipografia' },
  { label: 'Frontend (React + Tailwind + animações)', min: 8000, max: 18000, note: 'Todas as telas e componentes' },
  { label: 'Backend Firebase (Auth + Firestore + regras)', min: 2500, max: 6000, note: 'Setup, security rules, LGPD' },
  { label: 'Painel Administrativo completo', min: 4000, max: 10000, note: 'CRUD, importação Excel, métricas' },
  { label: 'Portal do Cliente', min: 1500, max: 4000, note: 'Login, minhas simulações, cartas' },
  { label: 'Simulador de Consórcio', min: 1500, max: 3500, note: 'Slider, formulário, WhatsApp' },
  { label: 'Integração Export/Import Excel (XLSX)', min: 1000, max: 2500, note: 'ExcelJS, mapeamento de colunas' },
  { label: 'Deploy Vercel + Configurações', min: 500, max: 1500, note: 'CI/CD, domínio, variáveis' },
  { label: 'Testes, ajustes e entrega', min: 1500, max: 4000, note: 'QA, revisões, documentação' },
];

const MARKET_PROFILES = [
  { title: 'Freelancer Júnior', range: 'R$ 8.000 – R$ 18.000', time: '2–4 meses', color: 'bg-slate-50 border-slate-200', badge: 'bg-slate-100 text-slate-600', desc: 'Desenvolvedor autônomo com até 2 anos de experiência. Menor custo, mais tempo de entrega.' },
  { title: 'Freelancer Pleno/Sênior', range: 'R$ 20.000 – R$ 45.000', time: '1–3 meses', color: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-600 text-white', desc: 'Desenvolvedor com experiência sólida em React e Firebase. Boa relação custo-benefício.', highlight: true },
  { title: 'Agência Pequena (2–5 devs)', range: 'R$ 45.000 – R$ 90.000', time: '1–2 meses', color: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', desc: 'Equipe estruturada com designer, dev e PM. Melhor suporte e prazo de entrega.' },
  { title: 'Agência Grande / Software House', range: 'R$ 90.000 – R$ 200.000+', time: '2–4 meses', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700', desc: 'Processo formal, contrato, SLA, suporte estendido e documentação técnica completa.' },
];

const SobreProjeto: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const totalMin = BUDGET_ITEMS.reduce((s, i) => s + i.min, 0);
  const totalMax = BUDGET_ITEMS.reduce((s, i) => s + i.max, 0);

  return (
    <div className="pt-20 sm:pt-24 pb-28 px-3 sm:px-6 max-w-5xl mx-auto space-y-16">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-widest">
          <Code2 size={12} /> Documentação Técnica e Comercial
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">
          Finance8 — Plataforma Digital<br />
          <span className="text-emerald-600">de Consórcio & Crédito</span>
        </h1>
        <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
          Sistema web completo para gestão e divulgação de consórcios contemplados,
          simulações de crédito e administração de clientes, desenvolvido em React com
          Firebase como backend — pronto para uso comercial.
        </p>
      </motion.div>

      {/* ── O que é o projeto ──────────────────────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <Layers size={20} className="text-emerald-600" /> O que é este sistema?
        </h2>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <p className="text-slate-600 leading-relaxed">
            O <strong className="text-slate-900">Finance8</strong> é uma plataforma digital completa para empresas
            e consultores de consórcio e crédito. Ele permite que o negócio:
          </p>
          <ul className="space-y-3">
            {[
              'Exiba um catálogo público de cartas contempladas com filtros avançados (categoria, crédito, parcelas, situação)',
              'Receba leads de clientes interessados através do simulador integrado ao WhatsApp',
              'Gerencie todo o portfólio de cartas via painel admin com importação/exportação de planilhas Excel',
              'Ofereça uma área logada onde o cliente acompanha suas simulações e cartas reservadas',
              'Acompanhe métricas de simulações por tipo, volume de crédito e status das cartas em um dashboard visual',
              'Envie cotações personalizadas pelo WhatsApp diretamente do painel administrativo',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Funcionalidades ───────────────────────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <Zap size={20} className="text-emerald-600" /> Funcionalidades Entregues
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2"
            >
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                <f.icon size={18} className="text-emerald-600" />
              </div>
              <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{f.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stack Técnica ─────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <Code2 size={20} className="text-emerald-600" /> Stack Tecnológica
        </h2>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((t, i) => (
              <div key={i} className={`px-3 py-2 rounded-xl border text-xs font-black ${t.color}`}>
                <span>{t.name}</span>
                <span className="opacity-60 font-normal ml-1.5">· {t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Orçamento estimado ────────────────────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <DollarSign size={20} className="text-emerald-600" /> Orçamento Estimado — Mercado Brasileiro
        </h2>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-amber-800 text-xs font-medium leading-relaxed">
          <strong>Atenção:</strong> Os valores abaixo são estimativas médias de mercado para o Brasil em 2025.
          O custo real varia conforme experiência do profissional, região, escopo final e prazo negociado.
        </div>

        {/* Tabela de itens */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black">
                  <th className="px-5 py-4">Item / Módulo</th>
                  <th className="px-5 py-4 text-right">Mín.</th>
                  <th className="px-5 py-4 text-right">Máx.</th>
                  <th className="px-5 py-4 hidden sm:table-cell">Obs.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BUDGET_ITEMS.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-800 text-sm font-bold">{item.label}</td>
                    <td className="px-5 py-4 text-right text-slate-600 text-sm font-bold">{fmtBRL(item.min)}</td>
                    <td className="px-5 py-4 text-right text-emerald-700 text-sm font-bold">{fmtBRL(item.max)}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs hidden sm:table-cell">{item.note}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-600 text-white">
                  <td className="px-5 py-5 font-black text-sm uppercase tracking-wide">TOTAL ESTIMADO</td>
                  <td className="px-5 py-5 text-right font-black text-base">{fmtBRL(totalMin)}</td>
                  <td className="px-5 py-5 text-right font-black text-base">{fmtBRL(totalMax)}</td>
                  <td className="px-5 py-5 hidden sm:table-cell text-emerald-200 text-xs">Freelancer pleno/sênior</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Perfis de mercado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MARKET_PROFILES.map((p, i) => (
            <div key={i} className={`relative rounded-2xl border p-5 space-y-3 ${p.color} ${p.highlight ? 'ring-2 ring-emerald-600 ring-offset-2' : ''}`}>
              {p.highlight && (
                <div className="absolute -top-3 left-5 flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  <Star size={9} /> Referência
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <p className="font-black text-slate-900 text-sm">{p.title}</p>
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full flex-shrink-0 ${p.badge}`}>
                  <Clock size={9} className="inline mr-1" />{p.time}
                </span>
              </div>
              <p className="font-black text-emerald-700 text-lg">{p.range}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Hospedagem */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-4 flex items-center gap-2">
            <Lock size={16} className="text-emerald-600" /> Custos Recorrentes de Operação
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { item: 'Vercel Hobby (Hospedagem)', cost: 'Gratuito', sub: 'Suficiente para projetos pequenos/médios' },
              { item: 'Firebase Spark (DB + Auth)', cost: 'Gratuito', sub: 'Até 1 GB Firestore, 50k leituras/dia' },
              { item: 'Domínio personalizado', cost: 'R$ 40–80/ano', sub: '.com.br via Registro.br ou Hostinger' },
            ].map((r, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4 space-y-1">
                <p className="text-xs font-black text-slate-600 uppercase tracking-wide">{r.item}</p>
                <p className="font-black text-emerald-600 text-base">{r.cost}</p>
                <p className="text-[11px] text-slate-400">{r.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <Star size={20} className="text-emerald-600" /> Perguntas Frequentes
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-black text-slate-900 text-sm pr-4">{item.q}</span>
                {openFaq === i
                  ? <ChevronUp size={18} className="text-emerald-600 flex-shrink-0" />
                  : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5">
                  <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Rodapé da página ─────────────────────────────────────────────── */}
      <div className="bg-emerald-600 rounded-3xl p-8 text-white text-center space-y-4">
        <p className="font-black text-2xl uppercase tracking-tight italic">FINANCE<span className="text-emerald-200">8</span></p>
        <p className="text-emerald-100 text-sm max-w-lg mx-auto leading-relaxed">
          Sistema desenvolvido sob medida para especialistas em consórcio e crédito.
          Documentação técnica gerada automaticamente pelo sistema.
        </p>
        <p className="text-emerald-200 text-[10px] uppercase tracking-widest font-black">
          Versão 1.0 · Stack: React 19 + Firebase + Vercel
        </p>
      </div>
    </div>
  );
};

export default SobreProjeto;
