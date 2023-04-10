import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

function DetailsScreen({ route }) {
    const { item } = route.params;

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.label}>Fecha de Abuso:</Text>
                <Text style={styles.value}>{item.fecha_abuso}</Text>
                <Text style={styles.label}>Hora de Acontecimiento:</Text>
                <Text style={styles.value}>{item.hora_acontecimiento}</Text>
                <Text style={styles.label}>Tipo de Abuso:</Text>
                <Text style={styles.value}>{item.tipo_abuso}</Text>
                <Text style={styles.label}>Nombre Denunciado:</Text>
                <Text style={styles.value}>{item.nombre}</Text>
                <Text style={styles.label}>Apellido Denunciado:</Text>
                <Text style={styles.value}>{item.apellido}</Text>
                <Text style={styles.label}>Cédula:</Text>
                <Text style={styles.value}>{item.cedula}</Text>
                <Text style={styles.label}>Nombre Denunciante:</Text>
                <Text style={styles.value}>{item.denunciante_nombre}</Text>
                <Text style={styles.label}>Apellido Denunciante:</Text>
                <Text style={styles.value}>{item.denunciante_apellido}</Text>
                <Text style={styles.label}>Cédula Denunciante:</Text>
                <Text style={styles.value}>{item.denunciante_cedula}</Text>
                <Text style={styles.label}>Descripción:</Text>
                <Text style={styles.value}>{item.descripcion}</Text>
            </View>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        margin: 50
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginBottom: 20,
    },
});

export default DetailsScreen;
