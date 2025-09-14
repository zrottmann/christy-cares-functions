const sdk = require('node-appwrite');

// Initialize Appwrite SDK
const client = new sdk.Client();
const databases = new sdk.Databases(client);

// Configuration - Update these values
const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '689fd36e0032936147b1';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY; // Set this as environment variable
const DATABASE_ID = process.env.DATABASE_ID || 'christy-cares-db';
const MESSAGES_COLLECTION_ID = 'messages';

// Configure the client
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

async function setupMessagesCollection() {
  try {
    console.log('Setting up messages collection...');

    // Try to get the collection first
    let collection;
    try {
      collection = await databases.getCollection(DATABASE_ID, MESSAGES_COLLECTION_ID);
      console.log('Collection already exists:', collection.name);
    } catch (error) {
      if (error.code === 404) {
        // Collection doesn't exist, create it
        console.log('Creating messages collection...');
        try {
          collection = await databases.createCollection(
            DATABASE_ID,
            MESSAGES_COLLECTION_ID,
            'Messages',
            [
              sdk.Permission.read(sdk.Role.any()),
              sdk.Permission.create(sdk.Role.users()),
              sdk.Permission.update(sdk.Role.users()),
              sdk.Permission.delete(sdk.Role.users())
            ]
          );
          console.log('Collection created successfully');
        } catch (createError) {
          console.log('Collection might already exist, continuing with attribute setup...');
        }
      } else {
        console.log('Error checking collection:', error.message);
      }
    }

    // Define all required attributes
    const attributes = [
      { key: 'senderId', type: 'string', size: 255, required: true },
      { key: 'senderName', type: 'string', size: 255, required: true },
      { key: 'senderEmail', type: 'string', size: 255, required: false },
      { key: 'senderPhone', type: 'string', size: 50, required: false },
      { key: 'receiverId', type: 'string', size: 255, required: true },
      { key: 'recipientName', type: 'string', size: 255, required: false },
      { key: 'recipientEmail', type: 'string', size: 255, required: false },
      { key: 'recipientPhone', type: 'string', size: 50, required: false },
      { key: 'content', type: 'string', size: 5000, required: true },
      { key: 'subject', type: 'string', size: 500, required: false },
      { key: 'timestamp', type: 'datetime', required: true },
      { key: 'createdAt', type: 'datetime', required: true },
      { key: 'isRead', type: 'boolean', required: false, default: false },
      { key: 'readAt', type: 'datetime', required: false },
      { key: 'channel', type: 'string', size: 50, required: false },
      { key: 'status', type: 'string', size: 50, required: false },
      { key: 'attachments', type: 'string', size: 2000, required: false, array: true },
      { key: 'metadata', type: 'string', size: 2000, required: false }
    ];

    // Create attributes
    for (const attr of attributes) {
      try {
        console.log(`Creating attribute: ${attr.key}`);

        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            MESSAGES_COLLECTION_ID,
            attr.key,
            attr.size,
            attr.required,
            attr.default || null,
            attr.array || false
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            MESSAGES_COLLECTION_ID,
            attr.key,
            attr.required,
            attr.default
          );
        } else if (attr.type === 'datetime') {
          await databases.createDatetimeAttribute(
            DATABASE_ID,
            MESSAGES_COLLECTION_ID,
            attr.key,
            attr.required,
            attr.default || null
          );
        }

        console.log(`✓ Attribute ${attr.key} created`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`- Attribute ${attr.key} already exists`);
        } else {
          console.error(`✗ Error creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    // Create indexes for better query performance
    const indexes = [
      { key: 'sender_index', attributes: ['senderId'], orders: ['ASC'] },
      { key: 'receiver_index', attributes: ['receiverId'], orders: ['ASC'] },
      { key: 'timestamp_index', attributes: ['timestamp'], orders: ['DESC'] },
      { key: 'status_index', attributes: ['status'], orders: ['ASC'] }
    ];

    for (const index of indexes) {
      try {
        console.log(`Creating index: ${index.key}`);
        await databases.createIndex(
          DATABASE_ID,
          MESSAGES_COLLECTION_ID,
          index.key,
          sdk.IndexType.KEY,
          index.attributes,
          index.orders
        );
        console.log(`✓ Index ${index.key} created`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`- Index ${index.key} already exists`);
        } else {
          console.error(`✗ Error creating index ${index.key}:`, error.message);
        }
      }
    }

    console.log('\n✅ Messages collection setup complete!');

  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupMessagesCollection();