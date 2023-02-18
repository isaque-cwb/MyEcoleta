import React from 'react'
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home'
import CreatePoints from './pages/CreatePoints';

const MainRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create-point' element={<CreatePoints />} />
        </Routes>

    )
}


export default MainRoutes;