import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Search, Mail } from "lucide-react";

export default function HelpPage() {
  const FAQ_SECTIONS = [
    {
      category: "Réservations & Rendez-vous",
      questions: [
        {
          q: "Comment fonctionne la réservation sur Belora ?",
          a: "Choisissez votre maison de soin, sélectionnez les prestations désirées et choisissez un créneau horaire en direct. La confirmation est immédiate, sans aucun échange téléphonique nécessaire.",
        },
        {
          q: "Puis-je annuler ou reporter mon rendez-vous ?",
          a: "Oui, vous pouvez annuler ou modifier votre créneau directement depuis votre espace client jusqu'à 24h avant le rendez-vous sans le moindre frais.",
        },
        {
          q: "Que se passe-t-il si j'ai un imprévu de dernière minute ?",
          a: "Chaque maison possède une politique d'annulation claire. Contactez directement l'artisan par SMS ou téléphone via les coordonnées indiquées dans votre e-mail de confirmation.",
        },
      ],
    },
    {
      category: "Paiement & Tarifs",
      questions: [
        {
          q: "Dois-je payer lors de la réservation en ligne ?",
          a: "Dans la majorité des salons partenaires, aucun prépaiement n'est exigé : vous réglez directement sur place à l'issue de votre rituel. Pour certains soins longs, un acompte sécurisé par carte bancaire peut être requis.",
        },
        {
          q: "Les tarifs affichés sont-ils garantis ?",
          a: "Absolument. Les prix indiqués sur Belora sont stricts, transparents, TTC et convenus avec chaque établissement, sans mauvaise surprise lors du paiement.",
        },
      ],
    },
    {
      category: "Pour les Salons & Artisans",
      questions: [
        {
          q: "Comment référencer mon salon sur Belora ?",
          a: "Vous pouvez soumettre votre candidature sur notre page dédiée aux professionnels (/pro). Notre équipe prendra contact avec vous pour planifier une visite d'audit.",
        },
        {
          q: "Quels sont les critères pour intégrer la sélection ?",
          a: "Nous vérifions l'hygiène irréprochable du lieu, les diplômes et savoir-faire des praticiens, l'utilisation de produits sains (sans substances toxiques) et la sérénité acoustique du salon.",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-sand-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1 pb-20">
        {/* En-tête */}
        <section className="py-16 sm:py-20 border-b border-primary-200/80 bg-primary-50/10/70 text-center">
          <div className="container-belora max-w-2xl mx-auto">
            <span className="eyebrow text-primary-700 font-semibold tracking-widest block mb-2">
              Centre d’Assistance
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-sand-950 mb-4">
              Comment pouvons-nous vous aider ?
            </h1>
            <p className="text-xs sm:text-sm text-sand-600 mb-8 max-w-md mx-auto">
              Retrouvez toutes les réponses concernant vos réservations, vos paiements et nos critères d’audit.
            </p>

            {/* Champ de recherche d'aide */}
            <div className="relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-sand-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher une question, une règle d’annulation..."
                className="input pl-11 py-2.5 text-xs sm:text-sm bg-primary-50/10"
              />
            </div>
          </div>
        </section>

        {/* Grille FAQ */}
        <section className="container-belora pt-12 max-w-4xl">
          <div className="space-y-12">
            {FAQ_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="font-display text-2xl text-sand-950 border-b border-primary-200/80 pb-2">
                  {section.category}
                </h2>

                <div className="space-y-3">
                  {section.questions.map((faq, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-xl bg-primary-50/10 border border-primary-200/80 space-y-2"
                    >
                      <h3 className="text-sm font-semibold text-sand-950">
                        {faq.q}
                      </h3>
                      <p className="text-xs text-sand-600 leading-relaxed font-normal">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Direct */}
          <div className="mt-16 p-8 rounded-xl bg-primary-50/10 border border-primary-300 text-center space-y-4">
            <h3 className="font-display text-2xl text-sand-950">
              Vous n’avez pas trouvé votre réponse ?
            </h3>
            <p className="text-xs text-sand-600 max-w-md mx-auto leading-relaxed">
              Notre équipe d’assistance dédiée est joignable du lundi au samedi pour vous accompagner dans votre expérience de soin.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="mailto:contact@belora.com"
                className="btn btn-outline btn-sm inline-flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Écrire à contact@belora.com</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
