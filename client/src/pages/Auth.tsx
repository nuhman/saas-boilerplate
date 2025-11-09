import { useState } from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { SignUpForm } from "../components/auth/SignUpForm";
import { Button } from "../components/ui/button";

export function AuthPage({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">Movie Watchlist</h1>
          <p className="text-gray-600">Track your favorite movies</p>
        </div>

        {mode === "login" ? (
          <LoginForm onSuccess={onAuthSuccess} />
        ) : (
          <SignUpForm onSuccess={onAuthSuccess} />
        )}

        <div className="text-center">
          {mode === "login" ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-purple-600"
                onClick={() => setMode("signup")}
              >
                Sign up
              </Button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-purple-600"
                onClick={() => setMode("login")}
              >
                Sign in
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
