from flask import render_template, request, redirect, url_for, flash, session, jsonify
from flask_mail import Message
from app import app, db, mail
from models import Lead
from translations import get_translation
import logging
import os

@app.context_processor
def inject_translation():
    """Make translation function available in all templates"""
    def t(key):
        language = session.get('language', 'pt')
        return get_translation(key, language)
    return dict(t=t)

@app.context_processor
def inject_language():
    """Make current language available in all templates"""
    return dict(current_language=session.get('language', 'pt'))

@app.route('/set_language/<language>')
def set_language(language):
    """Set the session language"""
    if language in ['pt', 'en', 'fr']:
        session['language'] = language
    return redirect(request.referrer or url_for('index'))

@app.route('/')
def index():
    """Home page with hero section"""
    return render_template('index.html')

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.route('/services')
def services():
    """Services page"""
    return render_template('services.html')

@app.route('/portfolio')
def portfolio():
    """Portfolio page"""
    return render_template('portfolio.html')

@app.route('/team')
def team():
    """Team page"""
    return render_template('team.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page with form handling"""
    if request.method == 'POST':
        try:
            # Get form data
            name = request.form.get('name', '').strip()
            email = request.form.get('email', '').strip()
            phone = request.form.get('phone', '').strip()
            message = request.form.get('message', '').strip()
            language = session.get('language', 'pt')
            
            # Basic validation
            if not all([name, email, message]):
                flash(get_translation('contact_error', language), 'error')
                return render_template('contact.html')
            
            # Save to database
            lead = Lead()
            lead.name = name
            lead.email = email
            lead.phone = phone
            lead.message = message
            lead.language = language
            db.session.add(lead)
            db.session.commit()
            
            # Send email notification
            try:
                logging.info(f"Attempting to send email to: {app.config['MAIL_RECIPIENT']}")
                logging.info(f"Using sender: {app.config['MAIL_DEFAULT_SENDER']}")
                logging.info(f"MAIL_USERNAME configured: {'Yes' if app.config['MAIL_USERNAME'] else 'No'}")
                logging.info(f"MAIL_PASSWORD configured: {'Yes' if app.config['MAIL_PASSWORD'] else 'No'}")
                
                msg = Message(
                    subject=f'Novo Contato - {name}',
                    recipients=[app.config['MAIL_RECIPIENT']],
                    body=f"""
                    Novo contato recebido através do site Oswalda Produções:
                    
                    Nome: {name}
                    E-mail: {email}
                    Telefone: {phone if phone else 'Não informado'}
                    Idioma: {language}
                    
                    Mensagem:
                    {message}
                    
                    ---
                    Este email foi enviado automaticamente pelo formulário de contato do site.
                    """,
                    sender=app.config['MAIL_DEFAULT_SENDER']
                )
                mail.send(msg)
                logging.info(f"✓ Email sent successfully for new lead: {email}")
            except Exception as e:
                logging.error(f"✗ Failed to send email: {str(e)}")
                logging.error(f"Error type: {type(e).__name__}")
                import traceback
                logging.error(f"Traceback: {traceback.format_exc()}")
                # Continue even if email fails
            
            flash(get_translation('contact_success', language), 'success')
            return redirect(url_for('contact'))
            
        except Exception as e:
            logging.error(f"Error processing contact form: {str(e)}")
            db.session.rollback()
            flash(get_translation('contact_error', session.get('language', 'pt')), 'error')
    
    return render_template('contact.html')

@app.route('/test-email-config')
def test_email_config():
    """Test route to check email configuration (for debugging)"""
    config_check = {
        'MAIL_SERVER': app.config.get('MAIL_SERVER'),
        'MAIL_PORT': app.config.get('MAIL_PORT'),
        'MAIL_USE_TLS': app.config.get('MAIL_USE_TLS'),
        'MAIL_USERNAME': 'Configured' if app.config.get('MAIL_USERNAME') else 'NOT CONFIGURED',
        'MAIL_PASSWORD': 'Configured' if app.config.get('MAIL_PASSWORD') else 'NOT CONFIGURED',
        'MAIL_DEFAULT_SENDER': app.config.get('MAIL_DEFAULT_SENDER'),
        'MAIL_RECIPIENT': app.config.get('MAIL_RECIPIENT'),
        'environment_variables': {
            'MAIL_USERNAME': 'Set' if os.environ.get('MAIL_USERNAME') else 'NOT SET',
            'MAIL_PASSWORD': 'Set' if os.environ.get('MAIL_PASSWORD') else 'NOT SET'
        }
    }
    return jsonify(config_check)
