const sdk = require('node-appwrite');

module.exports = async function(req, res) {
  // Initialize Appwrite SDK
  const client = new sdk.Client();
  const databases = new sdk.Databases(client);

  // Get environment variables
  const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    DATABASE_ID,
    MESSAGES_COLLECTION_ID
  } = req.variables;

  // Configure the client
  client
    .setEndpoint(APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  try {
    // Parse the request payload
    const payload = JSON.parse(req.payload || '{}');

    // Validate required fields
    if (!payload.senderId || !payload.senderName || !payload.content) {
      return res.json({
        success: false,
        error: 'Missing required fields: senderId, senderName, or content'
      }, 400);
    }

    // Create the message document with createdAt field
    const messageData = {
      senderId: payload.senderId,
      senderName: payload.senderName,
      senderEmail: payload.senderEmail || '',
      senderPhone: payload.senderPhone || '',
      receiverId: 'broadcast', // Special ID for broadcast messages
      recipientName: 'All Users',
      recipientEmail: '',
      recipientPhone: '',
      content: payload.content,
      subject: payload.subject || `Community message from ${payload.senderName}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(), // Required by Appwrite
      isRead: false,
      readAt: null,
      channel: 'app',
      status: 'broadcast',
      attachments: payload.attachments || [],
      metadata: JSON.stringify({ type: 'broadcast' })
    };

    // Create the document in Appwrite
    const document = await databases.createDocument(
      DATABASE_ID,
      MESSAGES_COLLECTION_ID,
      sdk.ID.unique(),
      messageData
    );

    // Return success response
    return res.json({
      success: true,
      message: 'Broadcast message sent successfully',
      documentId: document.$id,
      data: document
    });

  } catch (error) {
    console.error('Error sending broadcast message:', error);

    // Return error response
    return res.json({
      success: false,
      error: error.message || 'Failed to send broadcast message',
      details: error
    }, 500);
  }
};