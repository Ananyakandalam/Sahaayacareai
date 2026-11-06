import React, { useState, useEffect, useRef } from 'react';
import { MedicineSchedule } from '../types/medicine';
import { audioPlayer } from '../utils/audioPlayer';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  Smartphone,
  Camera,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';

interface SahaayaChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage?: string;
  currentSchedule?: MedicineSchedule;
  onOpenUpload?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const SahaayaChatbot: React.FC<SahaayaChatbotProps> = ({
  isOpen,
  onClose,
  selectedLanguage = 'English',
  currentSchedule,
  onOpenUpload,
}) => {
  const isTelugu = selectedLanguage === 'Telugu';
  const isHindi = selectedLanguage === 'Hindi';

  const defaultGreeting = isTelugu
    ? 'నమస్కారం! నేను సహాయ కేర్ (Sahaaya Care) సహాయకుడిని. ఈ వెబ్‌సైట్ ఎలా ఉపయోగించాలి, మందుల రంగుల గుర్తులు, మాట్లాడే ఆడియో, లేదా కెమెరాతో ప్రిస్క్రిప్షన్ అప్‌లోడ్ చేయడం గురించి మీరు నన్ను ఏదైనా అడగవచ్చు. మీరు క్రింది మైక్రోఫోన్ నొక్కి మాట్లాడవచ్చు కూడా!'
    : isHindi
    ? 'नमस्ते! मैं सहाय केयर सहायक हूँ। इस वेबसाइट का उपयोग, रंगीन गोलियों की पहचान, बोलती ऑडियो गाइड, या कैमरे से दवा पर्चा अपलोड करने के बारे में आप मुझसे कुछ भी पूछ सकते हैं। आप बोलकर भी सवाल पूछ सकते हैं!'
    : 'Hello! I am your Sahaaya Care Assistant. Ask me anything about using this timetable, spoken pill directions, camera prescription scanning, voice microphone problem explanation, or mobile app installation!';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: defaultGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickQuestions = isTelugu
    ? [
        'ఈ వెబ్‌సైట్ ఎలా ఉపయోగించాలి?',
        'చదవడం రాని పెద్దవారికి ఇది ఎలా ఉపయోగపడుతుంది?',
        'మందుల ఫోటో లేదా ప్రిస్క్రిప్షన్ ఎలా అప్‌లోడ్ చేయాలి?',
        'ఈ రోజంతా వేసుకోవాల్సిన మందులేవి?',
        'ఆండ్రాయిడ్ లేదా ఐఫోన్‌లో యాప్‌లా ఎలా ఇన్‌స్టాల్ చేయాలి?',
      ]
    : isHindi
    ? [
        'यह वेबसाइट कैसे काम करती है?',
        'पढ़ न सकने वाले बुजुर्गों के लिए यह कैसे मददगार है?',
        'दवाई की फोटो या पर्चा कैसे अपलोड करें?',
        'आज की कौन-सी दवाइयां हैं?',
        'मोबाइल में ऐप की तरह कैसे इंस्टॉल करें?',
      ]
    : [
        'How does this website work for non-readers?',
        'How do I take a photo or scan my prescription?',
        'What pills are scheduled for today?',
        'How do I install this on Android and iPhone?',
        'What do the pill colors and shapes mean?',
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Web Speech API for voice question asking
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        selectedLanguage === 'Telugu'
          ? 'te-IN'
          : selectedLanguage === 'Hindi'
          ? 'hi-IN'
          : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechError(
          isTelugu
            ? 'మైక్రోఫోన్ వినలేకపోయింది, దయచేసి మళ్లీ ప్రయత్నించండి లేదా టైప్ చేయండి.'
            : 'Could not catch voice. Please try again or type.'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError(
        isTelugu
          ? 'ఈ బ్రౌజర్‌లో స్వర గుర్తింపు అందుబాటులో లేదు.'
          : 'Speech recognition is not supported in this browser. Please type your question.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      audioPlayer.playChime('tap');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');
    setSpeechError(null);
    audioPlayer.playChime('tap');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history,
          language: selectedLanguage,
          currentSchedule,
        }),
      });

      if (!res.ok) {
        throw new Error('Assistant response failed.');
      }

      const data = await res.json();
      const assistantText = data.reply || defaultGreeting;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      audioPlayer.playChime('success');
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: isTelugu
          ? 'క్షమించండి, సమాచారం పొందడంలో చిన్న సమస్య వచ్చింది. దయచేసి కాసేపటి తర్వాత మళ్లీ అడగండి.'
          : 'Sorry, I had trouble connecting. Please try asking again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = async (msg: ChatMessage) => {
    if (playingMessageId === msg.id) {
      audioPlayer.stop();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msg.id);
    await audioPlayer.speakText({
      text: msg.text,
      language: selectedLanguage,
      speed: 0.88,
      voice: 'Kore',
      onEnd: () => setPlayingMessageId(null),
      onError: () => setPlayingMessageId(null),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[88vh] sm:h-[680px] max-h-screen">
        {/* Chatbot Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                🤖
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-indigo-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {isTelugu
                    ? 'సహాయ AI కేర్ అసిస్టెంట్'
                    : isHindi
                    ? 'सहाय AI केयर सहायक'
                    : 'Sahaaya Care AI Guide'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/50 border border-indigo-400/40 text-[10px] font-black uppercase tracking-wider text-indigo-100">
                  {selectedLanguage}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-indigo-200 font-medium">
                {isTelugu
                  ? 'వెబ్‌సైట్ & మందుల వివరాలను స్పష్టంగా అడగండి'
                  : 'Instant assistance for website, pills & spoken audio'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-indigo-50/70 border-b border-indigo-100 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
          <span className="text-[10px] font-black uppercase text-indigo-900 shrink-0 px-1">
            ⚡ {isTelugu ? 'త్వరిత ప్రశ్నలు:' : 'Quick Questions:'}
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-slate-700 text-[11px] font-bold whitespace-nowrap transition active:scale-95 shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => {
            const isAi = msg.role === 'assistant';
            const isSpeakingThis = playingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                    isAi
                      ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  <div
                    className={`mt-2 flex items-center justify-between gap-3 text-[10px] font-semibold ${
                      isAi ? 'text-slate-400' : 'text-indigo-200'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {/* Listen out loud button */}
                    {isAi && (
                      <button
                        type="button"
                        onClick={() => handleSpeakMessage(msg)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition ${
                          isSpeakingThis
                            ? 'bg-amber-400 text-slate-950 border-amber-500 font-black animate-pulse'
                            : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200'
                        }`}
                        title="వినండి (Listen out loud)"
                      >
                        {isSpeakingThis ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>ఆపు (Stop)</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>{isTelugu ? 'వినండి 🔊' : 'Listen 🔊'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                🤖
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-indigo-700 font-bold flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                <span>{isTelugu ? 'సమాధానం సిద్ధం చేస్తోంది...' : 'Thinking...'}</span>
              </div>
            </div>
          )}

          {speechError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-center">
              {speechError}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Microphone & Camera Quick Action */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Microphone Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl transition-all shadow-sm active:scale-95 shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white ring-4 ring-rose-300 animate-pulse'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
              title={
                isTelugu
                  ? isListening
                    ? 'మాట్లాడండి, వింటోంది...'
                    : 'మైక్రోఫోన్ నొక్కి తెలుగులో మాట్లాడండి'
                  : isListening
                  ? 'Listening to you speak...'
                  : 'Tap to speak your problem with microphone'
              }
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Prescription Camera Trigger */}
            {onOpenUpload && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUpload();
                }}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition active:scale-95 shrink-0"
                title={isTelugu ? 'కెమెరాతో ప్రిస్క్రిప్షన్ ఫోటో తీయండి' : 'Open Camera / Prescription Hub'}
              >
                <Camera className="w-5 h-5" />
              </button>
            )}

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? isTelugu
                    ? 'ఇప్పుడు మాట్లాడండి...'
                    : 'Listening... speak now'
                  : isTelugu
                  ? 'మీ సందేహాన్ని ఇక్కడ అడగండి లేదా మాట్లాడండి...'
                  : 'Ask about pills, schedule, or audio...'
              }
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-3 focus:ring-indigo-100 focus:border-indigo-600 font-medium"
            />

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className={`p-3 rounded-2xl font-bold transition active:scale-95 shrink-0 ${
                isLoading || !inputText.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
