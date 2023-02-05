import React from 'react'

function Forbidden({globalErrorMessage}) {
    return (
        <div>
            <h1>FORBIDDEN!</h1>
            <h2>{globalErrorMessage}</h2>
        </div>
    )
}

export default Forbidden