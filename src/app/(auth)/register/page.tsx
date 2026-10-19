"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  User,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<"client" | "pro">("client");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    businessCategory: "coiffure",
    city: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="w-full">
      {/* 1. Sélecteur de profil éditorial */}
      <div className="mb-6">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-primary-600 block mb-1.5">
          Inscription
        </span>
        <h1 className="text-3xl sm:text-4xl text-sand-950 tracking-tight">
          Rejoindre Belora
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-2 font-normal leading-relaxed">
          Choisissez l’expérience qui vous correspond pour débuter votre parcours.
        </p>
      </div>

      {/* 2. Choix du profil en 2 cartes distinctes */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            setRole("client");
            setSubmitted(false);
          }}
          className={`p-3.5 rounded-[var(--radius-sm)] border text-left transition-all cursor-pointer ${
            role === "client"
              ? "bg-sand-50 border-primary-600 ring-1 ring-primary-600 shadow-2xs"
              : "bg-sand-50/50 border-sand-300 hover:border-sand-400"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <User
              className={`w-4 h-4 ${
                role === "client" ? "text-primary-600" : "text-sand-500"
              }`}
            />
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                role === "client"
                  ? "border-primary-600 bg-primary-600"
                  : "border-sand-400"
              }`}
            >
              {role === "client" && (
                <span className="w-1.5 h-1.5 rounded-full bg-sand-50" />
              )}
            </span>
          </div>
          <span className="block text-xs font-semibold text-sand-900">
            Particulier
          </span>
          <span className="block text-[11px] text-sand-500 mt-0.5 leading-snug">
            Réserver des soins d’exception
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRole("pro");
            setSubmitted(false);
          }}
          className={`p-3.5 rounded-[var(--radius-sm)] border text-left transition-all cursor-pointer ${
            role === "pro"
              ? "bg-sand-50 border-primary-600 ring-1 ring-primary-600 shadow-2xs"
              : "bg-sand-50/50 border-sand-300 hover:border-sand-400"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <Building2
              className={`w-4 h-4 ${
                role === "pro" ? "text-primary-600" : "text-sand-500"
              }`}
            />
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                role === "pro"
                  ? "border-primary-600 bg-primary-600"
                  : "border-sand-400"
              }`}
            >
              {role === "pro" && (
                <span className="w-1.5 h-1.5 rounded-full bg-sand-50" />
              )}
            </span>
          </div>
          <span className="block text-xs font-semibold text-sand-900">
            Artisan & Salon
          </span>
          <span className="block text-[11px] text-sand-500 mt-0.5 leading-snug">
            Développer mon établissement
          </span>
        </button>
      </div>

      {submitted ? (
        <div className="p-6 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl text-sand-950 mb-1">
              Bienvenue dans la Maison Belora
            </h3>
            <p className="text-xs text-sand-600">
              Votre compte a été initialisé avec succès. Un e-mail de confirmation
              a été envoyé à votre adresse.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 hover:underline"
          >
            <span>Explorer les ateliers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* 3. Formulaire adapté */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {role === "pro" && (
              <>
                <div>
                  <label
                    htmlFor="reg-business-name"
                    className="block text-xs uppercase tracking-wider font-semibold text-sand-700 mb-1"
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
                    placeholder="Ex: L’Atelier des Ciseaux, Studio Séquoia…"
                    className="w-full px-3.5 py-2.5 text-sm bg-sand-50 border border-sand-300 rounded-[var(--radius-sm)] text-sand-900 placeholder:text-sand-400 focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-category"
                      className="block text-xs uppercase tracking-wider font-semibold text-sand-700 mb-1"
                    >
                      Activité principale
                    </label>
                    <select
                      id="reg-category"
                      value={formData.businessCategory}
                      onChange={(e) =>
                        setFormData({ ...formData, businessCategory: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-sand-50 border border-sand-300 rounded-[var(--radius-sm)] text-sand-900 focus:outline-none focus:border-primary-600"
                    >
                      <option value="coiffure">Coiffure</option>
                      <option value="visage">Soins Visage & Institut</option>
                      <option value="massage">Massage & Spa</option>
                      <option value="barbier">Barbier</option>
                      <option value="onglerie">Onglerie</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="reg-city"
                      className="block text-xs uppercase tracking-wider font-semibold text-sand-700 mb-1"
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
                      placeholder="Paris, Lyon…"
                      className="w-full px-3.5 py-2.5 text-sm bg-sand-50 border border-sand-300 rounded-[var(--radius-sm)] text-sand-900 placeholder:text-sand-400 focus:outline-none focus:border-primary-600"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="reg-first-name"
                  className="block text-xs uppercase tracking-wider font-semibold text-sand-700 mb-1"
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
                  className="w-full px-3.5 py-2.5 text-sm bg-sand-50 border border-sand-300 rounded-[var(--radius-sm)] text-sand-900 placeholder:text-sand-400 focus:outline-none focus:border-primary-600"
                />
              </div>
              <div>
                <label
                  htmlFor="reg-last-name"
                  className="block text-xs uppercase tracking-wider font-semibold text-sand-700 mb-1"
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
                  className="w-full px-3.5 py-2.5 text-sm bg-sand-50 border border-sand-300 rounded-[var(--radius-sm)] text-sand-900 placeholder:text-sand-400 focus:outline-none focus:border-primary-600"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs uppercase tracking-wider font-semibold text-sand-700 mb-1"
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
                  className="w-full px-3.5 py-2.5 text-sm bg-sand-50 border border-sand-300 rounded-[var(--radius-sm)] text-sand-900 placeholder:text-sand-400 focus:outline-none focus:border-primary-600"
                />
                <Mail className="w-4 h-4 text-sand-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-phone"
                className="block text-xs uppercase tracking-wider font-semibold text-sand-700 mb-1"
              >
                Téléphone mobile{" "}
                <span className="text-[11px] font-normal text-sand-500 lowercase">
                  (pour les rappels SMS de rdv)
                </span>
              </label>
              <div className="relative">
                <input
                  id="reg-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                  className="w-full px-3.5 py-2.5 text-sm bg-sand-50 border border-sand-300 rounded-[var(--radius-sm)] text-sand-900 placeholder:text-sand-400 focus:outline-none focus:border-primary-600"
                />
                <Phone className="w-4 h-4 text-sand-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs uppercase tracking-wider font-semibold text-sand-700 mb-1"
              >
                Mot de passe (8 caractères minimum)
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
                  className="w-full px-3.5 py-2.5 text-sm bg-sand-50 border border-sand-300 rounded-[var(--radius-sm)] text-sand-900 placeholder:text-sand-400 focus:outline-none focus:border-primary-600"
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

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-sand-600 leading-snug">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded-[2px] border-sand-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span>
                  J’accepte les{" "}
                  <Link href="/terms" className="text-sand-900 underline underline-offset-2">
                    conditions générales d’utilisation
                  </Link>{" "}
                  et confirme avoir pris connaissance de la politique de confidentialité.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="btn btn-primary btn-block mt-3"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-sand-50 border-t-transparent rounded-full animate-spin" />
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

          {/* 4. Lien de retour connexion */}
          <div className="mt-6 pt-5 border-t border-sand-200 text-center">
            <p className="text-xs text-sand-600">
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
