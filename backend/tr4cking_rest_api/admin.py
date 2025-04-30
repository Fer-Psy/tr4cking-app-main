from django.contrib import admin
from .models import (
    Empresa, Localidad, Agencia, Ruta, ParadaRuta, Bus, Cliente, Empleado,
    Asiento, Horario, Viaje, Servicio, TipoDocumento, Timbrado,
    CabeceraFactura, DetalleFactura
)

# Registro de modelos en el panel de administración
admin.site.register(Empresa)
admin.site.register(Localidad)
admin.site.register(Agencia)
admin.site.register(Ruta)
admin.site.register(ParadaRuta)
admin.site.register(Bus)
admin.site.register(Cliente)
admin.site.register(Empleado)
admin.site.register(Asiento)
admin.site.register(Horario)
admin.site.register(Viaje)
admin.site.register(Servicio)
admin.site.register(TipoDocumento)
admin.site.register(Timbrado)
admin.site.register(CabeceraFactura)
admin.site.register(DetalleFactura)
