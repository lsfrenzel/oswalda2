# replit.md

## Overview

Oswalda Produções & Eventos is a professional circus logistics and event management company website built with Flask. The application serves as a lead generation platform that showcases premium logistics services for circuses, emphasizing quality, safety, and excellence. The site features a multi-language interface (Portuguese, English, French) with a modern, responsive design optimized for converting visitors into leads through contact forms and service inquiries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Web Framework Architecture
- **Flask Application Structure**: Modular Flask app with separate files for routes, models, and configuration
- **Template Engine**: Jinja2 templating with template inheritance using base.html
- **Static Asset Management**: Organized CSS, JavaScript, and image assets in static directory
- **Session Management**: Flask sessions for language preference storage

### Database Architecture
- **ORM**: SQLAlchemy with DeclarativeBase for modern Flask integration
- **Database**: SQLite for development with configurable DATABASE_URL for production
- **Connection Management**: Pool recycling and pre-ping enabled for reliability
- **Models**: Simple Lead model for contact form data storage with timestamp tracking

### Frontend Architecture
- **Responsive Design**: Bootstrap 5 framework for mobile-first responsive layouts
- **CSS Architecture**: Custom CSS variables for consistent theming with primary colors (blue, red, yellow, white)
- **JavaScript**: Vanilla JavaScript with modular functions for navigation, animations, and form handling
- **UI Components**: Professional circus-themed design with hero video backgrounds and service cards

### Internationalization System
- **Translation Management**: Python dictionary-based translation system with language keys
- **Language Support**: Three languages (Portuguese default, English, French)
- **Context Processors**: Flask context processors inject translation functions into all templates
- **Session Storage**: User language preference persisted across sessions

### Email Integration
- **Mail Service**: Flask-Mail configured for SMTP email sending
- **Configuration**: Environment-based email settings with Gmail as default provider
- **Lead Notifications**: Automatic email notifications when contact forms are submitted

### Security & Configuration
- **Environment Variables**: Sensitive data stored in environment variables (database URL, email credentials, session secret)
- **Proxy Support**: ProxyFix middleware for deployment behind reverse proxies
- **Session Security**: Configurable session secret key with development fallback

## External Dependencies

- **Bootstrap 5.3.0**: Frontend CSS framework via CDN for responsive design and components
- **Font Awesome 6.4.0**: Icon library via CDN for consistent iconography
- **Google Fonts (Poppins)**: Typography via CDN for modern, professional font styling
- **Video Content**: External video hosting for hero section background videos
- **Image Assets**: Pixabay integration for high-quality circus and event photography
- **SMTP Email Service**: Gmail SMTP (configurable) for automated email notifications
- **SQLite Database**: File-based database for development (production-ready with environment configuration)

## Recent Updates (August 21, 2025)

- **Hero Section Redesign**: Updated hero messaging to "Coordenação e Gestão de Eventos Premium" with multilingual support, replaced hero video with new client-provided video
- **Company Rebranding**: Updated experience from 15 to 40+ years, repositioned as Louis Leonard's company with North American/European market focus expanding to Latin America
- **Navigation Enhancement**: Renamed "Portfólio" to "Nossos Clientes", added new "Nosso Time" (Our Team) page with complete translations
- **Contact Information**: Updated primary email to louis.leonard1313@gmail.com across all pages and languages
- **Content Updates**: Completely rewrote "Nossa História" section emphasizing Louis Leonard's 40+ years experience and company's market positioning
- **UI Improvements**: Removed social media buttons from footer, replaced with services navigation links for better user experience
- **Asset Management**: Successfully integrated new hero video, maintained responsive design and performance optimization