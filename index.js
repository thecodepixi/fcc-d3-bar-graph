// DOM Content Loaded listener for fetch
document.addEventListener("DOMContentLoaded", () => {
  // fetch data from API 
   fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
   .then( resp => resp.json())
   .then( jsonData => {
     // do all graph work here...
     const w = 750
     const h = 500
     const padding = 50 
     const barWidth = w / jsonData.data.length
     
     //get date data from data (lol)
     const yearDates = jsonData.data.map( item => {
       return new Date(item[0])
     })
     
     const xScale = d3.scaleTime()
     // use split below to access just the year of the date attr
                      .domain([d3.min(yearDates), d3.max(yearDates)])
                      .range([padding, w - padding])
     
     const yScale = d3.scaleLinear()
     // domain is min GDP to max GDP
                      .domain([0, d3.max(jsonData.data, d => d[1])])
                      .range([h-padding, padding])
     
     // append svg to graph div
     const svg = d3.select("#graph")
                   .append("svg")
                   .style("height", h)
                   .style("width", w)
     
     const xAxis = d3.axisBottom(xScale)
     const yAxis = d3.axisLeft(yScale)
     
     //format y axis ticks to $s
     // yAxis.tickFormat(d3.format("$.2s"))
     
     let gdpScale = jsonData.data.map( d => yScale(d[1]) )
     
     let hoverDiv = d3.select("body").append("div")
                      .attr("id", "tooltip")
                      .style("opacity", 0)
     
     //add x axis scale
     svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0,"+ (h - padding) +")")
        .call(xAxis)
     // add y axis scale     
       svg.append("g")
          .attr("id", "y-axis")
          .attr("transform", "translate("+ padding +",0)")
          .call(yAxis)
     // append bars to graph and position them
     svg.selectAll("rect")
        .data(gdpScale)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d,i) => jsonData.data[i][0])
        .attr("data-gdp", (d, i) => jsonData.data[i][1])
        .attr("width", barWidth)
        .attr("y", d => d)
        .attr("height", d => h - d - padding )
        .attr("x", (d, i) => xScale(yearDates[i]))
        .on("mouseover", (d, i)  => {
          hoverDiv.transition()		
                  .duration(200)		
                  .style("opacity", .8)
          hoverDiv.style("left", d3.event.pageX - 100 + "px")		
                  .style("top", h - 100 + "px")
                  .html("<p><strong> Date: " + yearDates[i].toLocaleDateString() +"</strong><p>GDP: $"+ jsonData.data[i][1] + " Billion" )
                 .attr("data-date", jsonData.data[i][0])
                 .attr("data-gdp", jsonData.data[i][1])
       })
       .on("mouseout", (d, i) => {
          hoverDiv.transition()
                 .duration(200)
                 .style("opacity", 0)
     })
 
   })
 })