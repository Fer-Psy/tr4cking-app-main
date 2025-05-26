from django.db import models
from django.contrib.auth.models import User, Group, Permission
from django.core.validators import MinValueValidator
from django.utils import timezone
from django.conf import settings


# -----------------------------------------------
# Autenticación (Usar el estándar de Django)
# -----------------------------------------------
# auth_user, auth_group, auth_permission, etc. 
# -> Ya lo maneja Django internamente, no hay que redefinirlo

# -----------------------------------------------
# Clientes (clientes no registrados)
# -----------------------------------------------
# -----------------------------------------------
# Personas y Usuarios
# -----------------------------------------------
class Persona(models.Model):
    cedula = models.BigIntegerField(primary_key=True, unique=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    telefono = models.CharField(max_length=30)
    direccion = models.TextField(help_text="Requerido para facturación")

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class UsuarioPersona(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=models.CASCADE)
    cedula = models.OneToOneField(
        Persona,
        to_field='cedula',
        db_column='cedula',
        on_delete=models.CASCADE
    )

    class Meta:
        db_table = 'usuario_persona'

# -----------------------------------------------
# Clientes (actualizado)
# -----------------------------------------------

class Cliente(models.Model):
    id_cliente = models.BigAutoField(primary_key=True)
    cedula = models.ForeignKey(
        Persona,
        to_field='cedula',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    dv = models.CharField(
        max_length=2,
        blank=True,
        null=True,
        help_text="Dígito verificador (opcional)"
    )
    razon_social = models.CharField(
        max_length=100,
        help_text="Para facturación, prioridad: auth_user > cliente o empleado para casuales"
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.razon_social
# -----------------------------------------------
# Pasajeros (nuevo)
# -----------------------------------------------
class Pasajero(models.Model):
    id_pasajero = models.BigAutoField(primary_key=True)
    cedula = models.OneToOneField(
        Persona,
        to_field='cedula',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.cedula.nombre} {self.cedula.apellido}"

#----------------------------------------------
# Empresas y Sucursales
# -----------------------------------------------
class Empresa(models.Model):
    id_empresa = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    ruc = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    direccion_legal = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

# -----------------------------------------------
# Geografía
# -----------------------------------------------
class Localidad(models.Model):
    id_localidad = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    coordenadas = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class Parada(models.Model):
    id_parada = models.BigAutoField(primary_key=True)
    localidad = models.ForeignKey(Localidad, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    direccion = models.TextField()
    coordenadas = models.FloatField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} ({self.localidad.nombre})"

    class Meta:
        verbose_name = "Parada"
        verbose_name_plural = "Paradas"

# -----------------------------------------------
# Transporte (Buses y Asientos)
# -----------------------------------------------
class Bus(models.Model):
    ESTADOS = [
        ('Activo', 'Activo'),
        ('Mantenimiento', 'Mantenimiento'),
        ('Inactivo', 'Inactivo'),
    ]

    id_bus = models.BigAutoField(primary_key=True)
    placa = models.TextField(unique=True)
    marca = models.TextField(blank=True, null=True)
    modelo = models.TextField(blank=True, null=True)
    capacidad = models.IntegerField()
    estado = models.CharField(max_length=20, choices=ESTADOS)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)

    def __str__(self):
        return self.placa

class Asiento(models.Model):
    ESTADOS_ASIENTO = [
        ('Disponible', 'Disponible'),
        ('Reservado', 'Reservado'),
        ('Ocupado', 'Ocupado'),
    ]
    TIPOS_ASIENTO = [
        ('Semi-cama', 'Semi-cama'),
        ('Cama', 'Cama'),
    ]

    id_asiento = models.BigAutoField(primary_key=True)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    numero_asiento = models.IntegerField()
    estado = models.CharField(max_length=20, choices=ESTADOS_ASIENTO, default='Disponible')
    tipo_asiento = models.CharField(max_length=20, choices=TIPOS_ASIENTO, blank=True, null=True)

    class Meta:
        unique_together = ('bus', 'numero_asiento')

# -----------------------------------------------
# Rutas
# -----------------------------------------------
class Ruta(models.Model):
    id_ruta = models.BigAutoField(primary_key=True)
    duracion_total = models.DecimalField(max_digits=6, decimal_places=2)
    distancia_km = models.DecimalField(max_digits=6, decimal_places=2)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    activo = models.BooleanField(default=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

class DetalleRuta(models.Model):
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE)
    parada = models.ForeignKey(Parada, on_delete=models.CASCADE)
    orden = models.IntegerField()

    class Meta:
        unique_together = [('ruta', 'parada'), ('ruta', 'orden')]

class Horario(models.Model):
    id_horario = models.BigAutoField(primary_key=True)
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE)
    hora_salida = models.TimeField()
    dias_semana = models.CharField(max_length=7)
    activo = models.BooleanField(default=True)

    class Meta:
        unique_together = ('ruta', 'hora_salida')

class Viaje(models.Model):
    id_viaje = models.BigAutoField(primary_key=True)
    horario = models.ForeignKey(Horario, on_delete=models.CASCADE,null=True, blank=True)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    fecha = models.DateField()
    activo = models.BooleanField(default=True)
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('bus', 'fecha', 'horario')

# -----------------------------------------------
# Servicios (Pasajes y Reservas)
# -----------------------------------------------
class Pasaje(models.Model):
    id_pasaje = models.BigAutoField(primary_key=True)
    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE)
    asiento = models.ForeignKey(Asiento, on_delete=models.CASCADE)
    pasajero = models.ForeignKey(Pasajero, on_delete=models.CASCADE)

    def __str__(self):
        return f"Pasaje #{self.id_pasaje} - {self.pasajero}"

class CabeceraReserva(models.Model):
    id_reserva = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reserva #{self.id_reserva} - {self.cliente}"

class DetalleReserva(models.Model):
    id_detalle = models.BigAutoField(primary_key=True)
    reserva = models.ForeignKey(CabeceraReserva, on_delete=models.CASCADE)
    pasaje = models.OneToOneField(Pasaje, on_delete=models.CASCADE)

    def __str__(self):
        return f"Detalle #{self.id_detalle} - Reserva #{self.reserva.id_reserva}"




# -----------------------------------------------
# Empleados
# ------------------------------------------  
class Empleado(models.Model):
    id_empleado = models.BigAutoField(primary_key=True)
    usuario = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE,null=True,blank=True)
    fecha_contratacion = models.DateField()
    cargo = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.usuario.first_name} {self.usuario.last_name}"





#modificacion de encomienda de a cuerdo al frontend

class Encomienda(models.Model):
    TIPO_ENVIO_CHOICES = [
        ('sobre', 'Sobre'),
        ('paquete', 'Paquete'),
        ('ambos', 'Ambos'),
    ]

    id_encomienda = models.BigAutoField(primary_key=True)
    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    origen = models.ForeignKey(DetalleRuta, on_delete=models.CASCADE, related_name='origen_encomienda')
    destino = models.ForeignKey(DetalleRuta, on_delete=models.CASCADE, related_name='destino_encomienda')
    flete = models.DecimalField(max_digits=12, decimal_places=2)
    remitente = models.CharField(max_length=100)
    ruc_ci = models.CharField(max_length=20)
    numero_contacto = models.CharField(max_length=20)
    tipo_envio = models.CharField(max_length=10, choices=TIPO_ENVIO_CHOICES)
    cantidad_sobre = models.PositiveIntegerField(default=0)
    cantidad_paquete = models.PositiveIntegerField(default=0)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Encomienda #{self.id_encomienda} - {self.get_tipo_envio_display()}"
    


class TipoDocumento(models.Model):
    nombre = models.CharField(max_length=50)
    codigo = models.CharField(max_length=10, unique=True)
    descripcion = models.TextField()
    requiere_cliente_registrado = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

class Timbrado(models.Model):
    numero_timbrado = models.CharField(max_length=15, unique=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    activo = models.BooleanField(default=True)
    
    def __str__(self):
        return self.numero_timbrado

class CabeceraFactura(models.Model):
    cliente = models.ForeignKey(Cliente, null=True, blank=True, on_delete=models.SET_NULL)
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)
    timbrado = models.ForeignKey(Timbrado, on_delete=models.CASCADE)
    parada = models.ForeignKey(Parada, on_delete=models.CASCADE, null=True, blank=True)
    numero_factura = models.TextField(unique=True)
    fecha_factura = models.DateField(default=timezone.now)
    condicion = models.CharField(max_length=30, default='Contado')
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    monto_exenta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    monto_iva_10 = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    monto_iva_5 = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estado = models.CharField(max_length=20)
    def __str__(self):
        return f"Factura {self.numero_factura}"

class DetalleFactura(models.Model):
    factura = models.ForeignKey(CabeceraFactura, on_delete=models.CASCADE)
    pasaje = models.ForeignKey(Pasaje, null=True, blank=True, on_delete=models.SET_NULL)
    encomienda = models.ForeignKey(Encomienda, null=True, blank=True, on_delete=models.SET_NULL)
    cantidad = models.SmallIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=100)
    iva_porcentaje = models.SmallIntegerField()
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    
    def __str__(self):
        return f"Detalle {self.id} - Factura {self.factura.numero_factura}"
    

class HistorialFactura(models.Model):
    factura = models.ForeignKey(CabeceraFactura, on_delete=models.CASCADE)
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    campo_modificado = models.CharField(max_length=30)
    valor_anterior = models.TextField(blank=True, null=True)
    valor_nuevo = models.TextField(blank=True, null=True)
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)
    def __str__(self):
        return f"Historial {self.id} - Factura {self.factura.numero_factura}"
    
class Caja(models.Model):
    nombre = models.TextField()
    estado = models.CharField(max_length=20)
    fecha_creacion = models.DateField()
    monto_inicial = models.IntegerField()

    def __str__(self):
        return self.nombre
    
class CabeceraCaja(models.Model):
    tipo_mov = models.CharField(max_length=20)
    fecha_mov = models.DateTimeField()
    monto_inical = models.DecimalField(max_digits=12, decimal_places=2)
    monto_final = models.DecimalField(max_digits=12, decimal_places=2)
    caja = models.ForeignKey(Caja, on_delete=models.CASCADE)
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)
    def __str__(self):
        return f"Movimiento {self.id} - Caja {self.caja.nombre}"
    
class DetalleCaja(models.Model):
    descripcion = models.TextField(blank=True, null=True)
    tipo_transaccion = models.CharField(max_length=50)
    monto = models.IntegerField()
    fecha_transaccion = models.DateTimeField()
    factura = models.ForeignKey(CabeceraFactura, null=True, blank=True, on_delete=models.SET_NULL)
    cabecera_caja = models.ForeignKey(CabeceraCaja, on_delete=models.CASCADE)
    def __str__(self):
        return f"Detalle {self.id} - Caja {self.cabecera_caja.caja.nombre}"