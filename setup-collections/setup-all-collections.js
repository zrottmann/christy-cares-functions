const sdk = require('node-appwrite');

// Initialize Appwrite SDK
const client = new sdk.Client();
const databases = new sdk.Databases(client);

// Configuration - Update these values
const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '689fd36e0032936147b1';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.DATABASE_ID || 'christy-cares-db';

// Configure the client
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

async function createCollection(collectionId, collectionName, attributes, indexes = []) {
  console.log(`\n📦 Setting up ${collectionName} collection...`);

  let collection;
  try {
    // Try to get existing collection
    collection = await databases.getCollection(DATABASE_ID, collectionId);
    console.log(`✓ Collection '${collectionName}' already exists`);
  } catch (error) {
    if (error.code === 404) {
      // Create new collection
      try {
        collection = await databases.createCollection(
          DATABASE_ID,
          collectionId,
          collectionName,
          [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.users()),
            sdk.Permission.update(sdk.Role.users()),
            sdk.Permission.delete(sdk.Role.users())
          ]
        );
        console.log(`✓ Collection '${collectionName}' created successfully`);
      } catch (createError) {
        console.log(`⚠️ Collection might already exist, continuing...`);
      }
    }
  }

  // Create attributes
  for (const attr of attributes) {
    try {
      console.log(`  Creating attribute: ${attr.key}`);

      if (attr.type === 'string') {
        await databases.createStringAttribute(
          DATABASE_ID,
          collectionId,
          attr.key,
          attr.size,
          attr.required,
          attr.default || null,
          attr.array || false
        );
      } else if (attr.type === 'boolean') {
        await databases.createBooleanAttribute(
          DATABASE_ID,
          collectionId,
          attr.key,
          attr.required,
          attr.default
        );
      } else if (attr.type === 'datetime') {
        await databases.createDatetimeAttribute(
          DATABASE_ID,
          collectionId,
          attr.key,
          attr.required,
          attr.default || null
        );
      } else if (attr.type === 'integer') {
        await databases.createIntegerAttribute(
          DATABASE_ID,
          collectionId,
          attr.key,
          attr.required,
          attr.default || null,
          attr.min || null,
          attr.max || null
        );
      }

      console.log(`  ✓ Attribute ${attr.key} created`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`  - Attribute ${attr.key} already exists`);
      } else {
        console.error(`  ✗ Error creating attribute ${attr.key}:`, error.message);
      }
    }
  }

  // Create indexes
  for (const index of indexes) {
    try {
      console.log(`  Creating index: ${index.key}`);
      await databases.createIndex(
        DATABASE_ID,
        collectionId,
        index.key,
        'key',
        index.attributes,
        index.orders
      );
      console.log(`  ✓ Index ${index.key} created`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`  - Index ${index.key} already exists`);
      } else {
        console.error(`  ✗ Error creating index ${index.key}:`, error.message);
      }
    }
  }
}

async function setupAllCollections() {
  try {
    console.log('🚀 Setting up all Christy Cares collections...\n');

    // 1. Messages Collection (already exists, but ensure all attributes)
    await createCollection(
      'messages',
      'Messages',
      [
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
      ],
      [
        { key: 'sender_idx', attributes: ['senderId'], orders: ['ASC'] },
        { key: 'receiver_idx', attributes: ['receiverId'], orders: ['ASC'] },
        { key: 'timestamp_idx', attributes: ['timestamp'], orders: ['DESC'] }
      ]
    );

    // 2. Conversations Collection
    await createCollection(
      'conversations',
      'Conversations',
      [
        { key: 'participant1Id', type: 'string', size: 255, required: true },
        { key: 'participant1Name', type: 'string', size: 255, required: true },
        { key: 'participant2Id', type: 'string', size: 255, required: true },
        { key: 'participant2Name', type: 'string', size: 255, required: true },
        { key: 'lastMessage', type: 'string', size: 1000, required: false },
        { key: 'lastMessageTime', type: 'datetime', required: false },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'unreadCount1', type: 'integer', required: false, default: 0, min: 0 },
        { key: 'unreadCount2', type: 'integer', required: false, default: 0, min: 0 },
        { key: 'isActive', type: 'boolean', required: false, default: true }
      ],
      [
        { key: 'participant1_idx', attributes: ['participant1Id'], orders: ['ASC'] },
        { key: 'participant2_idx', attributes: ['participant2Id'], orders: ['ASC'] },
        { key: 'lastMessage_idx', attributes: ['lastMessageTime'], orders: ['DESC'] }
      ]
    );

    // 3. Notifications Collection
    await createCollection(
      'notifications',
      'Notifications',
      [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'body', type: 'string', size: 1000, required: true },
        { key: 'timestamp', type: 'datetime', required: true },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'isRead', type: 'boolean', required: false, default: false },
        { key: 'type', type: 'string', size: 50, required: false },
        { key: 'data', type: 'string', size: 2000, required: false },
        { key: 'actionUrl', type: 'string', size: 500, required: false }
      ],
      [
        { key: 'user_idx', attributes: ['userId'], orders: ['ASC'] },
        { key: 'timestamp_idx', attributes: ['timestamp'], orders: ['DESC'] },
        { key: 'isRead_idx', attributes: ['isRead'], orders: ['ASC'] }
      ]
    );

    // 4. User Profiles Collection
    await createCollection(
      'profiles',
      'User Profiles',
      [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'email', type: 'string', size: 255, required: true },
        { key: 'phone', type: 'string', size: 50, required: false },
        { key: 'role', type: 'string', size: 50, required: true },
        { key: 'avatar', type: 'string', size: 500, required: false },
        { key: 'bio', type: 'string', size: 1000, required: false },
        { key: 'address', type: 'string', size: 500, required: false },
        { key: 'city', type: 'string', size: 100, required: false },
        { key: 'state', type: 'string', size: 50, required: false },
        { key: 'zipCode', type: 'string', size: 20, required: false },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: false },
        { key: 'isActive', type: 'boolean', required: false, default: true },
        { key: 'metadata', type: 'string', size: 2000, required: false }
      ],
      [
        { key: 'userId_idx', attributes: ['userId'], orders: ['ASC'] },
        { key: 'email_idx', attributes: ['email'], orders: ['ASC'] },
        { key: 'role_idx', attributes: ['role'], orders: ['ASC'] }
      ]
    );

    // 5. Appointments Collection
    await createCollection(
      'appointments',
      'Appointments',
      [
        { key: 'patientId', type: 'string', size: 255, required: true },
        { key: 'patientName', type: 'string', size: 255, required: true },
        { key: 'caregiverId', type: 'string', size: 255, required: true },
        { key: 'caregiverName', type: 'string', size: 255, required: true },
        { key: 'date', type: 'datetime', required: true },
        { key: 'startTime', type: 'string', size: 10, required: true },
        { key: 'endTime', type: 'string', size: 10, required: true },
        { key: 'service', type: 'string', size: 255, required: true },
        { key: 'status', type: 'string', size: 50, required: true },
        { key: 'notes', type: 'string', size: 2000, required: false },
        { key: 'location', type: 'string', size: 500, required: false },
        { key: 'price', type: 'integer', required: false, min: 0 },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: false },
        { key: 'cancelledAt', type: 'datetime', required: false },
        { key: 'cancelReason', type: 'string', size: 500, required: false }
      ],
      [
        { key: 'patient_idx', attributes: ['patientId'], orders: ['ASC'] },
        { key: 'caregiver_idx', attributes: ['caregiverId'], orders: ['ASC'] },
        { key: 'date_idx', attributes: ['date'], orders: ['DESC'] },
        { key: 'status_idx', attributes: ['status'], orders: ['ASC'] }
      ]
    );

    console.log('\n✅ All collections setup complete!');
    console.log('Your Christy Cares database is ready to use.');

  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupAllCollections();