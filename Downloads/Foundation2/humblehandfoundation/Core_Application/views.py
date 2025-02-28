from django.shortcuts import render, redirect
from django.http import HttpResponse
from Core_Application.models import Volunteer
from datetime import datetime
import time
import pandas as pd
import threading
from django.contrib.auth import logout

from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from .models import Volunteer, Contact

from django.core.mail import EmailMessage
from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from reportlab.pdfgen import canvas
import os

import os
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt


from .models import Signup
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.decorators import login_required

from threading import Thread
from django.contrib import messages

from .models import AdminPassword
import random
import string
from django.core.cache import cache
import secrets
from datetime import datetime, timedelta

def index(request):
    try:
        # Get visitor's IP and timestamp
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        current_time = datetime.now()
        visit_id = current_time.strftime("%Y%m%d%H%M%S%f")
        formatted_time = current_time.strftime("%I:%M %p")
        date = current_time.strftime("%d/%m/%Y")

        # Create a new thread for sending email
        def send_admin_notification():
            try:
                send_mail(
                    subject=f"New Website Visit #{visit_id}",
                    message=f"""Hello Admin,

A new visitor has accessed your website.

Visit Details:
Time: {formatted_time}
Date: {date}
Visitor IP: {ip_address}
Visit ID: #{visit_id}

Best Regards,
HumbleHandFoundation System""",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=['contactdarshan07@gmail.com'],
                    fail_silently=True
                )
            except Exception as email_error:
                print(f"Email sending failed: {str(email_error)}")

        # Start email thread
        email_thread = Thread(target=send_admin_notification)
        email_thread.daemon = True  # Make thread daemon so it doesn't block shutdown
        email_thread.start()

        # Render the template
        return render(request, "Core_Application/index.html")
    except Exception as e:
        print(f"Error in index view: {str(e)}")
        # Return a simple response if template rendering fails
        return render(request, "Core_Application/index.html")

def contribators(request):
    return render(request, "Core_Application/contributors.html")

def join(request):
    if request.method == "POST":
        try:
            # Get form data
            name = request.POST.get('name')
            email = request.POST.get('email')
            phone = request.POST.get('phone')
            age = request.POST.get('age')
            profession = request.POST.get('profession')
            message = request.POST.get('message', '')

            # Generate unique ID for this application
            current_time = datetime.now()
           # application_id = current_time.strftime("%Y%m%d%H%M%S")
            formatted_time = current_time.strftime("%I:%M %p")
            formatted_date = current_time.strftime("%d/%m/%Y")

            # Create volunteer instance
            volunteer = Volunteer(
                name=name,
                email=email,
                phone=phone,
                age=age,
                profession=profession,
                message=message
            )

            # Save to database
            volunteer.save()

            # Send email to owner
            def send_owner_notification():
                send_mail(
                    subject=f"New Volunteer Application #- {name}",
                    message=f"""Dear Admin,

A new volunteer application has been received.

Application Details:
-------------------

Date: {formatted_date}
Time: {formatted_time}

Volunteer Information:
-------------------
Name: {name}
Email: {email}
Phone: {phone}
Age: {age}
Profession: {profession}

Message from Volunteer:
-------------------
{message}

This data has been saved to your database. You can view full details in the admin panel.

Best Regards,
HumbleHandFoundation System""",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=['contactdarshan07@gmail.com'],
                    fail_silently=False,
                )

            # Send confirmation email to volunteer
            def send_volunteer_confirmation():
                send_mail(
                    subject="Thank You for Volunteering with HumbleHandFoundation",
                    message=f"""Dear {name},

Thank you for your interest in volunteering with HumbleHandFoundation. We have received your application.




Date: {formatted_date}
Time: {formatted_time}

We will review your application and contact you soon to discuss the next steps.

Best Regards,
HumbleHandFoundation Team""",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=False,
                )

            # Start email threads
            Thread(target=send_owner_notification).start()
            Thread(target=send_volunteer_confirmation).start()

            # Redirect to success page
            return render(request, 'Core_Application/Message_Sent_Successfully.html', {
                'redirect_url': '/join/',
                'redirect_delay': 3000,
                'message_type': 'volunteer'
            })

        except Exception as e:
            messages.error(request, "There was an error submitting your application. Please try again.")
            print(f"Error: {str(e)}")  # For debugging

    return render(request, "Core_Application/join.html")

def about(request):
    return render(request, "Core_Application/about.html")
    
def donate(request):
    return render(request, "Core_Application/donate.html")

def be_a_volunteer(request):
    return render(request, "Core_Application/be_a_volunteer.html")

def send_emails_async(name, email, subject, message):
    # Send detailed email to admin/owner
    send_mail(
        subject=f"New Contact Message - {subject}",
        message=f"""
Dear Admin,

A new contact message has been received.

Contact Details:
---------------
Name: {name}
Email: {email}
Subject: {subject}

Message:
---------------
{message}

Best Regards,
HumbleHandFoundation System
        """,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=['contactdarshan07@gmail.com'],
        fail_silently=True
    )

    # Send confirmation to user
    send_mail(
        subject="Thank you for contacting Humble Hand Foundation",
        message=f"""
Dear {name},

Thank you for reaching out to Humble Hand Foundation. We have received your message and appreciate your interest in our organization.

We will review your message and get back to you soon.

Best Regards,
Humble Hand Foundation Team
        """,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=True
    )

def contact(request):
    if request.method == "POST":
        try:
            # Get form data
            name = request.POST.get("name")
            email = request.POST.get("email")
            subject = request.POST.get("subject")
            message = request.POST.get("message")

            # Save to database first
            contact = Contact.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message
            )

            # Start email sending in background
            email_thread = Thread(
                target=send_emails_async,
                args=(name, email, subject, message)
            )
            email_thread.start()

            # Redirect to success page
            return render(request, 'Core_Application/Message_Sent_Successfully.html', {
                'redirect_url': '/contact/',
                'name': name
            })

        except Exception as e:
            print(f"Error: {str(e)}")  # For debugging
            messages.error(request, "There was an error sending your message. Please try again.")

    return render(request, "Core_Application/contact.html")

def events(request):
    return render(request, "Core_Application/events.html")

   

def message_sent_successfully(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        msg = request.POST.get("message")

        # Generate unique timestamp for each message
        current_time = datetime.now()
        date = current_time.strftime("%d/%m/%Y")
        formatted_time = current_time.strftime("%I:%M %p")
        message_id = current_time.strftime("%Y%m%d%H%M%S%f")

        try:
            # Create volunteer instance
            volunteer_data = Volunteer(
                name=name, 
                email=email, 
                msg=msg,
                time=formatted_time, 
                date=date
            )
            
            # Thread for saving data
            def save_data():
                volunteer_data.save()
            
            # Thread for sending email
            def send_email():
                send_mail(
                    subject=f"Thank You for Contacting HumbleHandFoundation #{message_id}",
                    message=f"""Dear {name},

Thank you for reaching out to HumbleHandFoundation. We have received your message and appreciate your interest in our organization.


We will get back to you as soon as possible.


Best Regards,
HumbleHandFoundation Team""",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=False,
                )
            
            # Start threads
            save_thread = Thread(target=save_data)
            email_thread = Thread(target=send_email)
            
            save_thread.start()
            email_thread.start()
            
            return render(request, "Core_Application/message_sent_successfully.html", {
                "email_response": "Thank you! Your message has been received.",
                "debug_info": {
                    "name": name,
                    "email": email,
                    "ref": message_id
                }
            })

        except Exception as e:
            print(f"Error: {str(e)}")
            return render(request, "Core_Application/message_sent_successfully.html", {
                "email_response": "Thank you! Your message has been received.",
            })

    return render(request, "Core_Application/contact.html")

def signup_view(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Generate unique signup timestamp
        signup_time = datetime.now()
        signup_id = signup_time.strftime("%Y%m%d%H%M%S%f")

        if Signup.objects.filter(username=username).exists():
            return render(request, 'Core_Application/signup.html', {
                'error': 'Username already taken!'
            })

        # Hash password and create user instance
        hashed_password = make_password(password)
        user = Signup(
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=username,
            password=hashed_password
        )

        # Thread for saving user data - new instance each time
        def save_user():
            user.save()

        # Thread for sending welcome email - new instance each time
        def send_welcome_email():
            send_mail(
                subject=f"Welcome to HumbleHandFoundation #{signup_id}",
                message=f"""Dear {first_name},

Welcome to HumbleHandFoundation! We're thrilled to have you join our community.

Your account has been successfully created with the following details:
Username: {username}
Email: {email}
Account Reference: #{signup_id}

Thank you for becoming a part of our mission to make a difference.

Best Regards,
HumbleHandFoundation Team""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )

        # Create and start new threads for each signup
        save_thread = Thread(target=save_user)
        email_thread = Thread(target=send_welcome_email)
        
        save_thread.start()
        email_thread.start()

        # Immediately redirect to login
        return redirect('login')

    return render(request, 'Core_Application/signup.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user = Signup.objects.get(username=username)
            if check_password(password, user.password):
                return render(request, 'Core_Application/dashboard.html', {'user': user})
            else:
                raise Signup.DoesNotExist
        except Signup.DoesNotExist:
            return render(request, 'Core_Application/login.html', {
                'error': 'Invalid username or password!'
            })

    return render(request, 'Core_Application/login.html')

@login_required
def dashboard(request):
    
    return render(request, 'Core_Application/dashboard.html', )

def process_donation(request):
    if request.method == 'POST':
        amount = request.POST.get('custom_amount')
        # Process the donation here
        # Add your payment gateway integration
        return redirect('donation_success')
    return redirect('dashboard')

def volunteer_submit(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        age = request.POST.get("age")
        profession = request.POST.get("profession")
        message = request.POST.get("message", "")
        
        volunteer = Volunteer(
            name=name,
            email=email,
            phone=phone,
            age=age,
            profession=profession,
            message=message
        )
        
        # Basic save without threading first
        volunteer.save()
        
       
        return render(request, "Core_Application/thank_you.html", {
            "type": "volunteer",
            "name": name
        })

    return render(request, "Core_Application/volunteer.html")

def data_view(request):
    # Get counts from database
    volunteer_count = Volunteer.objects.count()
    message_count = Contact.objects.count()
    user_count = Signup.objects.count()
    
    context = {
        'volunteer_count': volunteer_count,
        'message_count': message_count,
        'user_count': user_count,
    }
    return render(request, 'Core_Application/data.html', context)

def verify_password(request):
    if request.method == 'POST':
        password = request.POST.get('password')
        try:
            # Check if password matches any AdminPassword record
            admin_pass = AdminPassword.objects.filter(password=password).first()
            if admin_pass:
                request.session['is_verified'] = True
                return JsonResponse({'success': True})
            # If no match found, check if it's the default password
            if password == 'admin123' and not AdminPassword.objects.exists():
                AdminPassword.objects.create(password='admin123')
                request.session['is_verified'] = True
                return JsonResponse({'success': True})
        except Exception as e:
            print(f"Error verifying password: {e}")
    return JsonResponse({'success': False})

def volunteer_data(request):
    volunteers = Volunteer.objects.all().order_by('-date', '-time')
    return render(request, 'Core_Application/volunteer_data.html', {'volunteers': volunteers})

def message_data(request):
    messages = Contact.objects.all().order_by('-created_at')
    return render(request, 'Core_Application/message_data.html', {'messages': messages})

def user_data(request):
    users = Signup.objects.all()
    return render(request, 'Core_Application/user_data.html', {'users': users})

def donation_data(request):
    return render(request, 'Core_Application/donation_data.html')

def generate_reset_token(request):
    email = request.POST.get('email')
    token = secrets.token_urlsafe(32)
    # Store token with expiry
    cache.set(f'reset_token_{token}', email, timeout=3600)  # 1 hour expiry
    
    reset_link = f"{request.build_absolute_uri('/reset-password/')}?token={token}"
    send_mail(
        'Password Reset Link',
        f'Click here to reset your password: {reset_link}\nValid for 1 hour.',
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )

class EmailThread(threading.Thread):
    def __init__(self, subject, message, recipient_list):
        self.subject = subject
        self.message = message
        self.recipient_list = recipient_list
        threading.Thread.__init__(self)

    def run(self):
        send_mail(
            self.subject,
            self.message,
            'ddemo4544@gmail.com',
            self.recipient_list,
            fail_silently=False,
        )

def forgot_password(request):
    if request.method == 'POST':
        try:
            # Generate PIN
            pin = ''.join([str(random.randint(0, 9)) for _ in range(4)])
            
            # Store PIN in session
            request.session['reset_pin'] = pin
            
            # Send email in background
            EmailThread(
                'Password Reset PIN',
                f'Your PIN for password reset is: {pin}\nValid for 5 minutes.',
                ['contactdarshan07@gmail.com']
            ).start()
            
            return HttpResponse(status=200)
        except Exception as e:
            return HttpResponse(status=500)
    
    # For GET request, render the forgot password template
    return render(request, 'Core_Application/forgot_password.html')

def update_password(request):
    if request.method == 'POST':
        try:
            new_password = request.POST.get('password')
            stored_pin = request.session.get('reset_pin')
            
            if not stored_pin:
                return HttpResponse('PIN verification required', status=400)
            
            admin_pass = AdminPassword.objects.first()
            if not admin_pass:
                admin_pass = AdminPassword.objects.create()
            
            admin_pass.password = new_password
            admin_pass.save()
            
            # Clear session
            del request.session['reset_pin']
            
            return HttpResponse(status=200)
        except Exception as e:
            return HttpResponse(str(e), status=500)
    return HttpResponse('Invalid request', status=400)

def logout_view(request):
    logout(request)
    return redirect('donate')