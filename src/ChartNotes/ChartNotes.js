import React, { useRef, useEffect, useState } from 'react';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3';

const ChartNotes = () => {
    const svgRef = useRef();
    const [data, setData] = useState([25, 30, 45, 60, 20, 60, 75]);
    useEffect(() => {
        const svg = select(svgRef.current);

        const xScale = scaleBand().domain(data.map((_, index) => index)).range([0, 300]).padding(0.5)
        const yScale = scaleLinear().domain([0, 150]).range([150, 0])
        const colorScale = scaleLinear().domain([75, 100, 150]).range(['green', 'orange', 'red']).clamp(true)
        const xAxis = axisBottom(xScale).ticks(data.length)
        const yAxis = axisRight(yScale);

        svg.select('.x-axis').style('transform', 'translateY(150px').call(xAxis);
        svg.select('.y-axis').style('transform', 'translateX(300px').call(yAxis)
        svg.selectAll('.bar')
            .data(data)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', (value, index) => xScale(index))
            .attr('y', -150)
            .style('transform', 'scale(1,-1')
            .attr('width', xScale.bandwidth())
            .on('mouseenter', (value, index) => {
                svg.selectAll('.tooltip').data([value]).join('text').attr('class', 'tooltip').text(value).attr('x', xScale(index) + xScale.bandwidth() / 2).attr('y', yScale(value + 10)).attr('text-anchor', 'middle').transition().attr('opacity', 1)
            })
            .on('mouseleave', () => svg.select('.tooltip').remove())
            .transition()
            .attr('height', value => 150 - yScale(value))
            .attr('fill', colorScale)

    }, [data]);

    return (
        <div id='root'>
            <svg ref={svgRef}>
                <g className='x-axis' />
                <g className='y-axis' />
            </svg>
            <button onClick={() => setData(data.map(value => value + 5))}>
                Update data
      </button>
            <button onClick={() => setData(data.filter(value => value < 35))}>
                Filter fakeData
      </button>
        </div>
    );
};

export default ChartNotes;