# Postman API Testing Guide

This guide will help you test the Finance Tracker API using Postman.

## Setup

### 1. Import Environment

Create a new environment in Postman with the following variables:

```json
{
  "base_url": "http://localhost:5000/api",
  "token": "",
  "refresh_token": "",
  "user_id": ""
}
```

### 2. Collection Structure

Organize your requests into folders:

```
Finance Tracker API
├── Auth
│   ├── Register
│   ├── Login
│   ├── Refresh Token
│   ├── Get Profile
│   ├── Update Profile
│   ├── Change Password
│   └── Logout
├── Transactions
│   ├── Get All Transactions
│   ├── Get Transaction by ID
│   ├── Create Transaction
│   ├── Update Transaction
│   ├── Delete Transaction
│   └── Get Transaction Stats
├── Categories
│   ├── Get All Categories
│   ├── Get Category by ID
│   ├── Create Category
│   ├── Update Category
│   ├── Delete Category
│   └── Get Category Stats
├── Budgets
│   ├── Get All Budgets
│   ├── Get Budget by ID
│   ├── Create Budget
│   ├── Update Budget
│   ├── Delete Budget
│   └── Get Budget Alerts
├── Dashboard
│   ├── Get Summary
│   ├── Get Analytics
│   └── Get Trends
└── Reports
    ├── Export CSV
    ├── Get Summary Report
    └── Get Income vs Expense Report
```

## API Endpoints

### Authentication

#### 1. Register
**POST** `{{base_url}}/auth/register`

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Tests Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.accessToken);
    pm.environment.set("refresh_token", response.data.refreshToken);
    pm.environment.set("user_id", response.data.user.id);
}
```

#### 2. Login
**POST** `{{base_url}}/auth/login`

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Tests Script:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.accessToken);
    pm.environment.set("refresh_token", response.data.refreshToken);
    pm.environment.set("user_id", response.data.user.id);
}
```

#### 3. Refresh Token
**POST** `{{base_url}}/auth/refresh`

**Body (JSON):**
```json
{
  "refreshToken": "{{refresh_token}}"
}
```

**Tests Script:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.accessToken);
}
```

#### 4. Get Profile
**GET** `{{base_url}}/auth/me`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 5. Logout
**POST** `{{base_url}}/auth/logout`

**Headers:**
```
Authorization: Bearer {{token}}
```

### Transactions

#### 1. Get All Transactions
**GET** `{{base_url}}/transactions`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `type` (optional): income | expense
- `categoryId` (optional): Category ID
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD
- `sortBy` (optional): date | amount (default: date)
- `order` (optional): asc | desc (default: desc)

**Example:**
```
{{base_url}}/transactions?page=1&limit=10&type=expense&sortBy=date&order=desc
```

#### 2. Create Transaction
**POST** `{{base_url}}/transactions`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "amount": 150.50,
  "type": "expense",
  "categoryId": "6789abcd1234567890abcdef",
  "date": "2026-01-28",
  "description": "Grocery shopping"
}
```

#### 3. Update Transaction
**PUT** `{{base_url}}/transactions/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "amount": 175.00,
  "description": "Updated description"
}
```

#### 4. Delete Transaction
**DELETE** `{{base_url}}/transactions/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 5. Get Transaction Stats
**GET** `{{base_url}}/transactions/stats/summary`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

### Categories

#### 1. Get All Categories
**GET** `{{base_url}}/categories`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `type` (optional): income | expense

#### 2. Create Category
**POST** `{{base_url}}/categories`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "name": "Coffee",
  "type": "expense",
  "icon": "☕",
  "color": "#8b4513"
}
```

#### 3. Update Category
**PUT** `{{base_url}}/categories/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "name": "Coffee & Tea",
  "color": "#6f4e37"
}
```

#### 4. Delete Category
**DELETE** `{{base_url}}/categories/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

### Budgets

#### 1. Get All Budgets
**GET** `{{base_url}}/budgets`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `month` (optional): YYYY-MM format

#### 2. Create Budget
**POST** `{{base_url}}/budgets`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "categoryId": "6789abcd1234567890abcdef",
  "month": "2026-02",
  "limit": 500
}
```

#### 3. Update Budget
**PUT** `{{base_url}}/budgets/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "limit": 600
}
```

#### 4. Get Budget Alerts
**GET** `{{base_url}}/budgets/alerts`

**Headers:**
```
Authorization: Bearer {{token}}
```

### Dashboard

#### 1. Get Summary
**GET** `{{base_url}}/dashboard/summary`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 2. Get Analytics
**GET** `{{base_url}}/dashboard/analytics`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD
- `period` (optional): monthly | daily

### Reports

#### 1. Export CSV
**GET** `{{base_url}}/reports/csv`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD
- `type` (optional): income | expense

#### 2. Get Summary Report
**GET** `{{base_url}}/reports/summary`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

#### 3. Get Income vs Expense Report
**GET** `{{base_url}}/reports/income-expense`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `year` (optional): YYYY (default: current year)

## Pre-request Scripts

### Global Pre-request Script

Add this to your collection's pre-request scripts to automatically handle token refresh:

```javascript
const token = pm.environment.get("token");
const refreshToken = pm.environment.get("refresh_token");

if (!token && refreshToken) {
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/auth/refresh",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: {
            mode: "raw",
            raw: JSON.stringify({
                refreshToken: refreshToken
            })
        }
    }, function (err, res) {
        if (!err && res.code === 200) {
            const response = res.json();
            pm.environment.set("token", response.data.accessToken);
        }
    });
}
```

## Test Cases

### Authentication Tests

1. **Register with valid data** → Should return 201
2. **Register with existing email** → Should return 400
3. **Login with valid credentials** → Should return 200 and tokens
4. **Login with invalid credentials** → Should return 401
5. **Access protected route without token** → Should return 401
6. **Access protected route with expired token** → Should return 401
7. **Refresh token with valid refresh token** → Should return 200
8. **Logout** → Should return 200

### Transaction Tests

1. **Create transaction with valid data** → Should return 201
2. **Create transaction with invalid category** → Should return 404
3. **Get all transactions** → Should return 200 with pagination
4. **Filter transactions by type** → Should return 200
5. **Filter transactions by date range** → Should return 200
6. **Update own transaction** → Should return 200
7. **Delete own transaction** → Should return 200
8. **Access other user's transaction** → Should return 403

### Category Tests

1. **Get all categories** → Should return 200 (including default categories)
2. **Create custom category** → Should return 201
3. **Create duplicate category** → Should return 400
4. **Update own category** → Should return 200
5. **Delete category with transactions** → Should return 400
6. **Delete unused category** → Should return 200

### Budget Tests

1. **Create budget with valid data** → Should return 201
2. **Create duplicate budget** → Should return 400
3. **Get budget alerts** → Should return 200
4. **Update budget limit** → Should return 200
5. **Delete budget** → Should return 200

## Common Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Not authorized, no token provided"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Server error message"
}
```

## Tips

1. **Save requests** after successful tests
2. **Use variables** for dynamic data (IDs, tokens)
3. **Add descriptions** to each request
4. **Organize folders** logically
5. **Use Tests tab** to automate variable setting
6. **Export collection** for sharing with team
7. **Use environment variables** for different environments (dev, staging, prod)

## Workflow Example

1. Register a new user
2. Login to get tokens
3. Create custom categories
4. Create transactions
5. Set up budgets
6. Check dashboard summary
7. View analytics
8. Export reports
9. Logout

## Security Testing

Test the following security scenarios:

1. **SQL/NoSQL Injection**: Try injecting malicious code in inputs
2. **XSS**: Try HTML/JavaScript in text fields
3. **Rate Limiting**: Make multiple rapid requests
4. **Token Expiry**: Wait for token to expire and test refresh
5. **IDOR**: Try accessing other users' resources
6. **Invalid ObjectIDs**: Use malformed IDs in requests
