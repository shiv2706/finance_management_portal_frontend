import React from 'react';

const ExtractingText = () => {
    return (
        <>
            <div className="msg justify-content-center">
                <div className="success" role="status">
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div> <h8>Extracting Transaction Details...</h8>
                </div>
            </div>
        </>
    )
}

export default ExtractingText;