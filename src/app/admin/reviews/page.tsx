"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  const [selectedRating, setSelectedRating] = useState<string>("ALL");
  const [reviewToDelete, setReviewToDelete] = useState<AdminReviewItem | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<ReviewsResponse>({
    queryKey: ["admin", "reviews", selectedRating],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedRating === "LOW") params.set("minRating", "1");
      const res = await apiClient.get<ReviewsResponse>(`/admin/reviews?${params.toString()}`);
      return res.data;
    },
  });

  const reviews = data?.reviews || [];

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

  return (
    <div className="space-y-6 container mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Modération des Avis Clients
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Supervisez les retours d&apos;expérience certifiés, identifiez les signalements et modérez les commentaires non conformes.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </button>
      </div>

      {/* Erreur */}
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

      {/* Liste des Avis */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <span>{reviews.length} avis recensés</span>
          </div>
        </div>

        <div className="divide-y divide-neutral-200/80">
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
          ) : reviews.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={MessageSquare}
                title="Aucun avis recensé"
                description="Aucun avis ne correspond aux critères de filtrage pour le moment."
              />
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-neutral-50/40 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 text-sm">
                        {review.authorName}
                      </span>
                      {review.isVerified && (
                        <Badge variant="success" icon={CheckCircle2}>
                          Visite certifiée
                        </Badge>
                      )}
                      <span className="text-xs text-neutral-400">&bull;</span>
                      <Link
                        href={`/venue/${review.venueSlug}`}
                        target="_blank"
                        className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                      >
                        {review.venueName}
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
                              : "text-neutral-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-neutral-500 font-medium ml-1">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400">
                      {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => setReviewToDelete(review)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Supprimer cet avis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Commentaire */}
                <p className="text-sm text-neutral-700 mt-3 leading-relaxed">
                  &laquo; {review.comment} &raquo;
                </p>

                {/* Réponse du salon si existante */}
                {review.reply && (
                  <div className="mt-3 pl-4 border-l-2 border-neutral-300 bg-neutral-50/70 p-3 rounded-r-lg">
                    <p className="text-xs font-semibold text-neutral-800">
                      Réponse de l&apos;établissement :
                    </p>
                    <p className="text-xs text-neutral-600 mt-1 italic">
                      {review.reply}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modale de Confirmation de Suppression (Pas d'alert/confirm natif) */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-900">
                Confirmer la modération
              </h3>
              <button
                onClick={() => setReviewToDelete(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Êtes-vous certain de vouloir supprimer définitivement l&apos;avis laissé par{" "}
              <strong className="text-neutral-900">{reviewToDelete.authorName}</strong> sur le salon{" "}
              <strong className="text-neutral-900">{reviewToDelete.venueName}</strong> ? Cette action est irréversible.
            </p>
            <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 italic">
              &laquo; {reviewToDelete.comment} &raquo;
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReviewToDelete(null)}
                className="px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => deleteMutation.mutate(reviewToDelete.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
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
