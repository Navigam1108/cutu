require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const dns = require('dns');

const uri = process.env.MONGODB_URI;

if (!uri) { console.error("❌ MONGODB_URI missing"); process.exit(1); }

// Extract hostname for DNS check
const match = uri.match(/@([^/?]+)/);
const domain = match ? match[1] : '';

console.log("---------------------------------------------------");
console.log("� DIAGNOSTIC MODE");
console.log(`📡 Target Domain: ${domain}`);
console.log(`👤 Connection String User: ${uri.split('//')[1].split(':')[0]}`); // Print USERNAME only
console.log("---------------------------------------------------");

if (!domain) {
    console.error("❌ Invalid Connection String Format");
    process.exit(1);
}

// Step 1: Check DNS
console.log("1️⃣  Checking DNS Resolution...");
dns.resolveSrv(domain, (err, addresses) => {
    if (err) {
        console.error("❌ DNS FAIL: Could not resolve SRV record.");
        console.error("   This usually means your internet or firewall is blocking the connection lookup.");
        console.error("   Error:", err.code);
    } else {
        console.log("✅ DNS OK: Found replica set nodes.");

        // Step 2: Attempt Mongo Connection
        console.log("2️⃣  Attempting Mongoose Connection...");
        mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
            .then(() => {
                console.log("✅ MOONGOOSE CONNECTED SUCCESSFULLY!");
                process.exit(0);
            })
            .catch(err => {
                console.error("❌ CONNECTION FAILED");
                console.error("---------------------------------------------------");
                console.error("Full Error:", err.message);

                if (err.message.includes('bad auth')) {
                    console.error("\n� AUTH ERROR: The username/password in .env.local is WRONG.");
                    console.error("   You said you created user 'ptaham', but .env.local uses a different name?");
                } else {
                    console.error("\n🌐 NETWORK ERROR: blocked access or IP not whitelisted.");
                    console.error("   - If you are on Office/School WiFi, port 27017 might be blocked.");
                    console.error("   - Try sharing mobile hotspot data to your laptop and run this test again.");
                }
                process.exit(1);
            });
    }
});
