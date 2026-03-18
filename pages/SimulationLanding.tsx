import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import SimulatorForm from '../components/SimulatorForm';
import ElisBioSection from '../components/ElisBioSection';
import PartnerMarquee from '../components/PartnerMarquee';
import { useState, useEffect } from 'react';

const SimulationLanding: React.FC = () => {
  return (
    <div className="w-full bg-slate-900">
      <section className="relative min-h-[48vh] flex items-center overflow-hidden bg-slate-900 pt-24 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 opacity-100" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[150px] opacity-30 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500 rounded-full blur-[120px] opacity-20 -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 text-white">
            <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span className="text-emerald-50">Cartas Contempladas</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter italic">
              Seu Crédito Imediato, <br/>
              <span className="text-emerald-400">Sem Burocracia</span>
            </h1>
            
            <p className="text-white max-w-md text-base sm:text-lg font-medium leading-relaxed">
              Descubra o poder de compra imediato com nossas cartas contempladas. Faça uma simulação rápida e acesse as melhores oportunidades do mercado agora mesmo.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md transform sm:scale-100 scale-95">
              <SimulatorForm />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="w-full">
        <PartnerMarquee />
      </div>

      <ElisBioSection />
    </div>
  );
};

export default SimulationLanding;
