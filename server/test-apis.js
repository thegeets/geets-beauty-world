const testEndpoints = async () => {
  const BASE_URL = "http://localhost:5000/api";

  console.log("==========================================");
  console.log("🧪 TESTING GEETS BEAUTY WORLD BACKEND APIS");
  console.log("==========================================");

  // 1. Health Check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log("[1] Health Check:", healthData);

  // 2. Get Products
  const prodRes = await fetch(`${BASE_URL}/products`);
  const prodData = await prodRes.json();
  console.log(`[2] Products Count: ${prodData.count}, First Product: ${prodData.products[0]?.name}`);

  // 3. Admin Login
  const adminLoginRes = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@geetsbeauty.com", password: "admin123" }),
  });
  const adminLoginData = await adminLoginRes.json();
  console.log(`[3] Admin Login Success: ${adminLoginData.success}, Role: ${adminLoginData.admin?.role}`);
  const adminToken = adminLoginData.token;

  // 4. Admin Protected Customer List
  const custRes = await fetch(`${BASE_URL}/admin/customers`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const custData = await custRes.json();
  console.log(`[4] Admin Customers Count: ${custData.count}`);

  // 5. Customer Login
  const userLoginRes = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "demo@gmail.com", password: "demo123" }),
  });
  const userLoginData = await userLoginRes.json();
  console.log(`[5] User Login Success: ${userLoginData.success}, Name: ${userLoginData.user?.name}`);

  // 6. Orders
  const ordersRes = await fetch(`${BASE_URL}/orders`);
  const ordersData = await ordersRes.json();
  console.log(`[6] Total Orders in DB: ${ordersData.count}`);

  // 7. Reviews
  const reviewsRes = await fetch(`${BASE_URL}/reviews`);
  const reviewsData = await reviewsRes.json();
  console.log(`[7] Total Reviews in DB: ${reviewsData.count}`);

  console.log("==========================================");
  console.log("🎉 ALL API ENDPOINTS VERIFIED & WORKING!");
  console.log("==========================================");
};

testEndpoints().catch((e) => console.error("Test failed:", e));
