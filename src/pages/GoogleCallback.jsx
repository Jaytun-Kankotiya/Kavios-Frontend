import { useEffect, useState } from "react";
import axios from "axios";
import { useImageContext } from "../context/ImageContext";

const GoogleCallback = () => {
  const { backendUrl } = useImageContext();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const errorParam = urlParams.get("error");

    if (errorParam) {
      setStatus('error');
      setMessage(`Google OAuth error: ${errorParam}`);
      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_ERROR", error: errorParam },
          window.location.origin
        );
        setTimeout(() => window.close(), 2000);
      }
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received');
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/auth/google`,
          { code },
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        setStatus('success');
        setMessage('Login successful!');
        
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { 
              type: "GOOGLE_AUTH_SUCCESS", 
              user: response.data.user
            },
            window.location.origin
          );
          
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error";
        setStatus('error');
        setMessage(errorMessage);
        
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: "GOOGLE_AUTH_ERROR", error: errorMessage },
            window.location.origin
          );
          
          setTimeout(() => window.close(), 3000);
        }
      }
    };

    exchangeCode();
  }, [backendUrl]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{ 
        textAlign: "center", 
        maxWidth: "400px",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔐</div>
            <div style={{ fontSize: "18px", color: "#333" }}>
              Authenticating with Google...
            </div>
            <div style={{ 
              fontSize: "14px", 
              color: "#666", 
              marginTop: "10px" 
            }}>
              Please wait
            </div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>✅</div>
            <div style={{ fontSize: "18px", color: "#4CAF50", marginBottom: "10px" }}>
              Authentication Successful!
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              {message}
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌</div>
            <div style={{ fontSize: "18px", color: "#f44336", marginBottom: "10px" }}>
              Authentication Failed
            </div>
            <div style={{ 
              fontSize: "14px", 
              color: "#666",
              wordBreak: "break-word"
            }}>
              {message}
            </div>
            <div style={{ 
              fontSize: "12px", 
              color: "#999", 
              marginTop: "20px" 
            }}>
              This window will close automatically...
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;