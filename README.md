# LPX Ecommerce - Multi-Vendor Platform

A fully functional multi-vendor ecommerce application with complete marketplace features including vendor management, product listings, shopping cart, Stripe payments, order management, and admin controls.

![LPX Ecommerce Preview](https://drive.google.com/drive/folders/1FAhuMT1DzQ5MzLyM8QqfckQ4Ty0X1g9C?usp=sharing)

## 🚀 Features

### Multi-Vendor System

- **Vendor Registration & Management**: Vendors can create shops and manage their products
- **Vendor Approval Workflow**: Admin can approve/reject/suspend vendors
- **Withdrawal System**: Shop owners can request and receive payments
- **Vendor Ratings & Reviews**: Customers can rate and review vendors

### Customer Experience

- **Product Browsing**: Search and filter products across multiple vendors
- **Shopping Cart**: Add/remove items with persistent storage
- **Wishlist**: Save favorite products for later
- **Secure Checkout**: Stripe integration for payments
- **Order Tracking**: Real-time order status updates

### Admin Dashboard

- **Platform Control**: Full administrative control over the platform
- **Vendor Management**: Approve, reject, or suspend vendors
- **Order Management**: Process and manage all orders
- **Platform Settings**: Configure platform charges, shipping costs, categories
- **Analytics**: View platform performance and vendor metrics
- **User Management**: Manage customers and vendors

### Technical Features

- **Secure Payments**: Stripe integration with webhook support
- **File Uploads**: AWS S3 integration for product images
- **Email Service**: SMTP configuration for notifications
- **Shipping Integration**: Jeebly shipping API
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Database**: Scalable data storage

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- pnpm package manager
- Stripe account
- AWS S3 bucket (for file storage)

### 1. Clone the Repository

```bash
git clone https://github.com/faysaldev/lpx-ecommerce.git
cd lpx-ecommerce
```

### 2. Backend Setup

```bash
cd backend-server

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
```

#### Backend Environment Configuration (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development
BACKEND_IP=10.10.11.69
BACKEND_ONLINE_URL=https://faysal3000.sobhoy.com

# Database
MONGODB_URL=mongodb://localhost:27017/lpx

# Security
ENCRYPTION_KEY=234sfdfsdencryption
JWT_SECRET=72b6597c9a137bbe5e36862c592e90a5c88652494f37d6da57894888763d49cd
JWT_ACCESS_EXPIRATION_MINUTES=30000
JWT_REFRESH_EXPIRATION_DAYS=30000
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# Email Service
CONTACT_US_EMAIL=your_mail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_mail
SMTP_PASSWORD=your_mail_app_password
EMAIL_FROM=info.faysalspace@gmail.com

# Payment Gateway
STRIPE_SECRET_KEY=your_stripe_Key
STRIPE_WEBHOOK_SECRET=your_webhooks

# AWS S3 Storage
AWS_S3_BUCKET_NAME=lpx
AWS_BUCKET_REGINION=ap-southeast-1
AWS_YOUR_ACCESS_KEY=your_aws_access_key
AWS_YOUR_SECRET_KEY=your_aws_secret_key

# Shipping Configuration
JEEBLY_CLIENT_KEY=1118X251014011357Y4b68616c6564456c736164656b
JEEBLY_X_API_KEY=JjEeEeBbLlYy1200
JEEBLY_X_API_KEY_OUR_SIDE=JjE3Haysey1200

# Frontend URL
FRONTEND_URL=https://lpx-ecommmerce.vercel.app
```

### 3. Frontend Setup

```bash
cd ../clients

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
```

#### Frontend Environment Configuration (.env)

```env
NEXT_PUBLIC_BASE_URL=http://10.10.11.69:3000
```

### 4. Start the Application

#### Start Backend Server

```bash
cd backend-server
pnpm run dev
```

Backend will run on: `http://localhost:3000`

#### Start Frontend Application

```bash
cd clients
pnpm run dev
```

Frontend will run on: `http://localhost:3001` (or next available port)

## 🔧 Configuration

### Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-backend-url/webhooks/stripe`
3. Configure events for payment processing
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` in backend .env

### MongoDB Setup

- Use local MongoDB: `mongodb://localhost:27017/lpx`
- Or cloud MongoDB: Update `MONGODB_URL` with your connection string

### Email Service

- Configure Gmail SMTP or use services like Ethereal for testing
- Generate app password for Gmail in account settings

### AWS S3 Configuration

1. Create S3 bucket in AWS console
2. Generate access keys in IAM
3. Update AWS credentials in backend .env

## 📁 Project Structure

```
lpx-ecommerce/
├── backend-server/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   ├── .env               # Environment variables
│   └── package.json
└── clients/
    ├── components/        # React components
    ├── pages/            # Next.js pages
    ├── styles/           # CSS/styling
    ├── utils/            # Frontend utilities
    └── .env              # Frontend environment variables
```

## 🎯 User Roles

### Admin

- Full platform control
- Vendor approval/rejection
- Platform configuration
- Analytics and reporting
- User management

### Vendor

- Shop creation and management
- Product listing and inventory
- Order processing
- Withdrawal requests
- Performance analytics

### Customer

- Product browsing and search
- Shopping cart and wishlist
- Secure checkout
- Order history and tracking
- Vendor ratings and reviews

## 💳 Payment Flow

1. Customer adds items to cart
2. Proceeds to checkout with Stripe
3. Payment processed securely
4. Order confirmed and vendors notified
5. Admin manages order fulfillment
6. Vendors can request withdrawals

## 🚚 Shipping Integration

- Integrated with Jeebly shipping API
- Real-time shipping cost calculation
- Order tracking capabilities
- Multi-carrier support

## 🔒 Security Features

- JWT token-based authentication
- Data encryption for sensitive information
- Secure payment processing with Stripe
- Role-based access control
- Input validation and sanitization

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend-server
pnpm run build
pnpm start

# Frontend
cd clients
pnpm run build
pnpm start
```

### Environment Variables for Production

Update the following in production:

- `NODE_ENV=production`
- Live database URLs
- Production Stripe keys
- Live frontend and backend URLs
- Production email service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- Email: info.faysalspace@gmail.com
- GitHub Issues: [Create an issue](https://github.com/faysaldev/lpx-ecommerce/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: Make sure to configure all environment variables properly and set up the required services (Stripe, AWS S3, MongoDB) before running the application in production.
