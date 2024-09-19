import {
  IAccessAndRefreshTokens,
  ICategory,
  IOrganization,
  IProduct,
  IProductVariant,
  IStore,
  IUser,
} from '../interfaces/resources';
import { DeleteResponse, ResourceListResponse, ResourceResponse } from './api-operations';

export type AuthResponse = ResourceResponse<IAccessAndRefreshTokens>;
export type UserAuthResponse = ResourceResponse<{ tokens: IAccessAndRefreshTokens } & { user: IUser }>;

export type UserProfileResponse = ResourceResponse<IUser & { organization: IOrganization }>;

export type UserResponse = ResourceResponse<IUser>;
export type UserListResponse = ResourceListResponse<IUser>;
export type UserDeleteResponse = DeleteResponse;

export type OrganizationResponse = ResourceResponse<IOrganization>;
export type OrganizationListResponse = ResourceListResponse<IOrganization>;
export type OrganizationDeleteResponse = DeleteResponse;

export type StoreResponse = ResourceResponse<IStore>;
export type StoreListResponse = ResourceListResponse<IStore>;
export type StoreDeleteResponse = DeleteResponse;

export type ProductResponse = ResourceResponse<IProduct>;
export type ProductListResponse = ResourceListResponse<IProduct & { category: ICategory }>;
export type ProductDeleteResponse = DeleteResponse;

export type CategoryResponse = ResourceResponse<ICategory>;
export type CategoryListResponse = ResourceListResponse<ICategory>;
export type CategoryDeleteResponse = DeleteResponse;

export type ProductVariantResponse = ResourceResponse<IProductVariant>;
export type ProductVariantListResponse = ResourceListResponse<IProductVariant>;
export type ProductVariantDeleteResponse = DeleteResponse;

// Inventory
export type InventoryLevelsResponse = IProductVariant[];
export type LowStockAlertsResponse = IProductVariant[];
