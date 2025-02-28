"""
WSGI config for HumbleHandFoundation project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application
from django.core.handlers.wsgi import WSGIHandler

# Add the project directory to the Python path
path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if path not in sys.path:
    sys.path.append(path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HumbleHandFoundation.settings')

class ErrorHandlingApplication(WSGIHandler):
    def __call__(self, environ, start_response):
        try:
            return super().__call__(environ, start_response)
        except Exception as e:
            import traceback
            print(f"Error: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            status = '500 Internal Server Error'
            response_headers = [('Content-type', 'text/plain')]
            start_response(status, response_headers)
            return [b"Internal Server Error. Please check the logs."]

try:
    application = get_wsgi_application()
    application = ErrorHandlingApplication()
except Exception as e:
    print(f"Error loading application: {str(e)}")
    raise

app = application
