// EncomiendasPDF.js
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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

const EncomiendasPDF = ({ data }) => (
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
                {/* Agrega más campos según necesites */}
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
                {/* Agrega más campos según necesites */}
            </View>
            
            {/* Sección Encomienda */}
            <View style={styles.section}>
                <Text style={{fontWeight: 'bold', marginBottom: 5}}>DATOS DE LA ENCOMIENDA</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Tipo:</Text>
                    <Text>{data.encomiendaData?.tipo || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Remitente:</Text>
                    <Text>{data.encomiendaData?.remitente || 'N/A'}</Text>
                </View>
                {/* Agrega todos los campos de la encomienda */}
            </View>
            
            {/* Sección Total */}
            <View style={[styles.section, {marginTop: 30}]}>
                <View style={styles.row}>
                    <Text style={[styles.label, {fontSize: 14}]}>TOTAL A PAGAR:</Text>
                    <Text style={{fontSize: 14}}>Gs. {data.encomiendaData?.total?.toLocaleString() || '0'}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default EncomiendasPDF;