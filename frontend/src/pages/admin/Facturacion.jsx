import { useState } from "react";
import { ClientesModal } from "./ClientesModal";
import { EncomiendaModal } from "./EncomiendaModal";
import { useEffect } from "react";
import axios from "axios";

const Facturacion = () => {
  const today = new Date().toISOString().split("T")[0];

  const [cajaAbierta, setCajaAbierta] = useState(null);
  useEffect(() => {
  const obtenerCajaAbierta = async () => {
    try {
      const response = await axios.get("/api/cajas/");
      const cajasAbiertas = response.data;
      const abierta = cajasAbiertas.filter(caja => caja.estado === "Abierta");

      if (abierta.length > 0) {
        // Tomamos la primera caja abierta (asumiendo que solo hay una)
        setCajaAbierta(abierta[0]); 
      } else {
        setCajaAbierta(null);
      }
    } catch (error) {
      console.error("Error al obtener la caja abierta:", error);
    }
  };

  obtenerCajaAbierta();
}, []);



  const [factura, setFactura] = useState({
    numero: "0001",
    fecha: today,
    termino: "Contado",
  });

  const [cliente, setCliente] = useState({
    ruc: "",
    nombre: "",
  });

  const [modalActivo, setModalActivo] = useState(null); // null, "cliente", "servicio"

  const [servicio, setServicio] = useState({
    codigo: "",
    descripcion: "",
    cantidad: 1,
    precio: 0,
  });

  const [servicios, setServicios] = useState([]);

  const [editandoIndex, setEditandoIndex] = useState(null);

  const handleFacturaChange = (e) => {
    setFactura({ ...factura, [e.target.name]: e.target.value });
  };

  const handleClienteChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const agregarProducto = (e) => {
    e.preventDefault();
    if (servicio.codigo && servicio.descripcion) {
      setServicios([...servicios, servicio]);
      setServicio({ codigo: "", descripcion: "", cantidad: 1, precio: 0 });
    }
  };
  const handleServicioChange = (e) => {
    const { name, value } = e.target;
    setServicio({
      ...servicio,
      [name]: name === "cantidad" || name === "precio" ? parseInt(value) : value,
    });
  };

  const seleccionarCliente = (clienteSeleccionado) => {
    setCliente({
      ruc: `${clienteSeleccionado.cedula}-${clienteSeleccionado.dv}`, // Formatea el RUC como "cedula-dv"
      nombre: clienteSeleccionado.razon_social, // Usa razon_social en lugar de usuario_nombre
    });
    setModalActivo(null);
  };

  return (
    <div className="p-2">
      <div className="flex justify-end mb-2 py-0.5">
        {cajaAbierta ? (
          <button className="bg-blue-950 hover:bg-gray-500 text-white font-semibold px-3 py-1 rounded flex items-center gap-2">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
            </span>
            {`${cajaAbierta.nombre} Abierta`}
          </button>
        ) : (
          <button className="bg-red-600 text-white font-semibold px-3 py-1 rounded">
            No hay caja abierta
          </button>
        )}
      </div>

      {/* Bloque de Información de Factura */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="text-blue-600 text-lg font-bold mb-4">Información de la Factura</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Factura N°</label>
            <input
              type="text"
              name="numero"
              value={factura.numero}
              onChange={handleFacturaChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={factura.fecha}
              onChange={handleFacturaChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Término</label>
            <select
              name="termino"
              value={factura.termino}
              onChange={handleFacturaChange}
              className="w-full border rounded p-2"
            >
              <option>Contado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bloque de Datos del Cliente */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="text-blue-600 text-lg font-bold mb-4">Datos del Cliente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">RUC</label>
            <input
              type="text"
              name="ruc"
              value={cliente.ruc}
              onChange={handleClienteChange}
              className="w-full border rounded p-2"
              placeholder="Ingrese RUC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nombre Cliente</label>
            <input
              type="text"
              name="nombre"
              value={cliente.nombre}
              onChange={handleClienteChange}
              className="w-full border rounded p-2"
              placeholder="Ingrese Nombre"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
            onClick={() => setModalActivo("cliente")}
          >
            Buscar Cliente
          </button>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
            onClick={() => setModalActivo("cliente")}
          >
            Buscar Reservas
          </button>

        </div>
      </div>
      {/* Bloque de Agregar Servicios */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-blue-600 text-lg font-bold mb-4">Agregar Servicios</h3>
        <form onSubmit={agregarProducto}>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Código</label>
                <input
                  type="text"
                  name="codigo"
                  value={servicio.codigo}
                  onChange={handleServicioChange}
                  className="w-full border rounded p-2"
                  placeholder="Código"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={servicio.descripcion}
                  onChange={handleServicioChange}
                  className="w-full border rounded p-2"
                  placeholder="Descripción"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={servicio.cantidad}
                  onChange={handleServicioChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={servicio.precio}
                  onChange={handleServicioChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
              onClick={() => setModalActivo("servicio")}
            >
              Buscar Reservas
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
              onClick={() => setModalActivo("encomiendas")} // Asegúrate de manejar este estado
            >
              Buscar Encomiendas
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
            >
              Agregar Servicio
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de servicios */}
      <div className="mt-6">
        <h3 className="text-blue-600 text-lg font-bold mb-4">Listado de servicios</h3>
        <table className="table-auto w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-800 text-center">
              <th className="p-2">Código</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((prod, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{prod.codigo}</td>
                <td className="p-2">{prod.descripcion}</td>
                <td className="p-2">
                  {editandoIndex === index ? (
                    <input
                      type="number"
                      value={prod.cantidad}
                      onChange={(e) => {
                        const nuevaCantidad = parseInt(e.target.value);
                        const nuevosServicios = [...servicios];
                        nuevosServicios[index].cantidad = isNaN(nuevaCantidad) ? 1 : nuevaCantidad;
                        setServicios(nuevosServicios);
                      }}
                      className="w-16 border rounded p-1 text-center"
                    />
                  ) : (
                    prod.cantidad
                  )}
                </td>
                <td className="p-2">Gs. {(prod.precio).toLocaleString()}</td>
                <td className="p-2 flex gap-2">
                  {editandoIndex === index ? (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                      onClick={() => setEditandoIndex(null)}
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-300"
                      onClick={() => setEditandoIndex(index)}
                    >
                      Editar
                    </button>
                  )}
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
                    onClick={() => {
                      const nuevosServicios = servicios.filter((_, i) => i !== index);
                      setServicios(nuevosServicios);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-gray-200 text-right">
              <td colSpan={3}></td>
              <td className="p-2 font-bold">Total:</td>
              <td className="p-2 font-bold text-right" colSpan={4}>
                Gs.{" "}
                {servicios
                  .reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
                  .toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal de clientes */}
      <ClientesModal
        open={modalActivo === "cliente"}
        onClose={() => setModalActivo(null)}
        onSelect={seleccionarCliente}
      />

      <EncomiendaModal
        open={modalActivo === "encomiendas"}
        onClose={() => setModalActivo(null)}
        onSelect={(servicioSeleccionado) => {
          setServicio({
            codigo: servicioSeleccionado.id.toString(),
            descripcion: `${servicioSeleccionado.tipo} - ${servicioSeleccionado.cliente}`,
            cantidad: 1,
            precio: servicioSeleccionado.precio || 0,
          });
          setModalActivo(null);
        }}
      />

      {/* Botón de guardar */}
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setCliente({ ruc: "", nombre: "" });
            setServicio({ codigo: "", descripcion: "", cantidad: 1, precio: 0 });
            setServicios([]);
            setFactura({ ...factura, numero: "0001", fecha: today });
          }}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => {
            // Lógica de generar factura
            console.log("Factura generada:", { factura, cliente, servicios });
          }}
        >
          Generar Factura
        </button>
      </div>
    </div>
  );
};

export default Facturacion;