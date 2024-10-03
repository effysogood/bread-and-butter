const express = require( "express");
const router =  express.Router();
const path = require('path');
const multer = require('multer');

router.use('/', servestatic('home'));
router.use('/admin/order', servestatic('admin/order'));
router.use('/admin/category', servestatic('admin/category'));
router.use('/admin/products', servestatic('admin/products'));
router.use('/cart', servestatic('cart'));
router.use('/category', servestatic('category')); 
router.use('/books', servestatic('books')); 
router.use('/detail', servestatic('detail'));
router.use('/order', servestatic('order'));
router.use('/mypage', servestatic('mypage'));
router.use('/login', servestatic('login'));
router.use('/join', servestatic('join'));
router.use('/upload', servestatic('upload'));
router.use('/ordertrack', servestatic('ordertrack'));


function servestatic (resource) {
    const resourcePath = path.join(__dirname, `../views/${resource}`);
    const option = { index: `${resource.includes("admin")?resource.split("/")[1]:resource}.html`};
return express.static(resourcePath, option);
}
module.exports = router;