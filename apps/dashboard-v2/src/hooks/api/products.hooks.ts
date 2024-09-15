/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateProductReq, ProductDeleteResponse, ProductListResponse, ProductResponse } from '@shared';
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryClient } from '@/lib/query-client';
import { queryKeysFactory } from '@/lib/query-key-factory';

const PRODUCTS_QUERY_KEY = 'products' as const;
export const productsQueryKeys = queryKeysFactory(PRODUCTS_QUERY_KEY);

export const useProducts = (
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<ProductListResponse, FetchError, ProductListResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.products.list(query),
    queryKey: productsQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useCreateProduct = (options?: UseMutationOptions<ProductResponse, Error, CreateProductReq>) => {
  return useMutation({
    mutationFn: (payload: CreateProductReq) => client.products.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteProduct = (
  id: string,
  options?: UseMutationOptions<ProductDeleteResponse, FetchError, ProductDeleteResponse>
) => {
  return useMutation({
    mutationFn: () => client.products.delete(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};