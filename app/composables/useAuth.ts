import type { ApiResponse, AuthResponse } from "~/types";

const tokenStorageKey = "auth.token_data"

export const useAuth = () => {
  const token = useState<string>("auth.token", () => {
    if (import.meta.client) {
      const stored = localStorage.getItem(tokenStorageKey)
      if (stored){
        try{
          const {value, expiresAt} = JSON.parse(stored)
          if (new Date().getTime() < new Date(expiresAt).getTime()) {
            return value;
          } else {
            localStorage.removeItem(tokenStorageKey);
          }
        } catch (e) {
          console.error("解析 localStorage 失败", e);
        }
      }
    }
    return "";
  });
  const isLoggedIn = useState<boolean>("auth.isLoggedIn", () => !!token.value);
  const showLoginDialog = useState<boolean>("auth.showLoginDialog", () => false);

  const openLogin = () => {
    showLoginDialog.value = true;
  };

  const closeLogin = () => {
    showLoginDialog.value = false;
  };

  const login = async (credentials: { username: string; password: string }) => {
    const config = useRuntimeConfig()
    const res = await $fetch<ApiResponse<AuthResponse>>(`${config.public.apiClientBase}/login`, {
      method: "POST",
      body: credentials,
    });
    token.value = res.data.access_token;
    isLoggedIn.value = true;
    showLoginDialog.value = false;
    if (import.meta.client) {
      localStorage.setItem(
        "auth.token_data",
        JSON.stringify({
          value: res.data.access_token,
          expiresAt: res.data.expires_at,
        })
      );
    }
  };

  const logout = () => {
    isLoggedIn.value = false;
    token.value = "";
    if (import.meta.client) {
      localStorage.removeItem("auth.token_data");
    }
  };

  return {
    isLoggedIn,
    showLoginDialog,
    token,
    openLogin,
    closeLogin,
    login,
    logout,
  };
};
