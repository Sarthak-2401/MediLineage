CREATE DATABASE sih;
USE sih;
-- MediLineage AI Health Tracker - Final MySQL Database Schema
-- Healthcare and Genetic Insights Platform with Provider Access

-- MySQL-specific settings for optimal performance
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
SET FOREIGN_KEY_CHECKS = 0;

-- Users table - Core user information
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    country_code VARCHAR(3),
    timezone VARCHAR(50),
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    privacy_consent BOOLEAN DEFAULT FALSE,
    genetic_data_consent BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medical profiles - Extended medical information
CREATE TABLE medical_profiles (
    profile_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    blood_type VARCHAR(10),
    height_cm DECIMAL(5,2),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    primary_physician VARCHAR(255),
    insurance_provider VARCHAR(255),
    insurance_id VARCHAR(100),
    medical_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Health metrics tracking
CREATE TABLE health_metrics (
    metric_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    metric_type VARCHAR(50) NOT NULL COMMENT 'weight, blood_pressure, heart_rate, glucose, etc.',
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    systolic_value DECIMAL(5,2) COMMENT 'for blood pressure',
    diastolic_value DECIMAL(5,2) COMMENT 'for blood pressure',
    measured_date DATE NOT NULL,
    source VARCHAR(50) COMMENT 'manual, device, wearable, lab_test',
    device_id VARCHAR(100),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medical conditions and diagnoses
CREATE TABLE medical_conditions (
    condition_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    icd10_code VARCHAR(20),
    severity ENUM('mild', 'moderate', 'severe'),
    status ENUM('active', 'resolved', 'chronic') DEFAULT 'active',
    diagnosed_date DATE,
    resolved_date DATE,
    diagnosed_by VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medications tracking
CREATE TABLE medications (
    medication_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    medication_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    route ENUM('oral', 'injection', 'topical', 'inhalation', 'sublingual', 'rectal'),
    prescribing_doctor VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    purpose TEXT,
    side_effects_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Allergies and adverse reactions
CREATE TABLE allergies (
    allergy_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    allergen VARCHAR(255) NOT NULL,
    allergy_type ENUM('drug', 'food', 'environmental', 'contact'),
    severity ENUM('mild', 'moderate', 'severe', 'life_threatening'),
    reaction_description TEXT,
    first_occurrence DATE,
    verified_by VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Family medical history
CREATE TABLE family_history (
    history_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    relationship ENUM('parent', 'sibling', 'grandparent', 'aunt_uncle', 'cousin', 'child') NOT NULL,
    gender ENUM('male', 'female'),
    condition_name VARCHAR(255) NOT NULL,
    age_of_onset INTEGER,
    status ENUM('living', 'deceased'),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Genetic test results and raw data
CREATE TABLE genetic_tests (
    test_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    test_provider VARCHAR(100) COMMENT '23andMe, AncestryDNA, MyHeritage, etc.',
    test_type ENUM('ancestry', 'health', 'pharmacogenomics', 'whole_genome', 'exome', 'panel'),
    test_date DATE,
    raw_data_file_path TEXT COMMENT 'encrypted storage path',
    processing_status ENUM('pending', 'processing', 'processed', 'failed') DEFAULT 'pending',
    processed_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Genetic variants and SNPs
CREATE TABLE genetic_variants (
    variant_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    test_id CHAR(36) NOT NULL,
    chromosome VARCHAR(5),
    position BIGINT,
    rsid VARCHAR(20) COMMENT 'dbSNP reference ID',
    reference_allele CHAR(1),
    alternate_allele CHAR(1),
    genotype VARCHAR(10) COMMENT 'AA, AG, GG, etc.',
    gene_symbol VARCHAR(20),
    consequence VARCHAR(100) COMMENT 'missense, synonymous, etc.',
    clinical_significance ENUM('benign', 'likely_benign', 'uncertain_significance', 'likely_pathogenic', 'pathogenic'),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES genetic_tests(test_id) ON DELETE CASCADE
) ENGINE=InnoDB ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Disease risk predictions based on genetics
CREATE TABLE genetic_risk_scores (
    risk_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    risk_score DECIMAL(5,4) COMMENT '0.0000 to 1.0000',
    risk_category ENUM('very_low', 'low', 'moderate', 'high', 'very_high'),
    population_percentile DECIMAL(5,2) COMMENT '0.00 to 100.00',
    confidence_level DECIMAL(5,2),
    variants_count INTEGER,
    calculation_method VARCHAR(100),
    last_updated_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pharmacogenomics - drug response predictions
CREATE TABLE drug_responses (
    response_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    drug_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    response_type ENUM('efficacy', 'toxicity', 'dosing', 'metabolism'),
    predicted_response ENUM('poor', 'intermediate', 'normal', 'rapid', 'ultrarapid'),
    confidence_score DECIMAL(5,4),
    relevant_genes JSON COMMENT 'JSON array of gene symbols',
    clinical_annotation TEXT,
    dosing_recommendation TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Health insights and AI recommendations
CREATE TABLE health_insights (
    insight_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    insight_type ENUM('risk_alert', 'recommendation', 'trend_analysis', 'genetic_finding'),
    category ENUM('genetic', 'lifestyle', 'medication', 'prevention', 'family_history'),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity ENUM('info', 'low', 'moderate', 'high', 'critical'),
    action_required BOOLEAN DEFAULT FALSE,
    data_sources JSON COMMENT 'JSON array: genetic, health_metrics, family_history',
    confidence_score DECIMAL(5,4),
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    expires_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lab test results
CREATE TABLE lab_results (
    result_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    test_code VARCHAR(50),
    result_value DECIMAL(15,6),
    result_text TEXT,
    unit VARCHAR(20),
    reference_range VARCHAR(100),
    status ENUM('normal', 'abnormal', 'critical', 'pending'),
    lab_name VARCHAR(255),
    ordered_by VARCHAR(255),
    collected_date DATE,
    resulted_date DATE,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Healthcare providers/doctors login and details
CREATE TABLE healthcare_providers (
    provider_id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(50) COMMENT 'Dr., MD, DO, NP, PA, etc.',
    specialty VARCHAR(100) COMMENT 'cardiology, oncology, general_practice, etc.',
    sub_specialty VARCHAR(100),
    license_number VARCHAR(100) NOT NULL,
    license_state VARCHAR(50),
    license_expiry_date DATE,
    npi_number VARCHAR(10) COMMENT 'National Provider Identifier',
    dea_number VARCHAR(20) COMMENT 'DEA registration number',
    facility_name VARCHAR(255),
    facility_address TEXT,
    facility_phone VARCHAR(20),
    facility_fax VARCHAR(20),
    professional_email VARCHAR(255),
    phone VARCHAR(20),
    years_of_experience INTEGER,
    board_certifications JSON COMMENT 'JSON array of certifications',
    languages_spoken JSON COMMENT 'JSON array of languages',
    profile_picture_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    is_verified_provider BOOLEAN DEFAULT FALSE COMMENT 'Admin verification',
    verification_documents JSON COMMENT 'Paths to uploaded verification docs',
    last_license_verification_date DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Provider roles and permissions system
CREATE TABLE provider_roles (
    role_id CHAR(36) PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    can_view_genetic_data BOOLEAN DEFAULT FALSE,
    can_view_health_metrics BOOLEAN DEFAULT TRUE,
    can_view_medical_history BOOLEAN DEFAULT TRUE,
    can_view_family_history BOOLEAN DEFAULT FALSE,
    can_view_lab_results BOOLEAN DEFAULT TRUE,
    can_add_prescriptions BOOLEAN DEFAULT FALSE,
    can_add_diagnoses BOOLEAN DEFAULT FALSE,
    can_modify_conditions BOOLEAN DEFAULT FALSE,
    can_view_ai_insights BOOLEAN DEFAULT TRUE,
    can_export_data BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient-provider relationships and access permissions
CREATE TABLE patient_provider_relationships (
    relationship_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    provider_id CHAR(36) NOT NULL,
    role_id CHAR(36) NOT NULL,
    relationship_type ENUM('primary_care', 'specialist', 'consultant', 'second_opinion', 'emergency'),
    status ENUM('pending', 'active', 'inactive', 'revoked') DEFAULT 'pending',
    access_level ENUM('limited', 'standard', 'full', 'emergency') DEFAULT 'standard',
    specific_permissions JSON COMMENT 'Override default role permissions if needed',
    patient_notes TEXT COMMENT 'Notes from patient about this relationship',
    provider_notes TEXT COMMENT 'Notes from provider about this patient',
    emergency_access BOOLEAN DEFAULT FALSE COMMENT 'Can access in emergencies even if revoked',
    start_date DATE,
    end_date DATE,
    last_accessed_date DATE,
    patient_consent_date DATE,
    patient_consent_ip VARCHAR(45),
    created_by CHAR(36) COMMENT 'Who created this relationship (patient or provider)',
    FOREIGN KEY (patient_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES healthcare_providers(provider_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES provider_roles(role_id),
    UNIQUE KEY unique_patient_provider (patient_id, provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data access requests from providers to patients
CREATE TABLE data_access_requests (
    request_id CHAR(36) PRIMARY KEY,
    provider_id CHAR(36) NOT NULL,
    patient_id CHAR(36) NOT NULL,
    requested_role_id CHAR(36) NOT NULL,
    request_reason TEXT NOT NULL,
    requested_data_types JSON COMMENT 'Array: genetic, health_metrics, medical_history, etc.',
    access_duration_days INTEGER COMMENT 'How long access is requested for',
    urgent_request BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'approved', 'denied', 'expired') DEFAULT 'pending',
    patient_response TEXT,
    patient_response_date DATE,
    expires_date DATE,
    FOREIGN KEY (provider_id) REFERENCES healthcare_providers(provider_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (requested_role_id) REFERENCES provider_roles(role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Provider sessions for tracking active logins
CREATE TABLE provider_sessions (
    session_id CHAR(36) PRIMARY KEY,
    provider_id CHAR(36) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_method ENUM('password', 'sso', 'mfa') DEFAULT 'password',
    is_active BOOLEAN DEFAULT TRUE,
    expires_date DATE NOT NULL,
    last_activity_date DATE,
    created_date DATE,
    FOREIGN KEY (provider_id) REFERENCES healthcare_providers(provider_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- Audit log for sensitive operations
CREATE TABLE audit_logs (
    log_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id CHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    log_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_health_metrics_user_type ON health_metrics(user_id, metric_type);
CREATE INDEX idx_health_metrics_measured ON health_metrics(measured_date);
CREATE INDEX idx_genetic_variants_user_rsid ON genetic_variants(user_id, rsid);
CREATE INDEX idx_genetic_variants_gene ON genetic_variants(gene_symbol);
CREATE INDEX idx_genetic_variants_chromosome_position ON genetic_variants(chromosome, position);
CREATE INDEX idx_health_insights_user_severity ON health_insights(user_id, severity);
CREATE INDEX idx_lab_results_user_test ON lab_results(user_id, test_name);
CREATE INDEX idx_genetic_risk_scores_user_condition ON genetic_risk_scores(user_id, condition_name);
CREATE INDEX idx_medications_user_active ON medications(user_id, is_active);
CREATE INDEX idx_medical_conditions_user_status ON medical_conditions(user_id, status);
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action);

-- Provider-specific indexes
CREATE INDEX idx_healthcare_providers_email ON healthcare_providers(email);
CREATE INDEX idx_healthcare_providers_license ON healthcare_providers(license_number);
CREATE INDEX idx_healthcare_providers_npi ON healthcare_providers(npi_number);
CREATE INDEX idx_healthcare_providers_specialty ON healthcare_providers(specialty);
CREATE INDEX idx_healthcare_providers_active ON healthcare_providers(is_active);
CREATE INDEX idx_patient_provider_relationships_patient ON patient_provider_relationships(patient_id, status);
CREATE INDEX idx_patient_provider_relationships_provider ON patient_provider_relationships(provider_id, status);
CREATE INDEX idx_data_access_requests_patient ON data_access_requests(patient_id, status);
CREATE INDEX idx_data_access_requests_provider ON data_access_requests(provider_id, status);
CREATE INDEX idx_provider_sessions_provider ON provider_sessions(provider_id, is_active);
CREATE INDEX idx_provider_sessions_token ON provider_sessions(session_token);


-- Insert default provider roles with proper UUIDs
INSERT INTO provider_roles VALUES
('550e8400-e29b-41d4-a716-446655440001', 'primary_physician', 'Primary care physician with full patient access', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'specialist', 'Medical specialist with focused access', TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE),
('550e8400-e29b-41d4-a716-446655440003', 'consultant', 'Consulting physician with view-only access', TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE),
('550e8400-e29b-41d4-a716-446655440004', 'emergency', 'Emergency physician with limited access', FALSE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE),
('550e8400-e29b-41d4-a716-446655440005', 'genetic_counselor', 'Genetic counselor with genetic data focus', TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('550e8400-e29b-41d4-a716-446655440006', 'pharmacist', 'Pharmacist with medication focus', FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE);

-- Stored procedures for common operations
DELIMITER //

-- Get provider permissions for a patient
CREATE PROCEDURE GetProviderPermissions(
    IN p_provider_id CHAR(36),
    IN p_patient_id CHAR(36)
)
BEGIN
    SELECT 
        pr.role_name,
        pr.can_view_genetic_data,
        pr.can_view_health_metrics,
        pr.can_view_medical_history,
        pr.can_view_family_history,
        pr.can_view_lab_results,
        pr.can_add_prescriptions,
        pr.can_add_diagnoses,
        pr.can_modify_conditions,
        pr.can_view_ai_insights,
        pr.can_export_data,
        ppr.status,
        ppr.access_level,
        ppr.specific_permissions,
        ppr.emergency_access
    FROM patient_provider_relationships ppr
    JOIN provider_roles pr ON ppr.role_id = pr.role_id
    WHERE ppr.provider_id = p_provider_id 
    AND ppr.patient_id = p_patient_id
    AND ppr.status = 'active'
    AND (ppr.end_date IS NULL OR ppr.end_date > CURDATE());
END //

-- Log provider access
CREATE PROCEDURE LogProviderAccess(
    IN p_provider_id CHAR(36),
    IN p_patient_id CHAR(36),
    IN p_action VARCHAR(100),
    IN p_resource_type VARCHAR(50),
    IN p_resource_id CHAR(36),
    IN p_session_id CHAR(36),
    IN p_ip_address VARCHAR(45),
    IN p_user_agent TEXT,
    IN p_success BOOLEAN
)
BEGIN
    INSERT INTO provider_audit_logs (
        log_id, provider_id, patient_id, action, resource_type, resource_id,
        session_id, ip_address, user_agent, success, log_date
    ) VALUES (
        UUID(), p_provider_id, p_patient_id, p_action, p_resource_type, p_resource_id,
        p_session_id, p_ip_address, p_user_agent, p_success, CURDATE()
    );
END //

-- Check if provider can access specific data type
CREATE PROCEDURE CheckProviderDataAccess(
    IN p_provider_id CHAR(36),
    IN p_patient_id CHAR(36),
    IN p_data_type VARCHAR(50),
    OUT can_access BOOLEAN
)
BEGIN
    DECLARE role_permission BOOLEAN DEFAULT FALSE;
    
    SELECT 
        CASE p_data_type
            WHEN 'genetic_data' THEN pr.can_view_genetic_data
            WHEN 'health_metrics' THEN pr.can_view_health_metrics
            WHEN 'medical_history' THEN pr.can_view_medical_history
            WHEN 'family_history' THEN pr.can_view_family_history
            WHEN 'lab_results' THEN pr.can_view_lab_results
            ELSE FALSE
        END INTO role_permission
    FROM patient_provider_relationships ppr
    JOIN provider_roles pr ON ppr.role_id = pr.role_id
    WHERE ppr.provider_id = p_provider_id 
    AND ppr.patient_id = p_patient_id
    AND ppr.status = 'active'
    AND (ppr.end_date IS NULL OR ppr.end_date > CURDATE())
    LIMIT 1;
    
    SET can_access = COALESCE(role_permission, FALSE);
END //

DELIMITER ;

-- Views for common provider queries
CREATE VIEW active_provider_relationships AS
SELECT 
    ppr.*,
    hp.first_name as provider_first_name,
    hp.last_name as provider_last_name,
    hp.specialty as provider_specialty,
    hp.facility_name,
    u.first_name as patient_first_name,
    u.last_name as patient_last_name,
    pr.role_name
FROM patient_provider_relationships ppr
JOIN healthcare_providers hp ON ppr.provider_id = hp.provider_id
JOIN users u ON ppr.patient_id = u.user_id
JOIN provider_roles pr ON ppr.role_id = pr.role_id
WHERE ppr.status = 'active'
AND hp.is_active = TRUE
AND u.is_active = TRUE
AND (ppr.end_date IS NULL OR ppr.end_date > CURDATE());

CREATE VIEW provider_patient_summary AS
SELECT 
    hp.provider_id,
    hp.first_name,
    hp.last_name,
    hp.specialty,
    COUNT(DISTINCT ppr.patient_id) as total_patients,
    COUNT(DISTINCT CASE WHEN ppr.status = 'active' THEN ppr.patient_id END) as active_patients,
    MAX(ppr.last_accessed_date) as last_patient_access
FROM healthcare_providers hp
LEFT JOIN patient_provider_relationships ppr ON hp.provider_id = ppr.provider_id
WHERE hp.is_active = TRUE
GROUP BY hp.provider_id, hp.first_name, hp.last_name, hp.specialty;

-- Final success message
SELECT 'MediLineage database schema created successfully!' as Status;

CREATE TABLE cancer_patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age FLOAT,
    bmi FLOAT,
    smoking INT,
    geneticrisk FLOAT,
    physicalactivity FLOAT,
    alcoholintake FLOAT,
    cancerhistory INT,
    outcome INT,
    probability FLOAT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


