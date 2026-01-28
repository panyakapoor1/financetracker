# Security Architecture & Implementation

This document details the comprehensive security measures implemented in the Finance Tracker SaaS platform.

## Table of Contents

1. [Security Overview](#security-overview)
2. [OWASP Top 10 Protection](#owasp-top-10-protection)
3. [Authentication & Authorization](#authentication--authorization)
4. [Data Protection](#data-protection)
5. [API Security](#api-security)
6. [Input Validation](#input-validation)
7. [Security Best Practices](#security-best-practices)
8. [Security Testing](#security-testing)

---

## Security Overview

The Finance Tracker implements defense-in-depth security with multiple layers:

```
┌─────────────────────────────────────────────┐
│ Frontend (React)                            │
│ - Client-side validation                    │
│ - Secure token storage                      │
│ - XSS prevention                            │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────┐
│ Security Middleware Layer                   │
│ - Helmet (HTTP headers)                     │
│ - CORS                                      │
│ - Rate limiting                             │
│ - Request sanitization                      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│ Authentication Layer                        │
│ - JWT verification                          │
│ - Token refresh mechanism                   │
│ - Role-based access control                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│ Business Logic Layer                        │
│ - Input validation (Joi)                    │
│ - Resource ownership checks                 │
│ - Error handling                            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│ Database Layer (MongoDB Atlas)              │
│ - Encrypted connections                     │
│ - Schema validation                         │
│ - Network isolation                         │
└─────────────────────────────────────────────┘
```

---

## OWASP Top 10 Protection

### A01:2021 – Broken Access Control

**Threat**: Users accessing resources they shouldn't.

**Implementation**:

1. **JWT-based Authentication**
   ```javascript
   // authMiddleware.js
   const protect = asyncHandler(async (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) throw new Error('Not authorized');
     
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.user = await User.findById(decoded.id);
     next();
   });
   ```

2. **Resource Ownership Verification**
   ```javascript
   // Check if user owns the resource
   if (transaction.userId.toString() !== req.user._id.toString()) {
     throw new Error('Not authorized to access this resource');
   }
   ```

3. **Role-Based Access Control**
   ```javascript
   const authorize = (...roles) => {
     return (req, res, next) => {
       if (!roles.includes(req.user.role)) {
         throw new Error('User role not authorized');
       }
       next();
     };
   };
   ```

**Testing**:
- ✅ Try accessing other users' transactions
- ✅ Attempt to modify resources without authentication
- ✅ Test with expired tokens

---

### A02:2021 – Cryptographic Failures

**Threat**: Exposure of sensitive data due to weak encryption.

**Implementation**:

1. **Password Hashing with bcrypt**
   ```javascript
   // User model
   userSchema.pre('save', async function(next) {
     if (!this.isModified('password')) return next();
     
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password, salt);
     next();
   });
   ```

2. **JWT Token Encryption**
   ```javascript
   const generateAccessToken = (userId) => {
     return jwt.sign(
       { id: userId },
       process.env.JWT_SECRET,
       { expiresIn: '15m' }
     );
   };
   ```

3. **Environment-based Secrets**
   - Never hardcode secrets
   - Use `.env` files (gitignored)
   - Rotate secrets regularly

**Testing**:
- ✅ Verify passwords are never stored in plain text
- ✅ Check database for hashed passwords
- ✅ Ensure tokens expire correctly

---

### A03:2021 – Injection

**Threat**: SQL/NoSQL injection attacks.

**Implementation**:

1. **Mongoose Schema Validation**
   ```javascript
   const transactionSchema = new mongoose.Schema({
     amount: {
       type: Number,
       required: true,
       min: [0.01, 'Amount must be greater than 0']
     }
   });
   ```

2. **MongoDB Sanitization**
   ```javascript
   const mongoSanitize = require('express-mongo-sanitize');
   app.use(mongoSanitize());
   ```

3. **Input Validation with Joi**
   ```javascript
   const schema = Joi.object({
     email: Joi.string().email().required(),
     password: Joi.string().min(6).required()
   });
   ```

**Testing**:
```bash
# Try NoSQL injection
POST /api/auth/login
{
  "email": { "$ne": null },
  "password": { "$ne": null }
}
# Should fail with validation error
```

---

### A04:2021 – Insecure Design

**Threat**: Fundamental flaws in application architecture.

**Implementation**:

1. **Secure by Default**
   - All routes protected by default
   - Whitelist approach for public routes
   - Principle of least privilege

2. **Security Middleware Order**
   ```javascript
   app.use(helmet());           // Security headers
   app.use(cors(corsOptions));  // CORS protection
   app.use(limiter);            // Rate limiting
   app.use(mongoSanitize());    // Input sanitization
   app.use(protect);            // Authentication
   ```

3. **Error Handling**
   - No sensitive data in error messages
   - Different messages for dev/production
   - Centralized error handling

---

### A05:2021 – Security Misconfiguration

**Threat**: Default configurations, verbose errors, exposed endpoints.

**Implementation**:

1. **HTTP Security Headers (Helmet)**
   ```javascript
   app.use(helmet());
   ```
   Sets:
   - `X-DNS-Prefetch-Control`
   - `X-Frame-Options`
   - `X-Content-Type-Options`
   - `Strict-Transport-Security`
   - `X-Download-Options`
   - `X-Permitted-Cross-Domain-Policies`

2. **CORS Configuration**
   ```javascript
   const corsOptions = {
     origin: process.env.FRONTEND_URL,
     credentials: true,
     optionsSuccessStatus: 200
   };
   ```

3. **Environment-Based Configuration**
   ```javascript
   if (process.env.NODE_ENV === 'development') {
     app.use(morgan('dev'));
   }
   ```

**Checklist**:
- ✅ Helmet enabled
- ✅ CORS configured
- ✅ No default credentials
- ✅ Production mode in deployment
- ✅ No verbose errors in production

---

### A06:2021 – Vulnerable Components

**Threat**: Using outdated or vulnerable dependencies.

**Implementation**:

1. **Regular Updates**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

2. **Dependency Security**
   - Use `package-lock.json`
   - Review dependencies regularly
   - Remove unused packages

3. **Version Pinning**
   ```json
   {
     "dependencies": {
       "express": "^4.18.2"
     }
   }
   ```

**Maintenance Schedule**:
- Weekly: `npm audit`
- Monthly: Update dependencies
- Quarterly: Major version upgrades

---

### A07:2021 – Authentication Failures

**Threat**: Weak authentication, session management issues.

**Implementation**:

1. **Strong Password Requirements**
   ```javascript
   password: Joi.string()
     .min(6)
     .required()
   ```

2. **JWT with Short Expiry**
   ```javascript
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   ```

3. **Token Refresh Mechanism**
   ```javascript
   const refreshAccessToken = async (req, res) => {
     const { refreshToken } = req.body;
     const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
     
     const user = await User.findById(decoded.id).select('+refreshToken');
     if (user.refreshToken !== refreshToken) {
       throw new Error('Invalid refresh token');
     }
     
     const newAccessToken = generateAccessToken(user._id);
     res.json({ accessToken: newAccessToken });
   };
   ```

4. **Logout Implementation**
   - Invalidate refresh token on logout
   - Clear client-side tokens

**Best Practices**:
- ✅ No password in responses
- ✅ Tokens expire
- ✅ Secure token storage
- ✅ Account lockout after failed attempts (optional)

---

### A08:2021 – Software & Data Integrity

**Threat**: Untrusted updates, insecure CI/CD.

**Implementation**:

1. **Git Workflow**
   ```bash
   git add .
   git commit -m "Descriptive message"
   git push origin main
   ```

2. **Code Review Process**
   - Pull request reviews
   - No direct commits to main
   - Automated testing

3. **Integrity Checks**
   - `package-lock.json` for dependency integrity
   - Git commit signing (optional)

---

### A09:2021 – Logging & Monitoring Failures

**Threat**: Insufficient logging, no alerting.

**Implementation**:

1. **Structured Logging**
   ```javascript
   // Development logging
   if (process.env.NODE_ENV === 'development') {
     app.use(morgan('dev'));
   }

   // Error logging (without sensitive data)
   console.error('Error:', {
     message: err.message,
     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
   });
   ```

2. **Security Events to Log**
   - Authentication attempts
   - Authorization failures
   - Input validation failures
   - API rate limit hits

3. **What NOT to Log**
   - Passwords
   - JWT tokens
   - Credit card numbers
   - Personal identifiable information (PII)

**Example Safe Logging**:
```javascript
// ❌ BAD
console.log('Login attempt:', { email, password });

// ✅ GOOD
console.log('Login attempt:', { email });
```

---

### A10:2021 – Server-Side Request Forgery (SSRF)

**Threat**: Server makes requests to unintended locations.

**Implementation**:

1. **Input Validation**
   - Validate all external URLs
   - Whitelist allowed domains
   - No direct user input in URLs

2. **Network Segmentation**
   - Database in private network
   - API server in DMZ
   - Frontend on CDN

---

## Authentication & Authorization

### JWT Token Flow

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │ Server  │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  1. POST /auth/login                        │
     │  { email, password }                        │
     ├─────────────────────────────────────────────>
     │                                              │
     │                      2. Verify credentials  │
     │                      3. Generate tokens     │
     │                                              │
     │  4. { accessToken, refreshToken }           │
     <─────────────────────────────────────────────┤
     │                                              │
     │  5. Store tokens (localStorage)             │
     │                                              │
     │  6. GET /api/transactions                   │
     │  Authorization: Bearer <accessToken>        │
     ├─────────────────────────────────────────────>
     │                                              │
     │                      7. Verify token        │
     │                      8. Process request     │
     │                                              │
     │  9. { data }                                │
     <─────────────────────────────────────────────┤
     │                                              │
     │  10. (Token expires)                        │
     │                                              │
     │  11. POST /auth/refresh                     │
     │  { refreshToken }                           │
     ├─────────────────────────────────────────────>
     │                                              │
     │                      12. Verify refresh     │
     │                      13. Generate new token │
     │                                              │
     │  14. { accessToken }                        │
     <─────────────────────────────────────────────┤
```

### Token Security

1. **Access Token**
   - Short-lived (15 minutes)
   - Stored in memory/localStorage
   - Used for API requests

2. **Refresh Token**
   - Long-lived (7 days)
   - Stored in httpOnly cookie (recommended) or localStorage
   - Used to get new access tokens
   - Invalidated on logout

---

## Data Protection

### Sensitive Data Handling

1. **Password Storage**
   ```javascript
   // NEVER store plain text
   ❌ user.password = "password123"
   
   // ALWAYS hash
   ✅ const salt = await bcrypt.genSalt(10);
   ✅ user.password = await bcrypt.hash(password, salt);
   ```

2. **Data Minimization**
   - Only collect necessary data
   - Don't log sensitive information
   - Remove sensitive fields from responses

3. **Database Encryption**
   - MongoDB Atlas uses encryption at rest
   - TLS/SSL for data in transit

---

## API Security

### Rate Limiting

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests'
});
```

### CORS Protection

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Request Size Limiting

```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

---

## Input Validation

### Joi Validation Examples

```javascript
// Email validation
email: Joi.string()
  .email()
  .required()

// Amount validation
amount: Joi.number()
  .positive()
  .required()

// Date validation
date: Joi.date()
  .optional()

// Enum validation
type: Joi.string()
  .valid('income', 'expense')
  .required()

// ObjectID validation
categoryId: Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
```

---

## Security Best Practices

### Development

1. **Use Environment Variables**
   ```javascript
   // ❌ BAD
   const secret = 'mysecretkey';
   
   // ✅ GOOD
   const secret = process.env.JWT_SECRET;
   ```

2. **Validate Everything**
   - Never trust user input
   - Validate on both client and server
   - Use strict schemas

3. **Error Handling**
   ```javascript
   // ❌ BAD - Exposes internal details
   res.status(500).json({ error: err.stack });
   
   // ✅ GOOD - Generic message
   res.status(500).json({ error: 'Server error' });
   ```

### Deployment

1. **Environment Configuration**
   - Use different `.env` for dev/prod
   - Never commit `.env` files
   - Use platform environment variables

2. **HTTPS Only**
   - All communication over HTTPS
   - Redirect HTTP to HTTPS
   - Use HSTS header

3. **Database Security**
   - Restrict IP access
   - Use strong passwords
   - Enable audit logging
   - Regular backups

---

## Security Testing

### Automated Tests

```bash
# Dependency vulnerabilities
npm audit

# Security headers
curl -I https://your-api.com | grep -i "x-"

# CORS
curl -H "Origin: https://evil.com" https://your-api.com/api/transactions
```

### Manual Testing

1. **Authentication**
   - Invalid credentials
   - Missing tokens
   - Expired tokens
   - Refresh token flow

2. **Authorization**
   - Access other users' resources
   - Modify without permission
   - Delete others' data

3. **Input Validation**
   - SQL/NoSQL injection
   - XSS attempts
   - Extremely large payloads
   - Invalid data types

4. **Rate Limiting**
   - Rapid requests
   - DDoS simulation

### Security Checklist

```
Authentication & Authorization
✅ JWT tokens implemented
✅ Refresh token mechanism
✅ Password hashing (bcrypt)
✅ Resource ownership checks
✅ Role-based access control

Data Protection
✅ No sensitive data in responses
✅ Encrypted database connections
✅ Secure token storage
✅ Data validation

API Security
✅ HTTPS enabled
✅ CORS configured
✅ Rate limiting
✅ Request size limits
✅ Security headers (Helmet)

Input Validation
✅ Joi validation schemas
✅ MongoDB sanitization
✅ Type checking
✅ Length restrictions

Error Handling
✅ Centralized error handler
✅ No stack traces in production
✅ Generic error messages
✅ Proper logging

Infrastructure
✅ Environment variables
✅ .gitignore configured
✅ MongoDB network restrictions
✅ Regular dependency updates
```

---

## Incident Response

### If a Security Issue is Found

1. **Immediate Actions**
   - Identify the scope
   - Contain the threat
   - Notify stakeholders

2. **Remediation**
   - Patch the vulnerability
   - Update affected systems
   - Reset compromised credentials

3. **Post-Incident**
   - Document the incident
   - Review and improve security
   - Update security policies

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
