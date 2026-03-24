import { useEffect } from "react";
import { usePartyStore } from "../../store/party/partyStore";
import { useThemeStore } from "../../store/themeStore";

export default function ServiceTypeFilter({ selectedProductId, onSelect }) {
    const products = usePartyStore((state) => state.products);
    const loadProducts = usePartyStore((state) => state.loadProducts);
    const { theme } = useThemeStore();

    useEffect(() => {
        if (!products.length) {
            loadProducts();
        }
    }, [products, loadProducts]);

    const getSelectStyle = () => {
        switch (theme) {
            case 'pop':
                return 'bg-white text-black border border-gray-200 hover:bg-gray-50 focus:ring-pink-500/20';
            case 'dark':
                return 'bg-[#0F172A] text-white border border-gray-700 hover:bg-gray-800 focus:ring-[#635bff]/20';
            case 'christmas':
                return 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 focus:ring-[#c41e3a]/20';
            default:
                return 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 focus:ring-[#635bff]/20';
        }
    };

    return (
        <div className="relative">
            <select
                value={selectedProductId || ""}
                onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
                className={`appearance-none text-sm font-bold rounded-xl pl-4 pr-10 py-2 focus:outline-none focus:ring-2 transition-all cursor-pointer min-w-[140px] ${getSelectStyle()}`}
            >
                <option value="">OTT 전체</option>
                {products.map((product) => (
                    <option key={product.productId} value={product.productId}>
                        {product.productName}
                    </option>
                ))}
            </select>
            {/* Custom Arrow Icon */}
            <div className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
