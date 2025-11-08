// src/hooks/useProperties.js
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

/**
 * fetchProperties
 * expects queryKey: ["properties", paramsObj]
 * backend: GET /properties?search=&minPrice=&maxPrice=&bedrooms=&sort=&page=&limit=&saleType=
 * returns: { success, meta: { total, count, page, totalPages }, data: [...] }
 */
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
  return res.data; // expected: { success, meta: {...}, data: [...] }
};

/**
 * useProperties hook
 *
 * @param {string} defaultType - "all" | "rent" | "buy" | "sale"
 * returns object: { properties, meta, isLoading, isFetching, isError, error, filters, actions }
 */
const useProperties = (defaultType = "all") => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Controlled UI state (synced to URL)
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [limit] = useState(Number(searchParams.get("limit")) || 10);

  // Debounce search input for better UX (avoid hitting API per keystroke)
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const debounceRef = useRef(null);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // saleType param derived from defaultType prop (for route-based lists)
  const saleType = defaultType === "all" ? "" : defaultType;

  // build params object for react-query key
  const params = useMemo(
    () => ({
      search: debouncedSearch,
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      bedrooms: bedrooms || "",
      sort: sort || "",
      page: page || 1,
      limit: limit || 10,
      saleType: saleType || "",
    }),
    [debouncedSearch, minPrice, maxPrice, bedrooms, sort, page, limit, saleType]
  );

  // React Query call (v5 object syntax)
  const query = useQuery({
    queryKey: ["properties", params],
    queryFn: fetchProperties,
    keepPreviousData: true, // keep old page data while fetching new
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });

  // Sync relevant params into the URL for share/bookmark
  useEffect(() => {
    const p = new URLSearchParams();
    if (debouncedSearch) p.set("q", debouncedSearch);
    if (sort) p.set("sort", sort);
    if (page > 1) p.set("page", String(page));
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (bedrooms) p.set("bedrooms", bedrooms);
    if (limit && limit !== 10) p.set("limit", String(limit)); // only set when not default
    setSearchParams(p, { replace: true });
  }, [debouncedSearch, sort, page, minPrice, maxPrice, bedrooms, limit, setSearchParams]);

  // Actions for UI components to update filters
  const updateParams = useCallback((key, value) => {
    switch (key) {
      case "q":
        setSearch(value);
        setPage(1); // reset page on new search
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

  // Return normalized shape for UI
  return {
    properties: query.data?.data || [], // actual array of docs
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
      // convenience: reset filters
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
