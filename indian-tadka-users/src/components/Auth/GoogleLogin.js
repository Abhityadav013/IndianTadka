import React from "react";
const handleGoogleLogin = () => {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "consent",
        });

    window.location.href = googleAuthUrl; // Redirect to Google Login
};

export default function GoogleLogin() {
    return (
        <button onClick={handleGoogleLogin}>
            Login with Google
        </button>
    );
}
