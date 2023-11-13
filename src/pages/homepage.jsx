import React from "react"
import { useConnection } from "../utils/ConnectionContext";

export default function HomePage() {
    const user = useConnection();

    return (
        <div>
            <h1>
                HomePage {user.uid} {user.uname}
            </h1>
        </div>
    )
    
}