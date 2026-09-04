const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const readline = require("readline");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Admin = require("../models/Admin");

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].replace(/^--/, "");
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
      parsed[key] = val;
    }
  }
  return parsed;
};

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/geetsbeauty";
    await mongoose.connect(mongoUri);
    console.log(`\n🔒 [Admin Setup] Connected to MongoDB database.`);

    const cliArgs = parseArgs();

    let name = cliArgs.name;
    let email = cliArgs.email;
    let username = cliArgs.username;
    let password = cliArgs.password;
    let role = cliArgs.role || "Super Administrator";

    if (!email || !password) {
      console.log("\n========================================================");
      console.log("👑  GEETS BEAUTY WORLD - SECURE ADMIN ACCOUNT SETUP  👑");
      console.log("========================================================");
      console.log("Set up your own custom administrator credentials.\n");

      if (!name) name = await askQuestion("Enter Admin Full Name (e.g. Geeta Shrestha): ");
      if (!name) name = "Store Administrator";

      if (!email) email = await askQuestion("Enter Admin Email (e.g. owner@geetsbeauty.com): ");
      while (!email || !email.includes("@")) {
        console.log("❌ Please enter a valid email address.");
        email = await askQuestion("Enter Admin Email: ");
      }

      if (!username) username = await askQuestion("Enter Admin Username [optional, e.g. admin]: ");
      if (!username) username = email.split("@")[0];

      if (!password) password = await askQuestion("Enter Secure Admin Password (min 6 chars): ");
      while (!password || password.length < 6) {
        console.log("❌ Password must be at least 6 characters long.");
        password = await askQuestion("Enter Secure Admin Password: ");
      }
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username ? username.toLowerCase().trim() : cleanEmail.split("@")[0];

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if admin already exists with this email or username
    let existing = await Admin.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existing) {
      existing.name = name;
      existing.email = cleanEmail;
      existing.username = cleanUsername;
      existing.password = hashedPassword;
      existing.role = role;
      await existing.save();
      console.log(`\n✅ Existing Admin account (${cleanEmail}) updated with new hashed password!`);
    } else {
      await Admin.create({
        name,
        email: cleanEmail,
        username: cleanUsername,
        password: hashedPassword,
        role,
      });
      console.log(`\n✅ New Admin account successfully created in MongoDB!`);
    }

    console.log("--------------------------------------------------------");
    console.log(`Name:     ${name}`);
    console.log(`Email:    ${cleanEmail}`);
    console.log(`Username: ${cleanUsername}`);
    console.log(`Role:     ${role}`);
    console.log(`Password: [SECURELY HASHED WITH BCRYPT - NOT STORED AS PLAIN TEXT]`);
    console.log("--------------------------------------------------------");
    console.log("✨ You can now sign in at http://localhost:5173/admin/login using these credentials.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error setting up admin account:", error.message);
    process.exit(1);
  }
};

run();
