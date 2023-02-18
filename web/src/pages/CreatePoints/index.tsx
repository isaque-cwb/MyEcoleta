import React, { ChangeEvent, FormEvent, useEffect } from 'react'
import InputMask from 'react-input-mask'
import './styles.css'
import logo from '../../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { TileLayer, Marker, MapContainer, Popup, useMap, } from 'react-leaflet'
import api from '../../services/api'
import { useState } from 'react'
import axios from 'axios'
import Dropzone from '../../Components/Dropzone'


interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEufResponse {
    sigla: string
}

interface IBGEcityResponse {
    nome: string
}

const CreatePoints = () => {

    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [selectdUF, setSelectedUF] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [textPopup, setTextPopup] = useState('Você está Aqui')
    const [formData, SetFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })
    const [selectedItems, SetSelectedItem] = useState<number[]>([])
    const [seletedFile, SetSelectedFile] = useState<File>()

    const navigate = useNavigate()


    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEufResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })
    }, [])

    useEffect(() => {
        if (selectdUF === '0') {
            return;
        }
        axios.get<IBGEcityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectdUF}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome)
                setCities(cityNames)
            })
    }, [selectdUF])


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
        })
    }, [])


    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelectedUF(uf)
    }


    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {

        const city = event.target.value
        setSelectedCity(city)
    }


    function LocationMarker() {

        const map = useMap()

        map.on('click', (e) => {
            setSelectedPosition([e.latlng.lat, e.latlng.lng])
            console.log(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom())
        })
        return selectedPosition === null ? null : (
            <Marker position={selectedPosition}>
                <Popup>{textPopup}</Popup>
            </Marker>
        )
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        SetFormData({ ...formData, [name]: value })
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id)
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            SetSelectedItem(filteredItems)
        } else {

            SetSelectedItem([...selectedItems, id])
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const { name, email, whatsapp } = formData
        const uf = selectdUF
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems


        const data = new FormData()

        
            data.append('name', name)
            data.append('email', email)
            data.append('whatsapp', whatsapp)
            data.append('uf', uf)
            data.append('city', city)
            data.append('latitude', String(latitude))
            data.append('longitude', String(longitude))
            data.append('items', items.join(', '))
            
            if(seletedFile){
                data.append('image', seletedFile)
            }
        
        
        await api.post('points', data)
        alert("Ponto de coleta criado!")
        navigate('/')

    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to={'/'} >
                    <FiArrowLeft />
                    Valtar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> Ponto de Coleta</h1>

                <Dropzone onFileUploaded={SetSelectedFile} />
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input type="text"
                            name='name'
                            id='name'
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email"
                                name='email'
                                id='email'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <InputMask type='text' id="whatsapp" name="whatsapp" mask="(99)99999-9999" onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>

                    {initialPosition[0] !== 0 && (
                        <MapContainer center={[initialPosition[0], initialPosition[1]]} zoom={15} >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker
                            />
                        </MapContainer>
                    )}


                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectdUF} onChange={handleSelectUF} >
                                <option value="0">Selecione um Estado</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity} >
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt="Imagem" />
                                <span>{item.title}</span>
                            </li>))}


                    </ul>
                </fieldset>
                <button type='submit'>Cadastrar pondo de Coleta</button>
            </form>
        </div >
    )
}


export default CreatePoints;