import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

// --- Users ---
const useUsers = (page = 1, limit = 10, search = "") => {
  return useQuery(["users", page, limit, search], async () => {
    const { data } = await api.get("/admin/users", {
      params: { page, limit, search },
    });
    return data;
  });
};

const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, role }) => api.patch(`/admin/users/${id}/role`, { role }),
    { onSuccess: () => queryClient.invalidateQueries(["users"]) }
  );
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation((id) => api.delete(`/admin/users/${id}`), {
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });
};

// --- Properties ---
const useProperties = (page = 1, limit = 10, search = "") => {
  return useQuery(["properties", page, limit, search], async () => {
    const { data } = await api.get("/admin/properties", {
      params: { page, limit, search },
    });
    return data;
  });
};

const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, status }) => api.patch(`/admin/properties/${id}/status`, { status }),
    { onSuccess: () => queryClient.invalidateQueries(["properties"]) }
  );
};

export {
  useUsers,
  useUpdateUserRole,
  useDeleteUser,
  useProperties,
  useUpdatePropertyStatus,
};
