import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const OAuthButton = () => {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Continue with Google"
      onSuccess={async (credentialResponse) => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/google`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!res.ok) throw new Error("Auth failed");
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
      cookiePolicy="single_host_origin"
      ux_mode="redirect"
    />
  );
};

export default OAuthButton;
