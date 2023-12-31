const express = require('express')
const router = express.Router();



const adminController = require('../controller/admin_controller');
const adminMiddleWare = require('../middleware/admin_middle');
const adminProductController = require('../controller/admin_product_controller')
const adminUserController= require('../controller/admin_user_controller'); 
const adminHomepageController = require('../controller/admin_homepagecontroller')
const adminOrderController = require('../controller/admin_order_controller');

///////////////////////Login Page///////////////////////////
router.get('/login',adminController.loginPage);
router.post('/login',adminController.adminLogin);

router.get('/logout',adminController.logout)

router.post('/sales-data',adminController.salesData)


router.use(adminMiddleWare.isAdmin)


/////////////User Detailes//////////////////
router.get('/userlists',adminUserController.userLists)
router.get('/user/more/:id',adminUserController.userMoreDetails)
router.get('/user/block/:id',adminUserController.blockUser)
router.get('/user/unblock/:id',adminUserController.unBlockUser)


////////////////////Add Category/////////////////////////////
router.get('/add-category', adminProductController.addCategoryPage)
router.post('/add-category',adminProductController.addCategory)


///////////////////////Add Product///////////////////////////
router.get('/add-product',adminProductController.addProductPage)
router.post('/add-product',adminMiddleWare.uploadProductImg.array('img-file',{maxCount : 3}),adminProductController.addProduct)

////////////others//////////////
router.get('/others',adminProductController.othersPage)
router.post('/edit-banner',adminMiddleWare.bannerUpload.array('banner-img',{maxCount : 3}),adminHomepageController.editBanner)
router.get('/edit-banner/:path',adminHomepageController.editBannerPage)

//////////Orders///////////////
router.get('/orders',adminOrderController.ordersPage);
router.get('/order-confirm/:id',adminOrderController.orderConfirm)
router.get('/order-cancel/:id',adminOrderController.orderCancel)
router.get('/order-more/:id',adminOrderController.orderMore)





/////////////////block & Unblock////////////////
router.get('/products/unblock/:id',adminProductController.productUnblock)
router.get('/products/block/:id',adminProductController.productBlock)


////dashbord////////////////
router.get('/dashboard',adminController.dashboard)
router.get('/sales-report',adminController.salesReportPage)

router.get('/chart-data',adminController.chartData)
     
/////////////VIEW PRODUCTS///////////

router.get('/products',adminProductController.productsPage)
router.get('/products/:id', adminProductController.filterProducts)


///////////////edit Products////////////////////
router.get('/products/edit/:id',adminProductController.productEditPage)
router.post('/products/edit/:id',adminMiddleWare.uploadProductImg.single('img-file'), adminProductController.productEdit)

/////////////single products(more details)//////////
router.get('/product-details/:id',adminProductController.singleProduct)
router.get('/product/:productname', adminProductController.singleProductPage)

//////////////coupon//////////////////////
router.get('/create-coupon',adminUserController.createCouponPage)
router.post('/create-coupon',adminUserController.createCoupon)
router.get('/offer',adminUserController.offerPage)
router.post('/offer',adminMiddleWare.uploadOfferImg.single('img-file'),adminUserController.createOffer)




module.exports = router