from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import *

# Inline Models
class UsuarioPersonaInline(admin.StackedInline):
    model = UsuarioPersona
    can_delete = False
    verbose_name_plural = 'Información Personal'

class DetalleRutaInline(admin.TabularInline):
    model = DetalleRuta
    extra = 1

class AsientoInline(admin.TabularInline):
    model = Asiento
    extra = 1

# Custom User Admin
class CustomUserAdmin(UserAdmin):
    inlines = (UsuarioPersonaInline,)

# Unregister the default User admin and register with custom
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Personas y Usuarios
@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ('cedula', 'nombre', 'apellido', 'telefono')
    search_fields = ('cedula', 'nombre', 'apellido')
    ordering = ('apellido', 'nombre')

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id_cliente', 'get_nombre', 'dv', 'razon_social', 'fecha_registro')
    search_fields = ('cedula__nombre', 'cedula__apellido', 'razon_social')
    date_hierarchy = 'fecha_registro'
    
    def get_nombre(self, obj):
        return f"{obj.cedula.nombre} {obj.cedula.apellido}" if obj.cedula else "Sin persona"
    get_nombre.short_description = 'Nombre Completo'

@admin.register(Pasajero)
class PasajeroAdmin(admin.ModelAdmin):
    list_display = ('id_pasajero', 'get_nombre', 'get_cedula')
    search_fields = ('cedula__nombre', 'cedula__apellido', 'cedula__cedula')
    
    def get_nombre(self, obj):
        return f"{obj.cedula.nombre} {obj.cedula.apellido}"
    get_nombre.short_description = 'Nombre Completo'
    
    def get_cedula(self, obj):
        return obj.cedula.cedula
    get_cedula.short_description = 'Cédula'

# Empresas y Empleados
@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'ruc', 'telefono', 'email')
    search_fields = ('nombre', 'ruc')

@admin.register(Empleado)
class EmpleadoAdmin(admin.ModelAdmin):
    list_display = ('get_nombre', 'empresa', 'cargo', 'fecha_ingreso')
    list_filter = ('empresa', 'cargo')
    search_fields = ('cedula__nombre', 'cedula__apellido', 'cargo')
    date_hierarchy = 'fecha_ingreso'
    
    def get_nombre(self, obj):
        return f"{obj.cedula.nombre} {obj.cedula.apellido}" if obj.cedula else "Sin persona"
    get_nombre.short_description = 'Nombre Completo'

# Geografía
@admin.register(Localidad)
class LocalidadAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'coordenadas')
    search_fields = ('nombre',)

@admin.register(Parada)
class ParadaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'localidad', 'direccion', 'activo')
    list_filter = ('localidad', 'activo')
    search_fields = ('nombre', 'direccion')

# Transporte
@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('placa', 'empresa', 'marca', 'modelo', 'capacidad', 'estado')
    list_filter = ('empresa', 'estado')
    search_fields = ('placa', 'marca', 'modelo')
    inlines = [AsientoInline]

@admin.register(Asiento)
class AsientoAdmin(admin.ModelAdmin):
    list_display = ('bus', 'numero_asiento', 'estado', 'tipo_asiento')
    list_filter = ('bus', 'estado', 'tipo_asiento')
    search_fields = ('bus__placa',)

# Rutas
@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activo', 'fecha_actualizacion')
    list_filter = ('activo',)
    search_fields = ('nombre',)
    inlines = [DetalleRutaInline]

@admin.register(DetalleRuta)
class DetalleRutaAdmin(admin.ModelAdmin):
    list_display = ('ruta', 'parada', 'hora_salida', 'orden')
    list_filter = ('ruta', 'parada')
    ordering = ('ruta', 'orden')

# Viajes y Servicios
@admin.register(Viaje)
class ViajeAdmin(admin.ModelAdmin):
    list_display = ('ruta', 'bus', 'fecha', 'activo')
    list_filter = ('ruta', 'bus', 'activo')
    date_hierarchy = 'fecha'
    search_fields = ('ruta__nombre', 'bus__placa')

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ('id_reserva', 'cliente', 'estado', 'fecha_reserva')
    list_filter = ('estado',)
    date_hierarchy = 'fecha_reserva'
    search_fields = ('cliente__razon_social',)

@admin.register(Pasaje)
class PasajeAdmin(admin.ModelAdmin):
    list_display = ('id_pasaje', 'viaje', 'asiento', 'pasajero', 'reserva')
    list_filter = ('viaje__ruta', 'viaje__fecha')
    search_fields = ('pasajero__cedula__nombre', 'pasajero__cedula__apellido')
    autocomplete_fields = ['viaje', 'asiento', 'pasajero']

@admin.register(Encomienda)
class EncomiendaAdmin(admin.ModelAdmin):
    list_display = ('id_encomienda', 'viaje', 'cliente', 'tipo_envio', 'fecha_creacion')
    list_filter = ('tipo_envio', 'viaje__ruta')
    date_hierarchy = 'fecha_creacion'
    search_fields = ('remitente', 'ruc_ci', 'descripcion')
    fieldsets = (
        ('Información Básica', {
            'fields': ('viaje', 'cliente', 'origen', 'destino')
        }),
        ('Detalles del Envío', {
            'fields': ('tipo_envio', 'cantidad_sobre', 'cantidad_paquete', 'descripcion')
        }),
        ('Información de Contacto', {
            'fields': ('remitente', 'ruc_ci', 'numero_contacto')
        }),
        ('Información de Pago', {
            'fields': ('flete',)
        }),
    )
admin.site.register(TipoDocumento)
admin.site.register(Timbrado)
admin.site.register(CabeceraFactura)
admin.site.register(DetalleFactura)
admin.site.register(HistorialFactura)
admin.site.register(Caja)
admin.site.register(CabeceraCaja)
admin.site.register(DetalleCaja)
