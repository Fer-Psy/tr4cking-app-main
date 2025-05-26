from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User,Group,Permission
from .models import (
    Cliente, Localidad, Empresa, Persona,UsuarioPersona, Parada, Empleado,
    Bus, Asiento, Ruta, DetalleRuta, Horario, Viaje,
    Pasaje, Encomienda, TipoDocumento, Timbrado,Pasajero,
    CabeceraFactura, DetalleFactura, HistorialFactura,
    Caja, CabeceraCaja, DetalleCaja,CabeceraReserva, DetalleReserva
)
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['cedula', 'nombre', 'apellido', 'telefono', 'direccion']

class UsuarioPersonaSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    persona_details = PersonaSerializer(source='cedula', read_only=True)

    class Meta:
        model = UsuarioPersona
        fields = ['user', 'cedula', 'user_details', 'persona_details']


class ClienteSerializer(serializers.ModelSerializer):
    persona_details = PersonaSerializer(source='cedula', read_only=True)

    class Meta:
        model = Cliente
        fields = ['id_cliente', 'cedula', 'dv', 'razon_social', 'fecha_registro', 'persona_details']
        read_only_fields = ('fecha_registro',)

class PasajeroSerializer(serializers.ModelSerializer):
    persona_details = PersonaSerializer(source='cedula', read_only=True)

    class Meta:
        model = Pasajero
        fields = ['id_pasajero', 'cedula', 'persona_details']

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['id_empresa', 'nombre', 'ruc', 'telefono', 'email', 'direccion_legal']

class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = ['id_localidad', 'nombre', 'coordenadas']

class ParadaSerializer(serializers.ModelSerializer):
    localidad_nombre = serializers.CharField(source='localidad.nombre', read_only=True)

    class Meta:
        model = Parada
        fields = ['id_parada', 'localidad', 'localidad_nombre', 'nombre', 'direccion', 'coordenadas', 'activo']

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = '__all__'

class BusSerializer(serializers.ModelSerializer):
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)

    class Meta:
        model = Bus
        fields = ['id_bus', 'placa', 'marca', 'modelo', 'capacidad', 'estado', 'empresa', 'empresa_nombre']


class AsientoSerializer(serializers.ModelSerializer):
    bus_placa = serializers.CharField(source='bus.placa', read_only=True)

    class Meta:
        model = Asiento
        fields = ['id_asiento', 'bus', 'bus_placa', 'numero_asiento', 'estado', 'tipo_asiento']

class DetalleRutaSerializer(serializers.ModelSerializer):
    parada_nombre = serializers.CharField(source='parada.nombre', read_only=True)

    class Meta:
        model = DetalleRuta
        fields = ['ruta', 'parada', 'parada_nombre', 'orden']

class RutaSerializer(serializers.ModelSerializer):
    detalles = DetalleRutaSerializer(many=True, read_only=True, source='detalleruta_set')

    class Meta:
        model = Ruta
        fields = ['id_ruta', 'duracion_total', 'distancia_km', 'precio_base', 
                 'activo', 'fecha_actualizacion', 'detalles']
        read_only_fields = ('fecha_actualizacion',)

class HorarioSerializer(serializers.ModelSerializer):
    ruta_details = RutaSerializer(source='ruta', read_only=True)

    class Meta:
        model = Horario
        fields = ['id_horario', 'ruta', 'ruta_details', 'hora_salida', 'dias_semana', 'activo']


class ViajeSerializer(serializers.ModelSerializer):
    horario_details = HorarioSerializer(source='horario', read_only=True)
    bus_details = BusSerializer(source='bus', read_only=True)

    class Meta:
        model = Viaje
        fields = ['id_viaje', 'horario', 'horario_details', 'bus', 'bus_details',
                 'fecha', 'activo', 'observaciones']
        
class PasajeSerializer(serializers.ModelSerializer):
    viaje_details = ViajeSerializer(source='viaje', read_only=True)
    asiento_details = AsientoSerializer(source='asiento', read_only=True)
    pasajero_details = PasajeroSerializer(source='pasajero', read_only=True)

    class Meta:
        model = Pasaje
        fields = ['id_pasaje', 'viaje', 'viaje_details', 'asiento', 
                 'asiento_details', 'pasajero', 'pasajero_details']
        
class CabeceraReservaSerializer(serializers.ModelSerializer):
    cliente_details = ClienteSerializer(source='cliente', read_only=True)

    class Meta:
        model = CabeceraReserva
        fields = ['id_reserva', 'cliente', 'cliente_details', 'fecha_reserva']
        read_only_fields = ('fecha_reserva',)

class DetalleReservaSerializer(serializers.ModelSerializer):
    reserva_details = CabeceraReservaSerializer(source='reserva', read_only=True)
    pasaje_details = PasajeSerializer(source='pasaje', read_only=True)

    class Meta:
        model = DetalleReserva
        fields = ['id_detalle', 'reserva', 'reserva_details', 
                 'pasaje', 'pasaje_details']





#encomienda modificado
class EncomiendaSerializer(serializers.ModelSerializer):
    cliente_details = ClienteSerializer(source='cliente', read_only=True)
    viaje_details = ViajeSerializer(source='viaje', read_only=True)
    origen_details = ParadaSerializer(source='origen', read_only=True)
    destino_details = ParadaSerializer(source='destino', read_only=True)

    class Meta:
        model = Encomienda
        fields = ['id_encomienda', 'viaje', 'viaje_details', 'cliente', 'cliente_details',
                 'origen', 'origen_details', 'destino', 'destino_details', 'flete',
                 'remitente', 'ruc_ci', 'numero_contacto', 'tipo_envio',
                 'cantidad_sobre', 'cantidad_paquete', 'descripcion',
                 'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')

class TipoDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDocumento
        fields = '__all__'

class TimbradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timbrado
        fields = '__all__'

class CabeceraFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CabeceraFactura
        fields = '__all__'

class DetalleFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleFactura
        fields = '__all__'

class HistorialFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialFactura
        fields = '__all__'

class CajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caja
        fields = '__all__'

class CabeceraCajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CabeceraCaja
        fields = '__all__'

class DetalleCajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCaja
        fields = '__all__'
