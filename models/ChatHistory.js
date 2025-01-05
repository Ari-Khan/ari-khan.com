import mongoose from 'mongoose';

// Define the ChatHistory schema
const ChatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true, // Ensure every entry has a user
    },
    message: {
      type: String,
      required: true, // Ensure every entry has a message
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const ChatHistory = mongoose.model('ChatHistory', ChatHistorySchema);

export default ChatHistory;
