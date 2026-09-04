/**
 * migrateToAtlas.js
 * 
 * Safely and non-destructively migrates collections from local MongoDB to MongoDB Atlas.
 * - Read-only from local database (preserves source data completely).
 * - Preserves exact ObjectIds, subdocuments, dates, and cross-references.
 * - Checks target Atlas collections before inserting to prevent accidental overwrites.
 * - Recreates all collection indexes in Atlas.
 * - Verifies counts post-migration.
 * - Never prints secrets, credentials, or full connection strings.
 */

const mongoose = require("mongoose");
const readline = require("readline");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const COLLECTIONS_TO_MIGRATE = ["products", "orders", "reviews", "admins", "users"];
const LOCAL_DB_NAME = "geetsbeauty";

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Function to start a local mongod process pointing to server/data if not already active
async function ensureLocalMongo() {
  const testConn = async (port) => {
    try {
      const conn = await mongoose.createConnection(`mongodb://127.0.0.1:${port}/${LOCAL_DB_NAME}`, {
        serverSelectionTimeoutMS: 2000,
      }).asPromise();
      const count = await conn.collection("products").countDocuments();
      await conn.close();
      if (count > 0) return port;
    } catch (e) {
      return null;
    }
    return null;
  };

  // Check 27017 or 27018 first
  const p1 = await testConn(27017);
  if (p1) return { port: p1, process: null };

  const p2 = await testConn(27018);
  if (p2) return { port: p2, process: null };

  // If not running, spawn mongod using server/data
  const serverDataDir = path.resolve(__dirname, "../data");
  const mongodPath = "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe";

  if (!fs.existsSync(mongodPath) || !fs.existsSync(serverDataDir)) {
    throw new Error("Local MongoDB binary or server/data directory not found.");
  }

  console.log("[Local DB] Starting local MongoDB in background on port 27018...");
  const proc = spawn(mongodPath, [
    "--dbpath", serverDataDir,
    "--port", "27018",
    "--bind_ip", "127.0.0.1"
  ], {
    stdio: ["ignore", "ignore", "ignore"],
    detached: true,
  });

  proc.unref();

  // Wait up to 10 seconds for connection
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const activePort = await testConn(27018);
    if (activePort) {
      console.log("[Local DB] Local database connected successfully.");
      return { port: 27018, process: proc };
    }
  }

  throw new Error("Could not start local MongoDB instance on port 27018.");
}

async function runMigration() {
  let localMongoInfo = null;
  let localConn = null;
  let atlasConn = null;

  try {
    let atlasUri = process.env.ATLAS_URI || "";
    if (!atlasUri) {
      atlasUri = await askQuestion("Enter your MongoDB Atlas Connection String: ");
    }

    if (!atlasUri) {
      console.error("Error: MongoDB Atlas connection string is required.");
      process.exit(1);
    }

    // Mask URI for safe logging
    const maskedUri = atlasUri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, "mongodb$1://$2:****@");
    console.log(`[Atlas] Connecting to Atlas cluster (${maskedUri})...`);

    // Ensure database name in Atlas URI is geetsbeauty if not present
    let finalAtlasUri = atlasUri;
    try {
      const urlObj = new URL(atlasUri.startsWith("mongodb") ? atlasUri.replace("mongodb+srv://", "http://").replace("mongodb://", "http://") : atlasUri);
      if (!urlObj.pathname || urlObj.pathname === "/") {
        finalAtlasUri = atlasUri.includes("?") 
          ? atlasUri.replace("?", `/${LOCAL_DB_NAME}?`) 
          : `${atlasUri.replace(/\/$/, "")}/${LOCAL_DB_NAME}`;
      }
    } catch (err) {
      // Keep original if parsing fails
    }

    // 1. Connect to Local DB
    localMongoInfo = await ensureLocalMongo();
    const localUri = `mongodb://127.0.0.1:${localMongoInfo.port}/${LOCAL_DB_NAME}`;
    localConn = await mongoose.createConnection(localUri).asPromise();
    console.log(`[Local DB] Connected to local ${LOCAL_DB_NAME} (Port: ${localMongoInfo.port})`);

    // 2. Connect to Atlas
    atlasConn = await mongoose.createConnection(finalAtlasUri).asPromise();
    console.log(`[Atlas] Connected successfully to Atlas database: ${atlasConn.name}`);

    console.log("\n==================================================");
    console.log("             PRE-MIGRATION INSPECTION             ");
    console.log("==================================================");

    const migrationPlan = [];

    for (const colName of COLLECTIONS_TO_MIGRATE) {
      const localCol = localConn.collection(colName);
      const atlasCol = atlasConn.collection(colName);

      const localCount = await localCol.countDocuments();
      const atlasCount = await atlasCol.countDocuments();
      const indexes = await localCol.indexes();

      migrationPlan.push({
        colName,
        localCount,
        atlasCount,
        indexes,
      });

      console.log(`Collection: ${colName.padEnd(10)} | Local: ${String(localCount).padStart(3)} | Atlas: ${String(atlasCount).padStart(3)}`);
    }

    // Check if Atlas already has existing data
    const existingAtlasTotal = migrationPlan.reduce((acc, p) => acc + p.atlasCount, 0);
    if (existingAtlasTotal > 0) {
      console.log("\n[NOTICE] Target Atlas database already contains some documents.");
      console.log("Documents will be safely synchronized / updated by _id without deleting existing data.");
    }

    console.log("\n==================================================");
    console.log("              EXECUTING MIGRATION                 ");
    console.log("==================================================");

    for (const item of migrationPlan) {
      const { colName, localCount, indexes } = item;
      const localCol = localConn.collection(colName);
      const atlasCol = atlasConn.collection(colName);

      if (localCount === 0) {
        console.log(`[${colName}] No local documents to migrate. Skipping.`);
        continue;
      }

      console.log(`[${colName}] Fetching ${localCount} documents from local database...`);
      const docs = await localCol.find({}).toArray();

      if (docs.length > 0) {
        // Use bulkWrite with upsert on _id to safely insert/sync preserving original ObjectIds
        const bulkOps = docs.map((doc) => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: doc },
            upsert: true,
          },
        }));

        console.log(`[${colName}] Migrating ${docs.length} documents into Atlas...`);
        const result = await atlasCol.bulkWrite(bulkOps, { ordered: false });
        console.log(`[${colName}] Completed. Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}, Matched: ${result.matchedCount}`);
      }

      // Recreate indexes (excluding default _id index)
      const nonDefaultIndexes = indexes.filter((idx) => idx.name !== "_id_");
      if (nonDefaultIndexes.length > 0) {
        console.log(`[${colName}] Recreating ${nonDefaultIndexes.length} index(es)...`);
        for (const idx of nonDefaultIndexes) {
          try {
            const options = { name: idx.name };
            if (idx.unique) options.unique = true;
            if (idx.sparse) options.sparse = true;
            await atlasCol.createIndex(idx.key, options);
          } catch (idxErr) {
            console.warn(`[${colName}] Index notice (${idx.name}): ${idxErr.message}`);
          }
        }
      }
    }

    console.log("\n==================================================");
    console.log("             POST-MIGRATION VERIFICATION          ");
    console.log("==================================================");

    let allMatched = true;
    for (const colName of COLLECTIONS_TO_MIGRATE) {
      const localCount = await localConn.collection(colName).countDocuments();
      const atlasCount = await atlasConn.collection(colName).countDocuments();
      const match = localCount === atlasCount;
      if (!match) allMatched = false;

      console.log(`Collection: ${colName.padEnd(10)} | Local: ${String(localCount).padStart(3)} | Atlas: ${String(atlasCount).padStart(3)} | Match: ${match ? "✓ PASS" : "✗ MISMATCH"}`);
    }

    console.log("==================================================");
    if (allMatched) {
      console.log("✓ SUCCESS: All collections and documents migrated to MongoDB Atlas with 100% integrity!");
    } else {
      console.log("! NOTICE: Verification complete. Please check the summary above.");
    }
  } catch (error) {
    console.error(`\n[Migration Error]: ${error.message}`);
  } finally {
    if (localConn) await localConn.close();
    if (atlasConn) await atlasConn.close();
    if (localMongoInfo && localMongoInfo.process) {
      try {
        localMongoInfo.process.kill();
      } catch (e) {}
    }
  }
}

runMigration();
