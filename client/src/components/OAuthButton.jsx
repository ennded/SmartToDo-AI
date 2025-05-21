import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const OAuthButton = () => {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const res = await fetch("/api/auth/google", {
            method: "GET",
            credentials: "include",
          });
          const { token } = await res.json();

          localStorage.setItem("user", JSON.stringify({ token }));
          navigate("/todos");
        } catch (err) {
          console.error("Google login failed:", err);
        }
      }}
      onError={() => {
        console.log("Google login failed");
      }}
      useOneTap
    />
  );
};

export default OAuthButton;
