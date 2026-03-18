
import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, Sparkles, Building2, Users, Search, Plus, ChevronRight, History as HistoryIcon, Mail as MailIcon } from 'lucide-react';
import { AISummaryModal } from './AISummaryModal';
import { cleanText, getLinkedCompanies, safeRender, getStatusColor, formatCurrencyBR, normalizeEmail, normalizePhone } from '../utils/helpers';
import { COMPANY_FIELDS } from '../config/constants';

export const CompanyDetailsView = ({ company, allContacts, campaigns, onBack, onEdit, onViewContact, onDelete, onAddContact, onEditContact, detailFields, onEnrich }: any) => {
    const [contactSearch, setContactSearch] = useState('');
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [companyPage, setCompanyPage] = useState(1);
    const [companyPageSize, setCompanyPageSize] = useState(25);
    if (!company) return null;
    const linkedContacts = useMemo(() => {
        const linked = allContacts.filter((c: any) => getLinkedCompanies(c, [company]).length > 0);
        if (!contactSearch) return linked;
        const lowerSearch = contactSearch.toLowerCase();
        return linked.filter((c: any) => (c.name && c.name.toLowerCase().includes(lowerSearch)) || (c.email && c.email.toLowerCase().includes(lowerSearch)) || (c.role && c.role.toLowerCase().includes(lowerSearch)));
    }, [company, allContacts, contactSearch]);

    const matchedByEmailOrPhone = useMemo(() => {
        if (!company) return [];
        const emailKey = normalizeEmail(company.userEmail);
        const phoneKey = normalizePhone(company.userPhone);
        return allContacts.filter((c: any) => {
            const cEmail = normalizeEmail(c.email);
            const cPhone = normalizePhone(c.phone);
            return (emailKey && cEmail && emailKey === cEmail) || (phoneKey && cPhone && phoneKey === cPhone);
        });
    }, [company, allContacts]);
    const companyTotalPages = Math.max(1, Math.ceil(linkedContacts.length / companyPageSize));
    const companyPageContacts = linkedContacts.slice((companyPage - 1) * companyPageSize, companyPage * companyPageSize);
    useEffect(() => {
        if (companyPage > companyTotalPages) setCompanyPage(companyTotalPages);
    }, [companyTotalPages]);
    const companyCampaigns = useMemo(() => {
        if (!campaigns || !linkedContacts.length) return [];
        const contactEmails = new Set(linkedContacts.map((c: any) => c.email).filter(Boolean));
        return campaigns.filter((camp: any) => camp.recipientEmails && camp.recipientEmails.some((email: string) => contactEmails.has(email)));
    }, [campaigns, linkedContacts]);

    const fieldsToShow = useMemo(() => {
        return detailFields || [];
    }, [detailFields]);

    const displayName = cleanText(company.userName ?? company.name ?? company.userEmail ?? company.id);
    const secondaryTag = cleanText(company.type ?? company.industry);

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <AISummaryModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} data={{profile: company, stakeholders: linkedContacts.map((c: any) => ({ name: c.name, role: c.role })), campaign_stats: { total_campaigns: companyCampaigns.length, last_campaign: companyCampaigns[0]?.subject }}} type="company" />
            <button onClick={onBack} className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4"><ArrowLeft className="h-4 w-4 mr-2"/> Voltar para Lista</button>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-8 text-white flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{displayName || '-'}</h1>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(company.status)}`}>{cleanText(company.status)}</span>
                            {secondaryTag && <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">{secondaryTag}</span>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onEnrich} className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-sm rounded-lg text-emerald-100 text-sm font-bold transition-all flex items-center gap-2 border border-emerald-400/30"><Sparkles className="h-4 w-4" /> Enriquecer Dados</button>
                        <button onClick={() => setAiModalOpen(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white text-sm font-bold transition-all flex items-center gap-2 border border-white/30"><Sparkles className="h-4 w-4 text-yellow-300" /> Analisar Simulação</button>
                        <button onClick={onEdit} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="Editar"><Edit2 className="h-5 w-5"/></button>
                        <button onClick={() => onDelete(company.id)} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors" title="Excluir"><Trash2 className="h-5 w-5"/></button>
                    </div>
                </div>
                <div className="p-8 space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><Building2 className="h-4 w-4"/> Ficha Técnica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {fieldsToShow.map((key: string) => {
                                const val = company[key];
                                if (val === undefined || val === null || val === '') return null;
                                const label = COMPANY_FIELDS.find(f => f.key === key)?.label || key.replace(/_/g, ' ');
                                const displayValue = key === 'creditAmount' ? formatCurrencyBR(val) : safeRender(val);
                                return (<div key={key}><p className="text-xs text-gray-400 uppercase font-bold">{label}</p><p className="text-sm font-medium text-gray-800">{displayValue}</p></div>)
                            })}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Users className="h-4 w-4"/> Contatos ({linkedContacts.length})</h3>
                            <button onClick={onAddContact} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-1"><Plus className="h-3 w-3" /> Novo Contato</button>
                        </div>
                        {matchedByEmailOrPhone.length > 0 && (
                            <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                <p className="text-xs font-bold text-blue-800 uppercase mb-2">Contato vinculado por e-mail/WhatsApp</p>
                                <div className="space-y-2">
                                    {matchedByEmailOrPhone.map((c: any) => (
                                        <button key={c.id} onClick={() => onViewContact(c)} className="w-full text-left px-3 py-2 rounded-lg bg-white border border-blue-100 text-blue-700 hover:bg-blue-100 text-sm font-semibold">
                                            {cleanText(c.name) || c.email || 'Contato'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="mb-4 relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Pesquisar contatos..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={contactSearch} onChange={e => setContactSearch(e.target.value)} />
                        </div>
                        {linkedContacts.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">Nenhum contato encontrado. <button onClick={onAddContact} className="text-blue-600 font-bold hover:underline">Adicionar um?</button></div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {companyPageContacts.map((c: any) => (
                                        <div key={c.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => onViewContact(c)}>
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{c.name?.charAt(0)}</div>
                                                <div><p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{c.name}</p><p className="text-xs text-gray-500">{c.role || c.email}</p></div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => onEditContact(c)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar Contato"><Edit2 className="h-4 w-4"/></button>
                                                <button onClick={() => onViewContact(c)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"><ChevronRight className="h-4 w-4"/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-xs text-gray-500">Exibindo {linkedContacts.length} contatos — Página {companyPage} / {companyTotalPages}</div>
                                    <div className="flex items-center gap-2">
                                        <select value={companyPageSize} onChange={e => { setCompanyPageSize(Number(e.target.value)); setCompanyPage(1); }} className="text-xs border rounded px-2 py-1">
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                        <button onClick={() => setCompanyPage(p => Math.max(1, p - 1))} disabled={companyPage === 1} className="px-2 py-1 text-xs bg-gray-50 border rounded disabled:opacity-50">Anterior</button>
                                        <div className="text-xs px-2">{companyPage} / {companyTotalPages}</div>
                                        <button onClick={() => setCompanyPage(p => Math.min(companyTotalPages, p + 1))} disabled={companyPage === companyTotalPages} className="px-2 py-1 text-xs bg-gray-50 border rounded disabled:opacity-50">Próxima</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><HistoryIcon className="h-4 w-4"/> Histórico de Campanhas ({companyCampaigns.length})</h3>
                        {companyCampaigns.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">Nenhuma campanha enviada para contatos desta simulação.</div>
                        ) : (
                            <div className="space-y-3">
                                {companyCampaigns.map((camp: any) => (
                                    <div key={camp.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1"><MailIcon className="h-4 w-4 text-blue-500" /><span className="font-bold text-gray-900">{camp.subject}</span></div>
                                            <p className="text-xs text-gray-500">Enviado por {camp.responsible} em {new Date(camp.date?.seconds * 1000).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};
