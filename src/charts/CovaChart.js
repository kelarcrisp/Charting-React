import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'
import { Bar, Line, Pie } from 'react-chartjs-2';
import classes from './CovaChart.module.css';
const CovaChart = () => {

    const [chartData, setChartData] = useState([])
    const [test, setTest] = useState({});
    useEffect(() => {
        d3.csv('usCounties.csv').then(data => {

            const filterdCities =
                data.filter((x) => {
                    return x.county === 'Los Angeles' || x.county === 'King' || x.county === 'New York City'
                })

            const date = filterdCities[0].date
            for (let k in filterdCities) {
                filterdCities[k].date = filterdCities[k].date[6];
            }

            console.log(filterdCities)
            let beginningCityTotals = filterdCities.slice(34, 37);
            let middleCityTotals = filterdCities.slice(118, 121);
            console.log(middleCityTotals, 'middle')
            let totalCitiesCases = filterdCities.slice(-3);
            let totalCases = +totalCitiesCases[0].cases + +totalCitiesCases[1].cases + +totalCitiesCases[2].cases
            console.log(totalCitiesCases)
            console.log(totalCases, 'total cases')
            setTest({
                chartData: {
                    labels: ['February', 'March', 'April'],
                    datasets: [
                        {
                            label: 'Los Angeles',
                            data: [
                                beginningCityTotals[0].cases,
                                middleCityTotals[0].cases,
                                totalCitiesCases[0].cases,


                            ],
                            fill: false,
                            borderColor: 'green'
                        },
                        /// NYC
                        {
                            label: 'NYC',
                            data: [
                                beginningCityTotals[1].cases,
                                middleCityTotals[1].cases,
                                totalCitiesCases[1].cases,
                            ],

                            fill: false,
                            borderColor: 'blue'
                        },
                        /// Seattle
                        {
                            label: 'Seattle',
                            data: [
                                beginningCityTotals[2].cases,
                                middleCityTotals[2].cases,
                                totalCitiesCases[2].cases,
                            ],
                            fill: false,
                            borderColor: 'purple'
                        },
                    ]
                }
            });

        })

    }, [])
    console.log(test, 'test')


    return (
        <div>
            {/* {chartData.map((x) => {
                return <div key={Math.random()}>{x.county} {x.cases} {x.deaths}</div>
            })} */}
            <div className={classes.LineContainer}>
                <Line
                    data={test.chartData}

                    options={{
                        scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Number of Cases',
                                },

                            }],

                        },
                        maintainAspectRatio: false
                    }}
                />
            </div>

        </div>
    );
};

export default CovaChart;