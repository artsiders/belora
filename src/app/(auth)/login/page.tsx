"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [userType, setUserType] = useState<"client" | "pro">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de connexion propre
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="w-full">
      {/* 1. Bascule de type de compte : Client vs Professionnel */}
      <div className="p-1 rounded-xl bg-sand-200/60 border border-sand-300 flex items-center mb-8">
        <button
          type="button"
          onClick={() => {
            setUserType("client");
            setSubmitted(false);
          }}
          className={`flex-1 py-2 text-xs font-semibold tracking-wide uppercase rounded-[calc(var(--radius-sm)-2px)] transition-all ${
            userType === "client"
              ? "bg-sand-50 text-sand-950 shadow-2xs"
              : "text-sand-600 hover:text-sand-900"
          }`}
        >
          Compte Particulier
        </button>
        <button
          type="button"
          onClick={() => {
            setUserType("pro");
            setSubmitted(false);
          }}
          className={`flex-1 py-2 text-xs font-semibold tracking-wide uppercase rounded-[calc(var(--radius-sm)-2px)] transition-all ${
            userType === "pro"
              ? "bg-sand-50 text-sand-950 shadow-2xs"
              : "text-sand-600 hover:text-sand-900"
          }`}
        >
          Espace Professionnel
        </button>
      </div>

      {/* 2. Titre et sous-titre éditorial */}
      <div className="mb-8">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-primary-600 block mb-1.5">
          {userType === "client" ? "Réservations de soins" : "Gestion d’établissement"}
        </span>
        <h1 className="text-3xl sm:text-4xl text-sand-950 tracking-tight">
          {userType === "client" ? "Bienvenue à nouveau" : "Espace Artisan & Salon"}
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-2 font-normal leading-relaxed">
          {userType === "client"
            ? "Connectez-vous pour retrouver vos rendez-vous, vos ateliers favoris et vos praticiens."
            : "Accédez à votre agenda en temps réel, vos créneaux et vos réservations en ligne."}
        </p>
      </div>

      {/* Message de confirmation simulé */}
      {submitted ? (
        <div className="p-6 rounded-xl bg-sand-50 border border-sand-300 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl text-sand-950 mb-1">Connexion validée</h3>
            <p className="text-xs text-sand-600">
              Bienvenue sur votre espace Belora. Redirection en cours…
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 hover:underline"
          >
            <span>Retour à l’accueil</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* 3. Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs uppercase tracking-wider font-semibold text-sand-700 mb-1.5"
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
                  className="input pr-10"
                />
                <Mail className="w-4 h-4 text-sand-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs uppercase tracking-wider font-semibold text-sand-700"
                >
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
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
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-700 focus:outline-none"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-sand-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-[2px] border-sand-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span>Mémoriser mes identifiants</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-block mt-4"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-sand-50 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 4. Séparateur sobre */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sand-200" />
            </div>
            <span className="relative px-3 bg-sand-100 text-xs text-sand-500 uppercase tracking-wider font-medium">
              ou
            </span>
          </div>

          {/* 5. Connexion SSO Google */}
          <button
            type="button"
            className="btn btn-outline btn-block"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
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

          {/* 6. Lien d'inscription */}
          <div className="mt-8 pt-6 border-t border-sand-200 text-center">
            <p className="text-xs text-sand-600">
              Vous n’avez pas encore de compte ?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary-600 hover:text-primary-700 hover:underline"
              >
                Créer un compte Belora
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
