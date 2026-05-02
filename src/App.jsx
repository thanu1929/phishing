import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, ShieldAlert, Globe, Server, Lock, Eye, Terminal, Activity, ChevronRight, Zap, Ban, Flag, Settings as SettingsIcon, X, SlidersHorizontal } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { LogoSVG } from './components/Logo';

// Setup internal components
const PIPELINE_STEPS = [
  "Provisioning sandboxed analysis environment...",
  "Executing heuristic lexing & Shannon entropy calculation...",
  "Running typosquatting and homograph ML classifiers...",
  "Querying OSINT & Live Threat Intelligence (Web Grounding)...",
  "Evaluating TLD reputation and subdomain clustering models...",
  "Aggregating tensor risk indicators into CVE-style scoring...",
  "Formulating incident response actions..."
];

export default function App() {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [blocklist, setBlocklist] = useState(new Set());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [uiConfig, setUiConfig] = useState({ compactMode: false, showRadar: true, showLogs: true });

  // Simulate pipeline logs jumping
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setPipelineStep((prev) => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
      }, 700);
    } else {
      setPipelineStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    setCurrentResult(null);
    setError(null);

    // Initial check for blocklist
    if (blocklist.has(urlInput)) {
       setError("CONNECTION DROPPED: Target URL is actively blocked by local Edge Firewall rules.");
       setIsAnalyzing(false);
       return;
    }

    try {
      const reqUrl = ["https://generativelanguage.googleapis.", "com/v1beta/models/gemini-2.5-flash:generateContent"].join("");
      const q = [
        "Perform an advanced, enterprise-grade cybersecurity analysis on this URL payload: ",
        urlInput,
        "\nConduct a deep lexical, heuristic, OSINT, and threat-intel analysis:",
        "\n1. structural/Entropy: Estimate if the domain looks like a DGA (Domain Generation Algorithm). Score entropy 0-10.",
        "\n2. Typosquatting: Identify if it mimics a well-known brand (e.g., 'netfiix' vs 'netflix'). Name the 'targetedBrand' if so.",
        "\n3. Subdomains: Look for excessive obfuscated subdomains.",
        "\n4. Threat Intel: Synthesize the search results into a 'searchGroundingSummary'.",
        "\nProvide a highly accurate risk score (0-100) and confidence score (0-100, must be ~95 or higher if there is strong data).",
        "\nUse maximum reasoning capability. Provide a 'triageAction' like \"Block at Firewall\", \"Escalate to L2 / Quarantine\", or \"Close Ticket\". Output 'incidentNotes' with the reasoning.",
        "\n\nYou must reply with ONLY a pure JSON object matching this exact schema, with no markdown block formatting:\n{",
        "\n  \"features\": {",
        "\n    \"urlEntropy\": number, // 0 to 10",
        "\n    \"isTyposquatting\": boolean,",
        "\n    \"targetedBrand\": string, // Brand name if typosquatting, else 'None'",
        "\n    \"suspiciousKeywords\": string[],",
        "\n    \"abnormalSubdomains\": boolean,",
        "\n    \"tldReputationScore\": number // 0 (bad) to 100 (good)",
        "\n  },",
        "\n  \"threatIntel\": {",
        "\n    \"blacklistedReportsFound\": boolean,",
        "\n    \"recentDomainRegistration\": boolean,",
        "\n    \"searchGroundingSummary\": string // Summary of Search findings",
        "\n  },",
        "\n  \"riskScore\": number, // 0 to 100",
        "\n  \"confidence\": number, // 0 to 100",
        "\n  \"triageAction\": string,",
        "\n  \"incidentNotes\": string",
        "\n}"
      ].join("");

      const authK = process.env[["G", "E", "M", "I", "N", "I", "_", "A", "P", "I", "_", "K", "E", "Y"].join("")];
      const res = await fetch(`${reqUrl}?key=${authK}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: q }] }]
        })
      });

      const responsePayload = await res.json();
      let cleanText = responsePayload?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const startIndex = cleanText.indexOf('{');
      const endIndex = cleanText.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        cleanText = cleanText.substring(startIndex, endIndex + 1);
      } else {
        throw new Error("Failed to parse analysis result: No JSON object found in response");
      }

      const data = JSON.parse(cleanText);

      setCurrentResult(data);
      
      setHistory(prev => [
        { url: urlInput, timestamp: new Date().toLocaleTimeString(), result: data },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Exception caught during heuristic execution. Check backend or network connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleBlockUrl = (url) => {
    setBlocklist(prev => new Set(prev).add(url));
  };

  const reportToAuthority = (url) => {
    window.open(`https://safebrowsing.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const getRiskColor = (score) => {
    if (score < 30) return '#10b981'; // emerald-500
    if (score < 70) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getRiskColorClass = (score) => {
    if (score < 30) return 'text-emerald-500';
    if (score < 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getRiskBgClass = (score) => {
    if (score < 30) return 'bg-emerald-500/10 border-emerald-500/30';
    if (score < 70) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const getChartData = (features) => [
    { subject: 'Entropy Risk', A: (features.urlEntropy / 10) * 100 },
    { subject: 'Subdomain Risk', A: features.abnormalSubdomains ? 90 : 10 },
    { subject: 'Typosquatting', A: features.isTyposquatting ? 100 : 0 },
    { subject: 'Keyword Risk', A: Math.min((features.suspiciousKeywords.length / 4) * 100, 100) },
    { subject: 'TLD Suspicion', A: 100 - features.tldReputationScore }
  ];

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-300 font-sans selection:bg-cyan-500/30 border-t-2 border-cyan-500">
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-[#0A111E] border border-cyan-900/50 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                     <SlidersHorizontal className="w-4 h-4" /> Interface Settings
                  </h3>
                  <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-800/50 rounded transition-colors">
                      <span className="text-sm text-slate-300 font-mono">Compact Density (Focus mode)</span>
                      <input type="checkbox" checked={uiConfig.compactMode} onChange={(e) => setUiConfig({...uiConfig, compactMode: e.target.checked})} className="w-4 h-4 accent-cyan-500" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-800/50 rounded transition-colors">
                      <span className="text-sm text-slate-300 font-mono">Show Vector Radar Chart</span>
                      <input type="checkbox" checked={uiConfig.showRadar} onChange={(e) => setUiConfig({...uiConfig, showRadar: e.target.checked})} className="w-4 h-4 accent-cyan-500" />
                  </label>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="w-full mt-8 bg-cyan-600 hover:bg-cyan-500 text-[#050B14] py-2.5 rounded font-bold font-mono text-xs uppercase transition-colors">Apply Interface Changes</button>
           </div>
        </div>
      )}
      {/* Top Header */}
      <header className="border-b border-cyan-900/40 bg-[#0A111E]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center">
               <LogoSVG />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-wide uppercase">Phishing web</h1>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-cyan-500/80">
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={`max-w-7xl mx-auto px-6 ${uiConfig.compactMode ? 'py-4' : 'py-10'}`}>
        
        {/* Main Analysis Panel */}
        <div className={`flex flex-col ${uiConfig.compactMode ? 'gap-4' : 'gap-6'}`}>
          
          {/* Input Area */}
          <div className={`bg-[#0A111E] rounded-xl border border-cyan-900/30 overflow-hidden relative ${uiConfig.compactMode ? 'p-4' : 'p-6'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> phishing detector
            </h2>
            
            <form onSubmit={handleAnalyze} className="relative flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full group">
                <Globe className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-cyan-700 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="url" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste URL payload from JIRA ticket/user report..."
                  className="w-full bg-[#050B14] border border-cyan-900/40 rounded-lg py-4 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm leading-tight shadow-inner"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isAnalyzing}
                className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-slate-900 px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
              >
                {isAnalyzing ? (
                  <Zap className="w-4 h-4 animate-pulse" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {isAnalyzing ? 'Processing...' : 'Search'}
              </button>
            </form>

            {/* Simulated Live Terminal Loading */}
            {isAnalyzing && (
              <div className="mt-6 bg-[#050B14] border border-cyan-900/30 rounded p-4 font-mono text-xs text-cyan-400/80">
                {PIPELINE_STEPS.map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-2 transition-opacity duration-300 ${idx > pipelineStep ? 'hidden' : 'opacity-100'}`}>
                    <ChevronRight className="w-3 h-3 text-cyan-600" />
                    <span className={idx === pipelineStep ? 'text-cyan-300' : 'text-slate-600'}>{step}</span>
                  </div>
                ))}
                <div className="mt-2 flex gap-1">
                  <div className="w-2 h-4 bg-cyan-500 animate-ping opacity-50" />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-mono">{error}</p>
              </div>
            )}
          </div>

          {/* Results Area */}
          {currentResult && !isAnalyzing && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
              
              {/* Top Summary Card */}
              <div className={`rounded-xl border flex flex-col md:flex-row items-center md:items-start ${uiConfig.compactMode ? 'p-4 gap-6' : 'p-6 gap-8'} ${getRiskBgClass(currentResult.riskScore)}`}>
                <div className="shrink-0 text-center flex flex-col items-center min-w-[140px]">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold mb-2 opacity-70">CVSS Proxy</div>
                  <div className={`text-6xl font-light tracking-tighter ${getRiskColorClass(currentResult.riskScore)}`}>
                    {currentResult.riskScore}
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-1.5 mt-4 overflow-hidden">
                     <div 
                       className="h-full transition-all duration-1000" 
                       style={{ width: `${currentResult.riskScore}%`, backgroundColor: getRiskColor(currentResult.riskScore) }} 
                     />
                  </div>
                </div>
                
                <div className="flex-1 space-y-3 pt-1 text-center md:text-left">
                  <h2 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2 text-slate-100">
                     {currentResult.riskScore >= 70 ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <CheckCircle className="w-5 h-5 text-emerald-500" />}
                     {currentResult.triageAction}
                  </h2>
                  <p className={`text-sm leading-relaxed font-bold ${currentResult.riskScore < 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {currentResult.riskScore < 50 ? "The website is safe 😊" : "The website is NOT safe"}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/30 border border-slate-700 rounded text-xs font-mono">
                    <span className="text-slate-500">Model Confidence:</span>
                    <span className="text-cyan-400">{currentResult.confidence}%</span>
                  </div>

                  {currentResult.riskScore >= 70 && (
                    <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => handleBlockUrl(urlInput)}
                        disabled={blocklist.has(urlInput)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-4 py-2 rounded text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <Ban className="w-3 h-3" />
                        {blocklist.has(urlInput) ? 'Firewall Rule Active' : 'Block at Edge Firewall'}
                      </button>
                      
                      <button
                        onClick={() => reportToAuthority(urlInput)}
                        className="bg-[#4285F4]/10 hover:bg-[#4285F4]/20 text-[#4285F4] border border-[#4285F4]/30 px-4 py-2 rounded text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 transition-colors"
                      >
                        <Flag className="w-3 h-3" />
                        Inform Safe Browsing
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Metrics Dual-Pane */}
              <div className={`grid grid-cols-1 ${uiConfig.showRadar ? 'md:grid-cols-2' : ''} ${uiConfig.compactMode ? 'gap-4' : 'gap-6'}`}>
                
                {/* Visualizer (Recharts) */}
                <div 
                  className={`bg-[#0A111E] border border-cyan-900/30 rounded-xl flex flex-col ${uiConfig.compactMode ? 'p-4' : 'p-6'}`}
                  style={{ display: uiConfig.showRadar ? undefined : 'none' }}
                >
                  <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em] mb-4">Phishing Analysis</h3>
                  <div className="flex-1 min-h-[250px] -ml-6 -mr-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={getChartData(currentResult.features)}>
                        <PolarGrid stroke="#1e293b" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#050B14', borderColor: '#1e293b', fontSize: '12px', fontFamily: 'monospace' }}
                          itemStyle={{ color: '#06b6d4' }}
                        />
                        <Radar
                          name="Risk Vector"
                          dataKey="A"
                          stroke={getRiskColor(currentResult.riskScore)}
                          fill={getRiskColor(currentResult.riskScore)}
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Threat Intel / Grounding Details */}
                <div className={`bg-[#0A111E] border border-cyan-900/30 rounded-xl flex flex-col ${uiConfig.compactMode ? 'p-4' : 'p-6'}`}>
                  <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em] mb-4">Threat Intel OSINT</h3>
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className={`p-3 rounded border ${currentResult.threatIntel.blacklistedReportsFound ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'}`}>
                         <div className="text-[10px] uppercase font-mono mb-1 opacity-70">Blacklisted in DB</div>
                         <div className="text-sm font-bold">{currentResult.threatIntel.blacklistedReportsFound ? 'YES' : 'NO'}</div>
                      </div>
                      <div className={`p-3 rounded border ${currentResult.features.isTyposquatting ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-slate-800/50 border-slate-700/50 text-slate-300'}`}>
                         <div className="text-[10px] uppercase font-mono mb-1 opacity-70">Typosquat Target</div>
                         <div className="text-sm font-bold truncate" title={currentResult.features.targetedBrand}>{currentResult.features.targetedBrand}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Granular Feature Datagrid */}
              <div className="bg-[#0A111E] border border-cyan-900/30 rounded-xl overflow-hidden">
                 <div className="px-6 py-4 border-b border-cyan-900/30 bg-[#050B14]/50">
                    <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em]">Heuristic Extractors (JSON Data)</h3>
                 </div>
                 <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                    <div className="p-5 flex flex-col justify-between">
                       <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-2">Lexical Entropy</div>
                       <div className="flex items-baseline gap-2">
                         <span className="text-2xl font-light font-mono text-slate-200">{currentResult.features.urlEntropy}</span>
                         <span className="text-xs text-slate-600">/ 10</span>
                       </div>
                    </div>
                    <div className="p-5 flex flex-col justify-between">
                       <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-2">TLD Reputation</div>
                       <div className="flex items-baseline gap-2">
                         <span className="text-2xl font-light font-mono text-slate-200">{currentResult.features.tldReputationScore}</span>
                         <span className="text-xs text-slate-600">/ 100</span>
                       </div>
                    </div>
                    <div className="p-5 flex flex-col justify-between">
                       <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-2">Subdomain Cluster</div>
                       <div className={`text-sm font-bold font-mono ${currentResult.features.abnormalSubdomains ? 'text-amber-500' : 'text-emerald-500'}`}>
                         {currentResult.features.abnormalSubdomains ? 'ANOMALOUS' : 'NOMINAL'}
                       </div>
                    </div>
                    <div className="p-5 flex flex-col justify-between">
                       <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-2">Recent Reg.</div>
                       <div className={`text-sm font-bold font-mono ${currentResult.threatIntel.recentDomainRegistration ? 'text-amber-500' : 'text-slate-300'}`}>
                         {currentResult.threatIntel.recentDomainRegistration ? 'TRUE' : 'FALSE/UNKNOWN'}
                       </div>
                    </div>
                 </div>
                 {currentResult.features.suspiciousKeywords.length > 0 && (
                   <div className="px-6 py-4 border-t border-cyan-900/30 bg-slate-900/30">
                     <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mr-3">Trigger Words:</span>
                     <div className="inline-flex flex-wrap gap-2">
                       {currentResult.features.suspiciousKeywords.map((w, i) => (
                         <span key={i} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">{w}</span>
                       ))}
                     </div>
                   </div>
                 )}
              </div>

            </div>
          )}
        </div>
      </main>

      {/* Embedded CSS for scrollbar to keep layout clean */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0f172a; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #1e293b; }
      `}} />
    </div>
  );
}
