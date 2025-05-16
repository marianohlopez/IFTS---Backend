import Product from '../classes/Product.js';

// Funcion para listar productos

export const listProducts = async (req, res) => {
  try {
    const productModel = new Product();
    const products = await productModel.getAll();
    res.render('productList', { products });
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
};

// Funcion para agregar productos

export const addProduct = async (req, res) => {
  try {
    const productModel = new Product();
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