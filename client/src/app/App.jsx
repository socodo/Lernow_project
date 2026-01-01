import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import AppRouter from "./router/AppRouter";
import ScrollToTop from "../shared/components/ScrollToTop";
import { AdminProvider } from "../features/admin/AdminContext";
import { AppDataProvider } from "../shared/contexts/AppDataContext";
import useUserStore from "../store/userStore";
import { refreshAccessToken } from "../utils/tokenHelper";

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { setAccessToken, logout } = useUserStore.getState();

      // Kiểm tra localStorage có isAuthenticated không
      const wasAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";

      if (wasAuthenticated) {
        try {
          // Thử refresh token (dùng cookie refreshToken)
          const newToken = await refreshAccessToken();
          setAccessToken(newToken);
          // Giữ isAuthenticated = true
          console.log("✅ Token refreshed successfully");
        } catch (error) {
          console.error("❌ Refresh token failed:", error);
          // RefreshToken cookie không còn (đóng browser) hoặc hết hạn → logout
          logout();
        }
      }

      setIsInitializing(false);
    };

    initAuth();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppDataProvider>
        <AdminProvider>
          <AppRouter />
        </AdminProvider>
      </AppDataProvider>
    </BrowserRouter>
  );
}

export default App;
