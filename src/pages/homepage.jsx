import React, {useContext} from "react"
import {UserContext} from '../App'

export default function HomePage() {
    const user = useContext(UserContext);

    return (
        <div>
            <h1>
                HomePage {user?.uid}
            </h1>
        </div>
    )
    
}