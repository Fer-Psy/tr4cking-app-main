from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.db.models import Prefetch
from .models import (
    User, Group, Permission,
    Empresa, Localidad, Agencia, Ruta, Bus, Asiento, Horario,
    Viaje, Cliente, Empleado, Servicio, TipoDocumento, Timbrado,
    CabeceraFactura, DetalleFactura, ParadaRuta
)
from .serializers import (
    UserSerializer, GroupSerializer, PermissionSerializer,
    EmpresaSerializer, LocalidadSerializer, AgenciaSerializer,
    RutaSerializer, BusSerializer, AsientoSerializer, HorarioSerializer,
    ViajeSerializer, ClienteSerializer, EmpleadoSerializer, ServicioSerializer,
    TipoDocumentoSerializer, TimbradoSerializer, CabeceraFacturaSerializer,
    DetalleFacturaSerializer, ParadaRutaSerializer, RutaConParadasSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_fields = ['is_active', 'is_staff', 'groups']  # Permitir filtrar por grupos

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer

class LocalidadViewSet(viewsets.ModelViewSet):
    queryset = Localidad.objects.all()
    serializer_class = LocalidadSerializer
    filterset_fields = ['tipo', 'es_terminal']

class AgenciaViewSet(viewsets.ModelViewSet):
    queryset = Agencia.objects.select_related('empresa', 'localidad')
    serializer_class = AgenciaSerializer
    filterset_fields = ['empresa', 'localidad', 'es_principal']

class RutaViewSet(viewsets.ModelViewSet):
    queryset = Ruta.objects.select_related('origen', 'destino')
    serializer_class = RutaSerializer
    filterset_fields = ['origen', 'destino', 'activo']

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.select_related('agencia')
    serializer_class = BusSerializer
    filterset_fields = ['agencia', 'estado']

class AsientoViewSet(viewsets.ModelViewSet):
    queryset = Asiento.objects.select_related('bus')
    serializer_class = AsientoSerializer
    filterset_fields = ['bus', 'tipo', 'estado']

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.select_related('ruta')
    serializer_class = HorarioSerializer
    filterset_fields = ['ruta', 'activo']

class ViajeViewSet(viewsets.ModelViewSet):
    queryset = Viaje.objects.select_related('ruta', 'bus')
    serializer_class = ViajeSerializer
    filterset_fields = ['ruta', 'bus', 'estado', 'fecha']


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    search_fields = ['cedula', 'ruc', 'usuario__first_name', 'usuario__last_name']

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.select_related('usuario', 'agencia')
    serializer_class = EmpleadoSerializer
    filterset_fields = ['agencia', 'cargo']

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.select_related(
        'cliente', 'viaje', 'asiento'
    )
    serializer_class = ServicioSerializer
    filterset_fields = ['tipo', 'viaje', 'cliente']


class TipoDocumentoViewSet(viewsets.ModelViewSet):
    queryset = TipoDocumento.objects.all()
    serializer_class = TipoDocumentoSerializer

class TimbradoViewSet(viewsets.ModelViewSet):
    queryset = Timbrado.objects.all()
    serializer_class = TimbradoSerializer
    filterset_fields = ['activo']

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = CabeceraFactura.objects.select_related(
        'cliente', 'empleado', 'tipo_documento', 'timbrado', 'agencia'
    )
    serializer_class = CabeceraFacturaSerializer
    filterset_fields = ['estado', 'agencia', 'tipo_documento']

class ParadaRutaViewSet(viewsets.ModelViewSet):
    queryset = ParadaRuta.objects.select_related('ruta', 'localidad')
    serializer_class = ParadaRutaSerializer
    filterset_fields = ['ruta', 'localidad', 'es_principal']

# Vistas Personalizadas
class RutaParadasList(generics.ListAPIView):
    serializer_class = ParadaRutaSerializer
    
    def get_queryset(self):
        ruta_id = self.kwargs['pk']
        return ParadaRuta.objects.filter(ruta_id=ruta_id).select_related('localidad')

class RutasPorCodigoList(generics.ListAPIView):
    serializer_class = RutaConParadasSerializer
    
    def get_queryset(self):
        codigo = self.kwargs['codigo']
        return Ruta.objects.filter(codigo=codigo).prefetch_related(
            Prefetch('paradas', queryset=ParadaRuta.objects.select_related('localidad'))
        ).select_related('origen', 'destino')

class ViajesPorFechaList(generics.ListAPIView):
    serializer_class = ViajeSerializer
    
    def get_queryset(self):
        fecha = self.kwargs['fecha']
        return Viaje.objects.filter(fecha=fecha).select_related(
            'horario__ruta', 'bus'
        )

class ViajesPorRutaList(generics.ListAPIView):
    serializer_class = ViajeSerializer
    
    def get_queryset(self):
        ruta_id = self.kwargs['ruta_id']
        return Viaje.objects.filter(horario__ruta_id=ruta_id).select_related(
            'horario__ruta', 'bus'
        )

class FacturaDetallesList(generics.ListAPIView):
    serializer_class = DetalleFacturaSerializer
    
    def get_queryset(self):
        factura_id = self.kwargs['pk']
        return DetalleFactura.objects.filter(factura_id=factura_id).select_related('servicio')

class GenerarFactura(generics.CreateAPIView):
    serializer_class = CabeceraFacturaSerializer
    
    def perform_create(self, serializer):
        # Lógica compleja de generación de factura
        factura = serializer.save()
        # Aquí iría la generación de detalles, cálculos, etc.
        return factura