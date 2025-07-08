import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Environment variables with defaults
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notesapp';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Email configuration environment variables
const EMAIL_USER = process.env.EMAIL_USER; // Your Gmail email
const EMAIL_PASS = process.env.EMAIL_PASS; // Your Gmail app password or regular password
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail'; // 'gmail' or 'ethereal'

// Database connection
let db;
let mongoClient;

// Email transporter
let emailTransporter;

// In-memory OTP storage with expiry (production: use Redis)
const otpStore = new Map();
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

// ===========================================
// EMAIL CONFIGURATION
// ===========================================

const createEmailTransporter = async () => {
  if (EMAIL_SERVICE === 'ethereal') {
    // Use Ethereal for testing (creates fake SMTP service)
    console.log('🔧 Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    // Use Gmail or other SMTP service
    return nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
};

// ===========================================
// DATABASE CONNECTION
// ===========================================

const connectDB = async () => {
  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db();
    
    console.log('✅ MongoDB connected successfully');
    
    // Create indexes for better performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('notes').createIndex({ userId: 1 });
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiry
const storeOTP = (email, otp) => {
  const expiresAt = Date.now() + OTP_EXPIRY_TIME;
  otpStore.set(email, { otp, expiresAt });
  console.log(`📧 OTP stored for ${email}: ${otp} (expires in 5 minutes)`);
};

// Verify OTP
const verifyOTP = (email, providedOTP) => {
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return false; // No OTP found
  }
  
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email); // Clean up expired OTP
    return false; // OTP expired
  }
  
  return storedData.otp === providedOTP;
};

// Clear OTP from memory
const clearOTP = (email) => {
  otpStore.delete(email);
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Send OTP via email - REAL IMPLEMENTATION
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: EMAIL_USER || 'noreply@notesapp.com',
      to: email,
      subject: 'Your OTP for Notes App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Notes App - Email Verification</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #555;">Hello,</p>
            <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) for Notes App is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007bff; background: #e3f2fd; padding: 10px 20px; border-radius: 8px; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #666;">This OTP is valid for 5 minutes only.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this OTP, please ignore this email.</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            This is an automated message from Notes App. Please do not reply to this email.
          </p>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    if (EMAIL_SERVICE === 'ethereal') {
      console.log('📧 Ethereal Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    console.log('✅ OTP email sent successfully to:', email);
    return info;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// ===========================================
// MIDDLEWARE
// ===========================================

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// OTP request rate limiting (more restrictive)
const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 OTP requests per minute
  message: {
    success: false,
    message: 'Too many OTP requests. Please wait a minute before requesting again.'
  }
});

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = verifyToken(token);
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(decoded.userId) 
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Input validation middleware
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateOTPRequest = (req, res, next) => {
  const { email } = req.body;
  
  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  next();
};

const validateSignUp = (req, res, next) => {
  const { name, email, dateOfBirth, otp } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
  }
  
  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  if (!dateOfBirth) {
    return res.status(400).json({
      success: false,
      message: 'Date of birth is required'
    });
  }
  
  if (!otp || otp.length !== 6) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 6-digit OTP'
    });
  }
  
  next();
};

const validateSignIn = (req, res, next) => {
  const { email, otp } = req.body;
  
  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  if (!otp || otp.length !== 6) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 6-digit OTP'
    });
  }
  
  next();
};

const validateCreateNote = (req, res, next) => {
  const { title, content } = req.body;
  
  if (!title || title.trim().length < 1) {
    return res.status(400).json({
      success: false,
      message: 'Note title is required'
    });
  }
  
  if (!content || content.trim().length < 1) {
    return res.status(400).json({
      success: false,
      message: 'Note content is required'
    });
  }
  
  next();
};

// ===========================================
// AUTH ROUTES
// ===========================================

// Request OTP for signup or signin
app.post('/api/auth/request-otp', otpLimiter, validateOTPRequest, async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(email, otp);
    
    // Send OTP via email - REAL EMAIL SENDING
    await sendOTPEmail(email, otp);
    
    res.json({
      success: true,
      message: 'OTP sent successfully to your email. Please check your inbox and spam folder.'
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

// User signup with OTP verification - REMOVED PASSWORD HASHING
app.post('/api/auth/signup', validateSignUp, async (req, res) => {
  try {
    const { name, email, dateOfBirth, otp } = req.body;
    
    // Verify OTP
    if (!verifyOTP(email, otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create user - NO PASSWORD HASHING, OTP-ONLY AUTH
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      dateOfBirth: new Date(dateOfBirth),
      createdAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(userData);
    
    // Generate JWT token
    const token = generateToken(result.insertedId.toString());
    
    // Clear OTP from memory
    clearOTP(email);
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: result.insertedId.toString(),
        name: userData.name,
        email: userData.email
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again.'
    });
  }
});

// User signin with email and OTP
app.post('/api/auth/signin', validateSignIn, async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Verify OTP
    if (!verifyOTP(email, otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }
    
    // Find user
    const user = await db.collection('users').findOne({ 
      email: email.toLowerCase() 
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No account found with this email address'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user._id.toString());
    
    // Clear OTP from memory
    clearOTP(email);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sign in. Please try again.'
    });
  }
});

// ===========================================
// NOTES ROUTES (Protected)
// ===========================================

// Get all notes for authenticated user - FIXED TO ALWAYS RETURN ARRAY
app.get('/api/notes', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notes = await db.collection('notes')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    const formattedNotes = notes.map(note => ({
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      userId: note.userId
    }));
    
    // ENSURE NOTES IS ALWAYS AN ARRAY
    res.json({
      success: true,
      notes: Array.isArray(formattedNotes) ? formattedNotes : []
    });
  } catch (error) {
    console.error('Get notes error:', error);
    // RETURN EMPTY ARRAY ON ERROR TO PREVENT FRONTEND CRASHES
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      notes: [] // Always provide empty array fallback
    });
  }
});

// Create a new note
app.post('/api/notes', authenticate, validateCreateNote, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    
    const noteData = {
      title: title.trim(),
      content: content.trim(),
      userId,
      createdAt: new Date()
    };
    
    const result = await db.collection('notes').insertOne(noteData);
    
    const newNote = {
      id: result.insertedId.toString(),
      title: noteData.title,
      content: noteData.content,
      userId,
      createdAt: noteData.createdAt
    };
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: newNote
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create note'
    });
  }
});

// Get a specific note by ID
app.get('/api/notes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }
    
    const note = await db.collection('notes').findOne({
      _id: new ObjectId(id),
      userId
    });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      note: {
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        userId: note.userId
      }
    });
  } catch (error) {
    console.error('Get note by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch note'
    });
  }
});

// Update a note
app.put('/api/notes/:id', authenticate, validateCreateNote, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }
    
    const updateData = {
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('notes').findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Note updated successfully',
      note: {
        id: result.value._id.toString(),
        title: result.value.title,
        content: result.value.content,
        createdAt: result.value.createdAt,
        updatedAt: result.value.updatedAt,
        userId: result.value.userId
      }
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update note'
    });
  }
});

// Delete a note
app.delete('/api/notes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }
    
    const result = await db.collection('notes').deleteOne({
      _id: new ObjectId(id),
      userId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete note'
    });
  }
});

// ===========================================
// UTILITY ROUTES
// ===========================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    emailService: EMAIL_SERVICE,
    authMethod: 'OTP-only (no passwords)'
  });
});

// Get current user info
app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// ===========================================
// ERROR HANDLING
// ===========================================

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ===========================================
// SERVER STARTUP
// ===========================================

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  if (mongoClient) {
    await mongoClient.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  if (mongoClient) {
    await mongoClient.close();
  }
  process.exit(0);
});

// Connect to database, setup email, and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Setup email transporter
    emailTransporter = await createEmailTransporter();
    console.log('✅ Email transporter configured successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📧 Email service: ${EMAIL_SERVICE}`);
      console.log(`🔐 Authentication: OTP-only (no passwords)`);
      
      if (EMAIL_SERVICE === 'ethereal') {
        console.log('📧 Using Ethereal for testing - check console for preview URLs');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export for testing
export default app;