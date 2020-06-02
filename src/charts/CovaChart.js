import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'
import { Bar, Line, Pie } from 'react-chartjs-2';
import classes from './CovaChart.module.css';
const CovaChart = () => {

    // const [chartData, setChartData] = useState([])
    const [test, setTest] = useState({});
    const [deathToll, setDeathToll] = useState({})
    useEffect(() => {
        d3.csv('usCounties.csv').then(data => {
console.log(data, 'cova chart data')
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
            let totalCitiesCases = filterdCities.slice(-3);
            console.log(middleCityTotals, 'middle city totals')


            let totalDeaths = +totalCitiesCases[0].deaths + +totalCitiesCases[1].deaths + +totalCitiesCases[2].deaths;

            let totalCases = +totalCitiesCases[0].cases + +totalCitiesCases[1].cases + +totalCitiesCases[2].cases

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


            setDeathToll({
                chartData: {
                    labels: ['February', 'March', 'April'],
                    datasets: [
                        {
                            label: 'Los Angeles',
                            data: [
                                beginningCityTotals[0].deaths,
                                middleCityTotals[0].deaths,
                                totalCitiesCases[0].deaths,

                            ],
                            backgroundColor: 'green'
                        },
                        /// NYC
                        {
                            label: 'NYC',
                            data: [
                                beginningCityTotals[1].deaths,
                                middleCityTotals[1].deaths,
                                totalCitiesCases[1].deaths,

                            ],

                            backgroundColor: 'blue'
                        },
                        /// Seattle
                        {
                            label: 'Seattle',
                            data: [
                                beginningCityTotals[2].deaths,
                                middleCityTotals[2].deaths,
                                totalCitiesCases[2].deaths,

                            ],
                            backgroundColor: 'purple'
                        },
                    ]
                }
            });

        })

    }, [])
    console.log(deathToll, 'DEATH TOLL')


    return (
        <div className={classes.ChartContainer}>
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

            <div className={classes.BarContainer}>
                <Bar
                    data={deathToll.chartData}

                    options={{
                        scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Number of Deaths',
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