CREATE ROLE identity_service LOGIN PASSWORD 'identity_dev_only';
CREATE ROLE student_service LOGIN PASSWORD 'student_dev_only';
CREATE ROLE gamification_service LOGIN PASSWORD 'gamification_dev_only';
CREATE ROLE resource_service LOGIN PASSWORD 'resource_dev_only';
CREATE ROLE survey_service LOGIN PASSWORD 'survey_dev_only';
CREATE ROLE support_service LOGIN PASSWORD 'support_dev_only';
CREATE ROLE analytics_service LOGIN PASSWORD 'analytics_dev_only';
CREATE ROLE recommendation_service LOGIN PASSWORD 'recommendation_dev_only';

CREATE SCHEMA identity AUTHORIZATION identity_service;
CREATE SCHEMA student AUTHORIZATION student_service;
CREATE SCHEMA gamification AUTHORIZATION gamification_service;
CREATE SCHEMA resource AUTHORIZATION resource_service;
CREATE SCHEMA survey AUTHORIZATION survey_service;
CREATE SCHEMA support AUTHORIZATION support_service;
CREATE SCHEMA analytics AUTHORIZATION analytics_service;
CREATE SCHEMA recommendation AUTHORIZATION recommendation_service;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;

