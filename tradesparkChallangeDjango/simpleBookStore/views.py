from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Author, Category, Book
from .serializers import AuthorSerializer, CategorySerializer, BookSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    @action(detail=False, methods=['post'], url_path='delete-category')
    def delete_category(self, request):
        book_id = request.data.get('id')
        category_name = request.data.get('category')
        category_id = request.data.get('category_id')
        book_title = request.data.get('title')
        try:
            book = Book.objects.get(id=book_id)
            category = Category.objects.get(id=category_id)
        except Book.DoesNotExist:
            return Response({'status': 'error', 'message': f'Book "{book_title}" not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Category.DoesNotExist:
            return Response({'status': 'error', 'message': f'Category "{category_name}" not found.'}, status=status.HTTP_404_NOT_FOUND)

        if category in book.categories.all():
            book.categories.remove(category)
            return Response({'status': 'success', 'message': f'Category "{category_name}" removed from book "{book_title}".'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error', 'message': f'Category "{category_name}" not found in book "{book_title}".'}, status=status.HTTP_400_BAD_REQUEST)
        
    #Esto es extra para probar agregar categorias al libro desde python, no se utiliza en la app esta api
    @action(detail=False, methods=['post'], url_path='add-category')
    def add_category(self, request):
        book_id = request.data.get('id')
        category_name = request.data.get('category')
        try:
            book = Book.objects.get(id=book_id)
            category, created = Category.objects.get_or_create(name=category_name)
        except Book.DoesNotExist:
            return Response({'status': 'error', 'message': f'Book "{book_id}" not found.'}, status=status.HTTP_404_NOT_FOUND)

        if category not in book.categories.all():
            book.categories.add(category)
            return Response({'status': 'success', 'message': f'Category "{category_name}" added to book "{book_id}".'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error', 'message': f'Category "{category_name}" already exists in book "{book_id}".'}, status=status.HTTP_400_BAD_REQUEST)

