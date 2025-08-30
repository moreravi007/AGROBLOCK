// AgroBlock Application Data Structure
const AgroBlockApp = {
    // Application data stored in localStorage
    data: {
        users: [],
        crops: [],
        transportJobs: [],
        transactions: [],
        pendingApprovals: [],
        currentUser: null,
        nextId: 1,
        // New connection system data
        connections: [],
        connectionRequests: [],
        messages: [],
        userProfiles: [],
        activityFeed: [],
        // MetaMask integration
        metamaskConnected: false,
        metamaskAccount: null,
        metamaskNetwork: null
    },

    // Vehicle types for transporters
    vehicleTypes: [
        "Small Truck (1-2 tons)",
        "Medium Truck (3-5 tons)", 
        "Large Truck (6-10 tons)",
        "Refrigerated Truck",
        "Van",
        "Pickup Truck",
        "Motorcycle",
        "Bicycle"
    ],

    // Crop types for farmers
    cropTypes: [
        "Tomatoes", "Potatoes", "Carrots", "Onions", "Wheat", "Rice", 
        "Corn", "Soybeans", "Apples", "Oranges", "Bananas", "Grapes",
        "Lettuce", "Spinach", "Peppers", "Cucumbers"
    ],

    // Cultivation methods
    cultivationMethods: ["Organic", "Conventional", "Hydroponic", "Greenhouse"],

    // Payment rates
    paymentRates: {
        transportBaseRate: 50,
        transportPerKmRate: 2,
        platformFeePercent: 2
    },

    // Default wallet balances
    defaultWalletBalances: {
        farmer: 0,
        transporter: 0,
        warehouseManager: 10000,
        customer: 5000
    },

    // Initialize application
    init() {
        this.loadData();
        this.setupEventListeners();
        this.showPage('loginPage');
        
        // Add test users if no users exist
        if (this.data.users.length === 0) {
            // Test Farmer
            const testFarmer = {
                id: 'user_farmer',
                role: 'farmer',
                name: 'Test Farmer',
                email: 'farmer@example.com',
                password: 'password123',
                farmAddress: '123 Test Farm Road',
                mobile: '555-0123',
                wallet: '0x1234567890abcdef1234567890abcdef12345678',
                balance: 1000.00,
                joinDate: new Date().toISOString(),
                transactions: []
            };
            
            // Test Transporter
            const testTransporter = {
                id: 'user_transporter',
                role: 'transporter',
                name: 'Test Transporter',
                email: 'transporter@example.com',
                password: 'password123',
                vehicleType: 'Medium Truck (3-5 tons)',
                mobile: '555-0456',
                wallet: '0xabcdef1234567890abcdef1234567890abcdef12',
                balance: 500.00,
                joinDate: new Date().toISOString(),
                transactions: []
            };
            
            // Test Warehouse Manager
            const testWarehouse = {
                id: 'user_warehouse',
                role: 'warehouseManager',
                companyName: 'Test Warehouse',
                email: 'warehouse@example.com',
                password: 'password123',
                address: '456 Warehouse Street',
                mobile: '555-0789',
                wallet: '0x7890abcdef1234567890abcdef1234567890abcd',
                balance: 10000.00,
                joinDate: new Date().toISOString(),
                transactions: []
            };
            
            // Test Customer
            const testCustomer = {
                id: 'user_customer',
                role: 'customer',
                name: 'Test Customer',
                email: 'customer@example.com',
                password: 'password123',
                address: '789 Customer Avenue',
                mobile: '555-0124',
                wallet: '0xdef1234567890abcdef1234567890abcdef12345',
                balance: 5000.00,
                joinDate: new Date().toISOString(),
                transactions: []
            };
            
            this.data.users.push(testFarmer, testTransporter, testWarehouse, testCustomer);
            this.saveData();
            console.log('Test users created');
            
            // Add some test crops
            const testCrop = {
                id: 'crop_test',
                farmerId: 'user_farmer',
                type: 'Tomatoes',
                quantity: 100,
                pricePerKg: 2.50,
                cultivation: 'Organic',
                farmLocation: '123 Test Farm Road',
                harvestDate: '2024-12-31',
                dateAdded: new Date().toISOString(),
                status: 'pending',
                qrCode: 'QR123456',
                blockchainTx: '0x1234567890abcdef1234567890abcdef12345678',
                farmerName: 'Test Farmer'
            };
            
            this.data.crops.push(testCrop);
            this.saveData();
            console.log('Test crop added');
        }
        
        // Initialize signup form if on signup page
        if (document.getElementById('userRole')) {
            updateSignupForm();
        }
        
        // Initialize MetaMask integration
        this.initMetaMask();
        
        console.log('AgroBlock application initialized');
    },

    // Data management
    loadData() {
        const savedData = localStorage.getItem('agroBlockData');
        if (savedData) {
            this.data = { ...this.data, ...JSON.parse(savedData) };
        }
    },

    saveData() {
        localStorage.setItem('agroBlockData', JSON.stringify(this.data));
    },

    // Event listeners setup
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Add crop form
        const addCropForm = document.getElementById('addCropForm');
        if (addCropForm) {
            addCropForm.addEventListener('submit', (e) => this.handleAddCrop(e));
        }

        // Generate initial wallet when role is selected
        const roleSelect = document.getElementById('userRole');
        if (roleSelect) {
            roleSelect.addEventListener('change', () => {
                this.generateWallet();
                updateSignupForm(); // Call the form update function
            });
        }

        // Auto-save data periodically
        setInterval(() => this.saveData(), 30000); // Save every 30 seconds
    },

    // Page management
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    },

    // Authentication functions
    handleLogin(e) {
        e.preventDefault();
        console.log('Login attempt started');
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        console.log('Login credentials:', { email, password: password ? '***' : 'empty' });
        console.log('Available users:', this.data.users);

        const user = this.data.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            console.log('User found:', user);
            this.data.currentUser = user;
            this.saveData();
            this.showToast('Login successful!', 'success');
            this.redirectToDashboard(user.role);
        } else {
            console.log('No user found with these credentials');
            this.showToast('Invalid email or password', 'error');
        }
    },

    handleSignup(e) {
        e.preventDefault();
        console.log('Signup attempt started');
        
        const formData = this.getSignupFormData();
        console.log('Form data collected:', formData);
        
        if (!this.validateSignupForm(formData)) {
            console.log('Form validation failed');
            return;
        }

        // Check if email already exists
        if (this.data.users.find(u => u.email === formData.email)) {
            console.log('Email already exists');
            this.showToast('Email already exists', 'error');
            return;
        }

        // Use MetaMask wallet if connected, otherwise generate new wallet
        let wallet;
        if (this.data.metamaskConnected && this.data.metamaskAccount) {
            wallet = this.data.metamaskAccount;
            console.log('Using MetaMask wallet:', wallet);
        } else {
            wallet = this.generateWallet();
            console.log('Generated new wallet:', wallet);
        }
        
        const newUser = {
            id: 'user_' + this.data.nextId++,
            ...formData,
            wallet: wallet,
            metamaskConnected: this.data.metamaskConnected || false,
            balance: this.defaultWalletBalances[formData.role],
            joinDate: new Date().toISOString(),
            transactions: []
        };

        console.log('Creating new user:', newUser);
        this.data.users.push(newUser);
        this.data.currentUser = newUser;
        this.saveData();

        this.showToast('Account created successfully!', 'success');
        this.redirectToDashboard(newUser.role);
    },

    getSignupFormData() {
        const role = document.getElementById('userRole').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        console.log('Basic form data:', { role, email, password: password ? '***' : 'empty' });

        const baseData = { role, email, password };

        switch(role) {
            case 'farmer':
                const farmerData = {
                    ...baseData,
                    name: document.getElementById('farmerName')?.value || '',
                    farmAddress: document.getElementById('farmAddress')?.value || '',
                    mobile: document.getElementById('farmerMobile')?.value || ''
                };
                console.log('Farmer form data:', farmerData);
                return farmerData;
            case 'transporter':
                const transporterData = {
                    ...baseData,
                    name: document.getElementById('transporterName')?.value || '',
                    vehicleType: document.getElementById('vehicleType')?.value || '',
                    mobile: document.getElementById('transporterMobile')?.value || ''
                };
                console.log('Transporter form data:', transporterData);
                return transporterData;
            case 'warehouseManager':
                const warehouseData = {
                    ...baseData,
                    companyName: document.getElementById('companyName')?.value || '',
                    address: document.getElementById('companyAddress')?.value || '',
                    mobile: document.getElementById('warehouseMobile')?.value || ''
                };
                console.log('Warehouse form data:', warehouseData);
                return warehouseData;
            case 'customer':
                const customerData = {
                    ...baseData,
                    name: document.getElementById('customerName')?.value || '',
                    address: document.getElementById('residentialAddress')?.value || '',
                    mobile: document.getElementById('customerMobile')?.value || ''
                };
                console.log('Customer form data:', customerData);
                return customerData;
            default:
                console.log('No role selected, returning base data');
                return baseData;
        }
    },

    validateSignupForm(formData) {
        if (!formData.role) {
            this.showToast('Please select a role', 'error');
            return false;
        }

        if (!formData.email || !formData.password) {
            this.showToast('Email and password are required', 'error');
            return false;
        }

        const confirmPassword = document.getElementById('confirmPassword').value;
        if (formData.password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return false;
        }

        // Validate role-specific fields
        switch(formData.role) {
            case 'farmer':
                if (!formData.name || !formData.farmAddress || !formData.mobile) {
                    this.showToast('Please fill in all required fields for farmer', 'error');
                    return false;
                }
                break;
            case 'transporter':
                if (!formData.name || !formData.vehicleType || !formData.mobile) {
                    this.showToast('Please fill in all required fields for transporter', 'error');
                    return false;
                }
                break;
            case 'warehouseManager':
                if (!formData.companyName || !formData.address || !formData.mobile) {
                    this.showToast('Please fill in all required fields for warehouse manager', 'error');
                    return false;
                }
                break;
            case 'customer':
                if (!formData.name || !formData.address || !formData.mobile) {
                    this.showToast('Please fill in all required fields for customer', 'error');
                    return false;
                }
                break;
        }

        return true;
    },

    redirectToDashboard(role) {
        setTimeout(() => {
            switch(role) {
                case 'farmer':
                    this.showPage('farmerDashboard');
                    this.loadFarmerDashboard();
                    break;
                case 'transporter':
                    this.showPage('transporterDashboard');
                    this.loadTransporterDashboard();
                    break;
                case 'warehouseManager':
                    this.showPage('warehouseManagerDashboard');
                    this.loadWarehouseDashboard();
                    break;
                case 'customer':
                    this.showPage('customerDashboard');
                    this.loadCustomerDashboard();
                    break;
            }
        }, 1000);
    },

    logout() {
        this.data.currentUser = null;
        this.saveData();
        this.showPage('loginPage');
        this.showToast('Logged out successfully', 'success');
    },

    // Wallet functions
    generateWallet() {
        const wallet = '0x' + Array.from({length: 40}, () => 
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        const walletElement = document.getElementById('generatedWallet');
        const previewElement = document.getElementById('walletPreview');
        
        if (walletElement && previewElement) {
            walletElement.textContent = wallet;
            previewElement.style.display = 'block';
        }
        
        console.log('Generated wallet:', wallet);
        return wallet;
    },

    regenerateWallet() {
        this.generateWallet();
        this.showToast('New wallet address generated', 'info');
    },

    // Dashboard loading functions
    loadFarmerDashboard() {
        const user = this.data.currentUser;
        if (!user) return;

        // Update user info
        document.getElementById('farmerName').textContent = user.name || 'Farmer';
        document.getElementById('farmerBalance').textContent = user.balance.toFixed(2);

        // Get farmer's crops
        const farmerCrops = this.data.crops.filter(crop => crop.farmerId === user.id);
        
        // Update stats
        const totalEarnings = user.transactions
            .filter(t => t.type === 'credit')
            .reduce((sum, t) => sum + t.amount, 0);
        
        document.getElementById('totalEarnings').textContent = `$${totalEarnings.toFixed(2)}`;
        document.getElementById('totalCrops').textContent = farmerCrops.length;
        document.getElementById('activeCrops').textContent = 
            farmerCrops.filter(c => ['pending', 'approved', 'in_transit'].includes(c.status)).length;

        // Load produce grid
        this.loadFarmerCrops(farmerCrops);
        this.loadFarmerTransactions();
        
        // Load connection system
        this.loadUserDirectory();
        this.loadConnectionRequests();
        this.loadMessages();
        this.loadActivityFeed();
    },

    loadFarmerCrops(crops) {
        const grid = document.getElementById('farmerProduceGrid');
        if (!grid) return;

        if (crops.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🌱</div>
                    <h3>No crops added yet</h3>
                    <p>Start by adding your first crop to get started</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = crops.map(crop => `
            <div class="produce-card">
                <div class="produce-header">
                    <div class="produce-emoji">${this.getCropEmoji(crop.type)}</div>
                    <div class="produce-status">
                        <span class="status ${this.getStatusClass(crop.status)}">${this.getStatusText(crop.status)}</span>
                    </div>
                </div>
                <div class="produce-info">
                    <h3>${crop.cultivation} ${crop.type}</h3>
                    <div class="produce-details">
                        <span class="produce-detail">Quantity: ${crop.quantity}kg</span>
                        <span class="produce-detail price">$${crop.pricePerKg}/kg</span>
                        <span class="produce-detail">Total: $${(crop.quantity * crop.pricePerKg).toFixed(2)}</span>
                        <span class="produce-detail">Added: ${new Date(crop.dateAdded).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="produce-actions">
                    <button class="btn btn--outline btn--sm" onclick="AgroBlockApp.generateQR('${crop.id}')">
                        📱 QR Code
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="AgroBlockApp.trackCrop('${crop.id}')">
                        📍 Track
                    </button>
                </div>
            </div>
        `).join('');
    },

    loadFarmerTransactions() {
        const user = this.data.currentUser;
        const container = document.getElementById('farmerTransactions');
        if (!container || !user) return;

        const transactions = user.transactions || [];
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <h3>No transactions yet</h3>
                    <p>Your payment history will appear here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = transactions.map(tx => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <h4>${tx.description}</h4>
                    <div class="transaction-meta">
                        ${new Date(tx.date).toLocaleDateString()} • ${tx.type === 'credit' ? 'Received' : 'Paid'}
                    </div>
                </div>
                <div class="transaction-amount ${tx.type === 'credit' ? 'credit' : 'debit'}">
                    ${tx.type === 'credit' ? '+' : '-'}$${tx.amount.toFixed(2)}
                </div>
            </div>
        `).join('');
    },

    loadTransporterDashboard() {
        const user = this.data.currentUser;
        if (!user) return;

        // Update user info
        document.getElementById('transporterName').textContent = user.name || 'Transporter';
        document.getElementById('transporterBalance').textContent = user.balance.toFixed(2);

        // Get available jobs (approved crops needing transport)
        const availableJobs = this.data.crops.filter(crop => 
            crop.status === 'approved' && !crop.transporterId
        );
        
        // Get active jobs for this transporter
        const activeJobs = this.data.crops.filter(crop => 
            crop.transporterId === user.id && ['in_transit', 'picked_up'].includes(crop.status)
        );

        // Update stats
        const totalEarnings = user.transactions
            .filter(t => t.type === 'credit')
            .reduce((sum, t) => sum + t.amount, 0);

        document.getElementById('availableJobs').textContent = availableJobs.length;
        document.getElementById('activeJobs').textContent = activeJobs.length;
        document.getElementById('totalEarningsTransporter').textContent = `$${totalEarnings.toFixed(2)}`;

        // Load job grids
        this.loadTransportJobs(availableJobs);
        this.loadActiveJobs(activeJobs);
        
        // Load connection system
        this.loadUserDirectory();
        this.loadConnectionRequests();
        this.loadMessages();
        this.loadActivityFeed();
    },

    loadTransportJobs(jobs) {
        const grid = document.getElementById('transportJobsGrid');
        if (!grid) return;

        if (jobs.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🚛</div>
                    <h3>No jobs available</h3>
                    <p>Check back later for new transport opportunities</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = jobs.map(job => {
            const farmer = this.data.users.find(u => u.id === job.farmerId);
            const transportFee = this.calculateTransportFee(job.quantity);
            
            return `
                <div class="job-card">
                    <div class="job-header">
                        <h3>Job #${job.id.slice(-6)}</h3>
                        <div class="job-payment">$${transportFee.toFixed(2)}</div>
                    </div>
                    <div class="job-details">
                        <div class="job-detail">
                            ${this.getCropEmoji(job.type)} ${job.type} - ${job.quantity}kg
                        </div>
                        <div class="job-detail">
                            📍 ${farmer?.farmAddress || 'Farm Location'} → 🏢 Warehouse
                        </div>
                        <div class="job-detail">
                            ⏰ Added: ${new Date(job.dateAdded).toLocaleDateString()}
                        </div>
                        <div class="job-detail">
                            👨‍🌾 Farmer: ${farmer?.name || 'Unknown'}
                        </div>
                    </div>
                    <div class="job-actions">
                        <button class="btn btn--primary" onclick="AgroBlockApp.acceptJob('${job.id}')">
                            Accept Job
                        </button>
                        <button class="btn btn--outline" onclick="AgroBlockApp.viewJobDetails('${job.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    loadActiveJobs(jobs) {
        const grid = document.getElementById('activeJobsGrid');
        if (!grid) return;

        if (jobs.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <h3>No active jobs</h3>
                    <p>Accept jobs to see them here</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = jobs.map(job => {
            const farmer = this.data.users.find(u => u.id === job.farmerId);
            
            if (job.status === 'picked_up') {
                return `
                    <div class="job-card">
                        <div class="job-header">
                            <h3>Job #${job.id.slice(-6)}</h3>
                            <div class="job-payment">Picked Up</div>
                        </div>
                        <div class="job-details">
                            <div class="job-detail">
                                ${this.getCropEmoji(job.type)} ${job.type} - ${job.quantity}kg
                            </div>
                            <div class="job-detail">
                                📍 ${farmer?.farmAddress || 'Farm Location'} → 🏢 Warehouse
                            </div>
                            <div class="job-detail">
                                🚛 Picked up: ${new Date(job.pickupDate).toLocaleDateString()}
                            </div>
                        </div>
                        <div class="job-actions">
                            <button class="btn btn--primary" onclick="AgroBlockApp.confirmPickup('${job.id}')">
                                Confirm Pickup & Start Transit
                            </button>
                            <button class="btn btn--outline" onclick="AgroBlockApp.trackDelivery('${job.id}')">
                                Track Route
                            </button>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="job-card">
                        <div class="job-header">
                            <h3>Job #${job.id.slice(-6)}</h3>
                            <div class="job-payment">In Transit</div>
                        </div>
                        <div class="job-details">
                            <div class="job-detail">
                                ${this.getCropEmoji(job.type)} ${job.type} - ${job.quantity}kg
                            </div>
                            <div class="job-detail">
                                📍 ${farmer?.farmAddress || 'Farm Location'} → 🏢 Warehouse
                            </div>
                            <div class="job-detail">
                                🚛 Transit started: ${new Date(job.transitStartDate).toLocaleDateString()}
                            </div>
                        </div>
                        <div class="job-actions">
                            <button class="btn btn--primary" onclick="AgroBlockApp.markDelivered('${job.id}')">
                                Mark as Delivered
                            </button>
                            <button class="btn btn--outline" onclick="AgroBlockApp.trackDelivery('${job.id}')">
                                Track Route
                            </button>
                        </div>
                    </div>
                `;
            }
        }).join('');
    },

    loadWarehouseDashboard() {
        const user = this.data.currentUser;
        if (!user) return;

        // Update user info
        document.getElementById('warehouseName').textContent = user.companyName || 'Warehouse';
        document.getElementById('warehouseBalance').textContent = user.balance.toFixed(2);

        // Get pending approvals
        const pendingApprovals = this.data.crops.filter(crop => crop.status === 'pending');
        
        // Get incoming products (in transit)
        const incomingProducts = this.data.crops.filter(crop => crop.status === 'in_transit');
        
        // Get products awaiting confirmation (delivered by transporter)
        const awaitingConfirmation = this.data.crops.filter(crop => crop.status === 'awaiting_confirmation');
        
        // Get available products for sale
        const availableProducts = this.data.crops.filter(crop => crop.status === 'delivered');

        // Calculate total payments made
        const totalPayments = user.transactions
            .filter(t => t.type === 'debit')
            .reduce((sum, t) => sum + t.amount, 0);

        // Update stats
        document.getElementById('pendingApprovals').textContent = pendingApprovals.length;
        document.getElementById('incomingProducts').textContent = incomingProducts.length;
        document.getElementById('totalPayments').textContent = `$${totalPayments.toFixed(2)}`;

        // Load sections
        this.loadPendingApprovals(pendingApprovals);
        this.loadIncomingProducts(incomingProducts);
        this.loadAwaitingConfirmation(awaitingConfirmation);
        this.loadWarehouseMarketplace(availableProducts);
        
        // Load connection system
        this.loadUserDirectory();
        this.loadConnectionRequests();
        this.loadMessages();
        this.loadActivityFeed();
    },

    loadPendingApprovals(approvals) {
        const container = document.getElementById('pendingApprovalsList');
        if (!container) return;

        if (approvals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⏳</div>
                    <h3>No pending approvals</h3>
                    <p>New crop submissions will appear here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = approvals.map(crop => {
            const farmer = this.data.users.find(u => u.id === crop.farmerId);
            
            return `
                <div class="product-item">
                    <div class="product-info">
                        <h3>${this.getCropEmoji(crop.type)} ${crop.cultivation} ${crop.type}</h3>
                        <div class="product-meta">
                            <span>Quantity: ${crop.quantity}kg</span>
                            <span>Price: $${crop.pricePerKg}/kg</span>
                            <span>Total Value: $${(crop.quantity * crop.pricePerKg).toFixed(2)}</span>
                            <span>Farmer: ${farmer?.name || 'Unknown'}</span>
                            <span>Location: ${crop.farmLocation || farmer?.farmAddress || 'Unknown'}</span>
                            <span>Submitted: ${new Date(crop.dateAdded).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn--primary" onclick="AgroBlockApp.approveCrop('${crop.id}')">
                            ✅ Approve
                        </button>
                        <button class="btn btn--outline" onclick="AgroBlockApp.rejectCrop('${crop.id}')">
                            ❌ Reject
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    loadIncomingProducts(products) {
        const container = document.getElementById('incomingProductsList');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🚛</div>
                    <h3>No incoming products</h3>
                    <p>Products in transit will appear here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(crop => {
            const farmer = this.data.users.find(u => u.id === crop.farmerId);
            const transporter = this.data.users.find(u => u.id === crop.transporterId);
            
            return `
                <div class="product-item">
                    <div class="product-info">
                        <h3>${this.getCropEmoji(crop.type)} ${crop.cultivation} ${crop.type}</h3>
                        <div class="product-meta">
                            <span>Quantity: ${crop.quantity}kg</span>
                            <span>Farmer: ${farmer?.name || 'Unknown'}</span>
                            <span>Transporter: ${transporter?.name || 'Unknown'}</span>
                            <span>Transit started: ${new Date(crop.transitStartDate).toLocaleDateString()}</span>
                            <span>ETA: ${this.calculateETA()}</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn--outline" onclick="AgroBlockApp.trackIncoming('${crop.id}')">
                            📍 Track
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    loadAwaitingConfirmation(products) {
        const container = document.getElementById('awaitingConfirmationList');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <h3>No products awaiting confirmation</h3>
                    <p>Delivered products will appear here for confirmation</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(crop => {
            const farmer = this.data.users.find(u => u.id === crop.farmerId);
            const transporter = this.data.users.find(u => u.id === crop.transporterId);
            
            return `
                <div class="product-item">
                    <div class="product-info">
                        <h3>${this.getCropEmoji(crop.type)} ${crop.cultivation} ${crop.type}</h3>
                        <div class="product-meta">
                            <span>Quantity: ${crop.quantity}kg</span>
                            <span>Farmer: ${farmer?.name || 'Unknown'}</span>
                            <span>Transporter: ${transporter?.name || 'Unknown'}</span>
                            <span>Delivered: ${new Date(crop.deliveredDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn--primary" onclick="AgroBlockApp.confirmArrival('${crop.id}')">
                            ✅ Confirm Arrival & Process Payment
                        </button>
                        <button class="btn btn--outline" onclick="AgroBlockApp.viewProductDetails('${crop.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    loadWarehouseMarketplace(products) {
        const container = document.getElementById('warehouseMarketplace');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🏪</div>
                    <h3>No products available</h3>
                    <p>Delivered products will appear here for sale</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(crop => {
            const farmer = this.data.users.find(u => u.id === crop.farmerId);
            
            return `
                <div class="marketplace-item">
                    <div class="item-header">
                        <div class="item-emoji">${this.getCropEmoji(crop.type)}</div>
                        <span class="status status--success">✅ Available</span>
                    </div>
                    <div class="item-info">
                        <h3>${crop.cultivation} ${crop.type}</h3>
                        <div class="item-meta">
                            <div class="item-farmer">👨‍🌾 ${farmer?.name || 'Unknown Farmer'}</div>
                            <div class="item-location">📍 ${farmer?.farmAddress || 'Unknown Location'}</div>
                        </div>
                        <div class="item-price">$${crop.pricePerKg}/kg</div>
                        <div class="produce-detail">Available: ${crop.quantity}kg</div>
                    </div>
                    <button class="btn btn--outline" onclick="AgroBlockApp.viewProductDetails('${crop.id}')">
                        View Details
                    </button>
                </div>
            `;
        }).join('');
    },

    loadCustomerDashboard() {
        const user = this.data.currentUser;
        if (!user) return;

        // Update user info
        document.getElementById('customerName').textContent = user.name || 'Customer';
        document.getElementById('customerBalance').textContent = user.balance.toFixed(2);

        // Load marketplace
        const availableProducts = this.data.crops.filter(crop => crop.status === 'delivered');
        this.loadCustomerMarketplace(availableProducts);
        this.loadCustomerOrders();
        
        // Load connection system
        this.loadUserDirectory();
        this.loadConnectionRequests();
        this.loadMessages();
        this.loadActivityFeed();
    },

    loadCustomerMarketplace(products) {
        const container = document.getElementById('customerMarketplace');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🛒</div>
                    <h3>No products available</h3>
                    <p>Verified products will appear here when available</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(crop => {
            const farmer = this.data.users.find(u => u.id === crop.farmerId);
            
            return `
                <div class="marketplace-item">
                    <div class="item-header">
                        <div class="item-emoji">${this.getCropEmoji(crop.type)}</div>
                        <span class="status status--success">✅ Verified</span>
                    </div>
                    <div class="item-info">
                        <h3>${crop.cultivation} ${crop.type}</h3>
                        <div class="item-meta">
                            <div class="item-farmer">👨‍🌾 ${farmer?.name || 'Unknown Farmer'}</div>
                            <div class="item-location">📍 ${farmer?.farmAddress || 'Unknown Location'}</div>
                        </div>
                        <div class="item-price">$${crop.pricePerKg}/kg</div>
                        <div class="produce-detail">Available: ${crop.quantity}kg</div>
                    </div>
                    <button class="btn btn--primary" onclick="AgroBlockApp.purchaseProduct('${crop.id}')">
                        Purchase
                    </button>
                </div>
            `;
        }).join('');
    },

    loadCustomerOrders() {
        const user = this.data.currentUser;
        const container = document.getElementById('customerOrders');
        if (!container || !user) return;

        const orders = user.orders || [];
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <h3>No orders yet</h3>
                    <p>Your purchase history will appear here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-info">
                    <h4>${order.productName}</h4>
                    <div class="order-meta">
                        ${new Date(order.date).toLocaleDateString()} • ${order.quantity}kg
                    </div>
                </div>
                <div class="order-amount">$${order.amount.toFixed(2)}</div>
            </div>
        `).join('');
    },

    // Crop management functions
    handleAddCrop(e) {
        e.preventDefault();
        
        const cropData = {
            id: 'crop_' + this.data.nextId++,
            farmerId: this.data.currentUser.id,
            type: document.getElementById('cropType').value,
            quantity: parseInt(document.getElementById('cropQuantity').value),
            pricePerKg: parseFloat(document.getElementById('cropPrice').value),
            cultivation: document.getElementById('cultivationMethod').value,
            farmLocation: document.getElementById('farmLocation').value,
            harvestDate: document.getElementById('harvestDate').value,
            dateAdded: new Date().toISOString(),
            status: 'pending',
            qrCode: this.generateQRCode(),
            blockchainTx: this.generateTxHash(),
            farmerName: this.data.currentUser.name || 'Unknown Farmer'
        };

        this.data.crops.push(cropData);
        this.saveData();

        // Add to activity feed
        this.addActivityFeedItem('crop_added', this.data.currentUser.id, null, cropData.id);

        this.closeModal('addCropModal');
        this.showToast('Crop added successfully! Waiting for warehouse approval.', 'success');
        
        // Reload farmer dashboard
        this.loadFarmerDashboard();
        
        // Reset form
        document.getElementById('addCropForm').reset();
    },

    approveCrop(cropId) {
        const crop = this.data.crops.find(c => c.id === cropId);
        if (!crop) return;

        crop.status = 'approved';
        crop.approvedDate = new Date().toISOString();
        
        // Add to activity feed
        this.addActivityFeedItem('crop_approved', this.data.currentUser.id, null, crop.id);
        
        this.saveData();
        this.showToast(`${crop.type} has been approved for transport!`, 'success');
        this.loadWarehouseDashboard();
    },

    rejectCrop(cropId) {
        const crop = this.data.crops.find(c => c.id === cropId);
        if (!crop) return;

        crop.status = 'rejected';
        crop.rejectedDate = new Date().toISOString();
        
        this.saveData();
        this.showToast(`${crop.type} has been rejected.`, 'warning');
        this.loadWarehouseDashboard();
    },

    acceptJob(cropId) {
        const crop = this.data.crops.find(c => c.id === cropId);
        const user = this.data.currentUser;
        
        if (!crop || !user) return;

        crop.transporterId = user.id;
        crop.status = 'picked_up';
        crop.pickupDate = new Date().toISOString();
        crop.transporterName = user.name || 'Unknown Transporter';
        
        // Add to activity feed
        this.addActivityFeedItem('job_accepted', user.id, null, crop.id);
        
        this.saveData();
        this.showToast(`Job accepted! Please pick up ${crop.type} from the farm.`, 'success');
        this.loadTransporterDashboard();
    },

    confirmPickup(cropId) {
        const crop = this.data.crops.find(c => c.id === cropId);
        if (!crop) return;

        crop.status = 'in_transit';
        crop.transitStartDate = new Date().toISOString();
        
        this.saveData();
        this.showToast(`${crop.type} pickup confirmed! Now in transit to warehouse.`, 'success');
        this.loadTransporterDashboard();
    },

    markDelivered(cropId) {
        const crop = this.data.crops.find(c => c.id === cropId);
        if (!crop) return;

        crop.status = 'awaiting_confirmation';
        crop.deliveredDate = new Date().toISOString();
        
        this.saveData();
        this.showToast(`${crop.type} marked as delivered! Waiting for warehouse confirmation.`, 'success');
        this.loadTransporterDashboard();
    },

    confirmArrival(cropId) {
        this.showLoadingOverlay('Processing payment...');
        
        setTimeout(() => {
            const crop = this.data.crops.find(c => c.id === cropId);
            if (!crop) {
                this.hideLoadingOverlay();
                return;
            }

            crop.status = 'delivered';
            crop.confirmedDate = new Date().toISOString();

            // Process payments
            this.processPayments(crop);
            
                    // Add to activity feed
        this.addActivityFeedItem('payment_processed', warehouse.id, null, crop.id);
        
        this.saveData();
        this.hideLoadingOverlay();
        this.showToast(`${crop.type} arrival confirmed! Payments processed.`, 'success');
        this.loadWarehouseDashboard();
        }, 2000);
    },

    processPayments(crop) {
        const farmer = this.data.users.find(u => u.id === crop.farmerId);
        const transporter = this.data.users.find(u => u.id === crop.transporterId);
        const warehouse = this.data.currentUser;

        if (!farmer || !transporter || !warehouse) return;

        // Calculate amounts
        const farmerPayment = crop.quantity * crop.pricePerKg;
        const transportPayment = this.calculateTransportFee(crop.quantity);
        const totalPayment = farmerPayment + transportPayment;

        console.log('Processing payments:', {
            farmerPayment,
            transportPayment,
            totalPayment,
            warehouseBalance: warehouse.balance
        });

        // Update balances
        farmer.balance += farmerPayment;
        transporter.balance += transportPayment;
        warehouse.balance -= totalPayment;

        // Record transactions
        const timestamp = new Date().toISOString();
        const txHash = this.generateTxHash();

        // Farmer transaction
        if (!farmer.transactions) farmer.transactions = [];
        farmer.transactions.push({
            id: 'tx_' + this.data.nextId++,
            type: 'credit',
            amount: farmerPayment,
            description: `Payment for ${crop.quantity}kg ${crop.type}`,
            date: timestamp,
            txHash: txHash,
            cropId: crop.id
        });

        // Transporter transaction
        if (!transporter.transactions) transporter.transactions = [];
        transporter.transactions.push({
            id: 'tx_' + this.data.nextId++,
            type: 'credit',
            amount: transportPayment,
            description: `Transport fee for ${crop.type}`,
            date: timestamp,
            txHash: txHash,
            cropId: crop.id
        });

        // Warehouse transaction
        if (!warehouse.transactions) warehouse.transactions = [];
        warehouse.transactions.push({
            id: 'tx_' + this.data.nextId++,
            type: 'debit',
            amount: totalPayment,
            description: `Payment for ${crop.type} (Farmer: $${farmerPayment.toFixed(2)}, Transport: $${transportPayment.toFixed(2)})`,
            date: timestamp,
            txHash: txHash,
            cropId: crop.id
        });

        console.log('Payments processed successfully. New balances:', {
            farmer: farmer.balance,
            transporter: transporter.balance,
            warehouse: warehouse.balance
        });
    },

    // QR Code and verification functions
    generateQR(cropId) {
        const crop = this.data.crops.find(c => c.id === cropId);
        const farmer = this.data.users.find(u => u.id === crop?.farmerId);
        
        if (!crop || !farmer) return;

        document.getElementById('qrProductName').textContent = `${crop.cultivation} ${crop.type}`;
        document.getElementById('qrTxHash').textContent = crop.blockchainTx;
        document.getElementById('qrId').textContent = crop.qrCode;
        document.getElementById('qrFarmer').textContent = farmer.name || 'Unknown';
        document.getElementById('qrUrl').textContent = `https://agroblock.com/verify/${crop.qrCode}`;
        
        this.showModal('qrModal');
    },

    simulateQRScan() {
        this.showLoadingOverlay('Scanning QR code...');
        
        setTimeout(() => {
            // Get a random verified product
            const availableProducts = this.data.crops.filter(c => c.status === 'delivered');
            
            if (availableProducts.length === 0) {
                this.hideLoadingOverlay();
                this.showToast('No verified products found', 'warning');
                return;
            }

            const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
            const farmer = this.data.users.find(u => u.id === randomProduct.farmerId);
            
            // Populate verification modal
            document.getElementById('verifiedProductName').textContent = `${randomProduct.cultivation} ${randomProduct.type}`;
            document.getElementById('verifiedFarmer').textContent = `👨‍🌾 ${farmer?.name || 'Unknown'}`;
            document.getElementById('verifiedLocation').textContent = `📍 ${farmer?.farmAddress || 'Unknown'}`;
            document.getElementById('verifiedHarvestDate').textContent = `📅 ${new Date(randomProduct.harvestDate).toLocaleDateString()}`;
            document.getElementById('verifiedCultivation').textContent = `🌱 ${randomProduct.cultivation}`;
            document.getElementById('verifiedTx').textContent = `⛓️ ${randomProduct.blockchainTx}`;
            document.getElementById('verifiedPrice').textContent = `💰 $${randomProduct.pricePerKg}/kg`;
            
            // Store current product for purchase
            this.currentScannedProduct = randomProduct;
            
            this.hideLoadingOverlay();
            this.showModal('productModal');
        }, 2000);
    },

    purchaseProduct(productId = null) {
        const product = productId ? 
            this.data.crops.find(c => c.id === productId) : 
            this.currentScannedProduct;
            
        if (!product) return;

        const user = this.data.currentUser;
        if (!user) return;

        const totalCost = product.quantity * product.pricePerKg;
        
        if (user.balance < totalCost) {
            this.showToast('Insufficient balance!', 'error');
            return;
        }

        // Process purchase
        user.balance -= totalCost;
        
        if (!user.orders) user.orders = [];
        user.orders.push({
            id: 'order_' + this.data.nextId++,
            productId: product.id,
            productName: `${product.cultivation} ${product.type}`,
            quantity: product.quantity,
            amount: totalCost,
            date: new Date().toISOString()
        });

        if (!user.transactions) user.transactions = [];
        user.transactions.push({
            id: 'tx_' + this.data.nextId++,
            type: 'debit',
            amount: totalCost,
            description: `Purchase: ${product.type}`,
            date: new Date().toISOString(),
            txHash: this.generateTxHash()
        });

        // Remove product from available (sold)
        product.status = 'sold';
        product.soldDate = new Date().toISOString();
        product.customerId = user.id;

        this.saveData();
        this.closeModal('productModal');
        this.showToast(`Successfully purchased ${product.type}!`, 'success');
        this.loadCustomerDashboard();
    },

    // Utility functions
    getCropEmoji(cropType) {
        const emojiMap = {
            'Tomatoes': '🍅', 'Potatoes': '🥔', 'Carrots': '🥕', 'Onions': '🧅',
            'Wheat': '🌾', 'Rice': '🍚', 'Corn': '🌽', 'Soybeans': '🫘',
            'Apples': '🍎', 'Oranges': '🍊', 'Bananas': '🍌', 'Grapes': '🍇',
            'Lettuce': '🥬', 'Spinach': '🥬', 'Peppers': '🌶️', 'Cucumbers': '🥒'
        };
        return emojiMap[cropType] || '🌱';
    },

    getStatusClass(status) {
        const classMap = {
            'pending': 'status--warning',
            'approved': 'status--info',
            'in_transit': 'status--warning',
            'awaiting_confirmation': 'status--warning',
            'delivered': 'status--success',
            'sold': 'status--success',
            'rejected': 'status--error'
        };
        return classMap[status] || 'status--info';
    },

    getStatusText(status) {
        const textMap = {
            'pending': 'Pending Approval',
            'approved': 'Approved - Awaiting Transport',
            'in_transit': 'In Transit',
            'awaiting_confirmation': 'Awaiting Confirmation',
            'delivered': 'Delivered',
            'sold': 'Sold',
            'rejected': 'Rejected'
        };
        return textMap[status] || status;
    },

    calculateTransportFee(quantity) {
        return this.paymentRates.transportBaseRate + (quantity * 0.5);
    },

    calculateETA() {
        const randomHours = Math.floor(Math.random() * 24) + 1;
        return `${randomHours} hour(s)`;
    },

    generateQRCode() {
        return 'QR' + Math.random().toString(36).substr(2, 8).toUpperCase();
    },

    generateTxHash() {
        return '0x' + Array.from({length: 40}, () => 
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
    },

    // Modal and UI functions
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            
            // Focus management
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('notificationToast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');
        
        toastMessage.textContent = message;
        
        // Update icon and color based on type
        const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
        toastIcon.textContent = icons[type] || '✅';
        
        // Update toast class
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    },

    showLoadingOverlay(text = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        
        if (overlay && loadingText) {
            loadingText.textContent = text;
            overlay.classList.remove('hidden');
        }
    },

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    },

    // Additional utility functions
    trackCrop(cropId) {
        const crop = this.data.crops.find(c => c.id === cropId);
        if (!crop) return;
        
        this.showToast(`Tracking ${crop.type} - Status: ${this.getStatusText(crop.status)}`, 'info');
    },

    // Test workflow function
    testWorkflow() {
        console.log('Testing workflow...');
        console.log('Users:', this.data.users);
        console.log('Crops:', this.data.crops);
        console.log('Current user:', this.data.currentUser);
    },

    // ===== USER CONNECTION SYSTEM =====

    // Send connection request
    sendConnectionRequest(targetUserId) {
        const currentUser = this.data.currentUser;
        if (!currentUser || currentUser.id === targetUserId) return;

        // Check if request already exists
        const existingRequest = this.data.connectionRequests.find(req => 
            req.fromUserId === currentUser.id && req.toUserId === targetUserId
        );

        if (existingRequest) {
            this.showToast('Connection request already sent', 'info');
            return;
        }

        // Check if already connected
        const existingConnection = this.data.connections.find(conn => 
            (conn.user1Id === currentUser.id && conn.user2Id === targetUserId) ||
            (conn.user1Id === targetUserId && conn.user2Id === currentUser.id)
        );

        if (existingConnection) {
            this.showToast('Already connected with this user', 'info');
            return;
        }

        const request = {
            id: 'req_' + this.data.nextId++,
            fromUserId: currentUser.id,
            toUserId: targetUserId,
            status: 'pending',
            timestamp: new Date().toISOString(),
            message: ''
        };

        this.data.connectionRequests.push(request);
        this.saveData();
        this.showToast('Connection request sent successfully!', 'success');
        this.loadUserDirectory();
    },

    // Accept connection request
    acceptConnectionRequest(requestId) {
        const request = this.data.connectionRequests.find(req => req.id === requestId);
        if (!request) return;

        const currentUser = this.data.currentUser;
        if (request.toUserId !== currentUser.id) return;

        // Create connection
        const connection = {
            id: 'conn_' + this.data.nextId++,
            user1Id: request.fromUserId,
            user2Id: request.toUserId,
            timestamp: new Date().toISOString(),
            status: 'active'
        };

        this.data.connections.push(connection);
        
        // Update request status
        request.status = 'accepted';
        request.acceptedAt = new Date().toISOString();

        // Add to activity feed
        this.addActivityFeedItem('connection_accepted', currentUser.id, request.fromUserId);

        this.saveData();
        this.showToast('Connection accepted! You can now message this user.', 'success');
        this.loadConnectionRequests();
        this.loadUserDirectory();
    },

    // Reject connection request
    rejectConnectionRequest(requestId) {
        const request = this.data.connectionRequests.find(req => req.id === requestId);
        if (!request) return;

        const currentUser = this.data.currentUser;
        if (request.toUserId !== currentUser.id) return;

        request.status = 'rejected';
        request.rejectedAt = new Date().toISOString();

        this.saveData();
        this.showToast('Connection request rejected', 'info');
        this.loadConnectionRequests();
    },

    // Send message to connected user
    sendMessage(toUserId, message) {
        const currentUser = this.data.currentUser;
        if (!currentUser) return;

        // Check if users are connected
        const connection = this.data.connections.find(conn => 
            (conn.user1Id === currentUser.id && conn.user2Id === toUserId) ||
            (conn.user1Id === toUserId && conn.user2Id === currentUser.id)
        );

        if (!connection) {
            this.showToast('You must be connected to send messages', 'error');
            return;
        }

        const newMessage = {
            id: 'msg_' + this.data.nextId++,
            fromUserId: currentUser.id,
            toUserId: toUserId,
            message: message,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.data.messages.push(newMessage);
        this.saveData();
        this.showToast('Message sent successfully!', 'success');
        this.loadMessages();
    },

    // Mark message as read
    markMessageAsRead(messageId) {
        const message = this.data.messages.find(msg => msg.id === messageId);
        if (message) {
            message.read = true;
            this.saveData();
        }
    },

    // Get user profile
    getUserProfile(userId) {
        return this.data.users.find(u => u.id === userId);
    },

    // Get connected users
    getConnectedUsers() {
        const currentUser = this.data.currentUser;
        if (!currentUser) return [];

        return this.data.connections
            .filter(conn => conn.status === 'active')
            .map(conn => {
                const otherUserId = conn.user1Id === currentUser.id ? conn.user2Id : conn.user1Id;
                return this.getUserProfile(otherUserId);
            })
            .filter(user => user);
    },

    // Get pending connection requests
    getPendingConnectionRequests() {
        const currentUser = this.data.currentUser;
        if (!currentUser) return [];

        return this.data.connectionRequests.filter(req => 
            req.toUserId === currentUser.id && req.status === 'pending'
        );
    },

    // Get sent connection requests
    getSentConnectionRequests() {
        const currentUser = this.data.currentUser;
        if (!currentUser) return [];

        return this.data.connectionRequests.filter(req => 
            req.fromUserId === currentUser.id && req.status === 'pending'
        );
    },

    // Add activity feed item
    addActivityFeedItem(type, userId1, userId2 = null, cropId = null) {
        const user1 = this.getUserProfile(userId1);
        const user2 = userId2 ? this.getUserProfile(userId2) : null;
        const crop = cropId ? this.data.crops.find(c => c.id === cropId) : null;

        let activity = {
            id: 'activity_' + this.data.nextId++,
            type: type,
            userId1: userId1,
            userId2: userId2,
            cropId: cropId,
            timestamp: new Date().toISOString(),
            read: false
        };

        switch (type) {
            case 'crop_added':
                activity.description = `${user1?.name || 'Unknown'} added new ${crop?.type || 'crop'}`;
                break;
            case 'crop_approved':
                activity.description = `${user1?.name || 'Unknown'} approved ${crop?.type || 'crop'}`;
                break;
            case 'job_accepted':
                activity.description = `${user1?.name || 'Unknown'} accepted transport job for ${crop?.type || 'crop'}`;
                break;
            case 'connection_accepted':
                activity.description = `${user1?.name || 'Unknown'} and ${user2?.name || 'Unknown'} are now connected`;
                break;
            case 'payment_processed':
                activity.description = `Payment processed for ${crop?.type || 'crop'} delivery`;
                break;
        }

        this.data.activityFeed.push(activity);
        this.saveData();
    },

    // Load user directory
    loadUserDirectory() {
        const currentUser = this.data.currentUser;
        if (!currentUser) return;

        const container = document.getElementById('userDirectory');
        if (!container) return;

        const allUsers = this.data.users.filter(user => user.id !== currentUser.id);
        const connectedUserIds = this.getConnectedUsers().map(u => u.id);
        const pendingRequests = this.getSentConnectionRequests().map(req => req.toUserId);

        container.innerHTML = allUsers.map(user => {
            const isConnected = connectedUserIds.includes(user.id);
            const hasPendingRequest = pendingRequests.includes(user.id);
            const canConnect = !isConnected && !hasPendingRequest;

            return `
                <div class="user-card">
                    <div class="user-avatar">
                        <span class="avatar-emoji">${this.getRoleEmoji(user.role)}</span>
                    </div>
                    <div class="user-info">
                        <h3>${user.name || user.companyName || 'Unknown User'}</h3>
                        <p class="user-role">${this.getRoleDisplayName(user.role)}</p>
                        <p class="user-email">${user.email}</p>
                        ${user.farmAddress ? `<p class="user-location">📍 ${user.farmAddress}</p>` : ''}
                        ${user.address ? `<p class="user-location">📍 ${user.address}</p>` : ''}
                    </div>
                    <div class="user-actions">
                        ${isConnected ? 
                            `<button class="btn btn--primary" onclick="AgroBlockApp.openChat('${user.id}')">
                                💬 Message
                            </button>` :
                            hasPendingRequest ?
                            `<span class="status status--warning">Request Sent</span>` :
                            `<button class="btn btn--outline" onclick="AgroBlockApp.sendConnectionRequest('${user.id}')">
                                🔗 Connect
                            </button>`
                        }
                        <button class="btn btn--outline btn--sm" onclick="AgroBlockApp.viewUserProfile('${user.id}')">
                            👁️ View Profile
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Load connection requests
    loadConnectionRequests() {
        const container = document.getElementById('connectionRequests');
        if (!container) return;

        const pendingRequests = this.getPendingConnectionRequests();
        const sentRequests = this.getSentConnectionRequests();

        if (pendingRequests.length === 0 && sentRequests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔗</div>
                    <h3>No connection requests</h3>
                    <p>You'll see connection requests here</p>
                </div>
            `;
            return;
        }

        let html = '';

        if (pendingRequests.length > 0) {
            html += '<h3>Incoming Requests</h3>';
            html += pendingRequests.map(req => {
                const fromUser = this.getUserProfile(req.fromUserId);
                return `
                    <div class="connection-request">
                        <div class="request-info">
                            <h4>${fromUser?.name || fromUser?.companyName || 'Unknown User'}</h4>
                            <p>${fromUser?.role || 'Unknown Role'}</p>
                            <small>${new Date(req.timestamp).toLocaleDateString()}</small>
                        </div>
                        <div class="request-actions">
                            <button class="btn btn--primary" onclick="AgroBlockApp.acceptConnectionRequest('${req.id}')">
                                ✅ Accept
                            </button>
                            <button class="btn btn--outline" onclick="AgroBlockApp.rejectConnectionRequest('${req.id}')">
                                ❌ Reject
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        if (sentRequests.length > 0) {
            html += '<h3>Sent Requests</h3>';
            html += sentRequests.map(req => {
                const toUser = this.getUserProfile(req.toUserId);
                return `
                    <div class="connection-request">
                        <div class="request-info">
                            <h4>${toUser?.name || toUser?.companyName || 'Unknown User'}</h4>
                            <p>${toUser?.role || 'Unknown Role'}</p>
                            <small>${new Date(req.timestamp).toLocaleDateString()}</small>
                        </div>
                        <div class="request-actions">
                            <span class="status status--info">Pending</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        container.innerHTML = html;
    },

    // Load messages
    loadMessages() {
        const container = document.getElementById('messagesContainer');
        if (!container) return;

        const currentUser = this.data.currentUser;
        if (!currentUser) return;

        const userMessages = this.data.messages.filter(msg => 
            msg.fromUserId === currentUser.id || msg.toUserId === currentUser.id
        );

        if (userMessages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>No messages yet</h3>
                    <p>Connect with other users to start messaging</p>
                </div>
            `;
            return;
        }

        // Group messages by conversation
        const conversations = {};
        userMessages.forEach(msg => {
            const otherUserId = msg.fromUserId === currentUser.id ? msg.toUserId : msg.fromUserId;
            if (!conversations[otherUserId]) {
                conversations[otherUserId] = [];
            }
            conversations[otherUserId].push(msg);
        });

        container.innerHTML = Object.entries(conversations).map(([otherUserId, messages]) => {
            const otherUser = this.getUserProfile(otherUserId);
            const lastMessage = messages[messages.length - 1];
            const unreadCount = messages.filter(msg => 
                msg.toUserId === currentUser.id && !msg.read
            ).length;

            return `
                <div class="conversation-item" onclick="AgroBlockApp.openChat('${otherUserId}')">
                    <div class="conversation-avatar">
                        <span class="avatar-emoji">${this.getRoleEmoji(otherUser?.role)}</span>
                    </div>
                    <div class="conversation-info">
                        <h4>${otherUser?.name || otherUser?.companyName || 'Unknown User'}</h4>
                        <p class="last-message">${lastMessage.message.substring(0, 50)}${lastMessage.message.length > 50 ? '...' : ''}</p>
                        <small>${new Date(lastMessage.timestamp).toLocaleDateString()}</small>
                    </div>
                    ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
                </div>
            `;
        }).join('');
    },

    // Open chat with user
    openChat(userId) {
        const otherUser = this.getUserProfile(userId);
        if (!otherUser) return;

        // Mark messages as read
        this.data.messages.forEach(msg => {
            if (msg.fromUserId === userId && msg.toUserId === this.data.currentUser.id) {
                msg.read = true;
            }
        });

        this.saveData();
        
        // Update chat modal title
        document.getElementById('chatUserName').textContent = otherUser.name || otherUser.companyName || 'Unknown User';
        
        this.showModal('chatModal');
        this.loadChatMessages(userId);
        this.currentChatUser = otherUser;
    },

    // Load chat messages
    loadChatMessages(userId) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const currentUser = this.data.currentUser;
        const messages = this.data.messages.filter(msg => 
            (msg.fromUserId === currentUser.id && msg.toUserId === userId) ||
            (msg.fromUserId === userId && msg.toUserId === currentUser.id)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        container.innerHTML = messages.map(msg => {
            const isOwn = msg.fromUserId === currentUser.id;
            return `
                <div class="message ${isOwn ? 'message--own' : 'message--other'}">
                    <div class="message-content">
                        <p>${msg.message}</p>
                        <small>${new Date(msg.timestamp).toLocaleTimeString()}</small>
                    </div>
                </div>
            `;
        }).join('');

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    },

    // Send chat message
    sendChatMessage() {
        const input = document.getElementById('chatMessageInput');
        const message = input.value.trim();
        
        if (!message || !this.currentChatUser) return;

        this.sendMessage(this.currentChatUser.id, message);
        input.value = '';
        this.loadChatMessages(this.currentChatUser.id);
    },

    // View user profile
    viewUserProfile(userId) {
        const user = this.getUserProfile(userId);
        if (!user) return;

        document.getElementById('profileUserName').textContent = user.name || user.companyName || 'Unknown User';
        document.getElementById('profileUserRole').textContent = this.getRoleDisplayName(user.role);
        document.getElementById('profileUserEmail').textContent = user.email;
        document.getElementById('profileUserWallet').textContent = user.wallet;
        document.getElementById('profileUserJoinDate').textContent = new Date(user.joinDate).toLocaleDateString();

        // Role-specific information
        let roleInfo = '';
        switch (user.role) {
            case 'farmer':
                roleInfo = `<p><strong>Farm Address:</strong> ${user.farmAddress || 'Not specified'}</p>`;
                break;
            case 'transporter':
                roleInfo = `<p><strong>Vehicle Type:</strong> ${user.vehicleType || 'Not specified'}</p>`;
                break;
            case 'warehouseManager':
                roleInfo = `<p><strong>Company Address:</strong> ${user.address || 'Not specified'}</p>`;
                break;
            case 'customer':
                roleInfo = `<p><strong>Address:</strong> ${user.address || 'Not specified'}</p>`;
                break;
        }
        document.getElementById('profileUserRoleInfo').innerHTML = roleInfo;

        this.showModal('userProfileModal');
    },

    // Load activity feed
    loadActivityFeed() {
        const container = document.getElementById('activityFeed');
        if (!container) return;

        const currentUser = this.data.currentUser;
        if (!currentUser) return;

        const userActivities = this.data.activityFeed
            .filter(activity => 
                activity.userId1 === currentUser.id || 
                activity.userId2 === currentUser.id ||
                this.getConnectedUsers().some(u => u.id === activity.userId1 || u.id === activity.userId2)
            )
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 20);

        if (userActivities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📰</div>
                    <h3>No activity yet</h3>
                    <p>Start connecting and working with others to see activity here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = userActivities.map(activity => {
            const user1 = this.getUserProfile(activity.userId1);
            const user2 = activity.userId2 ? this.getUserProfile(activity.userId2) : null;
            const crop = activity.cropId ? this.data.crops.find(c => c.id === activity.cropId) : null;

            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        ${this.getActivityIcon(activity.type)}
                    </div>
                    <div class="activity-content">
                        <p>${activity.description}</p>
                        <small>${new Date(activity.timestamp).toLocaleString()}</small>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Get role emoji
    getRoleEmoji(role) {
        const emojiMap = {
            'farmer': '👨‍🌾',
            'transporter': '🚛',
            'warehouseManager': '🏢',
            'customer': '🛒'
        };
        return emojiMap[role] || '👤';
    },

    // Get role display name
    getRoleDisplayName(role) {
        const nameMap = {
            'farmer': 'Farmer',
            'transporter': 'Transporter',
            'warehouseManager': 'Warehouse Manager',
            'customer': 'Customer'
        };
        return nameMap[role] || role;
    },

    // Get activity icon
    getActivityIcon(type) {
        const iconMap = {
            'crop_added': '🌱',
            'crop_approved': '✅',
            'job_accepted': '🚛',
            'connection_accepted': '🔗',
            'payment_processed': '💰'
        };
        return iconMap[type] || '📝';
    },

    // ===== METAMASK INTEGRATION =====

    // Check if MetaMask is installed
    isMetaMaskInstalled() {
        return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
    },

    // Connect to MetaMask
    async connectMetaMask() {
        if (!this.isMetaMaskInstalled()) {
            this.showModal('metamaskGuideModal');
            return false;
        }

        try {
            this.showLoadingOverlay('Connecting to MetaMask...');
            
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length === 0) {
                this.showToast('No accounts found in MetaMask', 'error');
                this.hideLoadingOverlay();
                return false;
            }

            const account = accounts[0];
            const networkId = await window.ethereum.request({ 
                method: 'net_version' 
            });

            // Update application state
            this.data.metamaskConnected = true;
            this.data.metamaskAccount = account;
            this.data.metamaskNetwork = this.getNetworkName(networkId);
            
            // Update current user's wallet if logged in
            if (this.data.currentUser) {
                this.data.currentUser.wallet = account;
                this.data.currentUser.metamaskConnected = true;
            }

            this.saveData();
            this.hideLoadingOverlay();
            
            this.showToast(`Connected to MetaMask! Account: ${account.substring(0, 6)}...${account.substring(38)}`, 'success');
            
            // Update UI
            this.updateMetaMaskUI();
            
            // Listen for account changes
            this.setupMetaMaskListeners();
            
            return true;
        } catch (error) {
            this.hideLoadingOverlay();
            console.error('MetaMask connection error:', error);
            
            if (error.code === 4001) {
                this.showToast('MetaMask connection rejected by user', 'error');
            } else {
                this.showToast(`MetaMask connection failed: ${error.message}`, 'error');
            }
            return false;
        }
    },

    // Disconnect from MetaMask
    disconnectMetaMask() {
        this.data.metamaskConnected = false;
        this.data.metamaskAccount = null;
        this.data.metamaskNetwork = null;
        
        if (this.data.currentUser) {
            this.data.currentUser.metamaskConnected = false;
        }
        
        this.saveData();
        this.showToast('Disconnected from MetaMask', 'info');
        this.updateMetaMaskUI();
    },

    // Get network name from network ID
    getNetworkName(networkId) {
        const networks = {
            '1': 'Ethereum Mainnet',
            '3': 'Ropsten Testnet',
            '4': 'Rinkeby Testnet',
            '5': 'Goerli Testnet',
            '42': 'Kovan Testnet',
            '137': 'Polygon Mainnet',
            '80001': 'Mumbai Testnet',
            '56': 'BSC Mainnet',
            '97': 'BSC Testnet'
        };
        return networks[networkId] || `Network ${networkId}`;
    },

    // Setup MetaMask event listeners
    setupMetaMaskListeners() {
        if (!window.ethereum) return;

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                // User disconnected MetaMask
                this.disconnectMetaMask();
            } else {
                // User switched accounts
                const newAccount = accounts[0];
                this.data.metamaskAccount = newAccount;
                
                if (this.data.currentUser) {
                    this.data.currentUser.wallet = newAccount;
                }
                
                this.saveData();
                this.showToast(`Switched to account: ${newAccount.substring(0, 6)}...${newAccount.substring(38)}`, 'info');
                this.updateMetaMaskUI();
            }
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId) => {
            const networkId = parseInt(chainId, 16);
            const networkName = this.getNetworkName(networkId);
            
            this.data.metamaskNetwork = networkName;
            this.saveData();
            
            this.showToast(`Switched to network: ${networkName}`, 'info');
            this.updateMetaMaskUI();
        });

        // Listen for disconnect
        window.ethereum.on('disconnect', () => {
            this.disconnectMetaMask();
        });
    },

    // Update MetaMask UI elements
    updateMetaMaskUI() {
        const connectBtn = document.getElementById('metamaskConnectBtn');
        const disconnectBtn = document.getElementById('metamaskDisconnectBtn');
        const accountInfo = document.getElementById('metamaskAccountInfo');
        const networkInfo = document.getElementById('metamaskNetworkInfo');
        const walletDisplay = document.getElementById('metamaskWalletDisplay');

        if (this.data.metamaskConnected) {
            // Update connect button
            if (connectBtn) {
                connectBtn.style.display = 'none';
            }
            if (disconnectBtn) {
                disconnectBtn.style.display = 'inline-block';
            }

            // Update account info
            if (accountInfo) {
                const shortAccount = `${this.data.metamaskAccount.substring(0, 6)}...${this.data.metamaskAccount.substring(38)}`;
                accountInfo.textContent = shortAccount;
                accountInfo.title = this.data.metamaskAccount;
            }

            // Update network info
            if (networkInfo) {
                networkInfo.textContent = this.data.metamaskNetwork;
            }

            // Update wallet display
            if (walletDisplay) {
                walletDisplay.textContent = this.data.metamaskAccount;
                walletDisplay.style.display = 'block';
            }

            // Update current user wallet if logged in
            if (this.data.currentUser) {
                this.data.currentUser.wallet = this.data.metamaskAccount;
                this.data.currentUser.metamaskConnected = true;
                this.saveData();
            }
        } else {
            // Reset UI elements
            if (connectBtn) {
                connectBtn.style.display = 'inline-block';
            }
            if (disconnectBtn) {
                disconnectBtn.style.display = 'none';
            }
            if (accountInfo) {
                accountInfo.textContent = 'Not Connected';
            }
            if (networkInfo) {
                networkInfo.textContent = 'Not Connected';
            }
            if (walletDisplay) {
                walletDisplay.style.display = 'none';
            }
        }
    },

    // Get MetaMask account balance
    async getMetaMaskBalance() {
        if (!this.data.metamaskConnected || !this.data.metamaskAccount) {
            return null;
        }

        try {
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [this.data.metamaskAccount, 'latest']
            });

            // Convert from Wei to Ether
            const balanceInEther = parseFloat(balance) / Math.pow(10, 18);
            return balanceInEther;
        } catch (error) {
            console.error('Error getting balance:', error);
            return null;
        }
    },

    // Send transaction through MetaMask
    async sendMetaMaskTransaction(toAddress, amount, data = '') {
        if (!this.data.metamaskConnected || !this.data.metamaskAccount) {
            this.showToast('Please connect MetaMask first', 'error');
            return null;
        }

        try {
            this.showLoadingOverlay('Preparing transaction...');
            
            const transactionParameters = {
                to: toAddress,
                from: this.data.metamaskAccount,
                value: '0x' + (amount * Math.pow(10, 18)).toString(16), // Convert to Wei
                data: data
            };

            // Get gas estimate
            const gasEstimate = await window.ethereum.request({
                method: 'eth_estimateGas',
                params: [transactionParameters]
            });

            transactionParameters.gas = gasEstimate;

            // Send transaction
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters]
            });

            this.hideLoadingOverlay();
            this.showToast(`Transaction sent! Hash: ${txHash.substring(0, 10)}...`, 'success');
            
            return txHash;
        } catch (error) {
            this.hideLoadingOverlay();
            console.error('Transaction error:', error);
            
            if (error.code === 4001) {
                this.showToast('Transaction rejected by user', 'error');
            } else {
                this.showToast(`Transaction failed: ${error.message}`, 'error');
            }
            return null;
        }
    },

    // Initialize MetaMask on app start
    initMetaMask() {
        if (this.isMetaMaskInstalled()) {
            // Check if already connected
            this.checkMetaMaskConnection();
            
            // Setup listeners
            this.setupMetaMaskListeners();
            
            console.log('MetaMask integration initialized');
        } else {
            console.log('MetaMask not installed');
        }
    },

    // Check if already connected to MetaMask
    async checkMetaMaskConnection() {
        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_accounts' 
            });
            
            if (accounts.length > 0) {
                const account = accounts[0];
                const networkId = await window.ethereum.request({ 
                    method: 'net_version' 
                });

                this.data.metamaskConnected = true;
                this.data.metamaskAccount = account;
                this.data.metamaskNetwork = this.getNetworkName(networkId);
                
                this.saveData();
                this.updateMetaMaskUI();
            }
        } catch (error) {
            console.error('Error checking MetaMask connection:', error);
        }
    },

    // Connect MetaMask during signup
    async connectMetaMaskSignup() {
        if (!this.isMetaMaskInstalled()) {
            this.showModal('metamaskGuideModal');
            return false;
        }

        try {
            this.showLoadingOverlay('Connecting to MetaMask...');
            
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length === 0) {
                this.showToast('No accounts found in MetaMask', 'error');
                this.hideLoadingOverlay();
                return false;
            }

            const account = accounts[0];
            const networkId = await window.ethereum.request({ 
                method: 'net_version' 
            });

            // Update signup form UI
            this.updateMetaMaskSignupUI(account, this.getNetworkName(networkId));
            
            this.hideLoadingOverlay();
            this.showToast(`Connected to MetaMask! Account: ${account.substring(0, 6)}...${account.substring(38)}`, 'success');
            
            return true;
        } catch (error) {
            this.hideLoadingOverlay();
            console.error('MetaMask signup connection error:', error);
            
            if (error.code === 4001) {
                this.showToast('MetaMask connection rejected by user', 'error');
            } else {
                this.showToast(`MetaMask connection failed: ${error.message}`, 'error');
            }
            return false;
        }
    },

    // Disconnect MetaMask during signup
    disconnectMetaMaskSignup() {
        this.updateMetaMaskSignupUI(null, null);
        this.showToast('MetaMask disconnected from signup form', 'info');
    },

    // Update MetaMask signup UI
    updateMetaMaskSignupUI(account, network) {
        const connectBtn = document.getElementById('metamaskSignupConnectBtn');
        const disconnectBtn = document.getElementById('metamaskSignupDisconnectBtn');
        const infoSection = document.getElementById('metamaskSignupInfo');
        const networkInfo = document.getElementById('metamaskSignupNetwork');
        const accountInfo = document.getElementById('metamaskSignupAccount');

        if (account && network) {
            // Connected state
            if (connectBtn) connectBtn.style.display = 'none';
            if (disconnectBtn) disconnectBtn.style.display = 'inline-block';
            if (infoSection) infoSection.style.display = 'block';
            if (networkInfo) networkInfo.textContent = network;
            if (accountInfo) {
                accountInfo.textContent = `${account.substring(0, 6)}...${account.substring(38)}`;
                accountInfo.title = account;
            }

            // Hide generated wallet section
            const walletPreview = document.getElementById('walletPreview');
            if (walletPreview) walletPreview.style.display = 'none';
        } else {
            // Disconnected state
            if (connectBtn) connectBtn.style.display = 'inline-block';
            if (disconnectBtn) disconnectBtn.style.display = 'none';
            if (infoSection) infoSection.style.display = 'none';
            if (networkInfo) networkInfo.textContent = 'Not Connected';
            if (accountInfo) accountInfo.textContent = 'Not Connected';

            // Show generated wallet section
            const walletPreview = document.getElementById('walletPreview');
            if (walletPreview) walletPreview.style.display = 'block';
        }
    },

    refreshJobs() {
        this.showToast('Refreshing available jobs...', 'info');
        this.loadTransporterDashboard();
    },

    viewJobDetails(jobId) {
        this.showToast('Job details feature coming soon!', 'info');
    },

    trackDelivery(jobId) {
        this.showToast('GPS tracking feature coming soon!', 'info');
    },

    trackIncoming(cropId) {
        this.showToast('Real-time tracking feature coming soon!', 'info');
    },

    viewProductDetails(productId) {
        const product = this.data.crops.find(c => c.id === productId);
        if (!product) return;
        
        this.currentScannedProduct = product;
        this.simulateQRScan();
    },

    filterProducts(category) {
        this.showToast(`Filtering by ${category || 'all products'}...`, 'info');
        // Filter implementation would go here
    }
};

// Form update function for signup
function updateSignupForm() {
    console.log('updateSignupForm called');
    
    const role = document.getElementById('userRole').value;
    const dynamicFields = document.getElementById('dynamicFormFields');
    
    console.log('Role selected:', role);
    console.log('Dynamic fields container:', dynamicFields);
    
    if (!dynamicFields) {
        console.error('Dynamic fields container not found!');
        return;
    }

    let fieldsHTML = '';

    switch(role) {
        case 'farmer':
            fieldsHTML = `
                <div class="form-group">
                    <label class="form-label" for="farmerName">Name</label>
                    <input type="text" class="form-control" id="farmerName" name="farmerName" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="farmAddress">Farm Address</label>
                    <input type="text" class="form-control" id="farmAddress" name="farmAddress" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="farmerMobile">Mobile Number</label>
                    <input type="tel" class="form-control" id="farmerMobile" name="farmerMobile" required>
                </div>
            `;
            break;
        case 'transporter':
            fieldsHTML = `
                <div class="form-group">
                    <label class="form-label" for="transporterName">Name</label>
                    <input type="text" class="form-control" id="transporterName" name="transporterName" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="vehicleType">Type of Vehicle</label>
                    <select class="form-control" id="vehicleType" name="vehicleType" required>
                        <option value="">Select vehicle type...</option>
                        ${AgroBlockApp.vehicleTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="transporterMobile">Mobile Number</label>
                    <input type="tel" class="form-control" id="transporterMobile" name="transporterMobile" required>
                </div>
            `;
            break;
        case 'warehouseManager':
            fieldsHTML = `
                <div class="form-group">
                    <label class="form-label" for="companyName">Company Name</label>
                    <input type="text" class="form-control" id="companyName" name="companyName" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="companyAddress">Company/Warehouse Address</label>
                    <input type="text" class="form-control" id="companyAddress" name="companyAddress" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="warehouseMobile">Mobile Number</label>
                    <input type="tel" class="form-control" id="warehouseMobile" name="warehouseMobile" required>
                </div>
            `;
            break;
        case 'customer':
            fieldsHTML = `
                <div class="form-group">
                    <label class="form-label" for="customerName">Name</label>
                    <input type="text" class="form-control" id="customerName" name="customerName" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="residentialAddress">Residential Address</label>
                    <input type="text" class="form-control" id="residentialAddress" name="residentialAddress" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="customerMobile">Mobile Number</label>
                    <input type="tel" class="form-control" id="customerMobile" name="customerMobile" required>
                </div>
            `;
            break;
    }

    console.log('Generated HTML:', fieldsHTML);
    dynamicFields.innerHTML = fieldsHTML;
    
    if (role) {
        console.log('Generating wallet for role:', role);
        AgroBlockApp.generateWallet();
    } else {
        console.log('No role selected, hiding wallet preview');
        document.getElementById('walletPreview').style.display = 'none';
    }
}

// Navigation functions
function showLogin() {
    AgroBlockApp.showPage('loginPage');
}

function showSignup() {
    AgroBlockApp.showPage('signupPage');
}

// Tab switching function
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = event.target;
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

function showForgotPassword() {
    AgroBlockApp.showToast('Forgot password feature coming soon!', 'info');
}

function showAddCropModal() {
    AgroBlockApp.showModal('addCropModal');
}

function logout() {
    AgroBlockApp.logout();
}

function regenerateWallet() {
    AgroBlockApp.regenerateWallet();
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AgroBlockApp.init();
});

// Global click handlers for modals
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
});

// Export AgroBlockApp to global scope for onclick handlers
window.AgroBlockApp = AgroBlockApp;
window.updateSignupForm = updateSignupForm;
window.confirmPickup = (cropId) => AgroBlockApp.confirmPickup(cropId);
window.markDelivered = (cropId) => AgroBlockApp.markDelivered(cropId);
window.confirmArrival = (cropId) => AgroBlockApp.confirmArrival(cropId);
window.testWorkflow = () => AgroBlockApp.testWorkflow();

// Connection system functions
window.sendConnectionRequest = (userId) => AgroBlockApp.sendConnectionRequest(userId);
window.acceptConnectionRequest = (requestId) => AgroBlockApp.acceptConnectionRequest(requestId);
window.rejectConnectionRequest = (requestId) => AgroBlockApp.rejectConnectionRequest(requestId);
window.openChat = (userId) => AgroBlockApp.openChat(userId);
window.sendChatMessage = () => AgroBlockApp.sendChatMessage();
window.viewUserProfile = (userId) => AgroBlockApp.viewUserProfile(userId);
window.showTab = showTab;

// MetaMask functions
window.connectMetaMask = () => AgroBlockApp.connectMetaMask();
window.disconnectMetaMask = () => AgroBlockApp.disconnectMetaMask();
window.getMetaMaskBalance = () => AgroBlockApp.getMetaMaskBalance();
window.connectMetaMaskSignup = () => AgroBlockApp.connectMetaMaskSignup();
window.disconnectMetaMaskSignup = () => AgroBlockApp.disconnectMetaMaskSignup();
