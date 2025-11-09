import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

const fetchProperties = async ({ queryKey }) => {
  const [_key, params] = queryKey;
  const q = new URLSearchParams({
    ...(params.search ? { search: params.search } : {}),
    ...(params.minPrice ? { minPrice: params.minPrice } : {}),
    ...(params.maxPrice ? { maxPrice: params.maxPrice } : {}),
    ...(params.bedrooms ? { bedrooms: params.bedrooms } : {}),
    ...(params.sort ? { sort: params.sort } : {}),
    ...(params.saleType ? { saleType: params.saleType } : {}),
    page: params.page?.toString() ?? "1",
    limit: params.limit?.toString() ?? "10",
  }).toString();

  const res = await api.get(`/properties?${q}`);
  return res.data;
};

const useProperties = (defaultType = "all") => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [limit] = useState(Number(searchParams.get("limit")) || 10);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const saleType = defaultType === "all" ? "" : defaultType;

  const params = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      minPrice,
      maxPrice,
      bedrooms,
      sort,
      page,
      limit,
      saleType,
    }),
    [debouncedSearch, minPrice, maxPrice, bedrooms, sort, page, limit, saleType]
  );

  const query = useQuery({
    queryKey: ["properties", params],
    queryFn: fetchProperties,
    keepPreviousData: true,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const p = new URLSearchParams();
    if (debouncedSearch) p.set("search", debouncedSearch);
    if (sort) p.set("sort", sort);
    if (page > 1) p.set("page", String(page));
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (bedrooms) p.set("bedrooms", bedrooms);
    if (limit !== 10) p.set("limit", String(limit));
    setSearchParams(p, { replace: true });
  }, [debouncedSearch, sort, page, minPrice, maxPrice, bedrooms, limit, setSearchParams]);

  const updateParams = useCallback((key, value) => {
    switch (key) {
      case "search":
        setSearch(value);
        setPage(1);
        break;
      case "page":
        setPage(Number(value) || 1);
        break;
      case "sort":
        setSort(value);
        setPage(1);
        break;
      case "minPrice":
        setMinPrice(value);
        setPage(1);
        break;
      case "maxPrice":
        setMaxPrice(value);
        setPage(1);
        break;
      case "bedrooms":
        setBedrooms(value);
        setPage(1);
        break;
      default:
        break;
    }
  }, []);

  return {
    properties: query.data?.properties || [],
    meta: query.data?.meta || { total: 0, count: 0, page: params.page, totalPages: 0 },
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    filters: {
      search,
      debouncedSearch,
      page,
      limit,
      sort,
      saleType,
      minPrice,
      maxPrice,
      bedrooms,
    },
    actions: {
      updateParams,
      reset: () => {
        setSearch("");
        setDebouncedSearch("");
        setPage(1);
        setSort("");
        setMinPrice("");
        setMaxPrice("");
        setBedrooms("");
      },
    },
  };
};

export default useProperties;
