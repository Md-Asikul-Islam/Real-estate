import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

const useMyProperties = (page = 1, limit = 8) => {
  const queryClient = useQueryClient();

  //  Fetch my properties
  const fetchQuery = useQuery({
    queryKey: ["my-properties", { page, limit }],
    queryFn: async () => {
      const res = await api.get(`/properties/my?page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60,
    select: (response) => ({
      properties: response.data,
      meta: {
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        count: response.count,
      },
    }),
  });

  //  Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/properties/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["my-properties"]),
  });


  return {
    ...fetchQuery,
    deleteProperty: deleteMutation.mutate,
  };
};

export  default useMyProperties