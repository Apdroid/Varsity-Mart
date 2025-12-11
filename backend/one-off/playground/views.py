from django.core.mail import EmailMessage, BadHeaderError
from django.shortcuts import render
from .tasks import notify_customers


def say_hello(request):
    notify_customers(
        'Hello'
    )
    return render(request, 'hello.html', {'name': 'Mosh'})
