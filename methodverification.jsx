const { useState, useEffect, useRef } = React;

// --- 0. 图标库 (替代 lucide-react) ---
// 为了让代码在浏览器直接运行，我们需要手动定义这些 SVG 图标
const IconWrapper = ({ d, size = 24, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d={d} />
    </svg>
);

const Flame = (p) => <IconWrapper {...p} d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.072-4.286-3-6.428C8.607 3.417 10.268 3 12 3c1.732 0 3.393.417 5 1.572C16.072 6.714 15.072 8.857 14 11c-.5 1-1 1.62-1 3a2.5 2.5 0 0 0 2.5 2.5c1.38 0 2-1.12 2-2.5 0-.4-.1-.8-.3-1.1 1.2 1 2.3 2.3 3.3 3.6C19 21 13 23 12 23c-1 0-7-2-8.5-6.5.2-.3.6-.7 1-1 .4-.3.8-.7 1.1-1.1.8.4 1.3.9 1.9 1.1.6.2 1.2.2 1 .1z" />;
const Snowflake = (p) => <IconWrapper {...p} d="M2 12h20M12 2v20M20 20l-8-8-8 8M4 4l8 8 8-8" />; // 简化版雪花
const Droplets = (p) => <IconWrapper {...p} d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05zM17 21c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S17.29 11.5 17 10c-.29 1.45-1.14 2.84-2.29 3.76S13 15.8 13 17c0 2.22 1.8 4.05 4 4.05z" />;
const Wind = (p) => <IconWrapper {...p} d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />;
const Shield = (p) => <IconWrapper {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const Sword = (p) => <IconWrapper {...p} d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2" />;
const Zap = (p) => <IconWrapper {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const Thermometer = (p) => <IconWrapper {...p} d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />;
const Box = (p) => <IconWrapper {...p} d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />;
const FlaskConical = (p) => <IconWrapper {...p} d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2M8.5 2h7M7 16h10" />;

// --- Game Constants & Data ---

const MAX_ENTROPY = 100;
const MIN_ENTROPY = -100;
const DANGER_THRESHOLD = 50; // > 50 or < -50 is dangerous

// Character: Violet
const HERO = {
  name: "薇尔莉特",
  maxHp: 80,
  ultMax: 6
};

// Initial Enemy: Obsidian Golem
const INITIAL_ENEMY = {
  name: "黑曜石魔像",
  maxHp: 120,
  hp: 120,
  block: 20,
  state: 'SOLID', // SOLID, LIQUID, GAS
  intent: { type: 'ATTACK', value: 12 },
  effects: []
};

// Card Database
const CARDS_DB = [
  { id: 'c1', name: '点火', type: 'ATTACK', cost: 0, entropy: 15, damage: 8, block: 0, element: 'FIRE', desc: '造成8点伤害。升温15。' },
  { id: 'c2', name: '点火', type: 'ATTACK', cost: 0, entropy: 15, damage: 8, block: 0, element: 'FIRE', desc: '造成8点伤害。升温15。' },
  { id: 'c3', name: '液氮喷雾', type: 'SKILL', cost: 0, entropy: -15, damage: 0, block: 8, element: 'ICE', desc: '获得8点格挡。降温15。' },
  { id: 'c4', name: '液氮喷雾', type: 'SKILL', cost: 0, entropy: -15, damage: 0, block: 8, element: 'ICE', desc: '获得8点格挡。降温15。' },
  { id: 'c5', name: '高压蒸汽', type: 'ATTACK', cost: 0, entropy: 25, damage: 15, block: 0, element: 'HEAT', desc: '造成15点伤害。大幅升温。' },
  { id: 'c6', name: '急冻光束', type: 'ATTACK', cost: 0, entropy: -25, damage: 10, block: 0, element: 'ICE', desc: '造成10点伤害。若敌人是气态，将其凝华。' },
  { id: 'm1', name: '燃油瓶', type: 'MATERIAL', cost: 0, entropy: 0, damage: 0, block: 0, element: 'NONE', desc: '素材：融合后增加5点伤害并附加[易伤]。', effectMod: { damage: 5, vuln: 2 } },
  { id: 'm2', name: '铁屑', type: 'MATERIAL', cost: 0, entropy: 0, damage: 0, block: 0, element: 'NONE', desc: '素材：融合后伤害+3，并获得5点格挡。', effectMod: { damage: 3, block: 5 } },
  { id: 'c7', name: '热力虹吸', type: 'SKILL', cost: 0, entropy: -10, damage: 0, block: 5, element: 'NONE', desc: '稍微降温。如果当前处于过热状态，抽2张牌。' },
];

// --- Helper Functions ---

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// 注意：这里去掉了 export default function，改为普通的函数定义
const AlchemySingularityDemo = () => {
  // --- State ---
  const [gameState, setGameState] = useState('PLAYER_TURN'); // PLAYER_TURN, ENEMY_TURN, GAME_OVER, VICTORY
  const [entropy, setEntropy] = useState(0);
  const [player, setPlayer] = useState({ hp: HERO.maxHp, maxHp: HERO.maxHp, block: 0, ultCharge: 0 });
  const [enemy, setEnemy] = useState({ ...INITIAL_ENEMY });
  const [deck, setDeck] = useState([...CARDS_DB]);
  const [hand, setHand] = useState([]);
  const [discard, setDiscard] = useState([]);
  const [combatLog, setCombatLog] = useState(["战斗开始！遭遇 黑曜石魔像。"]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [animatingEffect, setAnimatingEffect] = useState(null); 

  // --- Initialization ---
  useEffect(() => {
    startTurn();
  }, []);

  // --- Logic: Logging ---
  const log = (msg) => {
    setCombatLog(prev => [msg, ...prev].slice(0, 5));
  };

  // --- Logic: Turn Management ---
  const startTurn = () => {
    setGameState('PLAYER_TURN');
    setPlayer(p => ({ ...p, block: 0 })); 
    
    // Draw Cards
    let newDeck = [...deck];
    let newDiscard = [...discard];
    let newHand = [...hand];

    while (newHand.length < 5) {
      if (newDeck.length === 0) {
        if (newDiscard.length === 0) break;
        newDeck = [...newDiscard].sort(() => Math.random() - 0.5);
        newDiscard = [];
      }
      newHand.push(newDeck.pop());
    }

    setDeck(newDeck);
    setDiscard(newDiscard);
    setHand(newHand);
  };

  const endTurn = async () => {
    setGameState('ENEMY_TURN');
    
    setTimeout(() => {
      let damage = enemy.intent.value;
      let actualDamage = Math.max(0, damage - player.block);
      setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - actualDamage) }));
      
      log(`${enemy.name} 攻击造成 ${actualDamage} 点伤害！`);
      
      if (player.hp - actualDamage <= 0) {
        setGameState('GAME_OVER');
      } else {
        startTurn();
      }
    }, 1000);
  };

  // --- Logic: Card Playing ---
  const playCard = (cardIndex) => {
    if (gameState !== 'PLAYER_TURN') return;

    const card = hand[cardIndex];
    
    // Handle Material Selection
    if (card.type === 'MATERIAL') {
      if (selectedMaterialId === cardIndex) {
        setSelectedMaterialId(null); 
      } else {
        setSelectedMaterialId(cardIndex); 
        log(`选择了素材: ${card.name}。请点击另一张卡牌进行融合。`);
      }
      return;
    }

    // Handle Synthesis
    if (selectedMaterialId !== null) {
      const materialCard = hand[selectedMaterialId];
      const newCard = {
        ...card,
        name: `${materialCard.name.charAt(0)}·${card.name}`,
        damage: card.damage + (materialCard.effectMod?.damage || 0),
        block: card.block + (materialCard.effectMod?.block || 0),
        effects: [...(card.effects || []), ...(materialCard.effectMod?.vuln ? ['VULNERABLE'] : [])],
        desc: `(炼成) ${card.desc} ${materialCard.effectMod?.vuln ? '+易伤' : ''}`
      };

      const newHand = [...hand];
      newHand[cardIndex] = newCard;
      const filteredHand = newHand.filter((_, idx) => idx !== selectedMaterialId);
      
      setHand(filteredHand);
      setSelectedMaterialId(null);
      log(`炼成成功！获得了 ${newCard.name}`);
      return;
    }

    // --- Normal Card Play Logic ---
    let newEntropy = clamp(entropy + card.entropy, MIN_ENTROPY, MAX_ENTROPY);
    
    // Overheat/Freeze Limit
    if (Math.abs(newEntropy) >= 100) {
      log(`系统崩溃！熵值达到极限！`);
      setEntropy(0);
      setGameState('ENEMY_TURN');
      return; 
    }

    // Danger Zone
    let selfDamage = 0;
    if (Math.abs(entropy) > DANGER_THRESHOLD) {
      selfDamage = 3;
      setPlayer(p => ({ ...p, hp: p.hp - selfDamage }));
      log(`危险区辐射造成 ${selfDamage} 点自身伤害！`);
    }

    // Calculate Damage & Reaction
    let finalDamage = card.damage;
    let reactionTriggered = false;
    let nextEnemyState = enemy.state;

    if (Math.abs(entropy) > DANGER_THRESHOLD) {
      finalDamage = Math.floor(finalDamage * 1.5);
    }

    if (card.element === 'FIRE' && enemy.state === 'SOLID') {
      nextEnemyState = 'LIQUID';
      log("反应：融化！(破甲)");
      setEnemy(e => ({ ...e, block: 0 }));
      reactionTriggered = true;
      setAnimatingEffect('MELT');
    } else if ((card.element === 'HEAT' || card.element === 'FIRE') && enemy.state === 'LIQUID') {
      nextEnemyState = 'GAS';
      log("反应：蒸发！(剧烈伤害)");
      finalDamage += 10;
      reactionTriggered = true;
      setAnimatingEffect('VAPOR');
    } else if (card.element === 'ICE' && enemy.state === 'GAS') {
      nextEnemyState = 'SOLID';
      log("反应：凝华！(冻结)");
      finalDamage += 5;
      reactionTriggered = true;
      setAnimatingEffect('FREEZE');
    } else if (card.element === 'ICE' && enemy.state === 'LIQUID') {
        nextEnemyState = 'SOLID';
        log("反应：凝固！");
        reactionTriggered = true;
    }

    if (card.id === 'c7' && entropy > 30) { 
        log("热力虹吸生效：额外抽牌");
    }

    let damageDealt = Math.max(0, finalDamage - enemy.block);
    let remainingBlock = Math.max(0, enemy.block - finalDamage);
    
    setEnemy(e => ({
      ...e,
      hp: Math.max(0, e.hp - damageDealt),
      block: remainingBlock,
      state: nextEnemyState
    }));

    setPlayer(p => ({
      ...p,
      block: p.block + card.block,
      ultCharge: reactionTriggered ? Math.min(HERO.ultMax, p.ultCharge + 1) : p.ultCharge
    }));

    setEntropy(newEntropy);
    setHand(hand.filter((_, i) => i !== cardIndex));
    setDiscard([...discard, card]);

    if (enemy.hp - damageDealt <= 0) {
      setGameState('VICTORY');
    }

    setTimeout(() => setAnimatingEffect(null), 1000);
  };

  // --- Ultimate Ability ---
  const castUltimate = () => {
    if (player.ultCharge < HERO.ultMax) return;

    log("必杀技：热寂奇点！");
    const dmg = Math.abs(entropy) + 40; 
    setEnemy(e => ({ ...e, hp: Math.max(0, e.hp - dmg) }));
    setEntropy(0); 
    setPlayer(p => ({ ...p, ultCharge: 0 }));
    setAnimatingEffect('ULTIMATE');
    
    if (enemy.hp - dmg <= 0) setGameState('VICTORY');
    setTimeout(() => setAnimatingEffect(null), 1500);
  };

  // --- Render Helpers ---
  const getEntropyColor = (val) => {
    if (val > 50) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]';
    if (val < -50) return 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]';
    if (val > 20) return 'bg-orange-400';
    if (val < -20) return 'bg-blue-400';
    return 'bg-gray-400';
  };

  const getStateIcon = (state) => {
    switch(state) {
      case 'SOLID': return <Box size={32} className="text-gray-700" />;
      case 'LIQUID': return <Droplets size={32} className="text-blue-600" />;
      case 'GAS': return <Wind size={32} className="text-gray-400" />;
      default: return <Box />;
    }
  };

  const getStateName = (state) => {
    switch(state) {
        case 'SOLID': return "固态 (高防)";
        case 'LIQUID': return "液态 (易伤)";
        case 'GAS': return "气态 (闪避)";
        default: return "";
    }
  };

  // --- Styles Helpers ---
  function getCardStyle(type) {
    switch (type) {
        case 'ATTACK': return 'bg-slate-200 text-slate-900 border-b-4 border-red-500';
        case 'SKILL': return 'bg-slate-200 text-slate-900 border-b-4 border-blue-500';
        case 'MATERIAL': return 'bg-amber-100 text-amber-900 border-b-4 border-amber-500 border-2 border-amber-300';
        default: return 'bg-white text-black';
    }
  }

  function getCardIcon(element) {
    switch (element) {
        case 'FIRE': return <Flame className="text-red-500" size={24} />;
        case 'ICE': return <Snowflake className="text-cyan-500" size={24} />;
        case 'HEAT': return <Thermometer className="text-orange-500" size={24} />;
        default: return <div className="w-6 h-6" />;
    }
  }

  // --- Main Render ---
  return (
    <div className="w-full h-[600px] bg-slate-900 text-slate-100 font-sans overflow-hidden relative flex flex-col select-none shadow-2xl rounded-xl">
      
      {/* Visual Effects Overlay */}
      {animatingEffect && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            {animatingEffect === 'MELT' && <div className="text-6xl font-bold text-orange-500 animate-bounce">融化!</div>}
            {animatingEffect === 'VAPOR' && <div className="text-6xl font-bold text-white opacity-80 animate-pulse">蒸发!</div>}
            {animatingEffect === 'FREEZE' && <div className="text-6xl font-bold text-cyan-300 animate-ping">凝华!</div>}
            {animatingEffect === 'ULTIMATE' && <div className="text-8xl font-bold text-purple-500 animate-pulse">热寂奇点!</div>}
        </div>
      )}

      {/* Top Bar */}
      <div className="h-24 bg-slate-800 border-b border-slate-700 flex items-center px-6 justify-between shadow-lg z-10">
        <div className="flex flex-col gap-1 w-1/3">
           <div className="flex justify-between text-sm text-slate-400">
             <span>{HERO.name}</span>
             <span>HP: {player.hp}/{player.maxHp} <span className="text-blue-400 ml-2">({player.block} 🛡️)</span></span>
           </div>
           <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
             <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(player.hp/player.maxHp)*100}%` }}></div>
           </div>
        </div>

        {/* Entropy Scale */}
        <div className="flex flex-col items-center w-1/3 relative">
           <div className="text-xs font-bold mb-1 tracking-wider text-slate-300">熵值天平 (ENTROPY)</div>
           <div className="w-full h-6 bg-gradient-to-r from-cyan-600 via-gray-500 to-red-600 rounded-full relative border-2 border-slate-600">
              {/* Markers */}
              <div className="absolute left-[25%] top-0 bottom-0 w-0.5 bg-white opacity-30"></div>
              <div className="absolute right-[25%] top-0 bottom-0 w-0.5 bg-white opacity-30"></div>
              <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-white opacity-50"></div>
              
              {/* Indicator */}
              <div 
                className="absolute top-[-4px] bottom-[-4px] w-4 bg-white border-2 border-slate-800 rounded shadow-lg transition-all duration-500 ease-out"
                style={{ left: `${((entropy + 100) / 200) * 100}%`, transform: 'translateX(-50%)' }}
              ></div>
           </div>
           <div className={`text-lg font-bold mt-1 ${Math.abs(entropy) > 50 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
             {entropy}° 
             {Math.abs(entropy) > 50 && <span className="text-xs ml-2 text-red-500">危险区!</span>}
           </div>
        </div>

        <div className="w-1/3 flex justify-end">
            <button 
                onClick={castUltimate}
                disabled={player.ultCharge < HERO.ultMax}
                className={`
                    relative px-4 py-2 rounded-lg font-bold border-2 overflow-hidden transition-all
                    ${player.ultCharge >= HERO.ultMax 
                        ? 'bg-purple-600 border-purple-400 text-white hover:scale-105 shadow-[0_0_15px_#9333ea]' 
                        : 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed'}
                `}
            >
                <div className="flex items-center gap-2 z-10 relative">
                    <Zap size={18} fill={player.ultCharge >= HERO.ultMax ? "currentColor" : "none"} />
                    必杀技 ({player.ultCharge}/{HERO.ultMax})
                </div>
                <div 
                    className="absolute bottom-0 left-0 top-0 bg-purple-800 opacity-50 transition-all duration-500"
                    style={{ width: `${(player.ultCharge/HERO.ultMax)*100}%` }}
                ></div>
            </button>
        </div>
      </div>

      {/* Battlefield */}
      <div className="flex-1 flex relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900">
        
        {/* Player */}
        <div className="w-1/4 flex items-center justify-center">
           <div className={`w-32 h-48 bg-slate-700 rounded-t-full rounded-b-xl border-b-4 border-purple-500 relative flex items-center justify-center ${Math.abs(entropy)>50 ? 'animate-shake' : ''}`}>
              <div className="absolute -top-10 text-purple-300"><FlaskConical size={40} /></div>
              <span className="text-slate-400 font-bold">薇尔莉特</span>
              {player.block > 0 && (
                  <div className="absolute -right-4 top-10 bg-blue-600 text-white p-2 rounded-full flex items-center gap-1 shadow-lg">
                      <Shield size={16} /> {player.block}
                  </div>
              )}
           </div>
        </div>

        {/* Logs */}
        <div className="w-2/4 pt-4 flex flex-col items-center">
           <div className="bg-black/40 p-4 rounded-lg w-full max-w-md h-32 overflow-hidden text-sm text-slate-300 border border-slate-700/50">
              {combatLog.map((line, i) => (
                  <div key={i} className={`mb-1 ${i===0 ? 'text-white font-bold' : 'opacity-60'}`}>{i===0 ? '> ' : ''}{line}</div>
              ))}
           </div>
           
           <div className="mt-4 text-xs text-slate-500 flex gap-4">
              <span className="flex items-center gap-1"><Flame size={12} /> 火 + <Box size={12} /> 固 = 融化</span>
              <span className="flex items-center gap-1"><Thermometer size={12} /> 热 + <Droplets size={12} /> 液 = 蒸发</span>
              <span className="flex items-center gap-1"><Snowflake size={12} /> 冰 + <Wind size={12} /> 气 = 凝华</span>
           </div>
        </div>

        {/* Enemy */}
        <div className="w-1/4 flex flex-col items-center justify-center relative">
           <div className="text-red-400 font-bold text-lg mb-2 flex items-center gap-2">
             <Sword size={18} /> 意图: {enemy.intent.value} 伤害
           </div>
           
           <div className={`
              w-40 h-40 rounded-xl flex flex-col items-center justify-center border-4 relative transition-all duration-500
              ${enemy.state === 'SOLID' ? 'bg-gray-800 border-gray-600 scale-100' : ''}
              ${enemy.state === 'LIQUID' ? 'bg-blue-900/50 border-blue-500 rounded-[40px] animate-pulse' : ''}
              ${enemy.state === 'GAS' ? 'bg-slate-700/30 border-slate-300 opacity-60 blur-sm scale-110' : ''}
           `}>
               {getStateIcon(enemy.state)}
               <span className="mt-2 font-bold text-white">{enemy.name}</span>
               <div className="text-xs bg-black/50 px-2 py-1 rounded mt-1">{getStateName(enemy.state)}</div>

               {enemy.block > 0 && (
                  <div className="absolute -left-4 top-0 bg-gray-600 text-white p-1 rounded border border-gray-400 flex items-center gap-1">
                      <Shield size={14} /> {enemy.block}
                  </div>
              )}
           </div>

           <div className="w-32 h-4 bg-slate-800 rounded-full mt-4 border border-slate-600 overflow-hidden">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemy.hp/enemy.maxHp)*100}%` }}></div>
           </div>
           <div className="text-sm mt-1">{enemy.hp} / {enemy.maxHp}</div>
        </div>
      </div>

      {/* Hand */}
      <div className="h-48 bg-slate-900/90 border-t border-slate-700 relative flex items-center justify-center gap-4 px-4 z-20">
          
          {gameState === 'ENEMY_TURN' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                  <span className="text-2xl font-bold text-white animate-pulse">敌方行动中...</span>
              </div>
          )}

          {gameState === 'VICTORY' && (
              <div className="absolute inset-0 bg-green-900/90 flex flex-col items-center justify-center z-50">
                  <h1 className="text-4xl font-bold text-white mb-4">胜利!</h1>
                  <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white text-green-900 font-bold rounded hover:bg-gray-200">再次实验</button>
              </div>
          )}

          {gameState === 'GAME_OVER' && (
               <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-50">
               <h1 className="text-4xl font-bold text-white mb-4">实验失败</h1>
               <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white text-red-900 font-bold rounded hover:bg-gray-200">重试</button>
           </div>
          )}

          {hand.map((card, index) => (
            <div 
                key={index}
                onClick={() => playCard(index)}
                className={`
                    w-32 h-44 rounded-lg p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 relative group
                    ${getCardStyle(card.type)}
                    ${selectedMaterialId === index ? 'ring-4 ring-yellow-400 -translate-y-6 scale-110 z-30' : 'hover:-translate-y-4 hover:scale-105 hover:z-20'}
                    ${selectedMaterialId !== null && card.type !== 'MATERIAL' && selectedMaterialId !== index ? 'animate-pulse ring-2 ring-yellow-200' : ''}
                `}
            >
                <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-tighter opacity-70">{card.type === 'MATERIAL' ? '素材' : '卡牌'}</span>
                    {card.entropy !== 0 && (
                        <div className={`text-xs font-bold px-1 rounded ${card.entropy > 0 ? 'text-red-500 bg-red-100' : 'text-cyan-600 bg-cyan-100'}`}>
                            {card.entropy > 0 ? '+' : ''}{card.entropy}°
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center text-center my-1">
                    {getCardIcon(card.element)}
                    <h3 className="font-bold text-sm leading-tight mt-1">{card.name}</h3>
                </div>

                <p className="text-[10px] leading-3 opacity-90 h-10 overflow-hidden">{card.desc}</p>
                
                <div className="flex justify-around text-xs font-bold pt-2 border-t border-black/10 mt-1">
                    {card.damage > 0 && <span className="flex items-center gap-0.5 text-red-700"><Sword size={10} />{card.damage}</span>}
                    {card.block > 0 && <span className="flex items-center gap-0.5 text-blue-700"><Shield size={10} />{card.block}</span>}
                    {card.type === 'MATERIAL' && <span className="text-purple-700">融合</span>}
                </div>
            </div>
          ))}

          <button 
            onClick={endTurn} 
            className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-600 flex flex-col items-center justify-center text-xs font-bold text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all active:scale-95 shadow-xl"
          >
             <span>结束</span>
             <span>回合</span>
          </button>
      </div>
    </div>
  );
}

// 关键点：告诉 React 将组件渲染到页面的 id="root" 上
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AlchemySingularityDemo />);
