import React, { useState, useRef, useEffect } from "react"
import { useConnection } from "../utils/ConnectionContext";
import { useNavigate } from 'react-router-dom';
import { BarChart } from "@mui/x-charts";
// import SnackCircle from '../assets/1000_F_227411817_EzyIQ0DJHUc9Fmy1p8U0M8nRXz3ED8jI-removebg-preview 1.png'
import { ImageContainer, MonsterImage, DataRoundContainer } from "../style/general";
import { FlexFormContainer, FormGrid } from "../style/form_elements";


export default function HomePage() {
    const [stats, setStats] = useState({})
    const [today, setToday] = useState(0)
    const user = useConnection();
    const navigate = useNavigate();
    const AMOUNT_OF_DAYS = useRef(5);

    useEffect(() => {
        if (AMOUNT_OF_DAYS?.current && Array.isArray(user?.reports)) {
            const reportsRes = {};
            const currDate = new Date();
            for (let i = 0; i< AMOUNT_OF_DAYS.current; i++) {
                const relevateDateStart = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - i, 5);
                const relevateDateEnd = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - i + 1, 4, 59);

                reportsRes[`${relevateDateStart.getMonth() + 1}/${relevateDateStart.getDate()}`] = user.reports.filter(item => {
                    return item.timestamp >= relevateDateStart.getTime() && item.timestamp <= relevateDateEnd.getTime()
                }).reduce((a,v) => a + Number(v.snack_total_sugar) , 0 )

                if (currDate.getTime() >= relevateDateStart.getTime() && currDate.getTime() <= relevateDateEnd.getTime()) {
                    setToday(reportsRes[`${relevateDateStart.getMonth() + 1}/${relevateDateStart.getDate()}`])
                }
            }
            setStats(reportsRes)
        }
    }, [user, AMOUNT_OF_DAYS, setStats])

    const handleReport = (e) => {
        navigate('/report')
    }



    return (
        <FlexFormContainer style={{alignItems:"center"}}>
            <ImageContainer>
                {/* <MonsterImage src={SnackCircle} alt="" /> */}
                <MonsterImage src={user.monsterImg} alt="" />
            </ImageContainer>
            <h1 style={{textAlign: "center"}}>
                Welcome back, {user.uname}
            </h1>
            <FormGrid>
                <DataRoundContainer>
                    <div style={{fontSize: '24px', fontWeight: 600}}>{today}/{Math.round(user.sugarAmount)}gr</div>
                    <div style={{fontSize: '14px'}}>sugar/day</div>
                </DataRoundContainer>
                <DataRoundContainer style={{cursor: "pointer"}} onClick={handleReport}>
                    <div style={{fontSize: '20px', fontWeight: 600}}>Add Snack</div>
                </DataRoundContainer>
            </FormGrid>
            {Object.keys(stats).length && <BarChart
                skipAnimation
                layout="horizontal"
                yAxis={[
                    {
                      id: 'day',
                      data: Object.keys(stats),
                      scaleType: 'band',
                    },
                  ]}
                  series={[
                    {
                      data: Object.values(stats)
                    },
                  ]}
                  height={200}           
                  width={300}           
            />}
        </FlexFormContainer>
    )
    
}