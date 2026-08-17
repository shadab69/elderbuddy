import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../App.jsx';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Bot, Send, X, ShoppingCart, ArrowRight, Calculator, CheckCircle2, Building2 } from 'lucide-react';

export default function AgenticAssistant() {
  const { products = [], addToCart } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Namaste! 🙏 I am your Elder-O-Buddy AI Construction & Shopping Agent.\n\nI can help you find building materials, calculate structural quantities (Cement, Steel, Bricks), or guide you through Turnkey Home Construction & 108 Quality Checks.',
      suggestedChips: [
        '📐 Calculate materials for 1,200 sq.ft',
        '🏠 Turnkey Home packages & pricing',
        '🔥 Show Hot Deals on Cement & Steel',
        '📋 108-point QA Checklist overview',
        '🧱 Find best AAC Blocks & Bricks'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleQuery = (queryText) => {
    const q = queryText.toLowerCase().trim();
    if (!q) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let agentResponse = null;

      const sqftMatch = q.match(/(\d{3,5})\s*(sq|sqft|sq\.ft|feet|ft)?/i);
      if (q.includes('calculate') || q.includes('estimate') || q.includes('quantity') || (sqftMatch && !q.includes('price') && !q.includes('cost'))) {
        const sqft = sqftMatch ? parseInt(sqftMatch[1], 10) : 1000;
        const cementBags = Math.round(sqft * 0.4);
        const steelTons = (sqft * 0.0035).toFixed(2);
        const bricksCount = Math.round(sqft * 22);
        const sandTons = (sqft * 0.08).toFixed(1);

        agentResponse = {
          id: Date.now() + 1,
          sender: 'agent',
          text: `📊 Structural Material Estimate for ${sqft.toLocaleString()} sq.ft Built-Up Area:\n\n- 🏗️ Cement: ~${cementBags} Bags (OPC 53 / PPC)\n- 🏢 TMT Steel: ~${steelTons} Metric Tonnes (Fe 550D)\n- 🧱 Bricks / AAC Blocks: ~${bricksCount.toLocaleString()} Units\n- ⏳ Sand: ~${sandTons} Tonnes\n\n*Estimated based on standard IS 456 RCC slab benchmarks.*`,
          actionType: 'estimator',
          recommendedProducts: products.filter(p => ['c1', 's1', 'b1', 'c2'].includes(p.id)).slice(0, 3),
          suggestedChips: [
            '🏠 Explore Turnkey Home Construction',
            '🛒 Add Cement & Steel to Cart',
            '📋 View 108 Quality Checks'
          ]
        };
      } else if (q.includes('turnkey') || q.includes('build your home') || q.includes('packages') || q.includes('ghar') || q.includes('house') || q.includes('cost')) {
        agentResponse = {
          id: Date.now() + 1,
          sender: 'agent',
          text: `🏠 Elder-O-Buddy Turnkey Construction:\n\nWe provide end-to-end design, civil construction, Tier-1 materials, and 108-point engineering quality audit:\n\n1. Essential Package: ₹1,650/sq.ft (PPC Cement, Fe 500D, Red Bricks)\n2. Premium Package: ₹2,150/sq.ft (UltraTech 53, Fe 550D, AAC Blocks, Vitrified GVT)\n3. Luxury Villa: ₹2,850/sq.ft (Italian Marble, Teak Wood, HDHMR Kitchen)\n\n✅ 10-Year Structural Warranty & Zero Cost Overruns.`,
          actionType: 'navigation',
          actionLabel: 'Open Build Your Home Page →',
          actionRoute: '/build-your-home',
          suggestedChips: [
            '📋 View 108-point QA Checklist',
            '📐 Calculate Materials for 1,500 sq.ft',
            '👷 Explore Verified Builders'
          ]
        };
      } else if (q.includes('checklist') || q.includes('108') || q.includes('quality') || q.includes('is code')) {
        agentResponse = {
          id: Date.now() + 1,
          sender: 'agent',
          text: `📋 108-Point Engineering Quality Checklist:\n\nOur certified structural engineers perform mandatory QA sign-offs across 6 critical stages:\n- 🏗️ Foundation & Substructure (IS 1892 & IS 6313)\n- 🏢 RCC Core & Fe 550D Steel (IS 456 & IS 1786)\n- 🧱 AAC Blockwork & GI Mesh Jointing\n- 💧 72-Hour Terrace Ponding Waterproofing\n- ⚡ FRLS Copper Wiring & Megger Insulation (>1MΩ)\n- ✨ 10-Year Structural Handover Protocol`,
          actionType: 'navigation',
          actionLabel: 'Open 108-Point QA Modal →',
          actionRoute: '/build-your-home',
          suggestedChips: [
            '🏠 Explore Turnkey Packages',
            '🔥 Show Hot Deals on Cement & Steel',
            '📐 Calculate materials for 1,000 sq.ft'
          ]
        };
      } else {
        const matched = products.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) || 
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          p.brand.toLowerCase().includes(q)
        );

        if (matched.length > 0) {
          agentResponse = {
            id: Date.now() + 1,
            sender: 'agent',
            text: `🔎 Found ${matched.length} product(s) matching your request:`,
            recommendedProducts: matched.slice(0, 4),
            suggestedChips: [
              '🔥 Hot Deals on Building Materials',
              '📐 Calculate Project Materials',
              '🏠 Turnkey Home Packages'
            ]
          };
        } else {
          agentResponse = {
            id: Date.now() + 1,
            sender: 'agent',
            text: 'Here are our top featured construction materials & solutions:',
            recommendedProducts: products.slice(0, 3),
            suggestedChips: [
              '📐 Calculate materials for 1,200 sq.ft',
              '🏠 Turnkey Home Construction',
              '🔥 Hot Deals'
            ]
          };
        }
      }

      setMessages((prev) => [...prev, agentResponse]);
      setIsTyping(false);
    }, 550);
  };

  const handleChipClick = (chip) => {
    handleQuery(chip.replace(/^[^\w\s]+/, '').trim());
  };

  return (
    <>
      <button 
        type="button" 
        className="agentic-floating-launcher"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Elder-O-Buddy AI Construction Assistant"
        title="Ask AI Shopping and Construction Agent"
      >
        <span className="agentic-bot-icon-wrap">
          <Bot className="agent-icon" style={{ width: '22px', height: '22px' }} />
          <Sparkles className="sparkle-badge" style={{ width: '12px', height: '12px' }} />
        </span>
        <span className="agentic-launcher-text">AI Copilot</span>
        <span className="agentic-live-pulse"></span>
      </button>

      {isOpen && (
        <div className="agentic-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="agentic-chat-card" onClick={(e) => e.stopPropagation()}>
            <div className="agentic-chat-header">
              <div className="agent-hdr-left">
                <div className="agent-hdr-avatar">
                  <Bot style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                </div>
                <div>
                  <div className="agent-hdr-title">
                    <span>Elder-O-Buddy AI Agent</span>
                    <span className="agent-online-pill">● Online</span>
                  </div>
                  <div className="agent-hdr-sub">Construction & Shopping Copilot</div>
                </div>
              </div>
              <button 
                type="button" 
                className="agent-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <div className="agentic-chat-body">
              {messages.map((msg) => (
                <div key={msg.id} className={'agent-msg-row ' + (msg.sender === 'user' ? 'msg-user' : 'msg-agent')}>
                  {msg.sender === 'agent' && (
                    <div className="agent-chat-bubble">
                      <div className="agent-bubble-text" style={{ whiteSpace: 'pre-line' }}>
                        {msg.text}
                      </div>

                      {msg.actionRoute && (
                        <button 
                          type="button" 
                          className="btn-agent-action"
                          onClick={() => {
                            setIsOpen(false);
                            navigate(msg.actionRoute);
                          }}
                        >
                          {msg.actionLabel}
                        </button>
                      )}

                      {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                        <div className="agent-products-grid">
                          {msg.recommendedProducts.map((p) => (
                            <div key={p.id} className="agent-mini-product-card">
                              <img src={p.imageSrc} alt={p.name} className="agent-prod-img" />
                              <div className="agent-prod-info">
                                <div className="agent-prod-name">{p.name}</div>
                                <div className="agent-prod-price">
                                  ₹{p.price.toLocaleString()} <span className="agent-unit">/ {p.unit}</span>
                                </div>
                                <button 
                                  type="button" 
                                  className="btn-agent-add-cart"
                                  onClick={() => addToCart(p, 1)}
                                >
                                  + Add to Cart
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.suggestedChips && msg.suggestedChips.length > 0 && (
                        <div className="agent-chips-wrap">
                          {msg.suggestedChips.map((chip, idx) => (
                            <button 
                              key={idx} 
                              type="button" 
                              className="agent-chip-btn"
                              onClick={() => handleChipClick(chip)}
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {msg.sender === 'user' && (
                    <div className="user-chat-bubble">
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="agent-typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <form 
              className="agentic-input-bar" 
              onSubmit={(e) => {
                e.preventDefault();
                handleQuery(inputVal);
              }}
            >
              <input 
                type="text" 
                placeholder="Ask about materials, prices, sq.ft estimates..." 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
              />
              <button type="submit" className="agent-btn-send" aria-label="Send message">
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
