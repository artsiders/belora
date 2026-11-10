import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export interface ApiErrorResponse {
  error: string;
  statusCode: number;
  details?: unknown;
}

/**
 * Instance Axios préconfigurée pour Belora (Directive .agents/AGENTS.md Règle 17).
 * Centralise les appels vers les API Routes (/api/...) avec normalisation des erreurs.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<any>) => {
    const statusCode = error.response?.status || 500;
    let userFriendlyMessage = "Une erreur est survenue lors du traitement de votre demande.";

    // Extraction du message d'erreur utilisateur renvoyé par l'API
    if (error.response?.data?.error) {
      userFriendlyMessage = error.response.data.error;
    } else if (statusCode === 401) {
      userFriendlyMessage = "Veuillez vous connecter pour accéder à cette fonctionnalité.";
    } else if (statusCode === 403) {
      userFriendlyMessage = "Vous ne disposez pas des permissions requises pour effectuer cette action.";
    } else if (statusCode === 404) {
      userFriendlyMessage = "La ressource demandée est introuvable.";
    } else if (statusCode === 409) {
      userFriendlyMessage = "Un conflit est survenu avec les données existantes.";
    } else if (statusCode === 422) {
      userFriendlyMessage = "Les données transmises sont incomplètes ou invalides.";
    } else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      userFriendlyMessage = "Le délai d'attente de la requête a expiré. Veuillez vérifier votre connexion.";
    } else if (!error.response) {
      userFriendlyMessage = "Impossible de contacter le serveur. Veuillez vérifier votre connexion internet.";
    }

    // Masquage strict des termes techniques internes (Règle 14 .agents/AGENTS.md)
    const technicalKeywords = ["prisma", "postgres", "sql", "cloudinary", "database", "econnrefused", "server 500", "stack"];
    for (const keyword of technicalKeywords) {
      if (userFriendlyMessage.toLowerCase().includes(keyword)) {
        userFriendlyMessage = "Une erreur inattendue est survenue. Veuillez réessayer dans quelques instants.";
        break;
      }
    }

    const normalizedError: ApiErrorResponse = {
      error: userFriendlyMessage,
      statusCode,
      details: error.response?.data?.details,
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
