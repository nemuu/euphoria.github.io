import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, Snowflake, Droplets, Wind, Skull, Shield, 
  Zap, RefreshCw, AlertTriangle, Thermometer, Box, 
  FlaskConical, ArrowRight, Sword, Check
} from 'lucide-react';

// --- Game Constants & Data ---

const MAX_ENTROPY = 100;
const MIN_ENTROPY = -100;
const DANGER_THRESHOLD = 50; // > 50 or < -50 is dangerous
const MAX_HAND_SIZE = 5;

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

export default function AlchemySingularityDemo() {
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
  const [animatingEffect, setAnimatingEffect] = useState(null); // For visual feedback

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
    setPlayer(p => ({ ...p, block: 0 })); // Reset block
    
    // Draw Cards
    let newDeck = [...deck];
    let newDiscard = [...discard];
    let newHand = [...hand];

    // Simple draw logic for demo (fill to 5)
    while (newHand.length < 5) {
      if (newDeck.length === 0) {
        if (newDiscard.length === 0) break;
        newDeck = [...newDiscard].sort(() => Math.random() - 0.5); // Shuffle
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
    
    // Enemy Action
    setTimeout(() => {
      let damage = enemy.intent.value;
      
      // Check Enemy State Modifiers
      if (enemy.state === 'LIQUID') {
         // Liquid enemies might attack faster but weaker? Or just normal for now.
      }
      if (enemy.state === 'GAS') {
        // Gas attacks are hard to block? (Pierce) - Simplified for demo
      }

      // Player Block
      let actualDamage = Math.max(0, damage - player.block);
      setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - actualDamage) }));
      
      log(`${enemy.name} 攻击造成 ${actualDamage} 点伤害！`);
      
      if (player.hp - actualDamage <= 0) {
        setGameState('GAME_OVER');
      } else {
        // Prepare next turn
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
        setSelectedMaterialId(null); // Deselect
      } else {
        setSelectedMaterialId(cardIndex); // Select
        log(`选择了素材: ${card.name}。请点击另一张卡牌进行融合。`);
      }
      return;
    }

    // Handle Synthesis (If material is selected)
    if (selectedMaterialId !== null) {
      const materialCard = hand[selectedMaterialId];
      // Create new synthesized card
      const newCard = {
        ...card,
        name: `${materialCard.name.charAt(0)}·${card.name}`,
        damage: card.damage + (materialCard.effectMod?.damage || 0),
        block: card.block + (materialCard.effectMod?.block || 0),
        effects: [...(card.effects || []), ...(materialCard.effectMod?.vuln ? ['VULNERABLE'] : [])],
        desc: `(炼成) ${card.desc} ${materialCard.effectMod?.vuln ? '+易伤' : ''}`
      };

      // Update Hand: Remove material, replace target with new card
      const newHand = [...hand];
      newHand[cardIndex] = newCard;
      // Filter out the material card by index. Note: selectedMaterialId is an index
      const filteredHand = newHand.filter((_, idx) => idx !== selectedMaterialId);
      
      setHand(filteredHand);
      setSelectedMaterialId(null);
      log(`炼成成功！获得了 ${newCard.name}`);
      return;
    }

    // --- Normal Card Play Logic ---

    // 1. Entropy Check
    let newEntropy = clamp(entropy + card.entropy, MIN_ENTROPY, MAX_ENTROPY);
    
    // Overheat/Freeze Limit Check (Crash)
    if (Math.abs(newEntropy) >= 100) {
      log(`系统崩溃！熵值达到极限！`);
      setEntropy(0); // Reset hard
      setGameState('ENEMY_TURN'); // End turn immediately punishment
      // In full game, take damage or lose cards
      return; 
    }

    // Danger Zone Damage (Self Burn)
    let selfDamage = 0;
    if (Math.abs(entropy) > DANGER_THRESHOLD) {
      selfDamage = 3;
      setPlayer(p => ({ ...p, hp: p.hp - selfDamage }));
      log(`危险区辐射造成 ${selfDamage} 点自身伤害！`);
    }

    // 2. Calculate Damage & Reaction
    let finalDamage = card.damage;
    let reactionTriggered = false;
    let nextEnemyState = enemy.state;

    // Danger Zone Bonus
    if (Math.abs(entropy) > DANGER_THRESHOLD) {
      finalDamage = Math.floor(finalDamage * 1.5);
    }

    // Reaction Logic
    if (card.element === 'FIRE' && enemy.state === 'SOLID') {
      nextEnemyState = 'LIQUID';
      log("反应：融化！(破甲)");
      setEnemy(e => ({ ...e, block: 0 })); // Melt removes armor
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
      // Freeze mechanic: maybe skips enemy turn or adds massive block to player?
      // For demo: just state change + damage
      finalDamage += 5;
      reactionTriggered = true;
      setAnimatingEffect('FREEZE');
    } else if (card.element === 'ICE' && enemy.state === 'LIQUID') {
        nextEnemyState = 'SOLID';
        log("反应：凝固！");
        reactionTriggered = true;
    }

    // Apply specific card logics
    if (card.id === 'c7' && entropy > 30) { // Thermal Siphon
        // Draw logic
        log("热力虹吸生效：额外抽牌");
    }

    // 3. Apply Effects to Enemy
    let damageDealt = Math.max(0, finalDamage - enemy.block);
    let remainingBlock = Math.max(0, enemy.block - finalDamage);
    
    setEnemy(e => ({
      ...e,
      hp: Math.max(0, e.hp - damageDealt),
      block: remainingBlock,
      state: nextEnemyState
    }));

    // 4. Apply Effects to Player
    setPlayer(p => ({
      ...p,
      block: p.block + card.block,
      ultCharge: reactionTriggered ? Math.min(HERO.ultMax, p.ultCharge + 1) : p.ultCharge
    }));

    // 5. Update State
    setEntropy(newEntropy);
    setHand(hand.filter((_, i) => i !== cardIndex));
    setDiscard([...discard, card]);

    // 6. Check Win
    if (enemy.hp - damageDealt <= 0) {
      setGameState('VICTORY');
    }

    // Clear animation after short delay
    setTimeout(() => setAnimatingEffect(null), 1000);
  };

  // --- Ultimate Ability ---
  const castUltimate = () => {
    if (player.ultCharge < HERO.ultMax) return;

    log("必杀技：热寂奇点！");
    // Deal damage equal to absolute entropy
    const dmg = Math.abs(entropy) + 40; // Base 40 + Entropy
    setEnemy(e => ({ ...e, hp: Math.max(0, e.hp - dmg) }));
    setEntropy(0); // Reset entropy
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

  // --- Render ---
  return (
    <div className="w-full h-[600px] bg-slate-900 text-slate-100 font-sans overflow-hidden relative flex flex-col select-none">
      
      {/* Visual Effects Overlay */}
      {animatingEffect && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            {animatingEffect === 'MELT' && <div className="text-6xl font-bold text-orange-500 animate-bounce">融化!</div>}
            {animatingEffect === 'VAPOR' && <div className="text-6xl font-bold text-white opacity-80 animate-pulse">蒸发!</div>}
            {animatingEffect === 'FREEZE' && <div className="text-6xl font-bold text-cyan-300 animate-ping">凝华!</div>}
            {animatingEffect === 'ULTIMATE' && <div className="text-8xl font-bold text-purple-500 animate-pulse">热寂奇点!</div>}
        </div>
      )}

      {/* Top Bar: Entropy & Player HP */}
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
              {/* Safe Zone Markers */}
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
                {/* Progress Fill for Button */}
                <div 
                    className="absolute bottom-0 left-0 top-0 bg-purple-800 opacity-50 transition-all duration-500"
                    style={{ width: `${(player.ultCharge/HERO.ultMax)*100}%` }}
                ></div>
            </button>
        </div>
      </div>

      {/* Main Battlefield */}
      <div className="flex-1 flex relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900">
        
        {/* Left: Player Sprite (Placeholder) */}
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

        {/* Center: Combat Log */}
        <div className="w-2/4 pt-4 flex flex-col items-center">
           <div className="bg-black/40 p-4 rounded-lg w-full max-w-md h-32 overflow-hidden text-sm text-slate-300 border border-slate-700/50">
              {combatLog.map((line, i) => (
                  <div key={i} className={`mb-1 ${i===0 ? 'text-white font-bold' : 'opacity-60'}`}>{i===0 ? '> ' : ''}{line}</div>
              ))}
           </div>
           
           {/* Reaction Hint */}
           <div className="mt-4 text-xs text-slate-500 flex gap-4">
              <span className="flex items-center gap-1"><Flame size={12} /> 火 + <Box size={12} /> 固 = 融化</span>
              <span className="flex items-center gap-1"><Thermometer size={12} /> 热 + <Droplets size={12} /> 液 = 蒸发</span>
              <span className="flex items-center gap-1"><Snowflake size={12} /> 冰 + <Wind size={12} /> 气 = 凝华</span>
           </div>
        </div>

        {/* Right: Enemy */}
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

           {/* Enemy HP Bar */}
           <div className="w-32 h-4 bg-slate-800 rounded-full mt-4 border border-slate-600 overflow-hidden">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemy.hp/enemy.maxHp)*100}%` }}></div>
           </div>
           <div className="text-sm mt-1">{enemy.hp} / {enemy.maxHp}</div>
        </div>
      </div>

      {/* Bottom: Hand Area */}
      <div className="h-48 bg-slate-900/90 border-t border-slate-700 relative flex items-center justify-center gap-4 px-4 z-20">
          
          {gameState === 'ENEMY_TURN' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                  <span className="text-2xl font-bold text-white animate-pulse">敌方行动中...</span>
              </div>
          )}

          {gameState === 'VICTORY' && (
              <div className="absolute inset-0 bg-green-900/90 flex flex-col items-center justify-center z-50">
                  <h1 className="text-4xl font-bold text-white mb-4">胜利!</h1>
                  <p className="mb-6 text-green-200">炼金实验成功。</p>
                  <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white text-green-900 font-bold rounded hover:bg-gray-200">再次实验</button>
              </div>
          )}

          {gameState === 'GAME_OVER' && (
               <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-50">
               <h1 className="text-4xl font-bold text-white mb-4">实验失败</h1>
               <p className="mb-6 text-red-200">你被摧毁了。</p>
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
                {/* Header */}
                <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-tighter opacity-70">{card.type === 'MATERIAL' ? '素材' : '卡牌'}</span>
                    {card.entropy !== 0 && (
                        <div className={`text-xs font-bold px-1 rounded ${card.entropy > 0 ? 'text-red-500 bg-red-100' : 'text-cyan-600 bg-cyan-100'}`}>
                            {card.entropy > 0 ? '+' : ''}{card.entropy}°
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col items-center text-center my-1">
                    {getCardIcon(card.element)}
                    <h3 className="font-bold text-sm leading-tight mt-1">{card.name}</h3>
                </div>

                {/* Description */}
                <p className="text-[10px] leading-3 opacity-90 h-10 overflow-hidden">{card.desc}</p>
                
                {/* Footer Stats */}
                <div className="flex justify-around text-xs font-bold pt-2 border-t border-black/10 mt-1">
                    {card.damage > 0 && <span className="flex items-center gap-0.5 text-red-700"><Sword size={10} />{card.damage}</span>}
                    {card.block > 0 && <span className="flex items-center gap-0.5 text-blue-700"><Shield size={10} />{card.block}</span>}
                    {card.type === 'MATERIAL' && <span className="text-purple-700">融合</span>}
                </div>

                {/* Selection Overlay for Synthesis Target */}
                {selectedMaterialId !== null && card.type !== 'MATERIAL' && (
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                        <span className="bg-black text-white text-xs px-2 py-1 rounded">点击融合</span>
                    </div>
                )}
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
