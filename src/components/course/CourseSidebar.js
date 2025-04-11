const CourseSidebar = ({ tabs, activeTab, setActiveTab }) => (
    <div className="w-56 p-4 bg-white border-r border-gray-200">
        <nav className="space-y-1">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;

                return (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                        {tab.name}
                    </button>
                );
            })}
        </nav>
    </div>
);

export default CourseSidebar;