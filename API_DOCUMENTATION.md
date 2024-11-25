````markdown:API_DOCUMENTATION.md
# API Documentation

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "role": "employee",
    "department": "IT",
    "position": "Developer"
}
````

### Login

```http
POST /auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### Logout

```http
GET /auth/logout
```

## Employee Endpoints

### Get All Employees (Managers Only)

```http
GET /employee
Authorization: Bearer {token}
```

### Get Own Profile

```http
GET /employee/profile
Authorization: Bearer {token}
```

### Update Own Profile

```http
PUT /employee/profile
Authorization: Bearer {token}
Content-Type: application/json

{
    "fullName": "Updated Name",
    "department": "New Department",
    "position": "New Position"
}
```

### Add New Employee (Managers Only)

```http
POST /employee
Authorization: Bearer {token}
Content-Type: application/json

{
    "email": "newemployee@example.com",
    "password": "password123",
    "fullName": "New Employee",
    "department": "Marketing",
    "position": "Coordinator"
}
```

### Update Employee (Managers Only)

```http
PUT /employee/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "fullName": "Updated Employee Name",
    "department": "Updated Department",
    "position": "Updated Position"
}
```

### Delete Employee (Managers Only)

```http
DELETE /employee/:id
Authorization: Bearer {token}
```

## Response Formats

### Success Response

```json
{
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "message": "Error message"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 500: Server Error

## Authentication

All protected routes require a valid JWT token in the session. The token is automatically handled by the session middleware.
