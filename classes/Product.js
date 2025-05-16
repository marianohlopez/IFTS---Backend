import { readFile, writeFile } from 'fs/promises';

const filePath = './data/products.json';

class Product {
  constructor(id, name, stock, price) {
    this.id = id;
    this.name = name;
    this.stock = stock;
    this.price = price;
  }

  async getAll() {
    try {
      const data = await readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading products:', err);
      return [];
    }
  }

  async save(products) {
    try {
      await writeFile(filePath, JSON.stringify(products, null, 2));
    } catch (err) {
      console.error('Error saving products:', err);
    }
  }
}

export default Product;