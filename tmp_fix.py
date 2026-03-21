import re

file_path = r"c:\Users\marke\OneDrive\Github\CONSORCIO-CRM-1\components\ContemplatedLetters.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace states creditRange and parcelRange
content = content.replace(
    "const [creditRange, setCreditRange] = useState<string>('all');\n  const [parcelRange, setParcelRange] = useState<string>('all');",
    "const [minCredit, setMinCredit] = useState<string>('');\n  const [maxCredit, setMaxCredit] = useState<string>('');\n  const [minParcel, setMinParcel] = useState<string>('');\n  const [maxParcel, setMaxParcel] = useState<string>('');"
)

# 2. Update toggle selection / filters reset
content = content.replace(
    "setCreditRange('all'); setParcelRange('all');",
    "setMinCredit(''); setMaxCredit(''); setMinParcel(''); setMaxParcel('');"
)

# 3. Update checkRange logic in filtering
check_range_old = """    const checkRange = (val: number, rangeLabel: string) => {
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
    const matchesRef = checkRange(letter.refGarantia || 0, refRange);"""

check_range_new = """    const checkRange = (val: number, minStr: string, maxStr: string) => {
      const min = minStr ? Number(minStr) : 0;
      const max = maxStr ? Number(maxStr) : Infinity;
      return val >= min && val <= max;
    };
    const checkFundoRef = (val: number, rangeLabel: string) => {
      if (rangeLabel === 'all') return true;
      if (rangeLabel === 'com-fundo') return val > 0;
      if (rangeLabel === 'sem-fundo') return val === 0;
      return true;
    };

    const matchesCredit = checkRange(letter.credit, minCredit, maxCredit);
    const matchesParcel = checkRange(letter.installmentsCount, minParcel, maxParcel);
    const matchesFundo = checkFundoRef(letter.fundoComum || 0, fundoRange);
    const matchesRef = checkFundoRef(letter.refGarantia || 0, refRange);"""

content = content.replace(check_range_old, check_range_new)

# 4. Remove Email Wall Modal
email_wall_pattern = r"\{/\* Email Wall Modal \*/\}.*?</AnimatePresence>\s*"
content = re.sub(email_wall_pattern, "", content, flags=re.DOTALL)

# 5. Remove blur effect
content = content.replace("className={`transition-all duration-300 ${!isUnlocked ? 'filter blur-sm opacity-40 pointer-events-none select-none' : ''}`}", "className=\"transition-all duration-300\"")
content = content.replace("className={`relative space-y-6 pt-20 sm:pt-24 pb-28 px-3 sm:px-6 max-w-7xl mx-auto ${!isUnlocked ? 'h-screen overflow-hidden' : ''}`}", "className=\"relative space-y-6 pt-20 sm:pt-24 pb-28 px-3 sm:px-6 max-w-7xl mx-auto\"")

# 6. Update Ficha logic to use the new unified EmailCapture if locked
ficha_old = """  const handleOpenFicha = (letter: ContemplatedLetter) => {
    if (isLogged || localStorage.getItem('ficha_lead_email')) {
      setFichaLetter(letter);
    } else {
      setPendingFichaLetter(letter);
      setShowFichaEmailGate(true);
    }
  };"""

ficha_new = """  const handleOpenFicha = (letter: ContemplatedLetter) => {
    if (isUnlocked) {
      setFichaLetter(letter);
    } else {
      setPendingFichaLetter(letter);
      setShowEmailCapture(true);
    }
  };"""
content = content.replace(ficha_old, ficha_new)

# 7. Remove Ficha Email Gate completely
ficha_email_gate_pattern = r"\{/\* Email capture modal for Ficha \*/\}.*?</AnimatePresence>\s*"
content = re.sub(ficha_email_gate_pattern, "", content, flags=re.DOTALL)

# 8. Unify onSuccess of EmailCapture
email_capture_old = "<EmailCapture />"
email_capture_new = """<EmailCapture onSuccess={() => {
                  localStorage.setItem('letters_unlocked', 'true');
                  setIsUnlocked(true);
                  setShowEmailCapture(false);
                  if (pendingFichaLetter) {
                    setFichaLetter(pendingFichaLetter);
                    setPendingFichaLetter(null);
                  }
                }} />"""
content = content.replace(email_capture_old, email_capture_new)

# 9. Change the filters UI
filters_ui_old = """<select value={creditRange} onChange={(e) => setCreditRange(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
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
              </select>"""
filters_ui_new = """<div className="flex gap-2">
                <input type="number" placeholder="Mín. Crédito" value={minCredit} onChange={(e) => setMinCredit(e.target.value)} className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500" />
                <input type="number" placeholder="Máx. Crédito" value={maxCredit} onChange={(e) => setMaxCredit(e.target.value)} className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="flex gap-2">
                <input type="number" placeholder="Mín. Parc." value={minParcel} onChange={(e) => setMinParcel(e.target.value)} className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500" />
                <input type="number" placeholder="Máx. Parc." value={maxParcel} onChange={(e) => setMaxParcel(e.target.value)} className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>"""
content = content.replace(filters_ui_old, filters_ui_new)

# 10. Desktop Table Entry Text
desktop_table_entry_old = """<td className="px-6 py-5 text-slate-900 font-bold text-sm">
                  {isLogged ? formatCurrency(letter.entry) : (
                    <button onClick={() => setShowEmailCapture(true)} className="text-[10px] font-black bg-emerald-600 text-white px-3 py-1 rounded-full">Ver</button>
                  )}
                </td>"""
desktop_table_entry_new = """<td className="px-6 py-5 text-slate-900 font-bold text-sm">
                  {isUnlocked ? formatCurrency(letter.entry) : (
                    <button onClick={(e) => { e.stopPropagation(); setShowEmailCapture(true); }} className="text-[10px] font-black bg-emerald-600 text-white px-3 py-1 rounded-full hover:bg-emerald-700 transition">VER</button>
                  )}
                </td>"""
content = content.replace(desktop_table_entry_old, desktop_table_entry_new)

# 11. Mobile Card Entry Text
mobile_card_entry_old = """<div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Entrada</p>
                <p className="font-black text-slate-900">
                  {isLogged ? formatCurrency(letter.entry) : '—'}
                </p>
              </div>"""
mobile_card_entry_new = """<div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Entrada</p>
                <div className="font-black text-slate-900">
                  {isUnlocked ? formatCurrency(letter.entry) : (
                    <button onClick={(e) => { e.stopPropagation(); setShowEmailCapture(true); }} className="text-[10px] font-black bg-emerald-600 text-white px-3 py-1 rounded-full mt-1 hover:bg-emerald-700 transition">VER</button>
                  )}
                </div>
              </div>"""
content = content.replace(mobile_card_entry_old, mobile_card_entry_new)

# 12. desktop button action "Ver"
content = content.replace(
    """<button onClick={(e) => { e.stopPropagation(); handleOpenFicha(letter); }} aria-label="Ver ficha da carta" className="p-2 bg-slate-50 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-xl border border-slate-200 transition-all">
                      <FileText size={16} />
                    </button>""",
    """<button onClick={(e) => { e.stopPropagation(); handleOpenFicha(letter); }} className="px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
                      VER
                    </button>"""
)

# 13. mobile button action "Ver"
content = content.replace(
    """<button
                onClick={(e) => { e.stopPropagation(); handleOpenFicha(letter); }}
                aria-label="Ver ficha"
                className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-600 hover:text-white text-slate-500 transition-all"
              >
                <FileText size={16} />
              </button>""",
    """<button
                onClick={(e) => { e.stopPropagation(); handleOpenFicha(letter); }}
                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              >
                VER
              </button>"""
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modification complete.")
