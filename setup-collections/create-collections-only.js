const sdk = require('node-appwrite');

// Initialize Appwrite SDK
const client = new sdk.Client();
const databases = new sdk.Databases(client);

// Configuration
const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '689fd36e0032936147b1';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.DATABASE_ID || 'christy-cares-db';

// Configure the client
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

async function createCollections() {
  console.log('🚀 Creating missing collections...\n');

  const collections = [
    { id: 'conversations', name: 'Conversations' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'profiles', name: 'User Profiles' }
  ];

  for (const col of collections) {
    try {
      console.log(`Creating collection: ${col.name}...`);

      const collection = await databases.createCollection(
        DATABASE_ID,
        col.id,
        col.name,
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users())
        ]
      );

      console.log(`✅ Collection '${col.name}' created successfully!`);
      console.log(`   ID: ${collection.$id}`);

    } catch (error) {
      if (error.code === 409) {
        console.log(`⚠️  Collection '${col.name}' already exists`);
      } else {
        console.error(`❌ Failed to create '${col.name}':`, error.message);
      }
    }
  }

  console.log('\n✅ Collection creation complete!');
  console.log('Now run setup-all-collections.js to add attributes');
}

// Run the setup
createCollections();