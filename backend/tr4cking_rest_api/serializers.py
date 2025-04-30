from rest_framework import serializers
from .models import (
    Permission, Group, User, Empresa, Localidad, Agencia, Ruta, Bus, Asiento, Horario,
    Viaje, Cliente, Empleado, Servicio, TipoDocumento, Timbrado,
    CabeceraFactura, DetalleFactura, ParadaRuta
)

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Permission.objects.all()
    )  # Permitir asignar permisos

    class Meta:
        model = Group
        fields = '__all__'

from django.contrib.auth.models import Group

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Group.objects.all()
    )  # Permitir asignar grupos

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
            'is_active',
            'is_staff',
            'is_superuser',
            'groups',
            'user_permissions',
            'date_joined',
            'last_login'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'default': False},
            'is_superuser': {'default': False}
        }

    def create(self, validated_data):
        groups = validated_data.pop('groups', [])
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.groups.set(groups)

        # Verificar si el usuario pertenece al grupo "Administrador"
        admin_group = Group.objects.filter(name="Administrador").first()
        if admin_group and admin_group in user.groups.all():
            user.is_staff = True
            user.is_superuser = True
            user.save()

        return user

    def update(self, instance, validated_data):
        groups = validated_data.pop('groups', None)
        if groups is not None:
            instance.groups.set(groups)

            # Verificar si el usuario pertenece al grupo "Administrador"
            admin_group = Group.objects.filter(name="Administrador").first()
            if admin_group and admin_group in instance.groups.all():
                instance.is_staff = True
                instance.is_superuser = True
            else:
                instance.is_staff = False
                instance.is_superuser = False

        return super().update(instance, validated_data)

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'

class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = '__all__'

class AgenciaSerializer(serializers.ModelSerializer):
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    localidad_nombre = serializers.CharField(source='localidad.nombre', read_only=True)
    
    class Meta:
        model = Agencia
        fields = '__all__'
        extra_fields = ['empresa_nombre', 'localidad_nombre']

class RutaSerializer(serializers.ModelSerializer):
    origen = LocalidadSerializer()
    destino = LocalidadSerializer()
    
    class Meta:
        model = Ruta
        fields = '__all__'

class BusSerializer(serializers.ModelSerializer):
    agencia_nombre = serializers.CharField(source='agencia.nombre', read_only=True)
    
    class Meta:
        model = Bus
        fields = '__all__'
        extra_fields = ['agencia_nombre']

class AsientoSerializer(serializers.ModelSerializer):
    bus_placa = serializers.CharField(source='bus.placa', read_only=True)
    
    class Meta:
        model = Asiento
        fields = '__all__'
        extra_fields = ['bus_placa']

class HorarioSerializer(serializers.ModelSerializer):
    ruta_codigo = serializers.CharField(source='ruta.codigo', read_only=True)
    origen = serializers.CharField(source='ruta.origen.nombre', read_only=True)
    destino = serializers.CharField(source='ruta.destino.nombre', read_only=True)
    
    class Meta:
        model = Horario
        fields = '__all__'
        extra_fields = ['ruta_codigo', 'origen', 'destino']

class ViajeSerializer(serializers.ModelSerializer):
    horario_display = serializers.CharField(source='horario.__str__', read_only=True)
    bus_placa = serializers.CharField(source='bus.placa', read_only=True)
    
    class Meta:
        model = Viaje
        fields = '__all__'
        extra_fields = ['horario_display', 'bus_placa']

class ClienteSerializer(serializers.ModelSerializer):
    razon_social = serializers.ReadOnlyField()

    class Meta:
        model = Cliente
        fields = ['id', 'cedula', 'ruc', 'dv', 'razon_social', 'telefono', 'direccion', 'fecha_registro']


class EmpleadoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    agencia_nombre = serializers.CharField(source='agencia.nombre', read_only=True)
    
    class Meta:
        model = Empleado
        fields = '__all__'
        extra_fields = ['usuario_nombre', 'agencia_nombre']
    
    def get_usuario_nombre(self, obj):
        return f"{obj.usuario.first_name} {obj.usuario.last_name}"

class ServicioSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.razon_social', read_only=True)
    viaje_display = serializers.CharField(source='viaje.__str__', read_only=True)
    
    class Meta:
        model = Servicio
        fields = [
            'id', 'cliente', 'viaje', 'tipo', 'asiento', 'fecha_creacion', 'detalles',
            'cliente_nombre', 'viaje_display'
        ]
class TipoDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDocumento
        fields = '__all__'

class TimbradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timbrado
        fields = '__all__'

class CabeceraFacturaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.razon_social', read_only=True)
    empleado_nombre = serializers.CharField(source='empleado.usuario_nombre', read_only=True)
    
    class Meta:
        model = CabeceraFactura
        fields = '__all__'
        extra_fields = ['cliente_nombre', 'empleado_nombre']

class DetalleFacturaSerializer(serializers.ModelSerializer):
    servicio_display = serializers.CharField(source='servicio.__str__', read_only=True)
    
    class Meta:
        model = DetalleFactura
        fields = '__all__'
        extra_fields = ['servicio_display']

class ParadaRutaSerializer(serializers.ModelSerializer):
    localidad_nombre = serializers.CharField(source='localidad.nombre', read_only=True)
    localidad_tipo = serializers.CharField(source='localidad.tipo', read_only=True)
    
    class Meta:
        model = ParadaRuta
        fields = '__all__'
        extra_fields = ['localidad_nombre', 'localidad_tipo']

class RutaConParadasSerializer(RutaSerializer):
    paradas = ParadaRutaSerializer(source='paradas', many=True, read_only=True)
    
    class Meta(RutaSerializer.Meta):
        fields = list(RutaSerializer.Meta.fields) + ['paradas'] if isinstance(RutaSerializer.Meta.fields, (list, tuple)) else ['paradas']