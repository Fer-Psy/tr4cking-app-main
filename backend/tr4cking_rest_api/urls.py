from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()


# Authentication
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'permissions', PermissionViewSet)

# Personas y Usuarios
router.register(r'personas', PersonaViewSet)
router.register(r'usuarios-personas', UsuarioPersonaViewSet)

# Clientes y Pasajeros
router.register(r'clientes', ClienteViewSet)
router.register(r'pasajeros', PasajeroViewSet)

# Empresas
router.register(r'empresas', EmpresaViewSet)

# Geografia
router.register(r'localidades', LocalidadViewSet)
router.register(r'paradas', ParadaViewSet)

# Transporte
router.register(r'buses', BusViewSet)
router.register(r'asientos', AsientoViewSet)

# Rutas
router.register(r'rutas', RutaViewSet)
router.register(r'detalle-rutas', DetalleRutaViewSet)
router.register(r'horarios', HorarioViewSet)

# Viajes y Servicios
router.register(r'viajes', ViajeViewSet)
router.register(r'pasajes', PasajeViewSet)
router.register(r'reservas', CabeceraReservaViewSet)
router.register(r'detalle-reservas', DetalleReservaViewSet)
router.register(r'encomiendas', EncomiendaViewSet)




router.register(r'tipos-documento', TipoDocumentoViewSet)
router.register(r'timbrados', TimbradoViewSet)
router.register(r'facturas', CabeceraFacturaViewSet)
router.register(r'detalles-factura', DetalleFacturaViewSet)
router.register(r'historial-facturas', HistorialFacturaViewSet)
router.register(r'cajas', CajaViewSet)
router.register(r'cabecera-caja', CabeceraCajaViewSet)
router.register(r'detalle-caja', DetalleCajaViewSet)



# Custom Endpoints
urlpatterns = [
    path('', include(router.urls)),
    
]