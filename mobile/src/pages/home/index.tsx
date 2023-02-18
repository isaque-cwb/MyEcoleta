import React, { useState, useEffect } from 'react'
import { StyleSheet, ImageBackground, Text, View, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { propsNavigationStack } from '../../Models/navigation-types'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios'





const Home = () => {

    const navigation = useNavigation<propsNavigationStack>()

    const [city, setCity] = useState<string[]>([])
    const [uf, setUf] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState();
    const [selectedCity, setSelectedCity] = useState();


    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map((uf: { sigla: string }) => uf.sigla)
            setUf(ufInitials)
        })
    }, [])

    useEffect(() => {
        if (uf[0] === '0') {
            return
        }
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map((city: { nome: string }) => city.nome)
                setCity(cityNames)
            })
    }, [selectedUf])


    function handleNavigationToPoints() {
        const cityUF = new Array
        cityUF.push(selectedUf, selectedCity)
        navigation.navigate('Points', cityUF)
    }




    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main} >
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#fff', height: 60, borderRadius: 10, }}>
                    <Picker
                        style={styles.input}
                        selectedValue={selectedUf}
                        onValueChange={(itemValue) =>
                            setSelectedUf(itemValue)
                        }>
                        {uf.map(uf => (
                            <Picker.Item key={uf} label={uf} value={uf} />
                        ))}
                    </Picker>
                </View>
                <View style={{ backgroundColor: '#fff', height: 60, borderRadius: 10,marginTop:10, marginBottom: 10 }}>
                    <Picker
                        style={styles.input}
                        placeholder='Selecione uma Cidade'
                        selectedValue={selectedCity}
                        onValueChange={(itemValue) =>
                            setSelectedCity(itemValue)
                        }>
                        {city.map(city => (
                            <Picker.Item key={city} label={city} value={city} />
                        ))}
                    </Picker>
                </View>


                <RectButton style={styles.button} onPress={handleNavigationToPoints} >
                    <View style={styles.buttonIcon}>
                        <Icon name='arrow-right' color="#fff" size={24} />
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>

                </RectButton>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,

    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,

    },

    footer: {},

    select: {},

    input: {
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        margin: 3,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home