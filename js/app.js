// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
var chart = d3.select("#scatter").append("div").classed("chart", true);

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left +15}, ${chartMargin.top})`);

d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("data.csv").then(function(trends) {
        


        trends.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            
            
        });



    var xLinearScale = d3.scaleLinear().range([0, chartWidth]);
    var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);
    
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    yMin = d3.min(trends, function(data) {
        return data.healthcare;
    });
    
    yMax = d3.max(trends, function(data) {
        return data.healthcare;
    });
    
    xMin = d3.min(trends, function(data) {
        return data.poverty;
    });
    
    xMax = d3.max(trends, function(data) {
        return data.poverty;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    
    console.log(xMin);
    console.log(yMax);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(trends)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 15)
      .attr("fill", "green")
      .attr("opacity", ".5")
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    var toolTip = d3.tip()
       .attr("class", "tooltip")
       .offset([80, -60])
       .html(function(d) {
         return (d.abbr + ' Lacks Healthcare ' + d.healthcare + '% and is In Poverty ' + d.poverty + '%');
         });
       
    chartGroup.call(toolTip);


// Updating circles group with a transition to
// new circles
    
    //circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, trends);
    })
    // onmouseout event
    .on("mouseout", function(d) {
        toolTip.hide(d);
    });

    chartGroup.append("text")
    .style("font-size", "10px")
    .selectAll("tspan")
    .data(trends)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty - 0.1);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare);
        })
        .text(function(data) {
            return data.abbr
        });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left -10)
        .attr("x", 0 - (chartHeight / 1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healtcare(%)");
    
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + chartMargin.top-2})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
}).catch(function(error) {
        console.log(error);
});