import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Definición de tipos
interface ClienteData {
  nombre: string;
  ruc: string;
  telefono?: string;
  direccion?: string;
}

interface ViajeData {
  id: number;
  fecha: string;
  bus?: {
    placa: string;
    empresa: string;
  };
}

interface ParadaData {
  nombre: string;
  direccion: string;
}

interface EncomiendaData {
  tipo: string;
  cantidadSobres: number;
  cantidadPaquetes: number;
  descripcion: string;
  remitente: string;
  contacto: string;
  total: number;
}

interface PreviewData {
  clienteData?: ClienteData;
  viajeData?: ViajeData;
  origenData?: ParadaData;
  destinoData?: ParadaData;
  encomiendaData?: EncomiendaData;
  ruc_ci?: string;
  fechaEmision?: string;
}

interface EncomiendasPDFProps {
  data: PreviewData;
}

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12
  },
  section: {
    marginBottom: 20
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: 150,
    fontWeight: 'bold'
  }
});

const EncomiendasPDF: React.FC<EncomiendasPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>COMPROBANTE DE ENCOMIENDA</Text>
      
      {/* Sección Cliente */}
      <View style={styles.section}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>DATOS DEL CLIENTE</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre/Razón Social:</Text>
          <Text>{data.clienteData?.nombre || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>RUC/CI:</Text>
          <Text>{data.clienteData?.ruc || 'N/A'}</Text>
        </View>
        {data.clienteData?.telefono && (
          <View style={styles.row}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text>{data.clienteData.telefono}</Text>
          </View>
        )}
        {data.clienteData?.direccion && (
          <View style={styles.row}>
            <Text style={styles.label}>Dirección:</Text>
            <Text>{data.clienteData.direccion}</Text>
          </View>
        )}
      </View>
      
      {/* Sección Viaje */}
      <View style={styles.section}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>DATOS DEL VIAJE</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text>{data.viajeData?.fecha || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Bus:</Text>
          <Text>{data.viajeData?.bus?.placa || 'N/A'}</Text>
        </View>
        {data.viajeData?.bus?.empresa && (
          <View style={styles.row}>
            <Text style={styles.label}>Empresa:</Text>
            <Text>{data.viajeData.bus.empresa}</Text>
          </View>
        )}
      </View>
      
      {/* Sección Origen y Destino */}
      <View style={styles.section}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>ORIGEN Y DESTINO</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Origen:</Text>
          <Text>{data.origenData?.nombre || 'N/A'}</Text>
        </View>
        {data.origenData?.direccion && (
          <View style={styles.row}>
            <Text style={styles.label}>Dirección Origen:</Text>
            <Text>{data.origenData.direccion}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Destino:</Text>
          <Text>{data.destinoData?.nombre || 'N/A'}</Text>
        </View>
        {data.destinoData?.direccion && (
          <View style={styles.row}>
            <Text style={styles.label}>Dirección Destino:</Text>
            <Text>{data.destinoData.direccion}</Text>
          </View>
        )}
      </View>
      
      {/* Sección Encomienda */}
      <View style={styles.section}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>DATOS DE LA ENCOMIENDA</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text>{data.encomiendaData?.tipo || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Destinatario:</Text>
          <Text>{data.encomiendaData?.remitente || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Contacto:</Text>
          <Text>{data.encomiendaData?.contacto || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sobres:</Text>
          <Text>{data.encomiendaData?.cantidadSobres || 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Paquetes:</Text>
          <Text>{data.encomiendaData?.cantidadPaquetes || 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Descripción:</Text>
          <Text>{data.encomiendaData?.descripcion || 'N/A'}</Text>
        </View>
      </View>
      
      {/* Sección Total */}
      <View style={[styles.section, {marginTop: 30}]}>
        <View style={styles.row}>
          <Text style={[styles.label, {fontSize: 14}]}>TOTAL A PAGAR:</Text>
          <Text style={{fontSize: 14}}>
            Gs. {(data.encomiendaData?.total || 0).toLocaleString()}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default EncomiendasPDF;