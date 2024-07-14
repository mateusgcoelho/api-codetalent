import FilterFindProducts from '../dtos/filter-find-products.dto';
import Product from '../entities/product';
import SalePrice from '../entities/sale-price';

export default interface ProductRepository {
  save(product: Product): Promise<Product>;
  delete(productId: number): Promise<void>;
  findAndCount(filter: FilterFindProducts): Promise<[Product[], number]>;
  deleteSalePrice(productId: number, supermarketId: number): Promise<void>;
  saveSalePrice(salePrice: SalePrice): Promise<SalePrice>;
  findProductSalesPrices(productId: number): Promise<[Product, SalePrice[]]>;
  updateSalePrice(
    productId: number,
    supermarketId: number,
    salePrice: number,
  ): Promise<SalePrice>;
}
