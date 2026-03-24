import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldX, Home, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AdminAuthGuard({ children }) {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-10 h-10 border-3 border-[#635bff] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">권한 확인 중...</p>
        </motion.div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ShieldX className="w-10 h-10 text-red-500" />
          </motion.div>

          <h1 className="text-2xl font-black text-gray-900 mb-2">
            접근 권한이 없습니다
          </h1>
          <p className="text-gray-500 mb-8">
            {!user
              ? "로그인이 필요한 페이지입니다."
              : "이 페이지는 관리자만 접근할 수 있습니다."
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
            >
              <Home className="w-4 h-4" />
              홈으로
            </button>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#635bff] hover:bg-[#5851e8] text-white font-bold rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                로그인
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return children;
}
