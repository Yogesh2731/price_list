
-- User Table
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- UI translations table (login page strings, nav labels, etc.)
CREATE TABLE IF NOT EXISTS translations (
    id          SERIAL PRIMARY KEY,
    key         VARCHAR(100) NOT NULL,
    lang        CHAR(2) NOT NULL,
    value       TEXT NOT NULL,
    UNIQUE(key, lang)
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