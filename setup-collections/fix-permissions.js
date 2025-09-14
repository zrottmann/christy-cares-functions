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

async function updateCollectionPermissions() {
  console.log('🔐 Updating collection permissions...\n');

  const collections = [
    'messages',
    'conversations',
    'notifications',
    'profiles',
    'appointments'
  ];

  for (const collectionId of collections) {
    try {
      console.log(`Updating permissions for: ${collectionId}`);

      // Update collection with proper permissions
      await databases.updateCollection(
        DATABASE_ID,
        collectionId,
        collectionId, // Keep the same name
        [
          sdk.Permission.read(sdk.Role.any()),     // Anyone can read
          sdk.Permission.create(sdk.Role.users()), // Any logged-in user can create
          sdk.Permission.update(sdk.Role.users()), // Any logged-in user can update
          sdk.Permission.delete(sdk.Role.users()), // Any logged-in user can delete
        ],
        true // documentSecurity enabled
      );

      console.log(`✅ Updated permissions for ${collectionId}`);

    } catch (error) {
      if (error.code === 404) {
        console.log(`⚠️  Collection '${collectionId}' not found`);
      } else {
        console.error(`❌ Failed to update '${collectionId}':`, error.message);
      }
    }
  }

  console.log('\n✅ Permission update complete!');
  console.log('Note: You may also need to set document-level permissions when creating documents.');
}

// Run the update
updateCollectionPermissions();