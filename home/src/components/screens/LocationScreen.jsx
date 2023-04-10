import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Button, Image,Text,Linking,Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import {
    Link
  } from "react-router-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeRouter } from 'react-router-native';

export default function LocationScreen() {
    const [mapRegion, setMapRegion] = useState({
        latitude: 10.631179817433752,
        longitude: - 71.62171261118527,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    })

    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            setErrorMsg("Permiso para ubicacion rechazado")
        }
        let location = await Location.getCurrentPositionAsync({ enableHighAccurancy: true })
        setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            // latitudeDelta: 0.0922,
            // longitudeDelta: 0.0421
        }
        )
        console.log(location.coords.latitude, location.coords.longitude)
    }
    useEffect(() => {
        userLocation();
    }, []);

    async function handleWsPress() {
        await Linking.openURL('https://wa.me/?text=¡AUXILIO! Estoy en peligro, estas son mis coordenadas de Google Maps' + ' ( ' + Object.values(mapRegion) + ' ). ' + 'Envia ayuda por favor!!');
    }
    return (
        <NativeRouter>

            <StatusBar backgroundColor="#fff" style={{ color: "#000" }} />

            <View style={{ marginTop: Constants.statusBarHeight, flexGrow: 1, }}>
                {/* Start header */}
                <View style={{ width: "100%", height: 50, backgroundColor: "#fff", flexDirection: "row", position:'absolute', zIndex:2}}>
                    <Image
                        style={{ width: 30, height: 30, marginLeft: 15, alignSelf: "center" }}
                        resizeMode="contain"
                        source={require("../images/logo.png")}
                    />
                    <Text style={{ textAlign: "center", alignSelf: "center", fontFamily: "OpenSans_700Bold", fontSize: 17, marginLeft: 2, marginRight:132 }}>
                        Ubicación
                    </Text>
                    <View>
                <Text style={{width:"100%", height:50, paddingLeft:20, paddingTop:12, marginTop:-7}}>

        <Button onPress={handleWsPress} title="Ayuda"  color="#d93025"/>
        </Text>
            </View>
                </View>
                {/* End header */}

            <View style={styles.container}>

        <MapView style={styles.map}
    region={mapRegion}
        >
    <Marker
        coordinate={mapRegion}
        title="Mi ubicación"
    />
    <Marker
        coordinate={
            {
                latitude: 10.670152775707237,
                longitude: -71.60887724378232
            }
        }
        title="Intendencia de Maracaibo"
    />
    <Marker
        coordinate={
            {
                latitude: 10.663850245638493,
                longitude: - 71.61537877261766
            }
        }
        title="Ministerio Público"
    />
    <Marker
        coordinate={
            {
                latitude: 10.678320353356645,
                longitude: - 71.60698670330049
            }
        }
        title="Defensoria Publica Maracaibo"
    />
    <Marker
        coordinate={
            {
                latitude: 10.509103416610028,
                longitude: - 66.91378734747845
            }
        }
        title="Instituto Nacional de la Mujer (INAMUJER)"
    />
    <Marker
        coordinate={
            {
                latitude: 10.501119624584103,
                longitude: - 66.89806430514918
            }
        }
        title="Defensoría del Pueblo"
    />
    <Marker
        coordinate={
            {
                latitude: 10.506425071808675,
                longitude: - 66.9074633167955
            }
        }
        title="Ministerio Público"
    />
</MapView>
<Button title='Ubicación' onPress={userLocation} />
</View>


            </View>

        </NativeRouter>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%'
    },
});
