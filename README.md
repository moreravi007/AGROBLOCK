# 🌱⛓️ AgroBlock - From Farm to Fork, Verified by Blockchain

A comprehensive blockchain-based supply chain management system for agricultural products, connecting farmers, transporters, warehouse managers, and customers in a transparent and secure ecosystem.

## 🚀 Features

### 🔐 **Multi-Role Authentication System**
- **Farmer**: Add crops, track production, view earnings
- **Transporter**: Accept transport jobs, track deliveries
- **Warehouse Manager**: Approve crops, manage inventory, process payments
- **Customer**: Purchase verified products, scan QR codes

### 📦 **Complete Supply Chain Workflow**
1. **Farmer** adds crop → Status: `pending`
2. **Warehouse** approves crop → Status: `approved`
3. **Transporter** accepts job → Status: `picked_up`
4. **Transporter** confirms pickup → Status: `in_transit`
5. **Transporter** delivers → Status: `awaiting_confirmation`
6. **Warehouse** confirms arrival → Status: `delivered` + **Payments processed**

### 💰 **Automated Payment System**
- **Farmer Payment**: Crop quantity × Price per kg
- **Transport Payment**: Base rate + Per kg rate
- **Blockchain Transactions**: All payments recorded with unique hashes
- **Real-time Balance Updates**: Instant balance synchronization

### 🔍 **Product Verification & Tracking**
- **QR Code Generation**: Unique QR codes for each product
- **Blockchain Verification**: Immutable transaction records
- **Real-time Status Updates**: Live tracking across all dashboards
- **Product History**: Complete traceability from farm to customer

### 📱 **Modern Web Interface**
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live dashboard synchronization
- **Interactive Charts**: Visual data representation
- **Toast Notifications**: User-friendly feedback system

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js for data visualization
- **Maps**: Google Maps API for location services
- **Storage**: LocalStorage for data persistence
- **Blockchain**: Simulated blockchain transactions
- **UI Framework**: Custom CSS with modern design principles

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Google Maps API key (optional, for location features)
- Local development server (for testing)

## 🚀 Installation & Setup

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/agroblock.git
cd agroblock
```

### 2. **Set Up Google Maps API (Optional)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Maps JavaScript API
4. Create API key
5. Replace `YOUR_API_KEY` in `index.html` with your actual API key

### 3. **Run the Application**
```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server

# Or simply open index.html in your browser
```

## 👥 Test Accounts

### **Farmer Account**
- **Email**: `farmer@example.com`
- **Password**: `password123`
- **Role**: Farmer
- **Features**: Add crops, view earnings, track production

### **Transporter Account**
- **Email**: `transporter@example.com`
- **Password**: `password123`
- **Role**: Transporter
- **Features**: Accept jobs, track deliveries, view earnings

### **Warehouse Manager Account**
- **Email**: `warehouse@example.com`
- **Password**: `password123`
- **Role**: Warehouse Manager
- **Features**: Approve crops, manage inventory, process payments

### **Customer Account**
- **Email**: `customer@example.com`
- **Password**: `password123`
- **Role**: Customer
- **Features**: Purchase products, scan QR codes, view order history

## 🔄 Complete Workflow Demo

### **Step 1: Add New Crop (Farmer)**
1. Login as farmer
2. Click "+ Add New Crop"
3. Fill in crop details (type, quantity, price, etc.)
4. Submit form
5. Crop status: `pending`

### **Step 2: Approve Crop (Warehouse)**
1. Login as warehouse manager
2. View "Pending Crop Approvals"
3. Click "✅ Approve" for the crop
4. Crop status: `approved`

### **Step 3: Accept Transport Job (Transporter)**
1. Login as transporter
2. View "Available Transport Jobs"
3. Click "Accept Job"
4. Job status: `picked_up`

### **Step 4: Confirm Pickup (Transporter)**
1. In "My Active Jobs"
2. Click "Confirm Pickup & Start Transit"
3. Job status: `in_transit`

### **Step 5: Mark as Delivered (Transporter)**
1. Click "Mark as Delivered"
2. Job status: `awaiting_confirmation`

### **Step 6: Confirm Arrival (Warehouse)**
1. Login as warehouse manager
2. View "Products Awaiting Confirmation"
3. Click "✅ Confirm Arrival & Process Payment"
4. **Payments automatically processed**
5. Product status: `delivered`

## 📊 Dashboard Features

### **Farmer Dashboard**
- Total earnings overview
- Crop production statistics
- Active crops tracking
- Transaction history
- Add new crops

### **Transporter Dashboard**
- Available transport jobs
- Active job management
- Earnings tracking
- Job status updates

### **Warehouse Dashboard**
- Pending crop approvals
- Incoming products tracking
- Products awaiting confirmation
- Available products marketplace
- Payment processing

### **Customer Dashboard**
- QR code verification
- Product marketplace
- Order history
- Product details

## 🔧 Configuration

### **Payment Rates**
```javascript
paymentRates: {
    transportBaseRate: 50,        // Base transport fee
    transportPerKmRate: 2,        // Per km rate
    platformFeePercent: 2         // Platform fee percentage
}
```

### **Default Wallet Balances**
```javascript
defaultWalletBalances: {
    farmer: 0,                    // Farmers start with $0
    transporter: 0,               // Transporters start with $0
    warehouseManager: 10000,      // Warehouse starts with $10,000
    customer: 5000                // Customers start with $5,000
}
```

## 🚧 Development Status

- ✅ **Core Authentication System**
- ✅ **Multi-Role Dashboards**
- ✅ **Supply Chain Workflow**
- ✅ **Payment Processing**
- ✅ **Product Tracking**
- ✅ **QR Code Generation**
- 🔄 **Real-time Updates** (In Progress)
- 🔄 **Advanced Analytics** (Planned)
- 🔄 **Mobile App** (Planned)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Blockchain Technology**: For transparent supply chain management
- **Modern Web Standards**: For responsive and accessible design
- **Open Source Community**: For inspiration and best practices

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/agroblock/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/agroblock/discussions)
- **Email**: your.email@example.com

---

**Made with ❤️ for the future of agriculture and blockchain technology**
