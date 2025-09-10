import { del, get, imgDel, newPost, post, postForm, put, putch } from "./api";



// user login and register
export const login = (data) => newPost("/auth/login", data);
export const registration = (data) => newPost("/users/register", data);
export const sendOtp = (data) => newPost("/otps/send", data);
export const verifyOtp = (data) => newPost("/auth/forget-password/verify-otp", data);
export const fetchUser = (data) => get("/users/profile", data);
export const resetPassword = (data) => newPost("/auth/forget-password/submit", data);

// user
export const updateUser = (data) => putch("/users/profile", data);
export const changePassword = (data) => putch("/auth/password-update", data);
// setting
// export const fetchSiteSettings = (data) => get("/settings", data);
export const fetchPublicSiteSettings = (data) => get("/settings/site", data);
export const fetchAdminSettings = (data) => get("/settings", data);
export const updateAdminSettings = (data) => post("/settings", data);

// language setting 
export const fetchLanguages = (data) => get("/settings/languages", data);
export const createLanguage = (data) => newPost("/settings/languages", data);
export const updateLanguage = (data) => put("/settings/languages", data);
export const deleteLanguage = (data) => del(`/settings/languages/${data}`)

export const fetchPublicLanguages = (data) => get("/settings/languages/site", data);
export const fetchTranslations = (data) => get("/settings/languages/site", data);

// page setting
export const  fetchPageData = (data) => get("/settings/pages/site", data)
export const  updatePageData = (data) => putch("/settings/pages", data)

// product 
export const fetchProducts = (data) => get("/products/site", data);
export const createProduct = (data) => newPost("/products", data);
export const updateProduct = (data) => put("/products", data);
export const deleteProduct = (data) => del(`/products/${data}`);
export const fetchAdminProducts = (data) => get("/products", data);
export const fetchSingleProduct = ({ id }) => get(`/products/${id}`);
export const fetchProductCategories = (data) => get("/product_categories", data);
export const createProductCategories = (data) => newPost("/product_categories", data);
export const updateProductCategories = (data) => put("/product_categories", data);
export const deleteProductCategories = (data) => del(`/product_categories/${data}`);
export const fetchProductBrands = (data) => get("/product_brands", data);
export const createProductBrands = (data) => newPost("/product_brands", data);
export const updateProductBrands = (data) => put("/product_brands", data);
export const deleteProductBrands = (data) => del(`/product_brands/${data}`);
export const fetchProductStyles = (data) => get("/product_styles", data);
export const createProductStyles = (data) => newPost("/product_styles", data);
export const updateProductStyles = (data) => put("/product_styles", data);
export const deleteProductStyles = (data) => del(`/product_styles/${data}`);
export const fetchProductTypes = (data) => get("/product_types", data);
export const createProductTypes = (data) => newPost("/product_types", data);
export const updateProductTypes = (data) => put("/product_types", data);
export const deleteProductTypes = (data) => del(`/product_types/${data}`);
export const fetchProductSeasons = (data) => get("/product_seasons", data);
export const createProductSeasons = (data) => newPost("/product_seasons", data);
export const updateProductSeasons = (data) => put("/product_seasons", data);
export const deleteProductSeasons = (data) => del(`/product_seasons/${data}`);
export const fetchProductSpeedRatings = (data) => get("/product_spreed_ratings", data);
export const createProductSpeedRatings = (data) => newPost("/product_spreed_ratings", data);
export const updateProductSpeedRatings = (data) => put("/product_spreed_ratings", data);
export const deleteProductSpeedRatings = (data) => del(`/product_spreed_ratings/${data}`);
export const fetchProductPly = (data) => get("/product_ply", data);
export const createProductPly = (data) => newPost("/product_ply", data);
export const updateProductPly = (data) => put("/product_ply", data);
export const deleteProductPly = (data) => del(`/product_ply/${data}`);
export const fetchProductPerformances = (data) => get("/product_performances", data);
export const createProductPerformances = (data) => newPost("/product_performances", data);
export const updateProductPerformances = (data) => put("/product_performances", data);
export const deleteProductPerformances = (data) => del(`/product_performances/${data}`);
export const fetchProductSidewalls = (data) => get("/product_sidewalls", data);
export const createProductSidewalls = (data) => newPost("/product_sidewalls", data);
export const updateProductSidewalls = (data) => put("/product_sidewalls", data);
export const deleteProductSidewalls = (data) => del(`/product_sidewalls/${data}`);
export const fetchProductLugs = (data) => get("/product_lugs", data);
export const createProductLugs = (data) => newPost("/product_lugs", data);
export const updateProductLugs = (data) => put("/product_lugs", data);
export const deleteProductLugs = (data) => del(`/product_lugs/${data}`);
export const fetchProductFinish = (data) => get("/product_finish", data);
export const createProductFinish = (data) => newPost("/product_finish", data);
export const updateProductFinish = (data) => put("/product_finish", data);
export const deleteProductFinish = (data) => del(`/product_finish/${data}`);
export const fetchProductSeasonalDesignations = (data) => get("/product_seasonal_designations", data);
export const createProductSeasonalDesignations = (data) => newPost("/product_seasonal_designations", data);
export const updateProductSeasonalDesignations = (data) => put("/product_seasonal_designations", data);
export const deleteProductSeasonalDesignations = (data) => del(`/product_seasonal_designations/${data}`);



// site product search
export const productSearch = (data) => get("/products/search", data);
export const productSearchRefinements = (data) => get("/products/refinements", data);
export const productBrand = (data) => get("/product_brands/site", data)
export const productBrandAll = (data) => get("/product_brands/all", data)
export const productbycategory_brand = (data) => get("/products/search-by-brands-category", data)
export const fetchPromotionProducts = (data) => get("/products/promotion", data);
export const fetchPromotionProductsByCategory = (data) => get("/products/promotion-by-category", data);
// order 
export const orderByAdmin = (data) => get("/orders", data);
export const fetchSingleOrder = ({ id }) => get(`/orders/${id}`);
export const orderPrice = (data) =>get("/cart/price", data);
export const publicCoupon = (data) =>get("/coupons/site", data);
export const createOrder = (data) => newPost("/orders", data);
export const updateOrderStatus = (data) => put("/orders", data);
export const fetchOrders = (data) => get("/orders/user", data);
export const paymentStripeSuccess = (data) => get("/payments/stripe/success", data);
export const paymentPaypalSuccess = (data) => get("/payments/paypal/success", data);
export const paymentList =  (data) => get("/payments/list", data);

export const sendInvoiceMail = (data) => newPost('/orders/send-mail', data)



// file upload
export const postSingleImage = (data) => postForm("/files/single-image-upload", data);
export const postMultipleImage = (data) => postForm("/files/multiple-image-upload", data);
export const removeFile = (data) => imgDel("/files/file-remove", data);


// user 
export const getUserLists = (data) => get("/users",data)


// cart
export const addtoCart = (data) => newPost("/cart", data);
export const gettoCart = (data) => get("/cart", data);
export const deleteItemtoCart = (data) => del(`/cart/${data}`);


// contact 
export const contactForm = (data) => newPost("/contact/send", data);


// dashboard
export const fetchDashboard = (data) => get("/dashboard/admin", data);



// vin decoder
export const getVin = (data) => newPost("/decoder/vin", data);
export const getLincesePlate = (data) => newPost("/decoder/license-plate", data);





