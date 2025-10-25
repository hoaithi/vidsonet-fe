"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { useEffect} from "react";
import { GoogleLoginRequest } from "@/types/auth";
import { useAuthStore } from "@/store/auth-store";
import { Profile } from "@/types/profile";

export default function authenticatePage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter(); 


  useEffect(() => {
    const handleLoginGoogle = async () => {
      if (code) {
        try {
          const requestData: GoogleLoginRequest = { code };
          const response = await AuthService.loginGoogle(requestData);
          console.log("access token: ",response.result?.accessToken)
          console.log("refresh token",response.result?.refreshToken)
          if(response.result){
            const {accessToken, refreshToken} = response.result; 
            const authResponse = { accessToken, refreshToken };
            setAuth(authResponse);
            router.push("/")
          }

        } catch (error) {
          console.log("Error from login with google",error)
        }
      }
    };
    handleLoginGoogle();
  }, [code]);
}
