# 📦 MongoDB Data Transfer Instructions

## 🎯 **What's Included in This Backup**

### **Collections Exported:**
- **users** (2 documents) - User accounts from Google OAuth
- **user_profiles** (1 document) - Professional profiles  
- **connection_requests** (1 document) - Connection request data
- **user_sessions** (2 documents) - Active user sessions

### **Backup Files Created:**
```
mongodb_backup/
├── test_database/          # Binary BSON backup (use for full restore)
│   ├── users.bson
│   ├── user_profiles.bson
│   ├── connection_requests.bson
│   ├── user_sessions.bson
│   └── *.metadata.json
└── json_export/           # Human-readable JSON files
    ├── users.json
    ├── user_profiles.json
    ├── connection_requests.json
    └── user_sessions.json
```

---

## 🌐 **Option 1: MongoDB Atlas (Cloud - Recommended)**

### **Step 1: Setup MongoDB Atlas**
1. Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Sign up/Login to MongoDB Atlas
3. Create a new cluster (Free M0 tier available)
4. Create a database user with read/write permissions
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)
6. Get your connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

### **Step 2: Import Data to Atlas**
```bash
# Install MongoDB Database Tools if not installed
# Download from: https://www.mongodb.com/try/download/database-tools

# Restore complete database (replace with your Atlas connection string)
mongorestore --uri "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/meetup_network" mongodb_backup/test_database/

# OR import individual collections:
mongoimport --uri "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/meetup_network" --collection users --file mongodb_backup/json_export/users.json --jsonArray
mongoimport --uri "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/meetup_network" --collection user_profiles --file mongodb_backup/json_export/user_profiles.json --jsonArray
mongoimport --uri "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/meetup_network" --collection connection_requests --file mongodb_backup/json_export/connection_requests.json --jsonArray
```

---

## 🖥️ **Option 2: Self-Hosted MongoDB**

### **Step 1: Install MongoDB on Your Server**
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Or using Docker
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest
```

### **Step 2: Import Data to Your MongoDB**
```bash
# Restore complete database
mongorestore --host localhost:27017 --db meetup_network mongodb_backup/test_database/

# OR import individual collections
mongoimport --host localhost:27017 --db meetup_network --collection users --file mongodb_backup/json_export/users.json --jsonArray
mongoimport --host localhost:27017 --db meetup_network --collection user_profiles --file mongodb_backup/json_export/user_profiles.json --jsonArray
mongoimport --host localhost:27017 --db meetup_network --collection connection_requests --file mongodb_backup/json_export/connection_requests.json --jsonArray
```

---

## ⚙️ **Step 3: Update Application Configuration**

### **Update Backend Environment Variables:**
Edit `/app/backend/.env`:

```bash
# For MongoDB Atlas:
MONGO_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
DB_NAME="meetup_network"

# For Self-hosted MongoDB:
MONGO_URL="mongodb://your-server-ip:27017"
DB_NAME="meetup_network"

# Keep existing CORS settings:
CORS_ORIGINS="https://techconnect-15.preview.emergentagent.com,http://localhost:3000"
```

### **Restart Backend Service:**
```bash
sudo supervisorctl restart backend
```

---

## ✅ **Step 4: Verify Data Transfer**

### **Check Collections:**
```bash
# For Atlas (use MongoDB Compass or Atlas UI)
# For Self-hosted:
mongosh "mongodb://your-server-ip:27017/meetup_network"

# Verify data:
db.users.countDocuments()           // Should return 2
db.user_profiles.countDocuments()   // Should return 1  
db.connection_requests.countDocuments() // Should return 1

# View actual data:
db.users.find().pretty()
db.user_profiles.find().pretty()
```

### **Test Application:**
1. Visit your application
2. Sign in with Google OAuth
3. Check if your existing profile loads
4. Verify all features work (browse, connections, messaging)

---

## 🔒 **Security Best Practices**

### **For Production:**
1. **Use strong passwords** for database users
2. **Restrict IP access** to your application servers only
3. **Enable SSL/TLS** for database connections
4. **Use environment variables** for connection strings
5. **Regular backups** with automated schedules

### **MongoDB Atlas Security:**
- Enable network access restrictions
- Use database-specific users (not admin)
- Enable audit logging if needed
- Set up monitoring and alerts

### **Self-hosted Security:**
- Configure firewall rules (only allow port 27017 from application servers)
- Enable authentication: `mongod --auth`
- Use replica sets for high availability
- Regular security updates

---

## 📋 **Troubleshooting**

### **Common Issues:**

#### **Connection String Problems:**
```bash
# Test connection:
mongosh "your-connection-string"

# Common fixes:
# - URL encode special characters in password
# - Check IP whitelist in Atlas
# - Verify database name exists
# - Check firewall rules for self-hosted
```

#### **Import Errors:**
```bash
# Check collection names match:
db.getCollectionNames()

# Verify document count:
db.collectionName.countDocuments()

# Check indexes if needed:
db.collectionName.getIndexes()
```

#### **Application Connection Issues:**
```bash
# Check backend logs:
tail -f /var/log/supervisor/backend.err.log

# Test database connectivity:
python3 -c "
from motor.motor_asyncio import AsyncIOMotorClient
client = AsyncIOMotorClient('your-mongo-url')
print(await client.list_database_names())
"
```

---

## 📞 **Next Steps After Transfer**

1. **Test all application features** thoroughly
2. **Setup automated backups** for your new database  
3. **Monitor performance** and optimize if needed
4. **Update documentation** with new database details
5. **Setup alerts** for database health monitoring

Your data includes real user profiles and connection requests, so the transfer will maintain all existing functionality and user data!