import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const OAuthButton = () => {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      // buttonText="Continue with Google"
      onSuccess={async (response) => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                credential: response.credential,
              }),
              // credentials: "include",
            }
          );

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Authentication failed");
          }
          const data = await res.json();

          localStorage.setItem("token", data.token);
          navigate("/todos");
        } catch (err) {
          console.error("Google login failed:", err);
          alert(`Login failed: ${err.message}`);
        }
      }}
      onError={() => {
        console.log("Google login failed");
        alert("Google login failed. Please try again.");
      }}
      useOneTap
      text="continue_with" // Better button text
      shape="rectangular"
    />
  );
};

export default OAuthButton;
