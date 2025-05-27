from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User,Group,Permission
from .models import *
UUser = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    groups = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Group.objects.all(),
        required=False
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_active', 'is_staff', 'groups']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'required': False},
            'is_active': {'required': False}
        }

    def create(self, validated_data):
        groups = validated_data.pop('groups', [])
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            is_staff=validated_data.get('is_staff', False),
            is_active=validated_data.get('is_active', True)
        )
        user.groups.set(groups)
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        if 'groups' in validated_data:
            groups = validated_data.pop('groups')
            instance.groups.set(groups)
        
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        
        instance.save()
        return instance

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
    persona_nombre = serializers.CharField(source='persona.nombre', read_only=True)
    persona_details = PersonaSerializer(source='cedula', read_only=True)

    class Meta:
        model = Pasajero
        fields = ['id_pasajero', 'cedula', 'persona_nombre', 'persona_details']

    def validate_asiento(self, value):
        if value.estado != 'Disponible':
            raise serializers.ValidationError("El asiento no está disponible")
        return value

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['id_empresa', 'nombre', 'ruc', 'telefono', 'email', 'direccion_legal']

class EmpleadoSerializer(serializers.ModelSerializer):
    persona_nombre = serializers.CharField(source='cedula.nombre', read_only=True)
    persona_details = PersonaSerializer(source='cedula', read_only=True)

    class Meta:
        model = Empleado
        fields = ['id_empleado', 'cedula', 'persona_nombre', 'persona_details', 
                  'empresa', 'cargo', 'fecha_ingreso']


class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = ['id_localidad', 'nombre', 'coordenadas']

class ParadaSerializer(serializers.ModelSerializer):
    localidad_nombre = serializers.CharField(source='localidad.nombre', read_only=True)

    class Meta:
        model = Parada
        fields = ['id_parada', 'localidad', 'localidad_nombre', 'nombre', 'direccion', 'coordenadas', 'activo']

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
    localidad_nombre = serializers.CharField(source='parada.localidad.nombre', read_only=True)

    class Meta:
        model = DetalleRuta
        fields = ['ruta', 'parada', 'parada_nombre',
                  'localidad_nombre', 'hora_salida', 'orden']

class RutaSerializer(serializers.ModelSerializer):
    detalles = DetalleRutaSerializer(many=True, read_only=True, source='detalleruta_set')

    class Meta:
        model = Ruta
        fields = ['id_ruta', 'nombre', 
                 'activo', 'fecha_actualizacion', 'detalles']
        read_only_fields = ('fecha_actualizacion',)
"""
class HorarioSerializer(serializers.ModelSerializer):
    ruta_details = RutaSerializer(source='ruta', read_only=True)

    class Meta:
        model = Horario
        fields = ['id_horario', 'ruta', 'ruta_details', 'hora_salida', 'dias_semana', 'activo']
"""
class ViajeSerializer(serializers.ModelSerializer):
    #horario_details = HorarioSerializer(source='horario', read_only=True)
    nombre_ruta = serializers.CharField(source='ruta.nombre', read_only=True)
    ruta_details = RutaSerializer(source='ruta', read_only=True)
    bus_placa = serializers.CharField(source='bus.placa', read_only=True)
    bus_details = BusSerializer(source='bus', read_only=True)

    class Meta:
        model = Viaje
        fields = ['id_viaje','ruta','nombre_ruta', 'ruta_details', 'bus','bus_placa', 'bus_details',
                 'fecha', 'activo', 'observaciones']


class ReservaSerializer(serializers.ModelSerializer):
    cliente_details = ClienteSerializer(source='cliente', read_only=True)

    class Meta:
        model = Reserva
        fields = ['id_reserva', 'cliente', 'cliente_details',
                  'estado', 'fecha_reserva']
        read_only_fields = ('fecha_reserva',)

class PasajeSerializer(serializers.ModelSerializer):
    reserva_details = ReservaSerializer(source='reserva', read_only=True)
    viaje_details = ViajeSerializer(source='viaje', read_only=True)
    asiento_details = AsientoSerializer(source='asiento', read_only=True)
    pasajero_details = PasajeroSerializer(source='pasajero', read_only=True)
    origen = serializers.CharField(source='viaje.ruta.detalleruta.parada.nombre', read_only=True)
    destino = serializers.CharField(source='viaje.ruta.detalleruta.parada.nombre', read_only=True)

    class Meta:
        model = Pasaje
        fields = ['id_pasaje','reserva', 'reserva_details', 'viaje', 'viaje_details', 'asiento', 
                 'asiento_details', 'pasajero', 'pasajero_details', 'origen', 'destino']
"""
class DetalleReservaSerializer(serializers.ModelSerializer):
    reserva_details = CabeceraReservaSerializer(source='reserva', read_only=True)
    pasaje_details = PasajeSerializer(source='pasaje', read_only=True)

    class Meta:
        model = DetalleReserva
        fields = ['id_detalle', 'reserva', 'reserva_details', 
                 'pasaje', 'pasaje_details']
"""


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
