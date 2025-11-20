const { useState, useEffect } = React;

const AppCard = ({ title, description, link, icon, color }) => (
    <a 
        href={link}
        className="block group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
    >
        <div className={`h-2 w-full ${color}`}></div>
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-2xl`}>
                    {icon}
                </div>
                <span className="text-gray-300 group-hover:text-gray-400">→</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
        </div>
    </a>
);

const App = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const apps = [
        {
            title: "玩法demo",
            description: "",
            link: "./methodverification.html", 
            icon: "🎮",
            color: "bg-purple-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <div className={`max-w-5xl mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                
                {/* 头部 */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        React <span className="text-blue-600">Playground</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        导航页面
                    </p>
                </header>

                {/* 卡片网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app, index) => (
                        <AppCard key={index} {...app} />
                    ))}
                    
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[200px] text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors cursor-help">
                        <span className="text-4xl mb-2">+</span>
                        <p className="font-medium">其他</p>
                        <p className="text-xs mt-2 max-w-[200px]">
                            快了...
                        </p>
                    </div>
                </div>

                <footer className="mt-16 text-center text-gray-400 text-sm">
                    Hosted on GitHub Pages
                </footer>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
