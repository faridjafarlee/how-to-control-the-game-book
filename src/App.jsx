import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, BookOpen, Hand, EyeOff, ShieldAlert, Sword, User, ShoppingCart, Menu, X, BrainCircuit, Sparkles, Lock, CheckCircle2, MessageSquare, PenTool, Zap } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// REPLACE THIS WITH YOUR ACTUAL GOOGLE ANALYTICS MEASUREMENT ID
const GA_MEASUREMENT_ID = 'G-L28GZ3JLT3';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // War Room State
  const [activeTool, setActiveTool] = useState('strategist'); // 'strategist', 'decoder', 'rewriter'
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize Google Analytics
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);
  }, []);

  // Tracking Function
  const trackClick = (location, type) => {
    if (window.gtag) {
      window.gtag('event', 'amazon_click', {
        event_category: 'conversion',
        event_label: location,
        link_type: type
      });
      console.log(`Tracked click: ${location} (${type})`);
    }
  };

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Gemini API Handler
  const handleGeminiAction = async () => {
    if (!analysisInput.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult('');

    // Initialize Gemini API
    const apiKey = "AIzaSyAlLCAAFL6qOYfPX3n9BgTBH5h8QfySXw8";

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

      let systemPrompt = "";

      if (activeTool === 'strategist') {
        systemPrompt = `
          You are the strategic embodiment of the book "How to Control the Game" by Farid Jafarli.
          Your persona is: Authoritative, dark, Machiavellian, concise, and razor-sharp.
          You do not offer moral support. You offer power dynamics analysis.
          
          Analyze the user's situation based on these core tactics:
          1. Control the Frame
          2. Speak Less, Hold More
          3. The Ego is the Weakness
          4. Use Absence
          
          Structure your response:
          1. THE TRAP: One sentence explaining why they are currently losing or vulnerable.
          2. THE MOVE: A specific, actionable, ruthless tactic to regain control.
          
          Keep it under 100 words. Use bolding for impact.
        `;
      } else if (activeTool === 'decoder') {
        systemPrompt = `
          You are a master of subtext and hidden power dynamics based on "How to Control the Game".
          The user will provide a message they received (email, text, or quote).
          
          Your task:
          1. Decode the hidden aggression, manipulation, or weakness in the sender's words.
          2. Identify the "Frame" they are trying to set.
          3. Reveal what they *actually* mean.
          
          Structure:
          **THE SUBTEXT:** [What is really being said]
          **THE POWER DYNAMIC:** [Who holds the leverage and why]
          
          Keep it dark, cynical, and precise. Under 100 words.
        `;
      } else if (activeTool === 'rewriter') {
        systemPrompt = `
          You are a communication editor for high-status individuals.
          The user will provide a draft of a message they want to send.
          
          Your task:
          1. Strip away all weakness: remove "just", "sorry", "I think", over-explanations, and seeking validation.
          2. Rewrite it to be concise, authoritative, and frame-controlling.
          3. Use silence/absence (make it shorter).
          
          Structure:
          **THE WEAKNESS:** [Identify 1-2 things making the original weak]
          **THE POWER DRAFT:** [The rewritten, powerful version]
          
          Keep it under 100 words.
        `;
      }

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\nUser Input: " + analysisInput }] }]
      });

      const text = result.response.text();
      setAnalysisResult(text);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setAnalysisResult("The connection is severed. Silence is your only answer for now.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Render Tool Content
  const renderToolContent = () => {
    switch (activeTool) {
      case 'strategist':
        return {
          title: "CONSULT THE STRATEGIST",
          desc: "Describe your conflict, negotiation, or power struggle. The Strategist will apply the book's tactics to reveal your next move.",
          placeholder: "e.g., My boss took credit for my work in a meeting, and I stayed silent. Now they are asking me to do more work for them. What should I do?",
          buttonText: "Generate Tactical Move"
        };
      case 'decoder':
        return {
          title: "SIGNAL DECODER",
          desc: "Paste a message, email, or comment you received. The AI will reveal the hidden subtext, aggression, and power plays hidden within.",
          placeholder: "e.g., 'I'm just checking in on this because I want to make sure we're all on the same page before the deadline...'",
          buttonText: "Decode Hidden Meaning"
        };
      case 'rewriter':
        return {
          title: "POWER REWRITER",
          desc: "Draft what you want to say. The AI will strip away the weakness, apologies, and fluff, leaving only pure authority.",
          placeholder: "e.g., 'Hi, sorry to bother you, I was just wondering if you had a chance to look at the proposal I sent? No rush though!'",
          buttonText: "Rewrite for Power"
        };
      default:
        return {};
    }
  };

  const toolContent = renderToolContent();

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#8B0000] selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;600&display=swap');
        
        :root {
          --font-cinzel: 'Cinzel', serif;
          --font-montserrat: 'Montserrat', sans-serif;
        }

        body {
          font-family: var(--font-montserrat);
        }

        .serif-font {
          font-family: var(--font-cinzel);
        }

        .gold-text {
          background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: #D4AF37; 
        }

        .book-shadow {
          box-shadow: 0 20px 50px rgba(212, 175, 55, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .book-shadow:hover {
          transform: translateY(-5px) perspective(1000px) rotateY(-5deg);
          box-shadow: 0 30px 60px rgba(212, 175, 55, 0.25);
        }

        .fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #111;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #D4AF37;
        }
        
        .glass-panel {
            background: rgba(10, 10, 10, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="serif-font text-xl text-white tracking-widest hover:text-[#D4AF37] transition-colors">HOW TO CONTROL THE GAME</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button onClick={() => scrollToSection('the-problem')} className="hover:text-[#D4AF37] transition-colors px-3 py-2 rounded-md text-sm font-medium bg-transparent border-none cursor-pointer text-[#e5e5e5]">The Game</button>
                <button onClick={() => scrollToSection('tactics')} className="hover:text-[#D4AF37] transition-colors px-3 py-2 rounded-md text-sm font-medium bg-transparent border-none cursor-pointer text-[#e5e5e5]">The Tactics</button>
                <button onClick={() => scrollToSection('war-room')} className="text-[#D4AF37] hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-bold bg-transparent border-none cursor-pointer flex items-center justify-center gap-1">
                  <Sparkles size={14} /> STRATEGIST
                </button>
                <a
                  href="https://www.amazon.com/dp/B0FR55DD14"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClick('header_nav', 'button')}
                  className="bg-[#8B0000] hover:bg-[#600000] text-white px-5 py-2 rounded-sm text-sm font-medium transition-all duration-300 tracking-wide border border-transparent hover:border-[#D4AF37] inline-flex items-center gap-2 no-underline"
                >
                  ORDER NOW
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-[#D4AF37] bg-transparent border-none cursor-pointer">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-b border-white/10 absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => scrollToSection('the-problem')} className="text-gray-300 hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium w-full text-left bg-transparent border-none cursor-pointer">The Game</button>
              <button onClick={() => scrollToSection('tactics')} className="text-gray-300 hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium w-full text-left bg-transparent border-none cursor-pointer">The Tactics</button>
              <button onClick={() => scrollToSection('war-room')} className="text-[#D4AF37] hover:text-white block px-3 py-2 rounded-md text-base font-bold w-full text-left bg-transparent border-none cursor-pointer flex items-center gap-2"><Sparkles size={16} /> Strategist</button>
              <a
                href="https://www.amazon.com/dp/B0FR55DD14"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick('mobile_menu', 'button')}
                className="text-[#8B0000] block px-3 py-2 rounded-md text-base font-bold w-full text-left no-underline"
              >
                ORDER NOW
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-80"></div>
          {/* Abstract background pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">

          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 fade-in-up">
            <div className="inline-block px-3 py-1 border border-[#D4AF37]/30 rounded-full bg-[#D4AF37]/10 mb-6">
              <span className="text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase">Timeless Tactics of Power</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white serif-font">
              CONTROL <br />
              <span className="gold-text">THE GAME</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              "The question is not whether you want to participate. The question is whether you understand the rules."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="https://www.amazon.com/dp/B0FR55DD14"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick('hero_primary', 'button')}
                className="w-full sm:w-auto px-8 py-4 bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-sm transition-all shadow-[0_0_20px_rgba(139,0,0,0.3)] flex items-center justify-center gap-2 group no-underline"
              >
                <span>GET THE BOOK</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button onClick={() => scrollToSection('tactics')} className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:border-[#D4AF37] text-white font-medium rounded-sm transition-all flex items-center justify-center cursor-pointer">
                READ PREVIEW
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start text-sm text-gray-500 gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Bestseller Status</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>Available on Amazon</span>
              </div>
            </div>
          </div>

          {/* Book Mockup */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end fade-in-up" style={{ animationDelay: '0.2s' }}>
            <a
              href="https://www.amazon.com/dp/B0FR55DD14"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackClick('hero_cover', 'image')}
              className="relative w-64 sm:w-80 lg:w-96 aspect-[2/3] book-shadow rounded-sm group block cursor-pointer border border-[#D4AF37]/20"
            >
              <img
                src="coverg.jpg"
                alt="How To Control The Game Book Cover"
                className="absolute inset-0 w-full h-full object-cover z-20 rounded-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                }}
              />

              {/* Fallback Design */}
              <div className="w-full h-full bg-[#0a0a0a] border border-[#D4AF37]/20 flex flex-col items-center justify-between p-8 text-center relative overflow-hidden hidden rounded-sm">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-[#D4AF37]/20"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-[#D4AF37]/20"></div>

                <div className="z-10 mt-10">
                  <Hand className="w-24 h-24 text-[#D4AF37] mx-auto mb-6 opacity-80" />
                </div>

                <div className="z-10">
                  <h2 className="serif-font text-[#8B0000] text-4xl sm:text-5xl leading-none font-bold tracking-tighter mb-2">HOW TO<br />CONTROL<br />THE GAME</h2>
                  <p className="text-[#D4AF37] text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] mt-4">Timeless Tactics of Power<br />and Strategy</p>
                </div>

                <div className="z-10 mb-4">
                  <p className="serif-font text-white text-lg tracking-widest">FARID JAFARLI</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* The Problem Section */}
      <section id="the-problem" className="py-20 bg-[#0A0A0A] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="serif-font text-3xl lg:text-4xl text-white mb-8">YOU ARE PLAYING WHETHER YOU ADMIT IT OR NOT</h2>
          <div className="h-1 w-20 bg-[#8B0000] mx-auto mb-10"></div>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
            Most people stumble through life reactive, confused, always one step behind. They wonder why others seem to get what they want while they get what they're given.
          </p>
          <p className="text-lg text-gray-400 mb-12 leading-relaxed">
            The game is power. Not the kind you see in movies. The kind that happens in your office when someone gets the promotion you deserved. The kind that happens in your relationship when you apologize for things you didn't do.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
            <div className="bg-black p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-colors group">
              <EyeOff className="w-10 h-10 text-gray-600 group-hover:text-[#8B0000] mb-4 transition-colors" />
              <h3 className="text-white text-lg font-bold mb-2">The Blind Stumble</h3>
              <p className="text-gray-500 text-sm">Most people don't see the hidden rules. They react to what happens instead of controlling what happens.</p>
            </div>
            <div className="bg-black p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-colors group">
              <ShieldAlert className="w-10 h-10 text-gray-600 group-hover:text-[#8B0000] mb-4 transition-colors" />
              <h3 className="text-white text-lg font-bold mb-2">The Silent Defeat</h3>
              <p className="text-gray-500 text-sm">You feel powerless not because you lack ability, but because you don't see the game being played on you.</p>
            </div>
            <div className="bg-black p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-colors group">
              <Sword className="w-10 h-10 text-gray-600 group-hover:text-[#8B0000] mb-4 transition-colors" />
              <h3 className="text-white text-lg font-bold mb-2">The Awakening</h3>
              <p className="text-gray-500 text-sm">This book ends the confusion. It puts the weapons of influence directly into your hands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* IS THIS BOOK FOR YOU? SECTION */}
      <section className="py-20 bg-[#080808] border-b border-white/5 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="serif-font text-3xl lg:text-4xl text-white mb-6">IS THIS BOOK FOR YOU?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              This is not a book for those who want to be comforted. It is for those who want to be effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-sm hover:bg-white/5 transition-colors border border-transparent hover:border-[#D4AF37]/20">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /></div>
                <div>
                  <h3 className="text-white font-bold mb-1">You Feel Invisible</h3>
                  <p className="text-gray-400 text-sm">You speak, but others don't seem to listen. You feel your presence fading in crowded rooms.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-sm hover:bg-white/5 transition-colors border border-transparent hover:border-[#D4AF37]/20">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /></div>
                <div>
                  <h3 className="text-white font-bold mb-1">You Are Tired of Being "Nice"</h3>
                  <p className="text-gray-400 text-sm">You realize that being accommodating has only made you a target for those who take advantage.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-sm hover:bg-white/5 transition-colors border border-transparent hover:border-[#D4AF37]/20">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /></div>
                <div>
                  <h3 className="text-white font-bold mb-1">You React Instead of Act</h3>
                  <p className="text-gray-400 text-sm">You find yourself constantly responding to other people's demands, timelines, and emotions.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-sm hover:bg-white/5 transition-colors border border-transparent hover:border-[#D4AF37]/20">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /></div>
                <div>
                  <h3 className="text-white font-bold mb-1">You Miss the Subtext</h3>
                  <p className="text-gray-400 text-sm">You often feel like there's a hidden conversation happening that you're not privy to.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-sm hover:bg-white/5 transition-colors border border-transparent hover:border-[#D4AF37]/20">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /></div>
                <div>
                  <h3 className="text-white font-bold mb-1">You Want Real Control</h3>
                  <p className="text-gray-400 text-sm">Not the illusion of participation, but the ability to shape outcomes in your favor.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-sm hover:bg-white/5 transition-colors border border-transparent hover:border-[#D4AF37]/20">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /></div>
                <div>
                  <h3 className="text-white font-bold mb-1">You Are Ready to See</h3>
                  <p className="text-gray-400 text-sm">You are prepared to look behind the curtain of human nature, even if what you find is uncomfortable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Tactics Section */}
      <section id="tactics" className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#8B0000] font-bold tracking-widest text-sm uppercase">Inside The Book</span>
            <h2 className="serif-font text-4xl lg:text-5xl text-white mt-2 mb-4">25 TACTICS OF CONTROL</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">These are not suggestions. These are weapons and shields, tested in the real world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Tactic 1 */}
            <div className="bg-[#0F0F0F] p-8 border-l-4 border-[#D4AF37] hover:bg-[#141414] transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="serif-font text-xl text-white">TACTIC 1: Control The Frame</h3>
                <span className="text-[#D4AF37] text-xs font-bold border border-[#D4AF37] px-2 py-1 rounded">Foundation</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 italic">"The person who controls the interpretation controls everything else."</p>
              <p className="text-gray-300 leading-relaxed">
                Learn how to set the rules of engagement before anyone realizes rules are being set. Stop reacting to events and start defining their meaning.
              </p>
            </div>

            {/* Tactic 2 */}
            <div className="bg-[#0F0F0F] p-8 border-l-4 border-[#555] hover:border-[#8B0000] transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="serif-font text-xl text-white">TACTIC 2: Speak Less, Hold More</h3>
                <span className="text-gray-500 text-xs font-bold border border-gray-600 px-2 py-1 rounded">Defense</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 italic">"Words are weapons. Most people fire them wildly."</p>
              <p className="text-gray-300 leading-relaxed">
                Silence is sharper than speech. Learn how to make others fill the silence with their mistakes, confessions, and weaknesses while you remain unreadable.
              </p>
            </div>

            {/* Tactic 3 */}
            <div className="bg-[#0F0F0F] p-8 border-l-4 border-[#555] hover:border-[#8B0000] transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="serif-font text-xl text-white">TACTIC 3: Hide the Knife Inside the Gift</h3>
                <span className="text-gray-500 text-xs font-bold border border-gray-600 px-2 py-1 rounded">Manipulation</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 italic">"A gift is never just a gift. It’s a chain."</p>
              <p className="text-gray-300 leading-relaxed">
                Generosity is a tool of control. Discover how to create debts and obligations that bind people to your will without them ever feeling forced.
              </p>
            </div>

            {/* Tactic 15 */}
            <div className="bg-[#0F0F0F] p-8 border-l-4 border-[#555] hover:border-[#8B0000] transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="serif-font text-xl text-white">TACTIC 15: Redraw The Field</h3>
                <span className="text-gray-500 text-xs font-bold border border-gray-600 px-2 py-1 rounded">Strategy</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 italic">"Never compete where you can't win."</p>
              <p className="text-gray-300 leading-relaxed">
                If the rules favor them, break the rules. Learn to shift the battleground to your strengths and leave your opponents fighting a war they cannot win.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://www.amazon.com/dp/B0FR55DD14"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackClick('tactics_preview', 'link')}
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors font-semibold tracking-widest text-sm uppercase border-b border-[#D4AF37] pb-1 cursor-pointer no-underline"
            >
              Unlock All 25 Tactics
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* WAR ROOM: TACTICAL TOOLKIT SECTION */}
      <section id="war-room" className="py-20 bg-[#050505] relative border-t border-b border-[#D4AF37]/20">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#8B0000] rounded-full blur-[128px]"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-[128px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">Tactical Toolkit</span>
            </div>
            <h2 className="serif-font text-3xl lg:text-5xl text-white mb-4">{toolContent.title}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              {toolContent.desc}
            </p>
          </div>

          {/* Tool Tabs */}
          <div className="flex justify-center mb-8 gap-2 sm:gap-4">
            <button
              onClick={() => { setActiveTool('strategist'); setAnalysisResult(''); setAnalysisInput(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs sm:text-sm font-bold tracking-wide transition-all ${activeTool === 'strategist' ? 'bg-[#D4AF37] text-black' : 'bg-transparent text-gray-500 border border-gray-800 hover:border-[#D4AF37] hover:text-white'}`}
            >
              <BrainCircuit size={16} />
              <span className="hidden sm:inline">STRATEGIST</span>
            </button>
            <button
              onClick={() => { setActiveTool('decoder'); setAnalysisResult(''); setAnalysisInput(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs sm:text-sm font-bold tracking-wide transition-all ${activeTool === 'decoder' ? 'bg-[#D4AF37] text-black' : 'bg-transparent text-gray-500 border border-gray-800 hover:border-[#D4AF37] hover:text-white'}`}
            >
              <MessageSquare size={16} />
              <span className="hidden sm:inline">DECODER</span>
            </button>
            <button
              onClick={() => { setActiveTool('rewriter'); setAnalysisResult(''); setAnalysisInput(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs sm:text-sm font-bold tracking-wide transition-all ${activeTool === 'rewriter' ? 'bg-[#D4AF37] text-black' : 'bg-transparent text-gray-500 border border-gray-800 hover:border-[#D4AF37] hover:text-white'}`}
            >
              <PenTool size={16} />
              <span className="hidden sm:inline">REWRITER</span>
            </button>
          </div>

          <div className="glass-panel rounded-sm p-6 md:p-8 shadow-2xl border border-[#D4AF37]/20">
            <div className="mb-6">
              <label htmlFor="scenario" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Input
              </label>
              <textarea
                id="scenario"
                value={analysisInput}
                onChange={(e) => setAnalysisInput(e.target.value)}
                placeholder={toolContent.placeholder}
                className="w-full bg-[#0F0F0F] border border-[#333] focus:border-[#D4AF37] rounded-sm p-4 text-white placeholder-gray-600 h-32 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none"
              ></textarea>
            </div>

            <button
              onClick={handleGeminiAction}
              disabled={isAnalyzing || !analysisInput.trim()}
              className={`w-full py-4 font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${isAnalyzing
                ? 'bg-[#1a1a1a] text-gray-500 cursor-wait'
                : 'bg-[#D4AF37] hover:bg-[#B38728] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]'
                }`}
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{toolContent.buttonText} ✨</span>
                </>
              )}
            </button>

            {/* Results Display */}
            {analysisResult && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase">Confidential Analysis</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
                </div>

                <div className="bg-[#080808] border-l-2 border-[#8B0000] p-6 rounded-r-sm">
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-light" dangerouslySetInnerHTML={{
                      __html: analysisResult
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold text-[#D4AF37]">$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }}></div>
                  </div>
                </div>

                <p className="text-center text-gray-600 text-xs mt-4">
                  *Analysis generated by AI based on the principles of "How to Control the Game". Your input is private and not collected or saved anywhere.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section id="author" className="py-20 bg-[#050505] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3">
              <div className="aspect-square bg-[#111] rounded-sm overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500 group">
                <img
                  src="author.jpg"
                  alt="Farid Jafarli - Author"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback icon if image doesn't load */}
                <div className="absolute inset-0 hidden items-center justify-center">
                  <User className="w-24 h-24 text-gray-700 group-hover:text-[#D4AF37] transition-colors" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h2 className="serif-font text-3xl text-white mb-6">FARID JAFARLI</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Farid Jafarli doesn't tell you to be nice. Nice people finish last because they refuse to see what's actually happening around them.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                He identifies the invisible forces that push and pull us daily. He teaches you how to be effective. How to see through masks. How to command respect without begging for it.
              </p>
              <a
                href="https://www.amazon.com/stores/author/B0FNWPDCLQ/about"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick('author_profile', 'link')}
                className="px-6 py-3 border border-white/20 text-white text-sm hover:bg-white hover:text-black transition-all inline-block no-underline"
              >
                VISIT AMAZON AUTHOR PAGE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#8B0000] relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20">
          {/* Simple grid pattern */}
          <div style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px', width: '100%', height: '100%', opacity: 0.2 }}></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="serif-font text-4xl md:text-6xl text-white font-bold mb-6">ARE YOU THE PIECE OR THE PLAYER?</h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">The game never stops. The board is always set. Make your move.</p>

          <a
            href="https://www.amazon.com/dp/B0FR55DD14"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackClick('final_cta', 'button')}
            className="bg-black text-white px-10 py-5 text-lg font-bold tracking-widest hover:scale-105 transition-transform shadow-2xl inline-flex items-center gap-3 border border-[#D4AF37] no-underline"
          >
            <span>ORDER ON AMAZON</span>
            <ShoppingCart className="w-5 h-5 text-[#D4AF37]" />
          </a>
          <p className="mt-6 text-white/60 text-xs uppercase tracking-widest">Available in Kindle & Paperback</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="serif-font text-white text-lg mb-4 md:mb-0 tracking-widest">FARID JAFARLI</div>
          <div className="text-gray-600 text-sm">
            &copy; 2024 All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;