import React from 'react'
import {render} from 'react-dom'
import {HomePage} from './HomePage.js'


export const App = (props)=>{

    return (<div className='center'>
        <HomePage/>
       
         </div>)
}


const appDiv = document.getElementById('app')

render(<App/>, appDiv)