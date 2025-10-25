import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImageContext } from "../context/ImageContext";
import "./Login.css";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl } = useImageContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        console.warn("⚠️ Message from different origin, ignoring");
        return;
      }

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        setIsLoading(false);

        localStorage.setItem("user", JSON.stringify(event.data.user));

        toast.success("Login successful!");
        navigate("/photos");
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        setIsLoading(false);
        toast.error(`Login failed: ${event.data.error}`);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  const handleGoogleLogin = () => {
    setIsLoading(true);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_REDIRECT_URI
    }&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;

    const width = 600;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      googleAuthUrl,
      "GoogleAuth",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      toast.error("Popup was blocked! Please allow popups for this site.");
      setIsLoading(false);
      return;
    }

    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login with Google</h1>
      <button
        className="google-btn"
        onClick={handleGoogleLogin}
        disabled={isLoading}>
        <img className="google-logo" src="/google-logo.png" alt="Google Logo" />
        <span>{isLoading ? "Authenticating..." : "Continue with Google"}</span>
      </button>

      {isLoading && (
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Please complete authentication in the popup window...
        </div>
      )}
    </div>
  );
};

export default Login;
