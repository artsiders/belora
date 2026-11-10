"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Eye,
  EyeOff,
  User,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "pro" ? "pro" : "client";

  const [role, setRole] = useState<"client" | "pro">(initialRole);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    businessCategory: "coiffure",
    address: "",
    postalCode: "",
    city: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const endpoint = role === "pro" ? "/api/auth/register-pro" : "/api/auth/register";
      const payload =
        role === "pro"
          ? {
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
              venueName: formData.businessName,
              venueAddress: formData.address || `${formData.city}`,
              venueCity: formData.city,
              venuePostalCode: formData.postalCode || "75000",
            }
          : {
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Impossible d'effectuer l'inscription. Veuillez vérifier vos informations.");
        setIsLoading(false);
        return;
      }

      setSubmitted(true);

      // Connexion automatique après inscription
      const loginRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      setTimeout(() => {
        if (!loginRes?.error) {
          if (role === "pro") {
            router.push("/pro/agenda");
          } else {
            router.push("/account");
          }
          router.refresh();
        } else {
          router.push("/login");
        }
      }, 1000);
    } catch {
      setErrorMessage("Une erreur réseau est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Titre et introduction */}
      <div className="mb-6">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary-700 block mb-1">
          Inscription
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-neutral-950 tracking-tight font-normal">
          Rejoindre Belora
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-2 font-normal leading-relaxed">
          Choisissez l’expérience qui vous correspond pour débuter votre parcours.
        </p>
      </div>

      {/* 2. Choix du profil en 2 cartes modernes */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            setRole("client");
            setSubmitted(false);
            setErrorMessage(null);
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            role === "client"
              ? "bg-primary-50/20 border-primary-600 ring-1 ring-primary-600 shadow-xs"
              : "bg-white border-neutral-200/90 hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <User
              className={`w-5 h-5 ${
                role === "client" ? "text-primary-600" : "text-neutral-500"
              }`}
            />
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                role === "client"
                  ? "border-primary-600 bg-primary-600"
                  : "border-neutral-300"
              }`}
            >
              {role === "client" && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </span>
          </div>
          <span className="block text-sm font-semibold text-neutral-950">
            Particulier
          </span>
          <span className="block text-sm text-neutral-500 mt-0.5 leading-snug">
            Réserver des soins
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRole("pro");
            setSubmitted(false);
            setErrorMessage(null);
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            role === "pro"
              ? "bg-primary-50/20 border-primary-600 ring-1 ring-primary-600 shadow-xs"
              : "bg-white border-neutral-200/90 hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Building2
              className={`w-5 h-5 ${
                role === "pro" ? "text-primary-600" : "text-neutral-500"
              }`}
            />
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                role === "pro"
                  ? "border-primary-600 bg-primary-600"
                  : "border-neutral-300"
              }`}
            >
              {role === "pro" && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </span>
          </div>
          <span className="block text-sm font-semibold text-neutral-950">
            Artisan & Salon
          </span>
          <span className="block text-sm text-neutral-500 mt-0.5 leading-snug">
            Développer mon atelier
          </span>
        </button>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-primary-50/20 border border-primary-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl text-neutral-950 font-medium">
              Bienvenue dans la Maison Belora
            </h3>
            <p className="text-sm text-neutral-600">
              Votre compte a été créé avec succès. Connexion et redirection en cours…
            </p>
          </div>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === "pro" && (
              <>
                <div>
                  <label
                    htmlFor="reg-business-name"
                    className="block text-sm font-semibold text-neutral-800 mb-1.5"
                  >
                    Nom de votre établissement
                  </label>
                  <input
                    id="reg-business-name"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    placeholder="Ex: Atelier Saint-Honoré, Studio Botanique…"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-address"
                      className="block text-sm font-semibold text-neutral-800 mb-1.5"
                    >
                      Adresse
                    </label>
                    <input
                      id="reg-address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="18 Rue de Turenne"
                      className="input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-city"
                      className="block text-sm font-semibold text-neutral-800 mb-1.5"
                    >
                      Ville
                    </label>
                    <input
                      id="reg-city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Paris, Lyon, Genève…"
                      className="input"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="reg-first-name"
                  className="block text-sm font-semibold text-neutral-800 mb-1.5"
                >
                  Prénom
                </label>
                <input
                  id="reg-first-name"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Camille"
                  autoComplete="given-name"
                  className="input"
                />
              </div>
              <div>
                <label
                  htmlFor="reg-last-name"
                  className="block text-sm font-semibold text-neutral-800 mb-1.5"
                >
                  Nom
                </label>
                <input
                  id="reg-last-name"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Dupont"
                  autoComplete="family-name"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-semibold text-neutral-800 mb-1.5"
              >
                Adresse e-mail
              </label>
              <div className="relative">
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="nom@exemple.com"
                  autoComplete="email"
                  className="input pr-12"
                />
                <Mail className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-phone"
                className="block text-sm font-semibold text-neutral-800 mb-1.5"
              >
                Téléphone mobile
              </label>
              <div className="relative">
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                  className="input pr-12"
                />
                <Phone className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-semibold text-neutral-800 mb-1.5"
              >
                Mot de passe (8 car. min, 1 majuscule, 1 chiffre)
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••••••"
                  autoComplete="new-password"
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

            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer text-sm text-neutral-600 leading-snug">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="checkbox mt-0.5"
                />
                <span>
                  J’accepte les{" "}
                  <Link href="/terms" className="text-neutral-900 underline underline-offset-2 hover:text-primary-600">
                    conditions générales d’utilisation
                  </Link>{" "}
                  et la politique de confidentialité.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="btn btn-primary w-full h-13 rounded-2xl text-sm font-semibold normal-case mt-4"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {role === "client" ? "Créer mon compte" : "Inscrire mon salon"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200/80 text-center">
            <p className="text-sm text-neutral-600">
              Déjà membre de la Maison Belora ?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary-600 hover:text-primary-700 hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full h-80 animate-pulse bg-neutral-100 rounded-2xl" />}>
      <RegisterFormContent />
    </Suspense>
  );
}
