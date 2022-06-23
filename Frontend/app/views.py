from django.shortcuts import render
from django.http import FileResponse
import requests
import io


# Create your views here.
endpoint = 'http://127.0.0.1:4000/'
def home(request):
    return render(request, 'index.html')

def add(request):
    return render(request, 'add.html')

def delete(request):
    return render(request, 'delete.html')  
    
def cargaMasiva(request):
    return render(request, 'cargar.html')