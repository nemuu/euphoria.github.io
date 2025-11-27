const { useState, useMemo, useEffect } = React;

// 通用图标 Mock (解决缺少图标库报错)
const IconMock = ({ name, ...props }) => (
  <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', border:'1px dashed #666', borderRadius:4, padding:4, fontSize:10, color:'#888', minWidth:24, minHeight:24 }} {...props}>
    {name}
  </span>
);
const Sword = (props) => <IconMock name="Sword" {...props} />;
const Shield = (props) => <IconMock name="Shield" {...props} />;
const Zap = (props) => <IconMock name="Zap" {...props} />;
const X = (props) => <IconMock name="X" {...props} />;
const Info = (props) => <IconMock name="Info" {...props} />;
const Diamond = (props) => <IconMock name="Diamond" {...props} />;
const Star = (props) => <IconMock name="Star" {...props} />;
const Flame = (props) => <IconMock name="Flame" {...props} />;
const Layers = (props) => <IconMock name="Layers" {...props} />;
const MousePointerClick = (props) => <IconMock name="MousePointerClick" {...props} />;
const Save = (props) => <IconMock name="Save" {...props} />;
const FileText = (props) => <IconMock name="FileText" {...props} />;
const RotateCcw = (props) => <IconMock name="RotateCcw" {...props} />;
const Box = (props) => <IconMock name="Box" {...props} />;
const Plus = (props) => <IconMock name="Plus" {...props} />;
const Filter = (props) => <IconMock name="Filter" {...props} />;
const Skull = (props) => <IconMock name="Skull" {...props} />;
const Hexagon = (props) => <IconMock name="Hexagon" {...props} />;
const Ghost = (props) => <IconMock name="Ghost" {...props} />;
const Calendar = (props) => <IconMock name="Calendar" {...props} />;
const Settings = (props) => <IconMock name="Settings" {...props} />;
const Check = (props) => <IconMock name="Check" {...props} />;
const Trash2 = (props) => <IconMock name="Trash2" {...props} />;
const LogOut = (props) => <IconMock name="LogOut" {...props} />;
const Copy = (props) => <IconMock name="Copy" {...props} />;
const XCircle = (props) => <IconMock name="XCircle" {...props} />;
const Undo2 = (props) => <IconMock name="Undo2" {...props} />;
const RefreshCw = (props) => <IconMock name="RefreshCw" {...props} />;
const Files = (props) => <IconMock name="Files" {...props} />;
const Sparkles = (props) => <IconMock name="Sparkles" {...props} />;

// import React, { useState, useMemo, useEffect } from 'react'; (已清理)
// import { 
  Sword, Shield, Zap, X, Info, Diamond, Star, Flame, Layers, 
  MousePointerClick, Save, FileText, RotateCcw, Box, Plus, Filter, 
  Skull, Hexagon, Ghost, Calendar, Settings, Check, Trash2, LogOut, Copy, XCircle, Undo2, RefreshCw, Files, Sparkles 
} from 'lucide-react'; (已转换为 Mock 组件)

// --- 数据定义 ---

// 初始卡牌数据 (图1 上排)
const initialStarterCards = [
  { id: 's1', name: '歼灭射击', cost: 1, type: 'attack', category: 'starter', description: '造成102%伤害', imageType: 'gun1' },
  { id: 's2', name: '歼灭射击', cost: 1, type: 'attack', category: 'starter', description: '造成102%伤害', imageType: 'gun1' },
  { id: 's3', name: '暗黑之幕', cost: 1, type: 'skill', category: 'starter', description: '获得102%护盾', imageType: 'hand' },
  { 
    id: 's4', 
    name: '悲叹回响', 
    cost: 1, 
    type: 'attack', 
    category: 'starter', 
    description: '伤害154%\n生成1张镇魂子弹', 
    imageType: 'gun2',
    customizable: true, // 允许灵光一闪
    divineFlash: 'none'
  }
];

// 其他卡牌初始数据 (基于图片录入)
const initialOtherCards = [
  // --- 图片 6 (中立卡) ---
  { id: 'n_void', name: '虚空流浪者', cost: 0, type: 'skill', category: 'neutral', description: '1回合内目标的行动次数\n不会减少', imageType: 'neutral_ph' },
  { id: 'n_shield', name: '能量护盾', cost: 0, type: 'skill', category: 'neutral', description: '[ 消灭 ]\n获得100%护盾\n获得1点AP', imageType: 'neutral_ph' },
  { id: 'n_recycle', name: '回收利用', cost: 0, type: 'skill', category: 'neutral', description: '自我意识点数为2以上时\n自我意识点数减少2\n并获得1点AP', imageType: 'neutral_ph' },
  { id: 'n_mutant', name: '攻击性突变', cost: 0, type: 'skill', category: 'neutral', description: '[ 消灭 ]\n自身攻击卡牌抽取1\n1回合内该卡牌伤害量\n+50%', imageType: 'neutral_ph' },
  { id: 'n_shell', name: '造壳细胞', cost: 0, type: 'skill', category: 'neutral', description: '[ 保留 ]\n护盾70%\n按照手牌中的卡牌数量\n护盾+25%', imageType: 'neutral_ph' },
  { id: 'n_start', name: '战略起点', cost: 1, type: 'skill', category: 'neutral', description: '[ 消灭 ]\n获得2点自我意识点数', imageType: 'neutral_ph' },
  { id: 'n_dark', name: '黑暗知识', cost: 1, type: 'skill', category: 'neutral', description: '[ 终极 / 消灭 ]\n抽取1\n发动该卡牌', imageType: 'neutral_ph' },
  { id: 'n_sleep', name: '睡眠果实', cost: 1, type: 'skill', category: 'neutral', description: '[ 终极 / 消灭 ]\n随机战斗员压力减少5', imageType: 'neutral_ph' },
  { id: 'n_disguise', name: '伪装', cost: 2, type: 'skill', category: 'neutral', description: '[ 消灭 ]\n闪避1\n下一回合抽取2', imageType: 'neutral_ph' },
  { id: 'n_wall', name: '铜墙铁壁', cost: 1, type: 'enhance', category: 'neutral', description: '[ 开战 ]\n决心1\n不屈1', imageType: 'neutral_ph' },

  // --- 图片 7 (中立/赛季/怪兽) ---
  // 赛季卡 (禁忌)
  { id: 'f_call', name: '禁忌：自由的召唤', cost: 0, type: 'skill', category: 'season', seasonType: 'catalyst', description: '[ 消灭 / 开战 ]\n手牌中的1张随机卡牌费\n用减少1', imageType: 'forbidden_ph' },
  { id: 'f_hunger', name: '禁忌：永生的饥饿', cost: 0, type: 'skill', category: 'season', seasonType: 'catalyst', description: '[ 保留 / 消灭 ]\n感应：抽取1\n获得1点AP', imageType: 'forbidden_ph' },
  { id: 'f_self', name: '禁忌：一次性自我', cost: 1, type: 'skill', category: 'season', seasonType: 'catalyst', description: '抽取1，按照该卡牌的费\n用抽取', imageType: 'forbidden_ph' },
  { id: 'f_malice', name: '禁忌：刻印的恶意', cost: 2, type: 'skill', category: 'season', seasonType: 'catalyst', description: '[ 主导 ]\n抽取1\n随机手牌变动 2张', imageType: 'forbidden_ph' },
  { id: 'f_algo', name: '禁忌的演算法', cost: 3, type: 'skill', category: 'season', seasonType: 'catalyst', description: '[ 消灭 / 主导 ]\n手牌中生成1张随机禁忌\n卡牌', imageType: 'forbidden_ph' },
  { id: 'f_guide', name: '禁忌：虚无的引导', cost: 1, type: 'enhance', category: 'season', seasonType: 'catalyst', description: '[ 开战 ]\n使用能力抽取时\n治愈40%\n随机战斗员压力减少1', imageType: 'forbidden_ph' },

  // 中立卡 (图片7中的普通技能)
  { id: 'n_prep', name: '准备战斗', cost: 1, type: 'skill', category: 'neutral', description: '???', imageType: 'neutral_ph' },
  { id: 'n_bag', name: '装备包', cost: 1, type: 'skill', category: 'neutral', description: '[ 消灭 / 连击 ]\n抽取2', imageType: 'neutral_ph' },
  { id: 'n_fix', name: '重新整顿', cost: 1, type: 'skill', category: 'neutral', description: '[ 消灭 ]\n抽取3', imageType: 'neutral_ph' },

  // 怪兽卡
  { id: 'm_gardener', name: '害羞的园丁', cost: 1, type: 'attack', category: 'monster', description: '伤害50%x4\n标记3', imageType: 'monster_ph' },

  // 空位
  { id: 'o1', type: 'empty', category: 'any' },
];

// --- 神之一闪 选项 ---
const divineFlashOptions = [
  { id: 'none', name: '无神闪', description: '', icon: X },
  { id: 'draw1', name: '抽取 1', description: '抽取1张牌', icon: Layers },
  { id: 'ap1', name: 'AP + 1', description: '获得1点AP', icon: Flame },
  { id: 'costMinus1', name: '费用 - 1', description: '', icon: Star } 
];

// --- 默认通用灵光一闪选项 ---
const genericAuraOptions = [
  { id: 'gen_1', name: '通用变体 I', cost: 1, type: 'attack', description: '通用灵光效果 I\n伤害提升20%', imageType: 'neutral_ph' },
  { id: 'gen_2', name: '通用变体 II', cost: 2, type: 'skill', description: '通用灵光效果 II\n获得护盾', imageType: 'neutral_ph' },
  { id: 'gen_3', name: '通用变体 III', cost: 0, type: 'ability', description: '通用灵光效果 III\n抽1张牌', imageType: 'neutral_ph' },
  { id: 'gen_4', name: '通用变体 IV', cost: 1, type: 'enhance', description: '通用灵光效果 IV\n本回合伤害+50%', imageType: 'neutral_ph' },
  { id: 'gen_5', name: '通用变体 V', cost: 3, type: 'attack', description: '通用灵光效果 V\n造成巨额伤害', imageType: 'neutral_ph' }
];

// --- 灵光一闪选项数据库 ---
const auraOptionsMap = {
  'a1': [
    { id: 'opt1_1', name: '即刻审判', cost: 1, type: 'attack', description: '伤害297%\n若手牌中有镇魂子弹，\n丢弃1张且伤害量+150%', imageType: 'girl_gun' },
    { id: 'opt1_2', name: '即刻审判', cost: 1, type: 'attack', description: '伤害242%\n若抽牌堆中有镇魂子弹，\n丢弃1张且伤害量+120%', imageType: 'girl_gun' },
    { id: 'opt1_3', name: '即刻审判', cost: 1, type: 'attack', description: '伤害242%\n若坟墓中有镇魂子弹，\n消灭1张且额外攻击1次', imageType: 'girl_gun' },
    { id: 'opt1_4', name: '即刻审判', cost: 2, type: 'attack', description: '伤害198%\n移动至弃牌堆时，对随\n机敌人造成275%的额外\n攻击', imageType: 'girl_gun' },
    { id: 'opt1_5', name: '即刻审判', cost: 1, type: 'enhance', description: '回合结束时\n对HP最低的敌人\n造成200%的额外攻击', imageType: 'girl_gun' }
  ],
  'a2': [
    { id: 'opt2_1', name: '漆黑颂诗', cost: 1, type: 'attack', description: '伤害83%x3\n按照手牌中的镇魂子弹\n数量，伤害+30%', imageType: 'girl_pray' },
    { id: 'opt2_2', name: '漆黑颂诗', cost: 1, type: 'skill', description: '抽牌堆和坟墓中\n最多3张镇魂子弹移动至手\n牌', imageType: 'girl_pray' },
    { id: 'opt2_3', name: '漆黑颂诗', cost: 1, type: 'attack', description: '伤害55%x3\n按照手牌的镇魂子弹数量\n，赋予目标标记1', imageType: 'girl_pray' },
    { id: 'opt2_4', name: '漆黑颂诗', cost: 1, type: 'attack', description: '伤害55%x3\n1回合内镇魂子弹的额外\n攻击伤害量增加100%', imageType: 'girl_pray' },
    { id: 'opt2_5', name: '漆黑颂诗', cost: 1, type: 'attack', description: '伤害55%x3\n消灭坟墓中所有镇魂子\n弹，且按照相应数量伤\n害量增加50%', imageType: 'girl_pray' }
  ],
  'a3': [
    { id: 'opt3_1', name: '吞噬命运之花', cost: 0, type: 'skill', description: '最多丢弃3张手牌\n按照其数量生成镇魂子\n弹', imageType: 'rose' },
    { id: 'opt3_2', name: '吞噬命运之花', cost: 1, type: 'skill', description: '[ 消灭 ]\n丢弃手牌中所有其他战\n斗员的卡牌\n按照相应数量\n各生成2张镇魂子弹', imageType: 'rose' },
    { id: 'opt3_3', name: '吞噬命运之花', cost: 0, type: 'skill', description: '最多丢弃2张手牌\n按照丢弃卡牌相应费用\n接下来使用的卡牌伤害\n量+40%', imageType: 'rose' },
    { id: 'opt3_4', name: '吞噬命运之花', cost: 1, type: 'skill', description: '抽取2\n若手牌中有镇魂子弹\n抽取增加1', imageType: 'rose' },
    { id: 'opt3_5', name: '吞噬命运之花', cost: 0, type: 'skill', description: '手牌中的镇魂子弹赋予\n回收', imageType: 'rose' }
  ],
  's4': [
    { id: 'opt4_1', name: '悲叹回响', cost: 1, type: 'attack', description: '伤害154%\n生成2张镇魂子弹', imageType: 'gun2' },
    { id: 'opt4_2', name: '悲叹回响', cost: 1, type: 'attack', description: '伤害154%\n生成1张镇魂子弹，并於\n弃牌堆中再生生成2张', imageType: 'gun2' },
    { id: 'opt4_3', name: '悲叹回响', cost: 1, type: 'attack', description: '伤害154%\n生成1张镇魂子弹\n从抽牌堆中丢弃2张镇魂\n子弹', imageType: 'gun2' },
    { id: 'opt4_4', name: '悲叹回响', cost: 1, type: 'skill', description: '生成3张镇魂子弹', imageType: 'gun2' },
    { id: 'opt4_5', name: '悲叹回响', cost: 1, type: 'enhance', description: '[ 开战 ]\n生成1张镇魂子弹\n回合开始时，生成1张镇\n魂子弹', imageType: 'gun2' }
  ]
};

// 默认的灵光一闪卡牌
const defaultAuraCards = [
  { id: 'a1', name: '即刻审判', cost: 1, type: 'attack', category: 'aura', description: '伤害198%\n若手牌中有镇魂子弹，\n丢弃1张且伤害量+100%', imageType: 'girl_gun', customizable: true, divineFlash: 'none' },
  { id: 'a2', name: '漆黑颂诗', cost: 1, type: 'attack', category: 'aura', description: '伤害55%x3\n按照手牌中镇魂子弹的\n数量，伤害量+20%', imageType: 'girl_pray', customizable: true, divineFlash: 'none' },
  { id: 'a3', name: '吞噬命运之花', cost: 0, type: 'skill', category: 'aura', description: '最多丢弃2张手牌\n按照其数量生成镇魂子\n弹', imageType: 'rose', customizable: true, divineFlash: 'none' },
  { id: 'a4', name: '誓死一击', cost: 1, type: 'attack', category: 'aura', description: '[保留]\n造成165% (+0%) 伤害\n将所有镇魂子弹 丢弃\n依丢弃的数量使伤害量+\n70%', imageType: 'girl_dash', customizable: false, divineFlash: 'none' }
];

// --- 工具函数 ---
const calculateDivineCard = (baseCard, divineType) => {
  let newCard = { ...baseCard, divineFlash: divineType };
  if (divineType === 'none') return newCard;
  if (divineType === 'costMinus1') {
    newCard.cost = Math.max(0, newCard.cost - 1);
  }
  if (newCard.type === 'attack') {
    newCard.description = newCard.description.replace(/(\d+)%/, (match, p1) => {
      const newVal = parseInt(p1) + 50;
      return `${newVal}%`;
    });
  }
  const divineOption = divineFlashOptions.find(opt => opt.id === divineType);
  if (divineOption && divineOption.description) {
    newCard.description += `\n[神闪] ${divineOption.description}`;
  }
  return newCard;
};

const getCardOptions = (card) => {
  if (card.transformCount && card.transformCount > 0) {
    return genericAuraOptions.map(opt => ({
      ...opt,
      name: card.name,
      imageType: card.imageType
    }));
  }

  if (auraOptionsMap[card.id]) return auraOptionsMap[card.id];
  
  const baseId = card.id.split('_copy')[0];
  if (auraOptionsMap[baseId]) return auraOptionsMap[baseId];

  const originalId = card.originalId || card.id;
  if (auraOptionsMap[originalId]) return auraOptionsMap[originalId];
  
  return genericAuraOptions.map(opt => ({
    ...opt,
    name: card.name,
    imageType: card.imageType
  }));
};


// --- 组件部分 ---

const TypeIcon = ({ type }) => {
  if (type === 'attack') return <div className="flex items-center gap-1 text-pink-500 text-xs font-bold"><span className="border border-pink-500 bg-pink-900/50 p-0.5"><Sword size={10} fill="currentColor" /></span> 攻击</div>;
  if (type === 'skill') return <div className="flex items-center gap-1 text-blue-400 text-xs font-bold"><span className="border border-blue-400 bg-blue-900/50 p-0.5 rounded-full"><Shield size={10} fill="currentColor" /></span> 技能</div>;
  if (type === 'enhance') return <div className="flex items-center gap-1 text-green-400 text-xs font-bold"><span className="border border-green-400 bg-green-900/50 p-0.5"><Zap size={10} fill="currentColor" /></span> 强化</div>;
  if (type === 'ability') return <div className="flex items-center gap-1 text-purple-400 text-xs font-bold"><span className="border border-purple-400 bg-purple-900/50 p-0.5"><Star size={10} fill="currentColor" /></span> 能力</div>;
  return null;
};

const CardArt = ({ imageType }) => {
  const getGradient = () => {
    switch(imageType) {
      case 'gun1': return 'from-purple-900 via-purple-700 to-blue-900';
      case 'hand': return 'from-indigo-900 via-purple-800 to-black';
      case 'gun2': return 'from-fuchsia-900 via-purple-800 to-black';
      case 'girl_gun': return 'from-slate-800 via-slate-600 to-emerald-900';
      case 'girl_pray': return 'from-pink-900 via-rose-800 to-orange-900';
      case 'rose': return 'from-blue-900 via-blue-800 to-indigo-900';
      case 'girl_dash': return 'from-green-900 via-teal-800 to-emerald-900';
      case 'neutral_ph': return 'from-gray-700 via-gray-600 to-gray-800';
      case 'forbidden_ph': return 'from-red-900 via-purple-900 to-black';
      case 'season2_ph': return 'from-cyan-900 via-blue-800 to-black';
      case 'monster_ph': return 'from-orange-900 via-red-800 to-gray-900';
      default: return 'from-gray-800 to-gray-900';
    }
  };

  return (
    <div className={`w-full h-32 bg-gradient-to-b ${getGradient()} relative overflow-hidden`}>
       <div className="absolute inset-0 opacity-50 mix-blend-overlay" 
            style={{backgroundImage: 'radial-gradient(circle at center, white 0%, transparent 70%)'}}></div>
       <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-80"></div>
       
       <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-4xl select-none">
          {imageType === 'girl_gun' && <Sword size={64} className="rotate-45" />}
          {imageType === 'rose' && <Diamond size={64} />}
          {imageType === 'girl_pray' && <Zap size={64} />}
          {imageType === 'neutral_ph' && <Hexagon size={64} />}
          {imageType === 'forbidden_ph' && <Skull size={64} />}
          {imageType === 'season2_ph' && <Star size={64} />}
          {imageType === 'monster_ph' && <Ghost size={64} />}
       </div>
    </div>
  );
};

const EmptyCardSlot = () => (
  <div className="relative w-full aspect-[3/4.5] rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/30 flex flex-col items-center justify-center text-gray-600 transition-colors hover:border-gray-500 hover:text-gray-400 cursor-pointer group">
    <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
    <span className="text-[10px] font-medium">添加</span>
  </div>
);

// Card 组件
const Card = ({ 
  data, onClick, isSelected, showSelectHint, readOnly, 
  onReset, isModified, onAdd, isAddedToArchive, isRemovedFromArchive,
  isArchiveCard, 
  onDelete, onRemove, onCopy, onTransform, onSpecialRemove, 
  onRestore 
}) => {
  if (data.type === 'empty') return <EmptyCardSlot />;
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const isDivine = data.divineFlash && data.divineFlash !== 'none';
  const isStarter = data.category === 'starter'; 
  const isCopy = data.isCopy;
  const isSpecialRemoved = data.specialRemoved;
  
  let borderColorClass = "border-gray-600";
  if (data.category === 'season') borderColorClass = "border-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.3)]";
  if (data.category === 'monster') borderColorClass = "border-red-800 shadow-[0_0_10px_rgba(153,27,27,0.3)]";
  if (data.category === 'neutral') borderColorClass = "border-gray-500";

  const isAuraCard = data.id && data.id.startsWith('a');
  const showRemovedState = isAuraCard && isRemovedFromArchive;
  const showAddedState = isAuraCard && isAddedToArchive;
  const isDisabled = showRemovedState || showAddedState;

  return (
    <div 
      className={`
        relative w-full aspect-[3/4.5] rounded-lg overflow-hidden flex flex-col select-none transition-all duration-300 group
        ${isSelected ? 'ring-2 ring-yellow-400 scale-105' : 'ring-transparent'}
        ${isDivine ? 'ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]' : `border ${borderColorClass} shadow-lg`}
        bg-gray-900 
      `}
      onMouseLeave={() => setShowActionsMenu(false)}
    >
      {/* 神闪特效边框 */}
      {isDivine && (
        <div className="absolute inset-0 border-[2px] border-amber-400/50 rounded-lg pointer-events-none z-30 animate-pulse"></div>
      )}

      {/* 转换次数标记 */}
      {data.transformCount > 0 && (
        <div className="absolute top-0 right-0 z-30 bg-blue-600 text-white text-[8px] px-1 rounded-bl flex items-center gap-0.5 shadow-md">
          <RefreshCw size={8} /> {data.transformCount}
        </div>
      )}

      {/* 复制标记 */}
      {isCopy && (
        <div className="absolute top-0 left-0 z-30 bg-cyan-600 text-white text-[8px] px-1 rounded-br flex items-center gap-0.5 shadow-md">
          <Files size={8} /> 复制
        </div>
      )}

      {/* 特殊移除标记 */}
      {isSpecialRemoved && (
        <div className="absolute top-0 left-0 z-30 bg-fuchsia-600 text-white text-[8px] px-1 rounded-br flex items-center gap-0.5 shadow-md">
          <Sparkles size={8} /> 特殊
        </div>
      )}

      {/* 重置按钮 */}
      {onReset && isModified && !readOnly && !isArchiveCard && (
        <button 
          onClick={(e) => { e.stopPropagation(); onReset(); }}
          className="absolute top-0 right-0 z-50 bg-red-500 hover:bg-red-600 text-white p-0.5 rounded-bl-md shadow-md transition-colors group/reset"
          title="重置为默认"
        >
          <RotateCcw size={10} className="group-hover/reset:-rotate-180 transition-transform duration-500" />
        </button>
      )}
      
      {/* --- 存档卡牌的操作遮罩 --- */}
      {isArchiveCard && (
        <div className={`absolute inset-0 bg-black/80 z-40 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 ${showActionsMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'}`}>
           {!showActionsMenu ? (
             <button 
               onClick={() => setShowActionsMenu(true)}
               className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold"
             >
               <Settings size={14} /> 操作
             </button>
           ) : (
             <div className="flex flex-col gap-2 w-full px-4 animate-in fade-in zoom-in duration-200">
                {/* 允许删除：只要不是原始起始卡牌，或者它是起始卡牌的“复制品” */}
                {(!isStarter || isCopy) && (
                  <button onClick={onDelete} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-[10px] w-full">
                    <Trash2 size={12} /> 删除
                  </button>
                )}
                <button onClick={onRemove} className="flex items-center justify-center gap-1 bg-orange-600 hover:bg-orange-500 text-white px-2 py-1 rounded text-[10px] w-full">
                  <LogOut size={12} /> 移除
                </button>
                <button onClick={onSpecialRemove} className="flex items-center justify-center gap-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-2 py-1 rounded text-[10px] w-full">
                  <Sparkles size={12} /> 特殊移除
                </button>
                <button onClick={onCopy} className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-[10px] w-full">
                  <Copy size={12} /> 复制
                </button>
                <button onClick={onTransform} className="flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-[10px] w-full">
                  <RefreshCw size={12} /> 转换
                </button>
                <button onClick={() => setShowActionsMenu(false)} className="mt-1 text-gray-400 hover:text-white text-[10px] underline">取消</button>
             </div>
           )}
        </div>
      )}

      {/* --- 移除区卡牌的恢复按钮 --- */}
      {onRestore && (
        <div className="absolute inset-0 bg-black/60 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center pointer-events-none group-hover:pointer-events-auto">
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 onRestore();
               }}
               className="flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg shadow-lg transform hover:scale-105 transition-all text-xs font-bold"
             >
               <Undo2 size={14} /> 恢复
             </button>
        </div>
      )}

      {/* --- 编辑区卡牌的悬停遮罩 --- */}
      {!readOnly && !isArchiveCard && !onRestore && (
        <div className="absolute inset-0 bg-black/60 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 pointer-events-none group-hover:pointer-events-auto">
           {onAdd && (
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 if (isDisabled) return;
                 onAdd();
               }}
               disabled={isDisabled} 
               className={`
                 flex items-center gap-1 px-3 py-1.5 rounded-lg shadow-lg transition-all text-xs font-bold
                 ${isDisabled 
                   ? showRemovedState ? 'bg-gray-700 text-red-400 cursor-not-allowed border border-red-900' : 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                   : 'bg-green-600 hover:bg-green-500 text-white transform hover:scale-105'}
               `}
             >
               {showRemovedState ? (<><XCircle size={14} /> 已移除</>) : showAddedState ? (<><Check size={14} /> 已添加</>) : (<><Plus size={14} /> 添加</>)}
             </button>
           )}
           {data.customizable && (
             <button 
               onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}
               className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg shadow-lg transform hover:scale-105 transition-all text-xs font-bold"
             >
               <Settings size={14} /> 配置
             </button>
           )}
        </div>
      )}

      {/* 顶部栏 */}
      <div className={`relative z-10 bg-gradient-to-r ${isDivine ? 'from-amber-900/90 to-purple-900/90' : 'from-blue-900/90 to-purple-900/90'} h-6 flex items-center px-1 border-b border-purple-500/50`}>
        <div className={`w-4 h-4 flex items-center justify-center ${isDivine ? 'bg-amber-600 border-amber-300' : 'bg-blue-600 border-blue-300'} text-white font-bold text-xs shadow-md border skew-x-[-10deg] ml-1`}>
          <span className="skew-x-[10deg]">{data.cost}</span>
        </div>
        <div className={`flex-1 text-center text-white text-[9px] font-bold drop-shadow-md truncate px-1 ${isDivine ? 'text-amber-100' : ''}`}>
          {data.name}
        </div>
        {isDivine && <Star size={8} className="text-amber-400 mr-1 animate-spin-slow" fill="currentColor" />}
      </div>

      {/* 顶部类型栏 */}
      <div className="absolute top-7 left-1 z-10 bg-black/60 backdrop-blur-sm px-1 py-0.5 rounded text-[8px] border border-gray-600">
        <TypeIcon type={data.type} />
      </div>
      
      {/* 神闪标签 */}
      {isDivine && (
        <div className="absolute top-7 right-1 z-10 bg-amber-500/90 text-black px-1 py-0.5 rounded text-[8px] font-bold border border-amber-300 shadow-sm">
          神闪
        </div>
      )}

      {/* 插画区域 */}
      <div className="flex-1 relative bg-gray-800 min-h-0">
        <CardArt imageType={data.imageType || 'girl_gun'} />
      </div>

      {/* 描述区域 - 上下居中 */}
      <div className={`relative h-[45%] bg-black/90 text-center flex flex-col items-center justify-center px-1 z-10 border-t ${isDivine ? 'border-amber-500/30' : 'border-purple-500/30'}`}>
        <p className={`text-[10px] leading-tight whitespace-pre-wrap font-medium ${isDivine ? 'text-amber-50' : 'text-gray-200'}`}>
          {data.description}
        </p>
        <div className={`text-[6px] mt-1 ${isDivine ? 'text-amber-500' : 'text-yellow-500/50'}`}>✦ ✦ ✦</div>
      </div>
    </div>
  );
};

// Modal (配置灵光一闪)
const Modal = ({ isOpen, onClose, onSelect, currentOptions }) => {
  const [selectedDivine, setSelectedDivine] = useState('none');
  if (!isOpen) return null;
  const processedOptions = currentOptions.map(opt => calculateDivineCard(opt, selectedDivine));
  const handleConfirm = (option) => { onSelect(option); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-hidden">
      <div className="w-full max-w-7xl h-[90vh] flex flex-col relative animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-4 flex-shrink-0">
          <h2 className="text-white text-2xl font-bold tracking-widest mb-1 flex items-center justify-center gap-2">
            <Zap className="text-purple-400" fill="currentColor" /> 灵光一闪 <Zap className="text-purple-400" fill="currentColor" />
          </h2>
          <p className="text-gray-400 text-xs">选择一个灵光变体，可叠加“神闪”效果</p>
        </div>
        <button onClick={onClose} className="absolute top-0 right-0 text-white hover:text-red-400 p-2 transition-colors"><X size={32} /></button>
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700 flex-shrink-0">
          <div className="text-amber-400 text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Star size={16} fill="currentColor" /> 配置神之一闪 (额外效果)
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {divineFlashOptions.map(opt => {
              const isActive = selectedDivine === opt.id;
              const Icon = opt.icon;
              return (
                <button key={opt.id} onClick={() => setSelectedDivine(opt.id)} className={`relative flex items-center gap-3 px-5 py-3 rounded-lg border transition-all duration-200 ${isActive ? 'bg-amber-900/40 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:border-gray-500'}`}>
                  <Icon size={18} /><div className="text-left"><div className="font-bold text-sm">{opt.name}</div>{opt.description && <div className="text-[10px] opacity-70">{opt.description}</div>}</div>{isActive && (<div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>)}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden"><div className="flex flex-wrap justify-center gap-6 pb-8">{processedOptions.map((option) => (<div key={option.id} className="w-48 flex-shrink-0 group relative"><div className="absolute -inset-4 bg-gradient-to-b from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:via-purple-600/20 transition-all rounded-xl"></div><Card data={option} onClick={() => handleConfirm(option)} customizable={false} /><button onClick={() => handleConfirm(option)} className="mt-3 w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold rounded shadow-lg border border-purple-400/50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"><span>确认选择</span></button></div>))}</div></div>
      </div>
    </div>
  );
};

// Updated Transform Modal with Filters and 8 cols
const TransformModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;
  
  const [filter, setFilter] = useState('all');
  const [seasonSubFilter, setSeasonSubFilter] = useState('catalyst');
  const validTargets = initialOtherCards.filter(c => c.type !== 'empty');

  const filteredTargets = useMemo(() => {
    return validTargets.filter(card => {
      if (filter === 'all') return ['neutral', 'monster', 'season'].includes(card.category);
      if (filter === 'season') return card.category === 'season' && card.seasonType === seasonSubFilter;
      return card.category === filter;
    });
  }, [validTargets, filter, seasonSubFilter]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-hidden">
      <div className="w-full max-w-5xl h-[80vh] flex flex-col relative animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-4 flex-shrink-0">
          <h2 className="text-white text-2xl font-bold tracking-widest mb-1 flex items-center justify-center gap-2">
            <RefreshCw className="text-indigo-400" /> 转换卡牌
          </h2>
          <p className="text-gray-400 text-xs">选择一张目标卡牌进行转换</p>
        </div>
        
        <div className="flex flex-col gap-2 mb-4 px-4 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center">
                {['all', 'neutral', 'monster', 'season'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        {f === 'all' ? '所有' : f === 'neutral' ? '中立' : f === 'monster' ? '怪兽' : '赛季'}
                    </button>
                ))}
            </div>
            {filter === 'season' && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => setSeasonSubFilter('catalyst')} className={`px-3 py-0.5 rounded-md text-[10px] font-bold border transition-all ${seasonSubFilter === 'catalyst' ? 'bg-purple-900/60 border-purple-500 text-purple-100' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>禁忌的催化剂</button>
                    <button onClick={() => setSeasonSubFilter('season_2')} className={`px-3 py-0.5 rounded-md text-[10px] font-bold border transition-all ${seasonSubFilter === 'season_2' ? 'bg-blue-900/60 border-blue-500 text-blue-100' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>赛季名2</button>
                </div>
            )}
        </div>

        <button onClick={onClose} className="absolute top-0 right-0 text-white hover:text-red-400 p-2 transition-colors"><X size={32} /></button>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gray-900/30 rounded-lg mx-4 mb-4 border border-gray-800">
          <div className="grid grid-cols-8 gap-3">
            {filteredTargets.map((card) => (
              <div key={card.id} className="group relative transform hover:scale-105 transition-transform duration-200">
                 <Card data={card} customizable={false} readOnly={true} />
                 <button 
                   onClick={() => onSelect(card)} 
                   className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-2 border-indigo-500 rounded-lg cursor-pointer"
                 >
                    <span className="bg-indigo-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-lg">选择</span>
                 </button>
              </div>
            ))}
             {filteredTargets.length === 0 && (
                <div className="col-span-8 py-10 text-center text-gray-500 italic">没有找到符合条件的卡牌</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChaosDeckBuilder = function () {
  const [starterCardsSource, setStarterCardsSource] = useState(initialStarterCards);
  const [archiveCards, setArchiveCards] = useState([...initialStarterCards]);
  
  const [auraCards, setAuraCards] = useState(defaultAuraCards);
  const [otherCards] = useState(initialOtherCards); 
  const [removedCards, setRemovedCards] = useState([]); 

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isTransformModalOpen, setIsTransformModalOpen] = useState(false); 
  const [editingCardId, setEditingCardId] = useState(null); 
  const [currentModalOptions, setCurrentModalOptions] = useState([]);
  
  const [otherFilter, setOtherFilter] = useState('all');
  const [seasonSubFilter, setSeasonSubFilter] = useState('catalyst');

  const otherCardsOperationDeck = archiveCards.filter(card => {
     const isOriginalAura = card.id.startsWith('a') && !card.isCopy; 
     const isStarter = card.category === 'starter'; 

     const isOtherCategory = ['neutral', 'monster', 'season'].includes(card.category);
     
     const isAuraCopy = (card.id.startsWith('a') && card.isCopy);

     return !isOriginalAura && !isStarter && (isOtherCategory || isAuraCopy);
  });

  const filteredOtherCards = useMemo(() => {
    return otherCards.filter(card => {
      if (card.category === 'any') return true;
      if (otherFilter === 'all') return card.category === 'neutral' || card.category === 'monster' || card.category === 'season';
      if (otherFilter === 'season') return card.category === 'season' && card.seasonType === seasonSubFilter;
      return card.category === otherFilter;
    });
  }, [otherCards, otherFilter, seasonSubFilter]);

  const handleConfigureClick = (card) => {
    const options = getCardOptions(card);
    if (options) {
      setCurrentModalOptions(options);
      setEditingCardId(card.id); 
      setIsModalOpen(true);
    }
  };

  const handleAuraSelect = (selectedOption) => {
    const originalId = editingCardId;
    const updatedCardData = {
      ...selectedOption,
      id: originalId,
      originalId: originalId,
      customizable: true,
      hasTriggeredAura: true 
    };

    setAuraCards(prev => prev.map(c => c.id === originalId ? { ...c, ...updatedCardData, imageType: selectedOption.imageType || c.imageType } : c));
    setStarterCardsSource(prev => prev.map(c => c.id === originalId ? { ...c, ...updatedCardData, imageType: selectedOption.imageType || c.imageType } : c));
    setArchiveCards(prev => prev.map(c => c.id === originalId ? { ...c, ...updatedCardData, imageType: selectedOption.imageType || c.imageType } : c));

    setIsModalOpen(false);
  };

  const handleTransformClick = (cardId) => {
    setEditingCardId(cardId);
    setIsTransformModalOpen(true);
  };

  const handleTransformConfirm = (targetCardTemplate) => {
     const cardId = editingCardId;
     
     setArchiveCards(prev => {
        const newArchive = [...prev];
        const cardIndex = newArchive.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return prev;
        
        const originalCard = newArchive[cardIndex];
        const newTransformCount = (originalCard.transformCount || 0) + 1;

        const transformedCard = {
            ...originalCard, 
            name: targetCardTemplate.name,
            cost: targetCardTemplate.cost,
            type: targetCardTemplate.type,
            description: targetCardTemplate.description,
            imageType: targetCardTemplate.imageType,
            category: targetCardTemplate.category, // 类别变更为目标卡牌的类别
            seasonType: targetCardTemplate.seasonType,
            transformCount: newTransformCount,
            customizable: true, 
            divineFlash: 'none' 
        };

        newArchive[cardIndex] = transformedCard;
        
        return newArchive;
     });
     
     setIsTransformModalOpen(false);
  };

  const handleResetCard = (cardId) => {
    let defaultData = defaultAuraCards.find(c => c.id === cardId);

    // 如果不在默认灵光卡中，尝试在初始卡牌中找 (例如 s4)
    if (!defaultData) {
        defaultData = initialStarterCards.find(c => c.id === cardId);
    }

    if (!defaultData) {
        const baseId = cardId.split('_copy')[0];
        defaultData = defaultAuraCards.find(c => c.id === baseId);

        if (!defaultData) {
           const templateId = cardId.split('_saved_')[0];
           defaultData = initialOtherCards.find(c => c.id === templateId);
        }

        if (defaultData) {
           defaultData = { 
             ...defaultData, 
             customizable: true, 
             divineFlash: 'none', 
             id: cardId,
             isCopy: cardId.includes('_copy'), 
             hasTriggeredAura: false 
           };
        }
    } else {
       defaultData = { ...defaultData, hasTriggeredAura: false };
    }
    
    if (defaultData) {
        setAuraCards(prev => prev.map(c => c.id === cardId ? defaultData : c));
        setStarterCardsSource(prev => prev.map(c => c.id === cardId ? defaultData : c)); // 重置初始卡牌
        setArchiveCards(prev => prev.map(c => c.id === cardId ? defaultData : c));
    }
  };

  const handleAddCardToArchive = (card) => {
    const isAuraCard = card.id.startsWith('a');
    if (isAuraCard) {
      if (checkIsRemoved(card.id)) return; 
      if (archiveCards.some(c => c.id === card.id)) return; 
      setArchiveCards(prev => [...prev, card]);
    } else {
      const newCard = { 
          ...card, 
          id: `${card.id}_saved_${Date.now()}`, 
          customizable: true, 
          divineFlash: 'none' 
      };
      setArchiveCards(prev => [...prev, newCard]);
    }
  };

  const handleDeleteSaved = (cardId) => {
    setArchiveCards(prev => prev.filter(c => c.id !== cardId));
  };

  const handleRemoveSaved = (card) => {
    setArchiveCards(prev => prev.filter(c => c.id !== card.id));
    setRemovedCards(prev => [...prev, card]);
  };

  const handleSpecialRemoveSaved = (card) => {
    setArchiveCards(prev => prev.filter(c => c.id !== card.id));
    setRemovedCards(prev => [...prev, { ...card, specialRemoved: true }]);
  };

  const handleCopySaved = (card) => {
    const newCard = { 
        ...card, 
        id: `${card.id.split('_copy')[0]}_copy_${Date.now()}`,
        isCopy: true, 
        hasTriggeredAura: false 
    };
    setArchiveCards(prev => [...prev, newCard]);
  };

  const handleRestoreCard = (card) => {
    const restoredCard = { ...card, specialRemoved: false };
    setRemovedCards(prev => prev.filter(c => c.id !== card.id));
    setArchiveCards(prev => [...prev, restoredCard]);
  };

  const checkIsAdded = (cardId) => {
    return archiveCards.some(c => c.id === cardId);
  };

  const checkIsRemoved = (cardId) => {
    return removedCards.some(c => c.id === cardId);
  };

  const FilterButton = ({ label, isActive, onClick }) => (
    <button 
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600 hover:text-gray-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-100 p-4 md:p-8 font-sans select-none overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* --- 1. 存档资料区域 --- */}
        <section className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-6 shadow-2xl backdrop-blur-sm min-h-[160px]">
          <div className="flex items-center gap-3 mb-4 text-blue-300 border-b border-gray-600 pb-2">
            <FileText size={24} />
            <h2 className="text-xl font-bold tracking-widest">存档资料 (当前卡组: {archiveCards.length}张)</h2>
            <div className="ml-auto text-xs text-gray-500 flex items-center gap-1">
              <Save size={12} /> 数据实时同步
            </div>
          </div>
          <div className="grid grid-cols-8 gap-3">
            {archiveCards.map((card, idx) => (
              <div key={card.id} className="opacity-90 hover:opacity-100 transition-opacity">
                <Card 
                  data={card} 
                  isArchiveCard={true} 
                  readOnly={true}      
                  onDelete={() => handleDeleteSaved(card.id)}
                  onRemove={() => handleRemoveSaved(card)}
                  onSpecialRemove={() => handleSpecialRemoveSaved(card)}
                  onCopy={() => handleCopySaved(card)}
                  onTransform={() => handleTransformClick(card.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* --- 2. 中间操作区 --- */}
        <div className="grid grid-cols-2 gap-6">
            <section className="bg-indigo-900/10 rounded-xl p-4 border border-indigo-500/20 min-h-[200px]">
              <div className="flex items-center justify-between mb-3 border-l-4 border-indigo-500 pl-3 py-1 bg-gradient-to-r from-indigo-900/30 to-transparent">
                 <div className="flex items-center gap-2 text-indigo-200"><Settings size={18} /><h3 className="text-lg font-bold tracking-wider">其他卡牌操作区</h3></div>
                 <div className="text-xs text-gray-400">已添加/转换/复制的非原始卡牌</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {otherCardsOperationDeck.map((card) => (
                  <div key={card.id} className="relative group">
                     <Card 
                       data={card} 
                       onClick={() => handleConfigureClick(card)} 
                       onReset={() => handleResetCard(card.id)}
                       isModified={card.hasTriggeredAura || (card.divineFlash && card.divineFlash !== 'none')} 
                     />
                     <div className="absolute -bottom-8 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="text-[10px] text-indigo-300 bg-indigo-900/80 px-1.5 py-0.5 rounded-full border border-indigo-500/30 whitespace-nowrap">点击配置</span>
                     </div>
                  </div>
                ))}
                {otherCardsOperationDeck.length === 0 && (
                    <div className="col-span-4 py-8 text-center text-gray-600 text-xs italic">暂无其他卡牌，请从右下角添加</div>
                )}
              </div>
            </section>

            <section className="bg-red-900/10 rounded-xl p-4 border border-red-500/20 min-h-[200px]">
              <div className="flex items-center justify-between mb-3 border-l-4 border-red-500 pl-3 py-1 bg-gradient-to-r from-red-900/30 to-transparent">
                 <div className="flex items-center gap-2 text-red-200"><LogOut size={18} /><h3 className="text-lg font-bold tracking-wider">移除区</h3></div>
                 <div className="text-xs text-gray-400">本局已移除的卡牌</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                 {removedCards.map((card, idx) => (
                   <div key={`${card.id}_removed_${idx}`} className="opacity-70 grayscale hover:grayscale-0 transition-all">
                     <Card 
                       data={card} 
                       readOnly={true} 
                       onRestore={() => handleRestoreCard(card)} 
                     />
                   </div>
                 ))}
                 {removedCards.length === 0 && (
                    <div className="col-span-4 py-8 text-center text-gray-600 text-xs italic">空空如也</div>
                )}
              </div>
            </section>
        </div>

        {/* --- 3. 底部源区域 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* 左侧源 */}
          <div className="flex flex-col gap-6">
            <section className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-3 border-l-4 border-gray-500 pl-3 py-1 bg-gradient-to-r from-gray-800/50 to-transparent">
                 <div className="flex items-center gap-2 text-gray-200"><Diamond size={18} /><h3 className="text-lg font-bold tracking-wider">起始卡牌</h3></div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {starterCardsSource.map((card) => {
                   const isModified = card.hasTriggeredAura || (card.divineFlash && card.divineFlash !== 'none');
                   // 初始卡牌是否显示配置按钮：只有可配置的才显示
                   return (
                      <div key={card.id} className="relative group perspective-1000">
                         <Card 
                            data={card} 
                            readOnly={!card.customizable} // 如果可配置，则非只读（以显示悬停菜单）
                            onClick={card.customizable ? () => handleConfigureClick(card) : undefined}
                            showSelectHint={false}
                            onReset={card.customizable ? () => handleResetCard(card.id) : undefined}
                            isModified={isModified}
                            // 初始卡牌已经在存档中，不显示添加按钮
                         />
                          {/* 可配置的初始卡牌提示 */}
                          {card.customizable && !isModified && (
                            <div className="absolute -bottom-8 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                              <span className="text-[10px] text-purple-300 bg-purple-900/80 px-1.5 py-0.5 rounded-full border border-purple-500/30 whitespace-nowrap">
                                点击配置
                              </span>
                            </div>
                          )}
                      </div>
                   );
                })}
              </div>
            </section>
            
            <section className="bg-purple-900/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3 border-l-4 border-purple-500 pl-3 py-1 bg-gradient-to-r from-purple-900/30 to-transparent">
                 <div className="flex items-center gap-2 text-purple-200"><Zap size={18} /><h3 className="text-lg font-bold tracking-wider">灵光一闪</h3></div>
                 <div className="text-xs text-gray-400 mr-4 flex items-center gap-1"><MousePointerClick size={12} /> 配置卡牌</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {auraCards.map((card, index) => {
                  const isModified = card.hasTriggeredAura || (card.divineFlash && card.divineFlash !== 'none');
                  const isAdded = checkIsAdded(card.id);
                  const isRemoved = checkIsRemoved(card.id); 
                  
                  return (
                    <div key={card.id} className="relative group perspective-1000">
                      <Card 
                        data={card} 
                        onClick={() => handleConfigureClick(card)}
                        showSelectHint={false} 
                        onReset={() => handleResetCard(card.id)}
                        isModified={isModified}
                        onAdd={() => handleAddCardToArchive(card)}
                        isAddedToArchive={isAdded}
                        isRemovedFromArchive={isRemoved}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* 右侧源 */}
          <div className="h-full">
            <section className="h-full bg-gray-800/20 rounded-xl p-4 border border-gray-700/30 flex flex-col">
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex items-center justify-between border-l-4 border-blue-500 pl-3 py-1 bg-gradient-to-r from-blue-900/30 to-transparent">
                   <div className="flex items-center gap-2 text-blue-200"><Box size={18} /><h3 className="text-lg font-bold tracking-wider">其他卡牌库</h3></div>
                   <Filter size={16} className="text-blue-400 mr-4" />
                </div>
                <div className="flex gap-2 px-2 overflow-x-auto pb-1 scrollbar-hide">
                  <FilterButton label="所有" isActive={otherFilter === 'all'} onClick={() => setOtherFilter('all')} />
                  <FilterButton label="中立" isActive={otherFilter === 'neutral'} onClick={() => setOtherFilter('neutral')} />
                  <FilterButton label="怪兽" isActive={otherFilter === 'monster'} onClick={() => setOtherFilter('monster')} />
                  <FilterButton label="赛季" isActive={otherFilter === 'season'} onClick={() => setOtherFilter('season')} />
                </div>
                {otherFilter === 'season' && (
                  <div className="flex gap-2 px-2 mt-1 overflow-x-auto pb-1 scrollbar-hide animate-in fade-in slide-in-from-top-2 duration-200">
                     <div className="flex items-center text-gray-500 mr-1"><RotateCcw size={12} className="rotate-90" /></div>
                     <button onClick={() => setSeasonSubFilter('catalyst')} className={`px-3 py-0.5 rounded-md text-[10px] font-bold border transition-all ${seasonSubFilter === 'catalyst' ? 'bg-purple-900/60 border-purple-500 text-purple-100' : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'}`}>禁忌的催化剂</button>
                     <button onClick={() => setSeasonSubFilter('season_2')} className={`px-3 py-0.5 rounded-md text-[10px] font-bold border transition-all ${seasonSubFilter === 'season_2' ? 'bg-blue-900/60 border-blue-500 text-blue-100' : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'}`}>赛季名2</button>
                  </div>
                )}
              </div>
              <div className="flex-1 grid grid-cols-4 gap-2 content-start overflow-y-auto pr-1 min-h-[300px]">
                 {filteredOtherCards.map((card) => (
                   <Card key={card.id} data={card} onAdd={() => handleAddCardToArchive(card)} />
                 ))}
              </div>
            </section>
          </div>

        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAuraSelect}
        currentOptions={currentModalOptions}
      />
      
      <TransformModal 
        isOpen={isTransformModalOpen} 
        onClose={() => setIsTransformModalOpen(false)} 
        onSelect={handleTransformConfirm} 
      />

    </div>
  );
}

// --- 自动生成的挂载代码 ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ChaosDeckBuilder />);
