from rest_framework import viewsets, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User, Group, Permission
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .models import *
from .serializers import *

User = get_user_model()

User = get_user_model()

# Authentication ViewSets
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [AllowAny]

class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [AllowAny]

# Personas y Usuarios ViewSets
class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Persona.objects.all()
        cedula = self.request.query_params.get('cedula', None)
        if cedula:
            queryset = queryset.filter(cedula=cedula)
        return queryset

class UsuarioPersonaViewSet(viewsets.ModelViewSet):
    queryset = UsuarioPersona.objects.select_related('user', 'cedula')
    serializer_class = UsuarioPersonaSerializer
    permission_classes = [AllowAny]

# Clientes y Pasajeros ViewSets
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.select_related('cedula')
    serializer_class = ClienteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Cliente.objects.select_related('cedula')
        cedula = self.request.query_params.get('cedula', None)
        if cedula:
            queryset = queryset.filter(cedula__cedula=cedula)
        return queryset

class PasajeroViewSet(viewsets.ModelViewSet):
    queryset = Pasajero.objects.select_related('cedula')
    serializer_class = PasajeroSerializer
    permission_classes = [AllowAny]

# Empresas ViewSet
class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [AllowAny]

# Empleados ViewSet
class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.select_related('cedula', 'empresa')
    serializer_class = EmpleadoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Empleado.objects.select_related('cedula', 'empresa')
        cedula = self.request.query_params.get('cedula', None)
        empresa = self.request.query_params.get('empresa', None)
        if cedula:
            queryset = queryset.filter(cedula__cedula=cedula)
        if empresa:
            queryset = queryset.filter(empresa_id=empresa)
        return queryset

# Geografia ViewSets
class LocalidadViewSet(viewsets.ModelViewSet):
    queryset = Localidad.objects.all()
    serializer_class = LocalidadSerializer
    permission_classes = [AllowAny]

class ParadaViewSet(viewsets.ModelViewSet):
    queryset = Parada.objects.select_related('localidad')
    serializer_class = ParadaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Parada.objects.select_related('localidad')
        localidad = self.request.query_params.get('localidad', None)
        activo = self.request.query_params.get('activo', None)
        if localidad:
            queryset = queryset.filter(localidad_id=localidad)
        if activo is not None:
            queryset = queryset.filter(activo=activo)
        return queryset

# Transporte ViewSets
class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.select_related('empresa')
    serializer_class = BusSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Bus.objects.select_related('empresa')
        empresa = self.request.query_params.get('empresa', None)
        estado = self.request.query_params.get('estado', None)
        if empresa:
            queryset = queryset.filter(empresa_id=empresa)
        if estado:
            queryset = queryset.filter(estado=estado)
        return queryset

class AsientoViewSet(viewsets.ModelViewSet):
    queryset = Asiento.objects.select_related('bus')
    serializer_class = AsientoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Asiento.objects.select_related('bus')
        bus = self.request.query_params.get('bus', None)
        estado = self.request.query_params.get('estado', None)
        if bus:
            queryset = queryset.filter(bus_id=bus)
        if estado:
            queryset = queryset.filter(estado=estado)
        return queryset

# Rutas ViewSets
class RutaViewSet(viewsets.ModelViewSet):
    queryset = Ruta.objects.prefetch_related('detalleruta_set')
    serializer_class = RutaSerializer
    permission_classes = [AllowAny]

class DetalleRutaViewSet(viewsets.ModelViewSet):
    queryset = DetalleRuta.objects.select_related('ruta', 'parada')
    serializer_class = DetalleRutaSerializer
    permission_classes = [AllowAny]
"""
class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.select_related('ruta')
    serializer_class = HorarioSerializer
    permission_classes = [AllowAny]
"""
# Viajes y Servicios ViewSets
class ViajeViewSet(viewsets.ModelViewSet):
    queryset = Viaje.objects.select_related('horario', 'bus')
    serializer_class = ViajeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Viaje.objects.select_related('bus')
        fecha = self.request.query_params.get('fecha', None)
        bus = self.request.query_params.get('bus', None)
        activo = self.request.query_params.get('activo', None)
        if fecha:
            queryset = queryset.filter(fecha=fecha)
        if bus:
            queryset = queryset.filter(bus_id=bus)
        if activo is not None:
            queryset = queryset.filter(activo=activo)
        return queryset

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.select_related('cliente')
    serializer_class = ReservaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        cliente = self.request.query_params.get('cliente', None)
        if cliente:
            queryset = queryset.filter(cliente_id=cliente)
        return queryset
    
class PasajeViewSet(viewsets.ModelViewSet):
    queryset = Pasaje.objects.select_related('viaje', 'asiento', 'pasajero')
    serializer_class = PasajeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        viaje = self.request.query_params.get('viaje', None)
        pasajero = self.request.query_params.get('pasajero', None)
        if viaje:
            queryset = queryset.filter(viaje_id=viaje)
        if pasajero:
            queryset = queryset.filter(pasajero_id=pasajero)
        return queryset
    
"""
class DetalleReservaViewSet(viewsets.ModelViewSet):
    queryset = DetalleReserva.objects.select_related('reserva', 'pasaje')
    serializer_class = DetalleReservaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        reserva = self.request.query_params.get('reserva', None)
        if reserva:
            queryset = queryset.filter(reserva_id=reserva)
        return queryset
"""

class EncomiendaViewSet(viewsets.ModelViewSet):
    queryset = Encomienda.objects.select_related(
        'viaje', 'cliente', 'origen', 'destino'
    )
    serializer_class = EncomiendaSerializer
    permission_classes = [AllowAny]
    
class TipoDocumentoViewSet(viewsets.ModelViewSet):
    queryset = TipoDocumento.objects.all()
    serializer_class = TipoDocumentoSerializer

class TimbradoViewSet(viewsets.ModelViewSet):
    queryset = Timbrado.objects.all()
    serializer_class = TimbradoSerializer

class CabeceraFacturaViewSet(viewsets.ModelViewSet):
    queryset = CabeceraFactura.objects.all()
    serializer_class = CabeceraFacturaSerializer

class DetalleFacturaViewSet(viewsets.ModelViewSet):
    queryset = DetalleFactura.objects.all()
    serializer_class = DetalleFacturaSerializer

class HistorialFacturaViewSet(viewsets.ModelViewSet):
    queryset = HistorialFactura.objects.all()
    serializer_class = HistorialFacturaSerializer

class CajaViewSet(viewsets.ModelViewSet):
    queryset = Caja.objects.all()
    serializer_class = CajaSerializer

class CabeceraCajaViewSet(viewsets.ModelViewSet):
    queryset = CabeceraCaja.objects.all()
    serializer_class = CabeceraCajaSerializer

class DetalleCajaViewSet(viewsets.ModelViewSet):
    queryset = DetalleCaja.objects.all()
    serializer_class = DetalleCajaSerializer
