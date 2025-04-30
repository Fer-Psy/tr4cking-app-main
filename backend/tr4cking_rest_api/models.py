from django.db import models
from django.contrib.auth.models import User, Group, Permission
from django.core.validators import MinValueValidator
from django.utils import timezone

class Empresa(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    ruc = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=30, blank=True)
    direccion_legal = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

class Localidad(models.Model):
    TIPO_CHOICES = [
        ('ciudad', 'Ciudad'),
        ('pueblo', 'Pueblo'),
        ('parada', 'Parada Rural')
    ]
    
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    es_terminal = models.BooleanField(default=False)
    coordenadas = models.CharField(max_length=50, blank=True)  # Simplificado para React

    def __str__(self):
        return f"{self.nombre} ({self.get_tipo_display()})"

class Agencia(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    localidad = models.ForeignKey(Localidad, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=30, blank=True)
    es_principal = models.BooleanField(default=False)

    class Meta:
        unique_together = ('empresa', 'nombre')
    
    def __str__(self):
        return f"{self.nombre} - {self.localidad.nombre}"

class Ruta(models.Model):
    origen = models.ForeignKey(Localidad, on_delete=models.CASCADE, related_name='rutas_origen')
    destino = models.ForeignKey(Localidad, on_delete=models.CASCADE, related_name='rutas_destino')
    codigo = models.CharField(max_length=10)
    duracion_estimada = models.DurationField()
    distancia_km = models.DecimalField(max_digits=6, decimal_places=2)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    activo = models.BooleanField(default=True)
    fecha_actualizacion = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('origen', 'destino')
    
    def __str__(self):
        return f"{self.origen} a {self.destino} ({self.codigo})"

class ParadaRuta(models.Model):
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, related_name='paradas')
    localidad = models.ForeignKey(Localidad, on_delete=models.CASCADE)
    orden = models.SmallIntegerField()
    es_principal = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('ruta', 'orden')
        ordering = ['ruta', 'orden']
        verbose_name = 'Parada de Ruta'
        verbose_name_plural = 'Paradas de Ruta'
    
    def __str__(self):
        return f"Parada {self.orden} - {self.localidad.nombre} ({self.ruta.codigo})"

class Bus(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('mantenimiento', 'Mantenimiento'),
        ('inactivo', 'Inactivo')
    ]
    
    agencia = models.ForeignKey(Agencia, on_delete=models.CASCADE)
    placa = models.CharField(max_length=15, unique=True)
    marca = models.CharField(max_length=50, blank=True)
    modelo = models.CharField(max_length=50, blank=True)
    capacidad = models.IntegerField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activo')

    def __str__(self):
        return f"{self.placa} ({self.marca} {self.modelo})"

class Cliente(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, unique=True)
    cedula = models.CharField(max_length=20, unique=True)
    ruc = models.CharField(max_length=15, blank=True, null=True)
    razon_social = models.CharField(max_length=255)
    dv = models.CharField(max_length=2, blank=True, null=True)
    telefono = models.CharField(max_length=30)
    direccion = models.TextField()
    fecha_registro = models.DateTimeField(default=timezone.now)
    @property
    def razon_social(self):
        if self.usuario:
            return f"{self.usuario.first_name} {self.usuario.last_name}"
        return f"Cliente {self.cedula}"

    def __str__(self):
        return self.razon_social

class Empleado(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    agencia = models.ForeignKey(Agencia, on_delete=models.CASCADE)
    cargo = models.CharField(max_length=50)
    fecha_contratacion = models.DateField()

    def __str__(self):
        return f"{self.usuario.get_full_name()} ({self.cargo})"

class Asiento(models.Model):
    TIPO_CHOICES = [
        ('ejecutivo', 'Ejecutivo'),
        ('semi-cama', 'Semi-cama'),
        ('cama', 'Cama')
    ]
    
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    numero_asiento = models.IntegerField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    
    class Meta:
        unique_together = ('bus', 'numero_asiento')
    
    def __str__(self):
        return f"Asiento {self.numero_asiento} - {self.bus.placa}"
    
class Horario(models.Model):
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE)
    hora_salida = models.TimeField()
    dias_semana = models.CharField(max_length=7)  # LMMJVSD (1=activo, 0=inactivo)
    activo = models.BooleanField(default=True)

    class Meta:
        unique_together = ('ruta', 'hora_salida')
    
    def __str__(self):
        return f"{self.ruta} a las {self.hora_salida}"

class Viaje(models.Model):
    ESTADO_CHOICES = [
        ('programado', 'Programado'),
        ('en_ruta', 'En Ruta'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado')
    ]
    
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    fecha = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='programado')
    
    class Meta:
        unique_together = ('bus', 'fecha', 'ruta')
    
    def __str__(self):
        return f"{self.ruta} - {self.fecha}"

class Servicio(models.Model):
    TIPO_CHOICES = [
        ('pasaje', 'Pasaje'),
        ('encomienda', 'Encomienda')
    ]
    
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    asiento = models.ForeignKey(Asiento, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    detalles = models.JSONField(default=dict, null=True, blank=True)
    
    class Meta:
        unique_together = ('viaje', 'asiento')
    
    def __str__(self):
        return f"{self.get_tipo_display()} - {self.cliente}"

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
    ESTADO_CHOICES = [
        ('emitida', 'Emitida'),
        ('anulada', 'Anulada')
    ]
    
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)
    tipo_documento = models.ForeignKey(TipoDocumento, on_delete=models.CASCADE)
    timbrado = models.ForeignKey(Timbrado, on_delete=models.CASCADE)
    agencia = models.ForeignKey(Agencia, on_delete=models.CASCADE)
    
    numero_factura = models.CharField(max_length=20, unique=True)
    fecha_emision = models.DateTimeField(default=timezone.now)
    monto_total = models.DecimalField(max_digits=12, decimal_places=2)
    monto_iva_10 = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    monto_iva_5 = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='emitida')
    
    def __str__(self):
        return f"Factura {self.numero_factura}"

class DetalleFactura(models.Model):
    factura = models.ForeignKey(CabeceraFactura, on_delete=models.CASCADE, related_name='detalles')
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    cantidad = models.SmallIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=100)
    iva_porcentaje = models.SmallIntegerField()  # 10, 5 o 0
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    
    def __str__(self):
        return f"Detalle {self.id} - Factura {self.factura.numero_factura}"