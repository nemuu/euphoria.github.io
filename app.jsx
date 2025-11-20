const { useState, useEffect } = React;

// 导航卡片组件
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

// 主导航页面
const App = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 这里定义你的应用列表
    const apps = [
        {
            title: "验证demo",
            description: "",
            link: "./methodverification.html",  // 对应下面创建的 HTML 文件
            icon: "🎮",
            color: "bg-purple-500"
        },
        // {
        //     title: "待办事项清单",
        //     description: "一个简单的 Todo List (示例链接)。",
        //     link: "./todo.html", // 这是一个假设的链接，你需要创建 todo.html 和 Todo.jsx
        //     icon: "📝",
        //     color: "bg-green-500"
        // },
        // {
        //     title: "计算器",
        //     description: "基础数学计算功能 (示例链接)。",
        //     link: "./calc.html",
        //     icon: "🧮",
        //     color: "bg-orange-500"
        // }
    ];
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
