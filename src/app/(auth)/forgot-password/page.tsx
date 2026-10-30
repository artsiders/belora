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
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Retour à la connexion</span>
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center mb-4 text-primary-600">
          <KeyRound className="w-6 h-6 stroke-[1.75]" />
        </div>

        <span className="text-sm font-semibold uppercase tracking-wider text-primary-700 block mb-1">
          Sécurité du compte
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-neutral-950 tracking-tight font-normal">
          Mot de passe oublié
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-2 font-normal leading-relaxed">
          Saisissez l’adresse e-mail associée à votre compte Belora. Nous vous
          enverrons un lien sécurisé à usage unique pour en définir un nouveau.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-primary-50/20 border border-primary-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl text-neutral-950 font-medium">
              Vérifiez votre boîte de réception
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Un e-mail contenant les instructions de réinitialisation vient d’être
              adressé à <span className="font-semibold text-neutral-900">{email}</span>. Ce
              lien expirera dans 60 minutes.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="btn btn-dark inline-flex"
            >
              <span>Retour à la connexion</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4.5">
          <div>
            <label
              htmlFor="forgot-email"
              className="block text-sm font-semibold text-neutral-800 mb-2"
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
                className="input pr-12"
              />
              <Mail className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full h-13 rounded-2xl text-sm font-semibold normal-case mt-4 shadow-sm"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Transmettre le lien</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-sm text-neutral-500 text-center pt-3">
            Vous n’avez plus accès à cet e-mail ?{" "}
            <Link
              href="/help"
              className="text-neutral-900 font-semibold underline underline-offset-2 hover:text-primary-600 transition-colors"
            >
              Contacter l’assistance Belora
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
