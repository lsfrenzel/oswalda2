from flask import render_template, request, redirect, url_for, flash, session, jsonify
from app import app, db
from models import Lead
from translations import get_translation
import logging
import os
import resend

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
            
            # Send email notification using Resend API
            def send_email_async():
                try:
                    resend.api_key = os.environ.get("RESEND_API_KEY")
                    
                    r = resend.Emails.send({
                        "from": "onboarding@resend.dev",
                        "to": "suportemensagemcliente@gmail.com",
                        "subject": f"Novo Contato - {name}",
                        "html": f"""
                        <h2>Novo contato recebido através do site Oswalda Produções</h2>
                        
                        <p><strong>Nome:</strong> {name}</p>
                        <p><strong>E-mail:</strong> {email}</p>
                        <p><strong>Telefone:</strong> {phone if phone else 'Não informado'}</p>
                        <p><strong>Idioma:</strong> {language}</p>
                        
                        <h3>Mensagem:</h3>
                        <p>{message}</p>
                        
                        <hr>
                        <p><small>Este email foi enviado automaticamente pelo formulário de contato do site.</small></p>
                        """
                    })
                    
                    logging.info(f"✓ Email sent successfully via Resend: {r}")
                except Exception as e:
                    logging.error(f"✗ Failed to send email via Resend: {str(e)}")
            
            # Send email in background thread
            import threading
            email_thread = threading.Thread(target=send_email_async)
            email_thread.daemon = True
            email_thread.start()
            logging.info("Email being sent in background to: suportemensagemcliente@gmail.com")
            
            flash(get_translation('contact_success', language), 'success')
            return redirect(url_for('contact'))
            
        except Exception as e:
            logging.error(f"Error processing contact form: {str(e)}")
            db.session.rollback()
            flash(get_translation('contact_error', session.get('language', 'pt')), 'error')
    
    return render_template('contact.html')

@app.route('/health')
def health_check():
    """Health check endpoint for Railway and monitoring"""
    return jsonify({'status': 'healthy', 'service': 'oswalda-website'}), 200

@app.route('/test-resend')
def test_resend():
    """Test Resend configuration and send test email"""
    try:
        resend.api_key = os.environ.get("RESEND_API_KEY")
        
        if not resend.api_key:
            return jsonify({
                'status': 'error',
                'message': 'RESEND_API_KEY not configured',
                'api_key_present': False
            }), 500
        
        r = resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": "suportemensagemcliente@gmail.com",
            "subject": "Teste de Configuração Resend",
            "html": "<h2>Email de teste</h2><p>Se você recebeu este email, o Resend está configurado corretamente!</p>"
        })
        
        return jsonify({
            'status': 'success',
            'message': 'Test email sent successfully',
            'response': str(r),
            'api_key_present': True
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'api_key_present': bool(os.environ.get("RESEND_API_KEY"))
        }), 500
