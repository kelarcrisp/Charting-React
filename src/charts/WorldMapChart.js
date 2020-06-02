import React, { useRef, useEffect, useState } from 'react';
import { select, geoPath, geoMercator, csv, min, max, scaleLinear } from 'd3'
import useResizeObserver from '../ResizeObserver/ResizeObserver';
const WorldMapChart = ({ data }) => {

    const [mappedJson, setMappedJson] = useState(null);
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        const svg = select(svgRef.current)
        csv('total_deaths_csv.csv').then(csvData => {
            const worldDeaths = csvData.slice(-1)[0].World
            const getIndividualDeaths = csvData.slice(-1)[0];
            const mappedJsonData = data.features.map((d) => {
                return {
                    name: [d.properties.brk_name], value: +getIndividualDeaths[d.properties.brk_name]
                }
            })
            if (mappedJson === null) {
                setMappedJson(mappedJsonData)
            }

        })
        if (mappedJson !== null) {

            const minDeaths = min(mappedJson, deaths => deaths.value)
            const maxDeaths = max(mappedJson, deaths => deaths.value)

            const colorScale = scaleLinear()
                .domain([minDeaths, 50, 250, 5000, maxDeaths])
                .range(['black', 'gray', 'yellow', 'orange', 'red'])

            // const minProp = min(mappedJsonData, deaths => deaths.value)
            const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect()
            const projection = geoMercator().fitSize([width, height], data);

            //transforms the getJson data info into the d attribute of a path element
            const pathGenerator = geoPath().projection(projection);


            console.log(data.features, 'features')
            svg.selectAll('.country')
                .data(data.features)
                .join('path')
                .attr('class', 'country')
                .attr('fill', (country, index) => {

                    country.properties['DEATHS'] = mappedJson[index].value

                    console.log(country.properties)
                    return colorScale(country.properties['DEATHS'])
                })
                .attr('d', feature => pathGenerator(feature))
        }



    }, [data, dimensions, mappedJson])

    return (
        <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
            <svg ref={svgRef} ></svg>
        </div>
    );
};

export default WorldMapChart;