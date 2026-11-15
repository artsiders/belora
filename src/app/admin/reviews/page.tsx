"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  MessageSquare,
  Star,
  Trash2,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  X,
  ExternalLink,
  Search,
  ShieldCheck,
  ShieldAlert,
  Reply,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";

interface AdminReviewItem {
  id: string;
  venueName: string;
  venueSlug: string;
  authorName: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  reply: string | null;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: AdminReviewItem[];
}

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"ALL" | "CRITICAL" | "VERIFIED" | "NO_REPLY">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState<AdminReviewItem | null>(null);
  const [reviewToReply, setReviewToReply] = useState<AdminReviewItem | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<ReviewsResponse>({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const res = await apiClient.get<ReviewsResponse>("/admin/reviews");
      return res.data;
    },
    staleTime: 30_000,
  });

  const rawReviews = data?.reviews || [];

  // Filtrage combiné par tab et par recherche
  const filteredReviews = useMemo(() => {
    return rawReviews.filter((r) => {
      // Filtre tab
      if (activeTab === "CRITICAL" && r.rating > 2) return false;
      if (activeTab === "VERIFIED" && !r.isVerified) return false;
      if (activeTab === "NO_REPLY" && r.reply) return false;

      // Filtre texte
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAuthor = r.authorName.toLowerCase().includes(q);
        const matchesVenue = r.venueName.toLowerCase().includes(q);
        const matchesComment = r.comment.toLowerCase().includes(q);
        if (!matchesAuthor && !matchesVenue && !matchesComment) return false;
      }
      return true;
    });
  }, [rawReviews, activeTab, searchQuery]);

  // Mutation Suppression
  const deleteMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await apiClient.delete(`/admin/reviews/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Avis supprimé de la plateforme");
      setReviewToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Erreur lors de la suppression de l'avis");
    },
  });

  // Mutation Certification (Vérifié / Non vérifié)
  const toggleVerifiedMutation = useMutation({
    mutationFn: async ({ id, isVerified }: { id: string; isVerified: boolean }) => {
      const res = await apiClient.patch(`/admin/reviews/${id}`, { isVerified });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success(
        variables.isVerified
          ? "Avis certifié avec le badge Visite Réelle"
          : "Certification de l'avis retirée"
      );
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Erreur lors de la mise à jour");
    },
  });

  // Mutation Réponse / Note officielle de modération
  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const res = await apiClient.patch(`/admin/reviews/${id}`, { reply });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Réponse de modération enregistrée avec succès");
      setReviewToReply(null);
      setReplyText("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Erreur lors de l'enregistrement de la réponse");
    },
  });

  // Compteurs statistiques
  const stats = useMemo(() => {
    const total = rawReviews.length;
    const critical = rawReviews.filter((r) => r.rating <= 2).length;
    const verified = rawReviews.filter((r) => r.isVerified).length;
    const noReply = rawReviews.filter((r) => !r.reply).length;
    return { total, critical, verified, noReply };
  }, [rawReviews]);

  return (
    <div className="space-y-6 container mx-auto">
      {/* En-tête de section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Modération des Avis &amp; Expériences
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Supervisez les retours clients certifiés, certifiez les avis légitimes et modérez les commentaires non conformes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Erreur réseau */}
      {isError && (
        <Alert
          variant="error"
          title="Erreur lors du chargement des avis"
          description={
            error instanceof Error ? error.message : "Erreur de connexion serveur."
          }
          action={{
            label: "Réessayer",
            onClick: () => refetch(),
            isLoading: isFetching,
          }}
        />
      )}

      {/* Barre d'outils : Onglets de filtrage & Recherche */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-neutral-200/90 shadow-2xs">
        {/* Onglets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "ALL"
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            Tous les avis ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CRITICAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "CRITICAL"
                ? "bg-rose-600 text-white"
                : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Critiques &le; 2 &star; ({stats.critical})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("VERIFIED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "VERIFIED"
                ? "bg-emerald-600 text-white"
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Certifiés ({stats.verified})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("NO_REPLY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "NO_REPLY"
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            Sans réponse ({stats.noReply})
          </button>
        </div>

        {/* Champ de recherche */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher client, salon..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Liste des Avis modérés */}
      <div className="bg-white rounded-xl border border-neutral-200/90 shadow-2xs overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 space-y-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <InlineSkeleton width="w-32" height="h-4" />
                  <InlineSkeleton width="w-20" height="h-4" />
                </div>
                <InlineSkeleton width="w-3/4" height="h-4" />
                <InlineSkeleton width="w-1/2" height="h-4" />
              </div>
            ))
          ) : filteredReviews.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={MessageSquare}
                title="Aucun avis trouvé"
                description={
                  searchQuery.trim()
                    ? "Aucun avis ne correspond à votre recherche."
                    : "Aucun avis dans cette catégorie pour le moment."
                }
              />
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="p-5 sm:p-6 hover:bg-neutral-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-neutral-900 text-sm">
                        {review.authorName}
                      </span>

                      {review.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Visite certifiée
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md">
                          Non certifié
                        </span>
                      )}

                      <span className="text-xs text-neutral-300">&bull;</span>
                      <Link
                        href={`/venue/${review.venueSlug}`}
                        target="_blank"
                        className="text-xs font-semibold text-primary-700 hover:text-primary-900 flex items-center gap-1 transition-colors"
                      >
                        <span>{review.venueName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Étoiles de note */}
                    <div className="flex items-center gap-1 mt-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-neutral-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-neutral-600 font-semibold ml-1.5">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Actions de modération */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className="text-xs text-neutral-400 font-mono hidden sm:inline mr-2">
                      {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {/* Bouton Certification */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleVerifiedMutation.mutate({
                          id: review.id,
                          isVerified: !review.isVerified,
                        })
                      }
                      title={review.isVerified ? "Retirer la certification" : "Certifier la visite"}
                      className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                        review.isVerified
                          ? "border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60"
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">
                        {review.isVerified ? "Certifié" : "Certifier"}
                      </span>
                    </button>

                    {/* Bouton Réponse modérateur */}
                    <button
                      type="button"
                      onClick={() => {
                        setReviewToReply(review);
                        setReplyText(review.reply || "");
                      }}
                      title="Répondre ou modifier la note officielle"
                      className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">
                        {review.reply ? "Modifier réponse" : "Répondre"}
                      </span>
                    </button>

                    {/* Bouton Suppression */}
                    <button
                      type="button"
                      onClick={() => setReviewToDelete(review)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                      title="Supprimer définitivement cet avis"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Commentaire client */}
                <p className="text-sm text-neutral-800 mt-3 leading-relaxed bg-neutral-50/60 p-3 rounded-lg border border-neutral-200/50">
                  &laquo; {review.comment} &raquo;
                </p>

                {/* Réponse de l'établissement ou médiation Belora */}
                {review.reply && (
                  <div className="mt-3 pl-4 border-l-2 border-primary-500 bg-primary-50/40 p-3 rounded-r-lg">
                    <p className="text-xs font-bold text-primary-900 flex items-center gap-1.5">
                      <Reply className="w-3 h-3 text-primary-600" />
                      <span>Réponse officielle / Note de médiation :</span>
                    </p>
                    <p className="text-xs text-neutral-700 mt-1 italic">
                      {review.reply}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modale de Réponse / Note officielle */}
      {reviewToReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                Note officielle de modération Belora
              </h3>
              <button
                type="button"
                onClick={() => setReviewToReply(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Ajoutez une réponse publique visible sous l&apos;avis laissé par{" "}
              <strong className="text-neutral-900">{reviewToReply.authorName}</strong> sur le salon{" "}
              <strong className="text-neutral-900">{reviewToReply.venueName}</strong>.
            </p>

            <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-700 italic border border-neutral-200/60">
              &laquo; {reviewToReply.comment} &raquo;
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-800 block">
                Texte de la réponse officielle
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Ex : Bonjour, nous vous remercions pour votre retour. Notre équipe a fait le point avec l'établissement..."
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-primary-500 text-neutral-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewToReply(null)}
                className="px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() =>
                  replyMutation.mutate({
                    id: reviewToReply.id,
                    reply: replyText.trim(),
                  })
                }
                disabled={replyMutation.isPending || !replyText.trim()}
                className="btn btn-primary text-xs px-4 py-2 cursor-pointer disabled:opacity-50"
              >
                {replyMutation.isPending ? "Enregistrement..." : "Publier la réponse"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de Confirmation de Suppression */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                Confirmer la modération
              </h3>
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Êtes-vous certain de vouloir supprimer définitivement l&apos;avis laissé par{" "}
              <strong className="text-neutral-900">{reviewToDelete.authorName}</strong> sur le salon{" "}
              <strong className="text-neutral-900">{reviewToDelete.venueName}</strong> ? Cette action est irréversible.
            </p>
            <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 italic border border-neutral-200/60">
              &laquo; {reviewToDelete.comment} &raquo;
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(reviewToDelete.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Suppression..." : "Supprimer l'avis"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
