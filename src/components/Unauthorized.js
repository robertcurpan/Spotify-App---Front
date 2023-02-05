import React from 'react'

function Unauthorized({globalErrorMessage}) {
    return (
        <div>
            <h1>UNAUTHORIZED</h1>
            <h2>{globalErrorMessage}</h2>
        </div>
    )
}

export default Unauthorized