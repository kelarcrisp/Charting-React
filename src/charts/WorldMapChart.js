import React, { useRef, useEffect, useState } from 'react';
import { select, geoPath, geoMercator, csv, min, max, scaleLinear, geoCentroid, geoProjection } from 'd3'
import { centroid } from 'd3-geo'
import useResizeObserver from '../ResizeObserver/ResizeObserver';
const WorldMapChart = ({ data }) => {

    const [mappedJson, setMappedJson] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null)
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
                .range(['#fcf4d9', '#8ED2C9', '#FF7A5A', '#FFB85F', '#462066'])

            // const minProp = min(mappedJsonData, deaths => deaths.value)
            const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect()
            const projection = geoMercator().fitSize([width, height], selectedCountry || data).precision(100);

            //transforms the getJson data info into the d attribute of a path element
            const pathGenerator = geoPath().projection(projection);

            svg.selectAll('.country')
                .data(data.features)
                .join('path')
                .on('click', feature => setSelectedCountry(selectedCountry === feature ? null : feature))
                .attr('class', 'country')
                .transition()
                .duration(500)
                .attr('fill', (country, index) => {
                    country.properties['DEATHS'] = mappedJson[index].value
                    // console.log(country.properties)
                    return colorScale(country.properties['DEATHS'])
                })
                .attr('d', feature => pathGenerator(feature))

            //render text
            svg.selectAll('.label')
                .data([selectedCountry])
                .join('text')
                .attr('class', 'label')
                .text(feature => {
                    console.log(feature)
                    return feature && feature.properties.name + ': ' + feature.properties.DEATHS
                })

                .attr('x', selectedCountry ? geoCentroid(selectedCountry)[0] : null)
                .attr('y', selectedCountry ? geoCentroid(selectedCountry)[1] : null)
        }



    }, [data, dimensions, mappedJson, selectedCountry])

    return (
        <>
            <div className="legend">
                <p className="legend-text"><span className="legend-color1"></span>  &lt; 50 cases</p>
                <p className="legend-text"><span className="legend-color2"></span>  &gt; 50 cases</p>
                <p className="legend-text"><span className="legend-color3"></span>  &gt; 250 cases</p>
                <p className="legend-text"><span className="legend-color4"></span>  &gt; 5000 cases</p>
                <p className="legend-text"><span className="legend-color5"></span>  &gt; 50000 cases</p>
                <p className="legend-text"><span className="legend-color6"></span>unKnown</p>
            </div>
            <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
                <svg ref={svgRef} ></svg>
            </div>
        </>
    );
};

export default WorldMapChart;