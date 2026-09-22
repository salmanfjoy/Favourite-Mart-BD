# Security Specification for Favourite Mart BD Firestore

## 1. Data Invariants
1. Orders must have a valid tracking code, valid phone, valid address, and initial status of 'pending'.
2. Users can only read and update their own private user profile data (`/users/{userId}`).
3. Admins (bootstrapped with salmanfjoyce@gmail.com or admin document) have elevated privileges to update order statuses and manage store entities.
4. Product reviews are publicly viewable by customers to promote transparency and social proof.
5. PII such as customer phone and address in orders is protected: only the owner who placed the order or an authorized admin can query the collection.

## 2. Hardened Rules Matrix
- `/orders/{orderId}`: Public / Guest create with strict schema validation; read/list restricted to order owner or admin.
- `/users/{userId}`: Strict owner-only access for personal profile and shipping details.
- `/reviews/{reviewId}`: Public read, validated create.
- `/subscribers/{subscriberId}`: Public create with contact size validation, admin-only read.
