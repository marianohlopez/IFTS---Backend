import Product from '../classes/Product.js';

const productModel = new Product();

// Funcion para listar productos

export const listProducts = async (req, res) => {
  try {
    const products = await productModel.getAll();
    res.render('productList', { products });
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
};

// Funcion para agregar productos

export const addProduct = async (req, res) => {
  try {
    const products = await productModel.getAll();
    const { name, stock, price } = req.body;
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = new Product(id, name, parseInt(stock), parseFloat(price));
    products.push(newProduct);
    await productModel.save(products);
    res.redirect('/products');
  } catch (err) {
    res.status(500).send('Error adding product');
  }
};

// Actualizar un producto existente
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const products = await productModel.getAll();
    const productIndex = products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar el producto
    products[productIndex] = { ...products[productIndex], name, price, stock };
    await productModel.save(products);
    res.json({ message: 'Producto actualizado', product: products[productIndex] });
  } catch (err) {
    console.log(`Error: ${err}`)
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto existente
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productModel.getAll();
    const filteredProducts = products.filter(p => p.id !== parseInt(id));

    if (filteredProducts.length === products.length) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Guardar el array actualizado
    await productModel.save(filteredProducts);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
}