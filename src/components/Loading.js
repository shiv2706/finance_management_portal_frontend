import React from 'react';


const Loading = () => {
    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status" style={{marginTop:10}}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    )
}

export default Loading;