import React from 'react'
import LinearProgress from '@mui/material/LinearProgress';
import { motion } from "framer-motion";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const UploadProgress = ({value}) => {
    return (
        <motion.div className="progressBar"
                    initial={{opacity: 0, x: 0}}
                    animate={{opacity: 2, x: 0}}
                    transition={{duration: 0.5, delay: 0.2}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{width: '100%', mr: 0}}>
                    <LinearProgress variant="determinate" value={value}/>
                </Box>
            </Box>
            <div className="percentage">
                <Box sx={{minWidth: 35}}>
                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                        {`${Math.round(value)}%`}
                    </Typography>
                </Box>
            </div>
        </motion.div>


    )
}

export default UploadProgress;