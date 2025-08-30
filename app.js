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
        nextId: 1
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

        // Generate wallet for new user
        const wallet = this.generateWallet();
        console.log('Generated wallet:', wallet);
        
        const newUser = {
            id: 'user_' + this.data.nextId++,
            ...formData,
            wallet: wallet,
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