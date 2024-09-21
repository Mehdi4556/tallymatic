import { Op, Sequelize } from 'sequelize';
import { InventoryLevelsResponse, IOptions, TransactionType } from '@shared';

import { getDatabaseInstance } from '@/database/db';

import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { Product } from '../product';
import { ProductVariant } from '../product-variant';
import { Inventory } from './inventory.model';

export const createClaimAdjustment = async (variantId: string, quantity: number, notes?: string): Promise<Inventory> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const inventoryCreated = await adjustStock(variantId, quantity, TransactionType.ADJUSTED, notes);
    await transaction.commit();

    return inventoryCreated;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// export const getInventoryLevels = async (productId: string): Promise<ProductVariant[]> => {
//   return ProductVariant.findAll({
//     where: { productId },
//     attributes: ['id', 'name', 'stock', 'lowStockThreshold', 'reorderPoint', 'reorderQuantity'],
//   });
// };

export const getAllInventoryLevels = async (
  filter: Record<string, any>,
  options: IOptions,
  wildcardFields: string[] = []
): Promise<InventoryLevelsResponse> => {
  const paginationOptions = buildPaginationOptions(filter, options, wildcardFields);
  const result = await ProductVariant.findAndCountAll({
    ...paginationOptions,
    attributes: ['id', 'name', 'stock', 'lowStockThreshold', 'reorderPoint', 'reorderQuantity'],
    include: [
      {
        model: Product,
        attributes: ['name'],
      },
    ],
  });

  return transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
};

export const checkLowStockAlerts = async (): Promise<ProductVariant[]> => {
  return ProductVariant.findAll({
    where: {
      stock: {
        [Op.lte]: Sequelize.col('lowStockThreshold'),
      },
    },
  });
};

export const adjustStock = async (
  variantId: string,
  quantity: number,
  type: TransactionType,
  notes?: string
): Promise<Inventory> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const variant = await ProductVariant.findByPk(variantId, { transaction });
    if (!variant) {
      throw new Error('Product variant not found');
    }

    const newStock = variant.stock + quantity;
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    await variant.update({ currentStock: newStock }, { transaction });

    const inventoryCreated = await Inventory.create(
      {
        variantId,
        quantity,
        type,
        notes,
      },
      { transaction }
    );
    await transaction.commit();

    return inventoryCreated.toJSON();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};