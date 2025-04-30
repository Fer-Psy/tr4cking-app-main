from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

#Endpoints
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'permissions', views.PermissionViewSet)
router.register(r'empresas', views.EmpresaViewSet)
router.register(r'localidades', views.LocalidadViewSet)
router.register(r'agencias', views.AgenciaViewSet)
router.register(r'rutas', views.RutaViewSet)
router.register(r'buses', views.BusViewSet)
router.register(r'asientos', views.AsientoViewSet)
router.register(r'horarios', views.HorarioViewSet)
router.register(r'viajes', views.ViajeViewSet)
router.register(r'clientes', views.ClienteViewSet)
router.register(r'empleados', views.EmpleadoViewSet)
router.register(r'servicios', views.ServicioViewSet)
router.register(r'tipos-documento', views.TipoDocumentoViewSet)
router.register(r'timbrados', views.TimbradoViewSet)
router.register(r'facturas', views.FacturaViewSet)
router.register(r'paradas-ruta', views.ParadaRutaViewSet)

# Custom Endpoints
urlpatterns = [
    path('', include(router.urls)),
    
    # Rutas especiales
    path('rutas/<int:pk>/paradas/', views.RutaParadasList.as_view(), name='ruta-paradas'),
    path('rutas/codigo/<str:codigo>/', views.RutasPorCodigoList.as_view(), name='rutas-por-codigo'),
    
    # Viajes especiales
    path('viajes/por-fecha/<str:fecha>/', views.ViajesPorFechaList.as_view(), name='viajes-por-fecha'),
    path('viajes/por-ruta/<int:ruta_id>/', views.ViajesPorRutaList.as_view(), name='viajes-por-ruta'),
    
    # Facturación
    path('facturas/<int:pk>/detalles/', views.FacturaDetallesList.as_view(), name='factura-detalles'),
    path('facturas/generar/', views.GenerarFactura.as_view(), name='generar-factura'),
    
    # Autenticación
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
]