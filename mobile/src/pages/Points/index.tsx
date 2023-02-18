import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import { propsNavigationStack } from '../../Models/navigation-types'
import api from './../../services/api';
import * as Location from 'expo-location'
import axios from 'axios'


interface Item {
    id: number;
    title: string,
    image_url: string
}

interface Point {
    id: number,
    name: string,
    image: string,
    image_url: string,
    latitude: number,
    longitude: number
}

interface Params{
    uf: string,
    city: string
    
}

const Points = () => {

    const route = useRoute()
    const routeParams = route.params as Params[]


    const navigation = useNavigation<propsNavigationStack>()
    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItem] = useState<number[]>([])
    const [initialPosition, SetiInitialPosition] = useState<[number, number]>([0, 0])
    const [points, setPoints] = useState<Point[]>([])


    useEffect(() => {
        async function loadLocation() {
            const { status } = await Location.requestForegroundPermissionsAsync()

            if (status !== 'granted') {
                Alert.alert('Ooooooopsss...', 'Precisamos de sua Permissão para obter sua Localização')
                return
            }

            const location = await Location.getCurrentPositionAsync()

            const { latitude, longitude } = location.coords

            SetiInitialPosition([
                latitude,
                longitude
            ])

        }
        loadLocation()

    }, [])


    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])




    useEffect(() => {

        axios.get(`http://192.168.1.173:3333/points?city=${routeParams[1]}&uf=${routeParams[0]}&items=${selectedItems}`)
            .then(response => { setPoints(response.data) })
    }, [selectedItems])

    function handleNavigateBack() {
        navigation.goBack()
    }

    function handleNavigateToDatail(id: number) {
        navigation.navigate('Datails', {point_id: id})
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id)
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItem(filteredItems)
        } else {

            setSelectedItem([...selectedItems, id])
        }
    }

    

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={{
                        flexDirection:'row',
                    }}
                    onPress={handleNavigateBack} >
                    <Icon style={{
                        marginRight:5,
                        
                    }}name='arrow-left-circle' size={20} color='#34cb79' />
                    <Text style={{
                        color: '#6C6C80',
                        fontSize: 16,
                        fontFamily: 'Roboto_400Regular',
                    }}>Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Bem Vindo.</Text>
                <Text style={styles.description} >Encontre no Mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer} >
                    {initialPosition[0] === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator
                                style={{ paddingBottom: 10 }}
                                size={'large'}
                                color='#34CB79'
                            >
                            </ActivityIndicator>
                            <Text style={styles.description}>Carregando localização no mapa...</Text>
                        </View>
                    ) : (
                        <MapView style={styles.map}
                            loadingEnabled={initialPosition[0] === 0}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.012,
                                longitudeDelta: 0.012
                            }}
                        >
                            {points.map(point => (
                                <Marker
                                    key={String(point.id)}
                                    onPress={()=>handleNavigateToDatail(point.id)}
                                    style={styles.mapMarker}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude,
                                    }}
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image
                                            style={styles.mapMarkerImage}
                                            source={{ uri: point.image_url }}
                                        ></Image>
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>

            </View>

            <View style={styles.itemsContainer} >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {items.map(item => (
                        <TouchableOpacity
                            key={String(item.id)}
                            style={[
                                styles.item,
                                selectedItems.includes(item.id) ? styles.selectedItem : {}
                            ]}
                            onPress={() => handleSelectItem(item.id)} >
                            <SvgUri width={42} height={42} uri={item.image_url} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
            </View>


        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 30,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});


export default Points