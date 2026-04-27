# 🚌 GoBus — Online Bus Ticket Booking Platform

A full-stack MERN application inspired by GoBus — India's leading bus ticket booking platform. Built with modern technologies including React 19, Node.js, MongoDB, Stripe payments, Groq AI chatbot, and more.

---

## 🌐 Live Demo

🔗 **[Live Demo](https://your-app.netlify.app)**

📁 **[GitHub Repository](https://github.com/hemahemapathi/bus-booking-system)**

⚙️ **[API Server](https://bus-booking-system-c4qp.onrender.com)**

---

## 📸 Screenshots

### 🏠 Home Page
<img width="1588" height="3240" alt="Home" src="https://github.com/user-attachments/assets/2b37f4f1-0be6-483d-98d0-2a014816da50" />

### 🔍 Search Results
<img width="1588" height="1003" alt="Search" src="https://github.com/user-attachments/assets/0fe93aef-6537-424f-afca-e8be3f7bedca" />

### 💺 Seat Selection
<img width="1588" height="1090" alt="Seats" src="https://github.com/user-attachments/assets/f89cef59-7de3-424a-b25d-c295417f2508" />

### 💳 Payment
<img width="1588" height="1193" alt="Payment" src="https://github.com/user-attachments/assets/67c5bd67-9669-4413-98a8-ca9ea26519aa" />

### ⭐ Rate & Review
<img width="1588" height="1345" alt="Review" src="https://github.com/user-attachments/assets/5a32581b-59e3-4db9-93a8-2488ab2a0343" />

### 🎟️ My Bookings
<img width="1588" height="1003" alt="My Bookings" src="https://github.com/user-attachments/assets/6f7a7fd1-c8bc-4ee1-b34f-f234a2ca1025" />

### 👤 Profile
<img width="1588" height="1026" alt="Profile" src="https://github.com/user-attachments/assets/587e70ef-364c-4ae9-b0b2-3156956835e7" />

### 🛡️ Admin Dashboard
<img width="1588" height="1274" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/a2e792a7-6c65-4f8b-aa30-ccc546ea2836" />

---

## ✨ Features

### 👤 User Features
- 🔍 **Bus Search** — Search buses by source, destination and date
- 💺 **Seat Selection** — Interactive 2+2 seat layout with gender color map (Male=Red, Female=Pink, Other=Purple, Selected=Blue)
- 💳 **Stripe Payments** — Secure card payments via Stripe
- 🎁 **Coupon Discounts** — Apply coupon codes at checkout (FIRST10, SAVE50, TRAVEL100)
- 📄 **PDF Ticket Download** — Download booking ticket as PDF from My Bookings
- 📧 **Email Confirmation** — Booking confirmation email sent automatically after payment
- ❌ **Free Cancellation** — Cancel any confirmed booking before journey date
- ⭐ **Rate & Review** — Rate your journey and leave a review after travel
- 🔔 **Trip Reminders** — Browser notification 1 hour before departure
- 👤 **User Profile** — Edit name, phone, change password, view booking stats
- 📱 **Mobile Responsive** — Fully responsive on all screen sizes

### 🔐 Authentication
- JWT-based authentication (7 day expiry)
- Role-based access control (user / admin)
- Admin accounts auto-assigned via `@admins.com` email
- Protected routes for user and admin pages
- Persistent login via localStorage

### 🤖 AI Chatbot
- Powered by **Groq AI** (Llama 3.1 8B Instant model)
- Answers questions about booking, cancellation, coupons, refund policy
- Quick reply buttons for common questions
- Typing indicator animation
- Responds in user's language

### 🛡️ Admin Panel
- 📊 **Dashboard** — Total bookings, revenue, users, buses, popular routes, recent activity
- 🚌 **Manage Buses** — Add, edit, delete buses with full details
- 📋 **Manage Bookings** — View all bookings, filter by status, delete
- 👥 **Manage Users** — View all users, delete (admin-protected)
- 🎟️ **Manage Coupons** — Create, edit, enable/disable, delete coupons
- 👤 **Admin Profile** — Edit name, phone, change password
- 📱 **Mobile Sidebar** — Hamburger menu with slide-in overlay on mobile

### 🎨 UI/UX
- Scroll animations on all pages (IntersectionObserver — no library)
- GoBus-themed red color scheme
- Custom date picker component
- Auto-rotating ad banner with 4 slides
- Exit intent feedback modal
- Alternating table rows, pill buttons, status badges
- Custom ConfirmModal (no browser confirm())
- Toast notifications (react-hot-toast)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.5 | UI framework |
| Vite | 8.0.10 | Build tool & dev server |
| Tailwind CSS | 4.2.4 | Utility-first CSS framework |
| React Router DOM | 7.14.2 | Client-side routing |
| Axios | 1.15.2 | HTTP client |
| @stripe/react-stripe-js | 6.2.0 | Stripe payment UI |
| @stripe/stripe-js | 9.3.1 | Stripe JS SDK |
| react-hot-toast | 2.6.0 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express | 4.19.2 | Web framework |
| MongoDB | Atlas | Database |
| Mongoose | 8.4.1 | MongoDB ODM |
| JSON Web Token | 9.0.2 | Authentication |
| bcryptjs | 2.4.3 | Password hashing |
| Stripe | 15.7.0 | Payment processing |
| Nodemailer | 8.0.6 | Email service |
| PDFKit | 0.18.0 | PDF ticket generation |
| dotenv | 16.4.5 | Environment variables |
| cors | 2.8.5 | Cross-origin requests |
| nodemon | 3.1.3 | Dev auto-restart |

### External Services
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Stripe | Payment processing |
| Groq AI (Llama 3.1) | AI chatbot |
| Gmail (Nodemailer) | Email confirmations |
| Render.com | Backend hosting |
| Netlify | Frontend hosting |

### Package Manager
- **pnpm** — Fast, disk-efficient package manager

---

## 📁 Project Structure

```
GoBus-booking/
├── client/                          # React frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── sw.js                    # Service Worker (notifications)
│   │   └── _redirects               # Netlify redirects
│   └── src/
│       ├── api/
│       │   └── axios.js             # Axios instance with auth interceptor
│       ├── components/
│       │   ├── AdminLayout.jsx      # Admin sidebar layout (mobile support)
│       │   ├── BackButton.jsx       # Reusable back button
│       │   ├── Chatbot.jsx          # Groq AI chatbot
│       │   ├── FeedbackModal.jsx    # Exit intent feedback modal
│       │   ├── Navbar.jsx           # Main navigation bar
│       │   ├── ProtectedRoute.jsx   # Auth & admin route guards
│       │   ├── Reveal.jsx           # Scroll animation component
│       │   └── StarRating.jsx       # Star rating component
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state
│       └── pages/
│           ├── admin/
│           │   ├── AdminBookings.jsx
│           │   ├── AdminBuses.jsx
│           │   ├── AdminCoupons.jsx
│           │   ├── AdminProfile.jsx
│           │   ├── AdminUsers.jsx
│           │   └── Dashboard.jsx
│           ├── legal/
│           │   ├── PrivacyPolicy.jsx
│           │   ├── RefundPolicy.jsx
│           │   └── TermsOfService.jsx
│           ├── Home.jsx             # Landing page
│           ├── Login.jsx
│           ├── MyBookings.jsx       # User bookings management
│           ├── Payment.jsx          # Stripe payment page
│           ├── Profile.jsx          # User profile
│           ├── Register.jsx
│           ├── SearchResults.jsx    # Bus search results
│           └── SeatSelection.jsx    # Interactive seat map
│
└── server/                          # Node.js backend
    ├── controllers/
    │   ├── adminController.js       # Admin CRUD operations
    │   ├── authController.js        # Register, login, profile
    │   ├── bookingController.js     # Hold, payment, confirm, cancel
    │   ├── busController.js         # Bus search & seat availability
    │   ├── couponController.js      # Coupon CRUD & validation
    │   └── reviewController.js      # Reviews & ratings
    ├── middleware/
    │   ├── adminMiddleware.js       # Admin role check
    │   └── authMiddleware.js        # JWT verification
    ├── models/
    │   ├── Booking.js               # Booking schema
    │   ├── Bus.js                   # Bus schema
    │   ├── Coupon.js                # Coupon schema
    │   ├── Review.js                # Review schema
    │   └── User.js                  # User schema
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── bookingRoutes.js
    │   ├── busRoutes.js
    │   ├── couponRoutes.js
    │   └── reviewRoutes.js
    └── utils/
        ├── emailService.js          # Nodemailer email templates
        ├── pdfService.js            # PDFKit ticket generation
        └── seedBuses.js             # Database seeder
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas account
- Stripe account
- Groq API key (free at console.groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/hemahemapathi/bus-booking-system.git
cd bus-booking-system
```

### 2. Setup Backend
```bash
cd server
pnpm install
```

Create `server/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gobus
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
PORT=5000
```

```bash
pnpm dev
```

### 3. Setup Frontend
```bash
cd client
pnpm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_GROQ_API_KEY=your_groq_api_key
```

```bash
pnpm dev
```

### 4. Seed the database (optional)
```bash
cd server
pnpm seed
```

---

## 🌍 Deployment

### Backend → Render.com
| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `pnpm install` |
| Start Command | `node index.js` |
| Node Version | 20 |

### Frontend → Netlify
| Setting | Value |
|---|---|
| Base Directory | `client` |
| Build Command | `pnpm run build` |
| Publish Directory | `client/dist` |

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile |
| PATCH | `/api/auth/profile` | Update profile/password |

### Buses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/buses/all` | Get all buses (public) |
| GET | `/api/buses/search` | Search buses by route & date |
| GET | `/api/buses/:id` | Get bus by ID |
| GET | `/api/buses/:id/seats` | Get booked seats for a date |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings/hold` | Hold seats (10 min) |
| POST | `/api/bookings/payment-intent` | Create Stripe payment intent |
| POST | `/api/bookings/confirm` | Confirm booking after payment |
| GET | `/api/bookings/my` | Get user's bookings |
| PATCH | `/api/bookings/cancel/:id` | Cancel booking |
| GET | `/api/bookings/ticket/:id` | Download PDF ticket |

### Coupons
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/coupons` | Get active coupons (public) |
| POST | `/api/coupons/validate` | Validate coupon code |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews` | Submit review |
| GET | `/api/reviews/my` | Get user's reviews |
| GET | `/api/reviews/recent` | Get recent reviews (home page) |
| GET | `/api/reviews/bus/:busId` | Get reviews for a bus |

### Admin (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET/POST | `/api/admin/buses` | List / create buses |
| PUT/DELETE | `/api/admin/buses/:id` | Update / delete bus |
| GET/DELETE | `/api/admin/bookings` | List / delete bookings |
| GET/DELETE | `/api/admin/users` | List / delete users |
| GET/POST | `/api/coupons/all` | Admin coupon management |

---

## 🎟️ Default Coupons

| Code | Type | Value | Min Order |
|---|---|---|---|
| `FIRST10` | Percent | 10% off | No minimum |
| `SAVE50` | Flat | Rs.50 off | Rs.200 |
| `TRAVEL100` | Flat | Rs.100 off | Rs.500 |

---

## 💳 Stripe Test Cards

| Card Number | Description |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |

Use any future expiry date and any 3-digit CVC.

---

## 🔒 Security Features

- JWT authentication with 7-day expiry
- Password hashing with bcryptjs (salt rounds: 10)
- Admin role protection on all admin routes
- Input sanitization on passenger names (XSS prevention)
- Regex escaping on bus search (ReDoS prevention)
- CORS restricted to frontend URL only
- No card details stored (Stripe handles all payment data)

---

## 📱 Mobile Support

- Fully responsive on all screen sizes
- Mobile hamburger navbar with dropdown
- Admin panel mobile sidebar with overlay
- AdBanner separate mobile/desktop layouts
- Swap cities button on mobile search

---

## 🏗️ Architecture Decisions

- **Seat Hold System** — Seats held for 10 minutes during payment to prevent double booking
- **Stripe 2-step flow** — Create payment intent → confirm → save booking
- **Role detection** — Email ending with `@admins.com` auto-assigns admin role
- **Review system** — One review per booking, updates bus average rating
- **Scroll animations** — Pure IntersectionObserver, no animation library needed
- **Notification system** — Browser Notification API + setTimeout, fires 1hr before departure

---

## 👨‍💻 Author

Built with ❤️ as a full-stack Bus Booking project.

---

## 📄 License

MIT License — free to use for personal and commercial projects.
