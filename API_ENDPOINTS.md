# Owner Dashboard API Endpoints

## Updated Login API Response

The login API should now return gyms/centers data along with the token and owner information.

### POST /api/owner/auth/signin

**Request Body:**
```json
{
  "email": "owner@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "token": "jwt_token_here",
  "owner": {
    "id": "owner_id",
    "name": "John Doe",
    "email": "owner@example.com",
    "businessName": "Fitness Center Inc"
  },
  "gyms": [
    {
      "id": "gym_1",
      "name": "Main Gym Location",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "phone": "+1-555-0123",
      "email": "main@fitnesscenter.com",
      "capacity": 100,
      "description": "Main gym location with full facilities"
    },
    {
      "id": "gym_2",
      "name": "Downtown Branch",
      "address": "456 Broadway",
      "city": "New York",
      "state": "NY",
      "zipCode": "10002",
      "phone": "+1-555-0456",
      "email": "downtown@fitnesscenter.com",
      "capacity": 75,
      "description": "Downtown branch with modern equipment"
    }
  ]
}
```

**Response (Error - 401/400):**
```json
{
  "message": "Invalid credentials"
}
```

## New Add Gym API

### POST /api/owner/gym/add

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Gym Location",
  "address": "789 Oak Street",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90210",
  "phone": "+1-555-0789",
  "email": "newgym@fitnesscenter.com",
  "capacity": 150,
  "description": "New gym with state-of-the-art equipment",
  "website": "https://newgym.com",
  "establishedYear": 2024,
  "totalArea": 5000,
  "mainImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "gallery": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  ],
  "timings": [
    {
      "day": "Monday",
      "openTime": "06:00",
      "closeTime": "22:00",
      "isOpen": true
    },
    {
      "day": "Tuesday", 
      "openTime": "06:00",
      "closeTime": "22:00",
      "isOpen": true
    }
  ],
  "membershipPlans": [
    {
      "id": "plan_1",
      "name": "Basic",
      "price": 49,
      "duration": "monthly",
      "features": ["24/7 access", "Locker room", "Shower facilities"],
      "description": "Basic membership with essential amenities"
    },
    {
      "id": "plan_2", 
      "name": "Premium",
      "price": 89,
      "duration": "monthly",
      "features": ["24/7 access", "Personal trainer", "Nutrition consultation", "Group classes"],
      "description": "Premium membership with personal training"
    }
  ],
  "trainers": [
    {
      "id": "trainer_1",
      "name": "John Smith",
      "specialty": "Weight Training",
      "experience": "5 years",
      "bio": "Certified personal trainer with expertise in strength training",
      "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
      "certifications": ["NASM", "ACE", "CrossFit Level 1"]
    }
  ],
  "facilities": [
    {
      "id": "facility_1",
      "name": "Cardio Zone",
      "description": "State-of-the-art cardio equipment including treadmills, bikes, and rowing machines",
      "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
      "available": true
    },
    {
      "id": "facility_2",
      "name": "Weight Room",
      "description": "Comprehensive weight training area with free weights and machines",
      "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
      "available": true
    }
  ],
  "amenities": ["WiFi", "Parking", "Locker Room", "Shower", "Towel Service", "Water Station"],
  "rules": ["No outside food", "Proper gym attire required", "Equipment must be wiped down", "No photography without permission"],
  "contactInfo": {
    "managerName": "Jane Doe",
    "managerPhone": "+1-555-0123",
    "emergencyContact": "+1-555-9999"
  }
}
```

**Response (Success - 201):**
```json
{
  "message": "Gym added successfully",
  "gym": {
    "id": "gym_3",
    "name": "New Gym Location",
    "address": "789 Oak Street",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "phone": "+1-555-0789",
    "email": "newgym@fitnesscenter.com",
    "capacity": 150,
    "description": "New gym with state-of-the-art equipment",
    "website": "https://newgym.com",
    "establishedYear": 2024,
    "totalArea": 5000,
    "mainImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "gallery": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."],
    "timings": [{"day": "Monday", "openTime": "06:00", "closeTime": "22:00", "isOpen": true}],
    "membershipPlans": [{"id": "plan_1", "name": "Basic", "price": 49, "duration": "monthly", "features": ["24/7 access"], "description": "Basic membership"}],
    "trainers": [{"id": "trainer_1", "name": "John Smith", "specialty": "Weight Training", "experience": "5 years", "bio": "Certified trainer", "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...", "certifications": ["NASM"]}],
    "facilities": [{"id": "facility_1", "name": "Cardio Zone", "description": "Cardio equipment", "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...", "available": true}],
    "amenities": ["WiFi", "Parking", "Locker Room"],
    "rules": ["No outside food", "Proper gym attire required"],
    "contactInfo": {"managerName": "Jane Doe", "managerPhone": "+1-555-0123", "emergencyContact": "+1-555-9999"},
    "ownerId": "owner_id",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - 400/401):**
```json
{
  "message": "Validation error or unauthorized"
}
```

## Frontend Routing Logic

### Route Structure:
- `/` - Redirects based on authentication and gym count
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/add-first-gym` - Add first gym page (only accessible if user has 0 gyms)
- `/dashboard` - Main dashboard (only accessible if user has 1+ gyms)
- `/dashboard/members` - Members management
- `/dashboard/statistics` - Statistics page
- `/dashboard/notifications` - Notifications page
- `/dashboard/alerts` - Send alerts page
- `/dashboard/compare` - Compare centers page (only shown if user has 2+ gyms)
- `/dashboard/attendance` - Attendance management
- `/dashboard/preferences` - User preferences

### Redirect Logic:
1. **Not authenticated** → `/signin`
2. **Authenticated with 0 gyms** → `/add-first-gym`
3. **Authenticated with 1+ gyms** → `/dashboard`

### Sidebar Navigation:
- Compare Centers button only appears if user has more than 1 gym
- All navigation uses React Router for proper URL handling
- Active state is determined by current route path
