import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './src/pages/home'
import Points from './src/pages/Points'
import Datails from './src/pages/Datails'

const AppStack = createStackNavigator()

const Routes = ()=>{
    return(
        <NavigationContainer  >
            <AppStack.Navigator  screenOptions={{headerShown: false, cardStyle:{ backgroundColor: '#f0f0f5'}}} >
                <AppStack.Screen  name='Home' component={Home} />
                <AppStack.Screen  name='Points' component={Points} />
                <AppStack.Screen  name='Datails' component={Datails} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}

export default Routes