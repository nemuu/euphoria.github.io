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
            title: "demo",
            description: "",
            link: "./methodverification.html",
            icon: "🎮",
            color: "bg-purple-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex flex-col justify-center items-center">
            <div className={`max-w-5xl w-full mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                
                {/* 头部 */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        {/* 工 具 */}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        点击下方的卡片跳转。
                    </p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app, index) => (
                        <AppCard key={index} {...app} />
                    ))}
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
