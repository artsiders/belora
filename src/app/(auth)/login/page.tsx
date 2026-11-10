"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Eye, EyeOff, Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [userType, setUserType] = useState<"client" | "pro">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Identifiants incorrects. Veuillez vérifier votre adresse e-mail et votre mot de passe.");
        setIsLoading(false);
        return;
      }

      setSubmitted(true);
      const session = await getSession();
      const role = (session?.user as any)?.role;

      setTimeout(() => {
        if (callbackUrl && !callbackUrl.includes("/login")) {
          router.push(callbackUrl);
        } else if (role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (role === "PRO") {
          router.push("/pro/agenda");
        } else {
          router.push("/account");
        }
        router.refresh();
      }, 500);
    } catch {
      setErrorMessage("Une erreur de connexion est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const targetUrl = callbackUrl || (userType === "pro" ? "/pro/agenda" : "/account");
    signIn("google", { callbackUrl: targetUrl });
  };

  return (
    <div className="w-full">
      {/* 1. Bascule de type de compte : Particulier vs Professionnel */}
      <div className="p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center mb-8">
        <button
          type="button"
          onClick={() => {
            setUserType("client");
            setSubmitted(false);
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            userType === "client"
              ? "bg-white text-neutral-950 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Compte Particulier
        </button>
        <button
          type="button"
          onClick={() => {
            setUserType("pro");
            setSubmitted(false);
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            userType === "pro"
              ? "bg-white text-neutral-950 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Espace Professionnel
        </button>
      </div>

      {/* 2. Titre et sous-titre éditorial */}
      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary-700 block mb-1">
          {userType === "client" ? "Réservation de soins" : "Gestion d’atelier"}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-neutral-950 tracking-tight font-normal">
          {userType === "client" ? "Bienvenue à nouveau" : "Espace Artisan & Salon"}
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-2 font-normal leading-relaxed">
          {userType === "client"
            ? "Connectez-vous pour retrouver vos rendez-vous et vos salons favoris."
            : "Accédez à votre agenda en direct et à la gestion de vos réservations."}
        </p>
      </div>

      {/* Message de succès */}
      {submitted ? (
        <div className="p-8 rounded-2xl bg-primary-50/20 border border-primary-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl text-neutral-950 font-medium">Connexion réussie</h3>
            <p className="text-sm text-neutral-600">
              Redirection en cours vers votre espace…
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Feedback d'erreur utilisateur */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-4.5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-neutral-800 mb-2"
              >
                Adresse e-mail
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  autoComplete="email"
                  className="input pr-12"
                />
                <Mail className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-neutral-800"
                >
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 focus:outline-none p-1 cursor-pointer"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox"
                />
                <span>Mémoriser mes identifiants</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full h-13 rounded-2xl text-sm font-semibold normal-case mt-4"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200/80" />
            </div>
            <span className="relative px-4 bg-white text-sm text-neutral-400 uppercase tracking-wider font-medium">
              ou
            </span>
          </div>

          {/* Connexion SSO Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-13 rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 text-sm font-medium text-neutral-800 shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg
              className="w-5 h-5 shrink-0"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuer avec Google</span>
          </button>

          {/* Lien d'inscription */}
          <div className="mt-8 pt-6 border-t border-neutral-200/80 text-center">
            <p className="text-sm text-neutral-600">
              Vous n’avez pas encore de compte ?{" "}
              <Link
                href={userType === "pro" ? "/pro/join" : "/register"}
                className="font-semibold text-primary-600 hover:text-primary-700 hover:underline"
              >
                {userType === "pro" ? "Créer un espace professionnel" : "Créer un compte Belora"}
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full h-80 animate-pulse bg-neutral-100 rounded-2xl" />}>
      <LoginForm />
    </Suspense>
  );
}
