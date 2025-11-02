base url :- https://edunutshell-lms.onrender.com"

## 🔐 Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|-----------|--------------|--------|
| `POST` | `/auth/register` | Register a new **student** | Public |
{
  "name": "Tsunade",    
  "email": "Tsunade@example.com",
  "password": "123456",
  "role": "admin"
}


| `POST` | `/auth/login` | Login as **student** or **admin** | Public |

"email":"sam@example.com",
  "password": "123456"


| `POST` | `/auth/refresh` | Generate new access token using refresh token | Authenticated |
| `POST` | `/auth/logout` | Logout user and clear refresh token cookie | Authenticated |


| `POST` | `/api/auth/create-admin` | Registers new admin | Admin Only |
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "123456"
}


## 🎓 Course Routes (`/api/courses`)
| Method | Endpoint | Description | Access |
|--------|-----------|--------------|--------|
| `POST` | `/courses/add` | Add a new course | Admin only |
{
  "title": "JS for Beginners 00",
  "description": "Learn the basics of React.js including hooks and components.",
  "price": 599,
  "image": "https://link-to-course-image.jpg",
  "level": ""
}


| `PATCH` | `/courses/:id` | Edit an existing course | Admin only |
{
  "title": "",
  "description": "Learn to build modern web applications using the MERN stack.",
  "price": 1000,
  "image": "https://via.placeholder.com/400x250.png?text=Full+Stack+Course",
  "level": ""
}

| `DELETE` | `/courses/delete/:id` | Delete a course | Admin only |
| `GET` | `/courses/list` | Get all available courses | Authenticated |

<!-- BELOW ONE YET TO BE MADE -->
<!-- | `GET` | `/courses/:id` | Get details of a specific course | Authenticated | -->

## 💳 Enrollment Routes (`/api/enrollments`)
| Method | Endpoint | Description | Access |
|--------|-----------|--------------|--------|
| `POST` | `/enrollments/enroll/:courseId` | Enroll a student into a course |
<!-- RAZORPAY ETC INTEGRATIONS TO BE MADE LATER -->

| `GET` | `/enrollments/my-courses` | Get all courses enrolled by logged-in user |

<!-- BELOW ONE YET TO BE MADE {DONE :)}  -->
<!-- | `GET` | `/enrollments/course/:id/students` | Get all students enrolled in a course | Admin only | -->

## 💬 Feedback Routes (`/api/feedback`)
| Method | Endpoint | Description | Access |
|--------|-----------|--------------|--------|
| `POST` | `/feedback` | Submit feedback of a particular course
{
  "course": "68e5ffe4dcff8aab76d29782",
  "message": "Loved the course, very helpful!",
  "rating": 5
  <!-- NOTE: FEEDBACK VALUES TO BE B/W 1&5 ONLY -->
}


| `GET` | `/feedback/course/:courseId` | Get all feedbacks of a specific course 



## 💬 AdminUser Routes (`/api/admin/users`)
| `GET` | `/admin/users` | Get all users | Admins only


| `DELETE` | `/admin/users/:userId` | Delete user.(NEEDS UPDAITON)
