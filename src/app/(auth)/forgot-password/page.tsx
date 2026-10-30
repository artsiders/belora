"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-950 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Retour à la connexion</span>
        </Link>

        <div className="w-10 h-10 rounded-xl bg-neutral-200/80 border border-primary-300 text-neutral-800 flex items-center justify-center mb-4">
          <KeyRound className="w-5 h-5 text-primary-600" />
        </div>

        <span className="text-[11px] uppercase tracking-wider font-semibold text-primary-600 block mb-1">
          Sécurité du compte
        </span>
        <h1 className="text-3xl sm:text-4xl text-neutral-950 tracking-tight">
          Mot de passe oublié
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-normal leading-relaxed">
          Saisissez l’adresse e-mail associée à votre compte Belora. Nous vous
          enverrons un lien sécurisé à usage unique pour en définir un nouveau.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-xl bg-primary-50/10 border border-primary-300 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl text-neutral-950 mb-1">
              Vérifiez votre boîte de réception
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Un e-mail contenant les instructions de réinitialisation vient d’être
              adressé à <span className="font-semibold text-neutral-900">{email}</span>. Ce
              lien expirera dans 60 minutes.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-neutral-50 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <span>Retour à la connexion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="forgot-email"
              className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1.5"
            >
              Adresse e-mail du compte
            </label>
            <div className="relative">
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                autoComplete="email"
                className="input pr-10"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-block mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-primary-50 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Transmettre le lien</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-neutral-500 text-center pt-2">
            Vous n’avez plus accès à cet e-mail ?{" "}
            <Link href="/help" className="text-neutral-800 underline underline-offset-2">
              Contacter l’assistance Belora
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
