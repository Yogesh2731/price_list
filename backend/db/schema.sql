
-- User Table
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- UI translations table 
CREATE TABLE IF NOT EXISTS translations (
    id          SERIAL PRIMARY KEY,
    key         VARCHAR(100) NOT NULL,
    lang        CHAR(2) NOT NULL,
    value       TEXT NOT NULL,
    UNIQUE(key, lang)
);


-- Products / pricelist table
CREATE TABLE IF NOT EXISTS products (
    id              SERIAL PRIMARY KEY,
    product_code    VARCHAR(50),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    unit            VARCHAR(50),
    in_price        NUMERIC(12, 2) DEFAULT 0,
    price           NUMERIC(12, 2) DEFAULT 0,
    vat_percent     NUMERIC(5, 2) DEFAULT 25,
    discount        NUMERIC(5, 2) DEFAULT 0,
    account_number  VARCHAR(20),
    in_stock        INTEGER DEFAULT 0,
    active          BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (email, password, full_name) VALUES
    ('admin@test.com', '$2b$10$sOKJOdThz9F097bUVN5euO16XMysuUD1qwIO4Z7OU6O6HW.ouzzVy', 'Admin User')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;


-- English
INSERT INTO translations (key, lang, value) VALUES
    ('login.title',          'en', 'Log in'),
    ('login.subtitle',       'en', 'Invoice & accounting program'),
    ('login.email',          'en', 'Email address'),
    ('login.password',       'en', 'Password'),
    ('login.show_password',  'en', 'Show password'),
    ('login.remember_me',    'en', 'Remember me'),
    ('login.forgot',         'en', 'Forgot password?'),
    ('login.button',         'en', 'Log in'),
    ('login.no_account',     'en', 'Don''t have an account?'),
    ('login.register',       'en', 'Register for free'),
    ('login.terms',          'en', 'By logging in, you accept our'),
    ('login.terms_link',     'en', 'terms of service'),
    ('nav.home',             'en', 'Home'),
    ('nav.pricing',          'en', 'Pricing'),
    ('nav.features',         'en', 'Features'),
    ('nav.about',            'en', 'About'),
    ('nav.contact',          'en', 'Contact'),
    ('nav.login',            'en', 'Log in'),
    ('nav.register',         'en', 'Register'),
    ('pricelist.title',      'en', 'Price List'),
    ('pricelist.add',        'en', 'Add product'),
    ('pricelist.search',     'en', 'Search products...')
ON CONFLICT (key, lang) DO NOTHING;

-- Swedish
INSERT INTO translations (key, lang, value) VALUES
    ('login.title',          'sv', 'Logga in'),
    ('login.subtitle',       'sv', 'Faktura- & bokföringsprogram'),
    ('login.email',          'sv', 'E-postadress'),
    ('login.password',       'sv', 'Lösenord'),
    ('login.show_password',  'sv', 'Visa lösenord'),
    ('login.remember_me',    'sv', 'Kom ihåg mig'),
    ('login.forgot',         'sv', 'Glömt lösenordet?'),
    ('login.button',         'sv', 'Logga in'),
    ('login.no_account',     'sv', 'Har du inget konto?'),
    ('login.register',       'sv', 'Registrera dig gratis'),
    ('login.terms',          'sv', 'Genom att logga in godkänner du våra'),
    ('login.terms_link',     'sv', 'användarvillkor'),
    ('nav.home',             'sv', 'Hem'),
    ('nav.pricing',          'sv', 'Priser'),
    ('nav.features',         'sv', 'Funktioner'),
    ('nav.about',            'sv', 'Om oss'),
    ('nav.contact',          'sv', 'Kontakt'),
    ('nav.login',            'sv', 'Logga in'),
    ('nav.register',         'sv', 'Registrera'),
    ('pricelist.title',      'sv', 'Prislista'),
    ('pricelist.add',        'sv', 'Lägg till produkt'),
    ('pricelist.search',     'sv', 'Sök produkter...')
ON CONFLICT (key, lang) DO NOTHING;



-- Products dummy data
INSERT INTO products (product_code, name, description, unit, in_price, price, vat_percent, discount, account_number, in_stock) VALUES
    ('P001', 'Web Design - Basic',       'Basic website design package',     'pcs',  2500.00,  4500.00, 25, 0,  3041, 10),
    ('P002', 'Web Design - Standard',    'Standard website design package',  'pcs',  4500.00,  8500.00, 25, 5,  3041, 8),
    ('P003', 'Web Design - Premium',     'Premium website design package',   'pcs',  8000.00, 15000.00, 25, 0,  3041, 5),
    ('P004', 'SEO Optimization',         'Monthly SEO optimization service', 'month',1200.00,  2500.00, 25, 10, 3041, 0),
    ('P005', 'Domain Registration',      'Annual domain registration',       'year',  100.00,   250.00, 25, 0,  3041, 0),
    ('P006', 'Web Hosting - Basic',      'Basic shared hosting plan',        'year',  500.00,  1200.00, 25, 0,  3041, 0),
    ('P007', 'Web Hosting - Pro',        'Professional hosting plan',        'year', 1200.00,  2800.00, 25, 0,  3041, 0),
    ('P008', 'Logo Design',              'Custom logo design service',       'pcs',  1500.00,  3500.00, 25, 0,  3041, 0),
    ('P009', 'Brand Identity Package',   'Full brand identity design',       'pcs',  5000.00, 12000.00, 25, 5,  3041, 0),
    ('P010', 'Social Media Setup',       'Social media profile setup',       'pcs',   800.00,  1800.00, 25, 0,  3041, 0),
    ('P011', 'Content Writing - Blog',   'Blog post writing per article',    'pcs',   300.00,   750.00, 25, 0,  3041, 0),
    ('P012', 'Email Marketing Setup',    'Email campaign setup and design',  'pcs',   900.00,  2200.00, 25, 0,  3041, 0),
    ('P013', 'E-commerce Integration',   'Online shop integration',          'pcs',  6000.00, 14000.00, 25, 0,  3041, 0),
    ('P014', 'Mobile App Design',        'UI/UX design for mobile app',      'pcs',  8500.00, 18000.00, 25, 0,  3041, 0),
    ('P015', 'Database Design',          'Custom database architecture',     'hour',  700.00,  1500.00, 25, 0,  3041, 0),
    ('P016', 'API Development',          'REST API development per endpoint','hour',  850.00,  1800.00, 25, 0,  3041, 0),
    ('P017', 'Maintenance - Monthly',    'Monthly website maintenance',      'month', 600.00,  1400.00, 25, 10, 3041, 0),
    ('P018', 'SSL Certificate',          'Annual SSL certificate',           'year',  200.00,   500.00, 25, 0,  3041, 0),
    ('P019', 'Analytics Setup',          'Google Analytics configuration',   'pcs',   400.00,   900.00, 25, 0,  3041, 0),
    ('P020', 'Training Session',         'One-on-one training session',      'hour',  500.00,  1200.00, 25, 0,  3041, 0),
    ('P021', 'Security Audit',           'Full website security audit',      'pcs',  2000.00,  4500.00, 25, 0,  3041, 0),
    ('P022', 'Performance Optimization', 'Website speed optimization',       'pcs',  1000.00,  2500.00, 25, 5,  3041, 0),
    ('P023', 'Backup Solution',          'Automated backup setup',           'year',  300.00,   800.00, 25, 0,  3041, 0)
ON CONFLICT DO NOTHING;