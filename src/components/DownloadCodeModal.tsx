import React, { useState } from 'react';
import {
  Download,
  FileCode,
  FolderArchive,
  Terminal,
  Check,
  Copy,
  X,
  ExternalLink,
  Laptop,
  Sparkles,
  ShieldCheck,
  Play,
} from 'lucide-react';

interface DownloadCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage?: string;
}

export const DownloadCodeModal: React.FC<DownloadCodeModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage = 'English',
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'zip' | 'guide'>('html');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const isTelugu = selectedLanguage === 'Telugu';
  const isHindi = selectedLanguage === 'Hindi';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between relative shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/50 border border-indigo-400/40 flex items-center justify-center text-white shadow-inner">
              <Download className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  {isTelugu
                    ? 'సహాయ కేర్ కోడ్ డౌన్‌లోడ్'
                    : isHindi
                    ? 'सहाय केयर कोड डाउनलोड'
                    : 'Download Sahaaya Care Code'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                  VS Code Ready
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 font-medium mt-0.5">
                {isTelugu
                  ? 'పూర్తి ప్రాజెక్ట్ జిప్ (ZIP) లేదా ఒకే ఒక sahaya.care.html ఫైల్ డౌన్‌లోడ్ చేసుకోండి'
                  : isHindi
                  ? 'पूरा प्रोजेक्ट ZIP या स्टैंडअलोन sahaya.care.html फ़ाइल डाउनलोड करें'
                  : 'Get the full project ZIP or the standalone zero-install sahaya.care.html file'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2 shrink-0 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`pb-3 px-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'html'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>1. Standalone sahaya.care.html (Instant)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('zip')}
            className={`pb-3 px-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'zip'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>2. Full VS Code Project (ZIP)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>3. How to Run in VS Code</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* TAB 1: Standalone HTML (Zero Install) */}
          {activeTab === 'html' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-indigo-950 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                      sahaya.care.html
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      ~64 KB • Single File
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {isTelugu
                      ? 'ఈ ఒక్క ఫైల్‌లో రియాక్ట్, టైల్‌విండ్, ఆడియో గైడ్, మరియు అన్ని మెడిసిన్ ఫీచర్లు ఉన్నాయి. ఏ ఇన్‌స్టాలేషన్ అవసరం లేదు!'
                      : isHindi
                      ? 'इस एक फ़ाइल में रिएक्ट, टेलविंड, वॉयस गाइड और सभी फ़ीचर्स एम्बेडेड हैं। किसी इंस्टॉलेशन की ज़रूरत नहीं!'
                      : 'Self-contained single file with React, Tailwind CSS, Web Speech audio, and all clinical modules embedded. Runs without Node.js!'}
                  </p>
                </div>
                <a
                  href="/sahaya.care.html"
                  download="sahaya.care.html"
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs shadow-md shadow-indigo-300 flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download HTML</span>
                </a>
              </div>

              {/* Running Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">1</span>
                    <span>VS Code Live Server</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Open in VS Code, right-click <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-[10px]">sahaya.care.html</code>, and select <strong>"Open with Live Server"</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">2</span>
                    <span>Any Web Browser</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Double-click the file to open in Google Chrome, Microsoft Edge, Safari, or Firefox directly from any folder or USB drive.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">3</span>
                    <span>Online Compilers</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Paste contents into CodePen, JSFiddle, Replit, or HTML Online Editor for immediate instant preview anywhere.
                  </p>
                </div>
              </div>

              {/* Direct Preview Link */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                <span className="text-slate-600 font-bold">
                  Test standalone version in your current browser tab:
                </span>
                <a
                  href="/sahaya.care.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-black flex items-center gap-1 hover:underline"
                >
                  <span>Open /sahaya.care.html</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: Full Project ZIP */}
          {activeTab === 'zip' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-emerald-950 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                      sahaya_care_full_project.zip
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      ~320 KB • 56 Files
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {isTelugu
                      ? 'పూర్తి సోర్స్ కోడ్, రియాక్ట్ కాంపోనెంట్లు, టైప్‌స్క్రిప్ట్, ఎక్స్‌ప్రెస్ సర్వర్ మరియు ప్యాకేజీలు ఉన్నాయి.'
                      : isHindi
                      ? 'पूरा सोर्स कोड, रिएक्ट कंपोनेंट्स, टाइपस्क्रिप्ट, एक्सप्रेस बैकएंड और पैकेज शामिल हैं।'
                      : 'Complete production source code with React components, TypeScript, Vite, Tailwind CSS, and Express server.'}
                  </p>
                </div>
                <a
                  href="/sahaya_care_full_project.zip"
                  download="sahaya_care_full_project.zip"
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs shadow-md shadow-emerald-300 flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Project ZIP</span>
                </a>
              </div>

              {/* What is included */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Included Inside the Archive:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-700">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">📁 src/components/ (30+)</div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">📄 server.ts (Express)</div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">📄 package.json</div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">📄 vite.config.ts</div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">📄 tsconfig.json</div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">📄 VSCODE_GUIDE.md</div>
                </div>
              </div>

              {/* Quick CLI steps */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Terminal Quick Commands:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('npm install && npm run dev', 'cmd')}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer text-[10px]"
                  >
                    {copiedCmd === 'cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'cmd' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="space-y-1 text-slate-300">
                  <p><span className="text-slate-500"># 1. Extract and enter folder</span></p>
                  <p className="text-amber-300">cd sahaya_care_full_project</p>
                  <p><span className="text-slate-500"># 2. Install dependencies</span></p>
                  <p className="text-emerald-400">npm install</p>
                  <p><span className="text-slate-500"># 3. Start local development server</span></p>
                  <p className="text-indigo-400">npm run dev</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: How to Run in VS Code Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-slate-950 text-sm">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>Option A: Run Full Project in VS Code (Recommended)</span>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-slate-700 leading-relaxed font-medium">
                  <li>
                    Download and extract <strong>sahaya_care_full_project.zip</strong>.
                  </li>
                  <li>
                    In VS Code, select <strong>File &gt; Open Folder...</strong> and choose the unzipped folder.
                  </li>
                  <li>
                    Open the integrated terminal with <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono">Ctrl + `</kbd> (or <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono">Cmd + `</kbd> on Mac).
                  </li>
                  <li>
                    Run <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-indigo-700 font-mono font-bold">npm install</code> to install dependencies.
                  </li>
                  <li>
                    Run <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-indigo-700 font-mono font-bold">npm run dev</code> to start the development server on <strong className="text-slate-900">http://localhost:3000</strong>.
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-slate-950 text-sm">
                  <Play className="w-4 h-4 text-emerald-600" />
                  <span>Option B: Run Single File with Live Server (Zero-Install)</span>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-slate-700 leading-relaxed font-medium">
                  <li>
                    Download <strong>sahaya.care.html</strong>.
                  </li>
                  <li>
                    In VS Code Extensions (<kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono">Ctrl + Shift + X</kbd>), install <strong>Live Server</strong> (by Ritwick Dey).
                  </li>
                  <li>
                    Right-click on <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono font-bold">sahaya.care.html</code> and choose <strong>"Open with Live Server"</strong>.
                  </li>
                  <li>
                    Your browser will instantly launch Sahaaya Care with speech and adherence tracking!
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Clean, complete code with no hidden telemetry</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href="/sahaya_care_full_project.zip"
              download="sahaya_care_full_project.zip"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
