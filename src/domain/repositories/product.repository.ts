import FilterFindProducts from '../dtos/filter-find-products.dto';
import Product from '../entities/product';
import SalePrice from '../entities/sale-price';

export default interface ProductRepository {
  save(product: Product): Promise<Product>;
  find(filter: FilterFindProducts): Promise<[Product[], number]>;
  saveSalePrice(salePrice: SalePrice): Promise<SalePrice>;
  findProductSalesPrices(productId: number): Promise<[Product, SalePrice[]]>;
}
