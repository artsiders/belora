"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Users,
  Search,
  Shield,
  Briefcase,
  UserCheck,
  MoreVertical,
  X,
  AlertTriangle,
  Mail,
  Phone,
  Store,
  Calendar,
  CreditCard,
  Edit2,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";

interface AdminUserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: "CUSTOMER" | "PRO" | "ADMIN";
  emailVerified: string | null;
  createdAt: string;
  ownedVenuesCount: number;
  bookingsCount: number;
  totalSpentEuros: number;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);
  const [editRole, setEditRole] = useState<"CUSTOMER" | "PRO" | "ADMIN">("CUSTOMER");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const { data, isLoading, isError, refetch } = useQuery<{
    users: AdminUserItem[];
    error?: string;
  }>({
    queryKey: ["admin", "users", roleFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await apiClient.get<{ users: AdminUserItem[] }>(
        `/admin/users?${params.toString()}`
      );
      return res.data;
    },
    staleTime: 30_000,
  });

  const users = data?.users || [];
  const hasError = isError || Boolean(data?.error);

  // Stats calculation
  const stats = useMemo(() => {
    const total = users.length;
    const customers = users.filter((u) => u.role === "CUSTOMER").length;
    const pros = users.filter((u) => u.role === "PRO").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    return { total, customers, pros, admins };
  }, [users]);

  // Mutation to update user
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: { role?: string; firstName?: string; lastName?: string; phone?: string };
    }) => {
      const res = await apiClient.patch(`/admin/users/${id}`, input);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Utilisateur mis à jour avec succès.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setSelectedUser(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Erreur lors de la mise à jour.";
      toast.error(msg);
    },
  });

  // Mutation to delete user
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/admin/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Compte utilisateur supprimé.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setUserToDelete(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Erreur lors de la suppression.";
      toast.error(msg);
    },
  });

  const handleOpenEdit = (user: AdminUserItem) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditPhone(user.phone || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    updateMutation.mutate({
      id: selectedUser.id,
      input: {
        role: editRole,
        firstName: editFirstName,
        lastName: editLastName,
        phone: editPhone || undefined,
      },
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="gold">Administrateur</Badge>;
      case "PRO":
        return <Badge variant="info">Professionnel</Badge>;
      default:
        return <Badge variant="neutral">Client</Badge>;
    }
  };

  return (
    <div className="space-y-8 container mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Gestion des Utilisateurs
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Supervisez, éditez les privilèges et gérez les comptes de la communauté Belora.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total Comptes
            </span>
            <Users className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-16" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {stats.total}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Clients Particuliers
            </span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-16" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {stats.customers}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Partenaires Professionnels
            </span>
            <Briefcase className="w-4 h-4 text-primary-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-16" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {stats.pros}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Administrateurs
            </span>
            <Shield className="w-4 h-4 text-secondary-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-16" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {stats.admins}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
          {[
            { id: "ALL", label: "Tous" },
            { id: "CUSTOMER", label: "Clients" },
            { id: "PRO", label: "Pros" },
            { id: "ADMIN", label: "Admins" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === tab.id
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher nom, e-mail, téléphone..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      {/* Error State */}
      {hasError && (
        <Alert
          variant="error"
          title="Erreur de chargement"
          description="Impossible de récupérer la liste des utilisateurs."
          action={{
            label: "Réessayer",
            onClick: () => refetch(),
          }}
        />
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <InlineSkeleton width="w-10" height="h-10" className="rounded-full" />
                  <div className="space-y-1">
                    <InlineSkeleton width="w-32" height="h-4" />
                    <InlineSkeleton width="w-48" height="h-3" />
                  </div>
                </div>
                <InlineSkeleton width="w-20" height="h-6" />
                <InlineSkeleton width="w-24" height="h-4" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Users}
              title="Aucun utilisateur trouvé"
              description="Aucun compte ne correspond aux filtres et termes de recherche spécifiés."
              action={
                search || roleFilter !== "ALL"
                  ? {
                      label: "Réinitialiser les filtres",
                      onClick: () => {
                        setSearch("");
                        setRoleFilter("ALL");
                      },
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-neutral-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Utilisateur</th>
                  <th className="py-3 px-4">Rôle</th>
                  <th className="py-3 px-4">Établissements</th>
                  <th className="py-3 px-4">Activité</th>
                  <th className="py-3 px-4">Date d'inscription</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map((user) => {
                  const initials = `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase();

                  return (
                    <tr key={user.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-neutral-200 text-neutral-700 font-semibold flex items-center justify-center shrink-0 text-xs">
                            {initials || "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 text-sm">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-neutral-500 text-xs flex items-center gap-2 mt-0.5">
                              <span>{user.email}</span>
                              {user.phone && (
                                <>
                                  <span className="text-neutral-300">•</span>
                                  <span>{user.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {getRoleBadge(user.role)}
                      </td>

                      <td className="py-3 px-4 text-neutral-700 font-medium">
                        {user.ownedVenuesCount > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-neutral-900 font-semibold">
                            <Store className="w-3.5 h-3.5 text-primary-600" />
                            {user.ownedVenuesCount} salon{user.ownedVenuesCount > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-neutral-900 font-semibold">
                          {user.bookingsCount} rdv
                        </div>
                        <div className="text-neutral-500 text-xs">
                          {user.totalSpentEuros.toFixed(2)} € dépensés
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-500 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3 h-3 text-neutral-500" />
                            Gérer
                          </button>
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer le compte"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit & Privileges Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-neutral-200 relative animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute right-4 top-4 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                {selectedUser.firstName[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Gérer l'utilisateur
                </h3>
                <p className="text-xs text-neutral-500">{selectedUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Rôle & Privilèges Belora
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["CUSTOMER", "PRO", "ADMIN"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEditRole(r)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                        editRole === r
                          ? "border-primary-500 bg-primary-50/40 text-primary-800"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{r === "ADMIN" ? "Admin" : r === "PRO" ? "Pro" : "Client"}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-neutral-900">
                Confirmer la suppression
              </h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed mb-6">
              Êtes-vous certain de vouloir supprimer définitivement le compte de{" "}
              <strong>
                {userToDelete.firstName} {userToDelete.lastName}
              </strong>{" "}
              ({userToDelete.email}) ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(userToDelete.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Suppression..." : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
