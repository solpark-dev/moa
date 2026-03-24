import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function SavingsChart({ soloPrice = 17000, sharedPrice = 4250 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 200;
    const margin = { top: 30, right: 30, bottom: 30, left: 40 };

    const data = [
      { label: '혼자 볼 때', value: soloPrice },
      { label: 'MoA 이용 시', value: sharedPrice },
    ];

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, Math.max(...data.map(d => d.value)) * 1.2])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Draw Bars
    svg.append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.label))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth())
      .attr("rx", 8)
      .attr("fill", d => d.label === 'MoA 이용 시' ? '#ea580c' : '#d6d3d1');

    // Add Value Labels
    svg.append("g")
      .attr("fill", "#292524")
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", d => x(d.label) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 8)
      .text(d => `₩${d.value.toLocaleString()}`);

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select(".domain").remove())
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("color", "#78716c");

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("font-weight", "bold")
      .attr("fill", "#a8a29e")
      .text("월 예상 비용");

  }, [soloPrice, sharedPrice]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center w-full">
      <h3 className="text-sm font-bold text-stone-800 mb-2 self-start">💸 절약 분석</h3>
      <svg ref={svgRef} width={300} height={200} className="overflow-visible"></svg>
    </div>
  );
}
