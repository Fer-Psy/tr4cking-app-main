from django.contrib import admin
from .models import (
    Cliente, Localidad, Empresa, Parada, Empleado,
    Bus, Asiento, Ruta, DetalleRuta, Horario, Viaje,
    Pasaje, Encomienda, TipoDocumento, Timbrado,
    CabeceraFactura, DetalleFactura, HistorialFactura,
    Caja, CabeceraCaja, DetalleCaja
)

admin.site.register(Cliente)
admin.site.register(Localidad)
admin.site.register(Empresa)
admin.site.register(Parada)
admin.site.register(Empleado)
admin.site.register(Bus)
admin.site.register(Asiento)
admin.site.register(Ruta)
admin.site.register(DetalleRuta)
admin.site.register(Horario)
admin.site.register(Viaje)
admin.site.register(Pasaje)
admin.site.register(Encomienda)
admin.site.register(TipoDocumento)
admin.site.register(Timbrado)
admin.site.register(CabeceraFactura)
admin.site.register(DetalleFactura)
admin.site.register(HistorialFactura)
admin.site.register(Caja)
admin.site.register(CabeceraCaja)
admin.site.register(DetalleCaja)
