const BASE_URL = "http://localhost:5000/api";

const runSecurityTests = async () => {
  console.log("=================================================");
  console.log("🛡️  RUNNING GEETS BEAUTY WORLD SECURITY AUDIT SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  const assert = (condition, title) => {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}`);
    }
  };

  // 1. Test Customer Products API (Public)
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    assert(
      res.status === 200 && data.success === true && data.count === 141,
      `Public Product API returns 200 OK with all 141 products (Count: ${data.count})`
    );
  } catch (e) {
    assert(false, `Public Product API test failed: ${e.message}`);
  }

  // 2. Test Admin Login with WRONG credentials
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@geetsbeauty.com", password: "WRONG_PASSWORD_XYZ" }),
    });
    const data = await res.json();
    assert(
      res.status === 401 && data.success === false,
      `Admin login rejects incorrect credentials with HTTP 401 Unauthorized`
    );
  } catch (e) {
    assert(false, `Admin login rejection test failed: ${e.message}`);
  }

  // 3. Test Admin Login with Non-Existent User
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nonexistent@geetsbeauty.com", password: "anyPassword123" }),
    });
    const data = await res.json();
    assert(
      res.status === 401 && data.success === false,
      `Admin login rejects non-existent users without leaking account state`
    );
  } catch (e) {
    assert(false, `Admin login non-existent test failed: ${e.message}`);
  }

  // 4. Test Admin Login with CORRECT credentials
  let adminToken = "";
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@geetsbeauty.com", password: "admin123" }),
    });
    const data = await res.json();
    adminToken = data.token;
    assert(
      res.status === 200 &&
        data.success === true &&
        Boolean(data.token) &&
        !data.password &&
        !data.passwordHash &&
        !data.admin?.password,
      `Admin login succeeds, returns signed JWT, and NEVER exposes passwords or hashes`
    );
  } catch (e) {
    assert(false, `Admin login success test failed: ${e.message}`);
  }

  // 5. Test Protected Admin Profile WITHOUT Token
  try {
    const res = await fetch(`${BASE_URL}/admin/profile`);
    assert(
      res.status === 401,
      `GET /api/admin/profile without token returns 401 Unauthorized`
    );
  } catch (e) {
    assert(false, `Admin profile no-token test failed: ${e.message}`);
  }

  // 6. Test Protected Admin Profile WITH INVALID Token
  try {
    const res = await fetch(`${BASE_URL}/admin/profile`, {
      headers: { Authorization: "Bearer fake_or_tampered_jwt_token_xyz" },
    });
    assert(
      res.status === 401,
      `GET /api/admin/profile with forged token returns 401 Unauthorized`
    );
  } catch (e) {
    assert(false, `Admin profile forged-token test failed: ${e.message}`);
  }

  // 7. Test Protected Admin Profile WITH VALID Token
  try {
    const res = await fetch(`${BASE_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    assert(
      res.status === 200 && data.success === true && data.admin?.email === "admin@geetsbeauty.com",
      `GET /api/admin/profile with valid JWT returns 200 OK and verified admin identity`
    );
  } catch (e) {
    assert(false, `Admin profile valid-token test failed: ${e.message}`);
  }

  // 8. Test Protected Product Creation WITHOUT Admin Token
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Hacked Product", price: 100, category: "Skincare", image: "/fake.png" }),
    });
    assert(
      res.status === 401,
      `POST /api/products without admin token is rejected with 401 Unauthorized`
    );
  } catch (e) {
    assert(false, `Product mutation protection test failed: ${e.message}`);
  }

  // 9. Test Protected Order Status Update WITHOUT Admin Token
  try {
    const res = await fetch(`${BASE_URL}/orders/GBW-173890201`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: "Delivered" }),
    });
    assert(
      res.status === 401,
      `PUT /api/orders/:id without admin token is rejected with 401 Unauthorized`
    );
  } catch (e) {
    assert(false, `Order mutation protection test failed: ${e.message}`);
  }

  // 10. Test Protected Review Moderation WITHOUT Admin Token
  try {
    const res = await fetch(`${BASE_URL}/reviews/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    });
    assert(
      res.status === 401,
      `PUT /api/reviews/:id without admin token is rejected with 401 Unauthorized`
    );
  } catch (e) {
    assert(false, `Review mutation protection test failed: ${e.message}`);
  }

  console.log("\n=================================================");
  console.log(`📊 AUDIT RESULTS: ${passed}/${total} Security Tests Passed!`);
  console.log("=================================================\n");
};

runSecurityTests();
