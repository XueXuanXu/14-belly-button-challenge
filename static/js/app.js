// store the url as a variable
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// function to initialize the page
function init() {
    // populate the dropdown menu with individual IDs
    d3.json(url).then(function(data) {
      let dropdown = d3.select("#selDataset");
  
      data.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value", name);
      });
  
      // initial bar chart render with the first individual
      updateBar(data.names[0]);

      updateBubble(data.names[0]);

      updateMetaData(data.names[0]);
    });
  };

// function to update the bar chart based on the selected individual
function updateBar(selectedIndividual) {
    d3.json(url).then(function(data) {
      // filter data for the selected individual
      let selectedData = data.samples.find(sample => sample.id === selectedIndividual);
      console.log(selectedData);
  
      // slice and sort the data to get the top 10 OTUs
      let sortedData = selectedData.sample_values.slice(0, 10).reverse();
      let OTUIDs = selectedData.otu_ids.slice(0, 10).reverse().map(OTUid => `OTU ${OTUid}`);
      let OTULabels = selectedData.otu_labels.slice(0, 10).reverse();

  
      // create the horizontal bar chart
      let trace = {
        type: 'bar',
        orientation: 'h',
        x: sortedData,
        y: OTUIDs,
        text: OTULabels,
      };
  
      let layout = {
        title: `Bar chart of top 10 OTUs for ${selectedIndividual}`,
      };
  
      Plotly.newPlot('bar', [trace], layout);
    });
  };

  // function to update the bubble chart based on the selected sample
  function updateBubble(selectedIndividual){
    d3.json(url).then(function(data) {
        // filter data for the selected individual
        let selectedData = data.samples.find(sample => sample.id === selectedIndividual);
        
        // create a bubble chart
        let trace = {
            x: selectedData.otu_ids,
            y: selectedData.sample_values,
            mode: 'markers',
            marker: {
                color: selectedData.otu_ids,
                size: selectedData.sample_values
            },
            text: selectedData.otu_labels
        };

        let layout = {
            title: `Bubble chart for ${selectedIndividual}`
        };

        Plotly.newPlot('bubble', [trace], layout);
    });
  };

  // function to update the metadata for the selected sample
  function updateMetaData(selectedIndividual){
    d3.json(url).then(function(data){

        // filter data for the selected individual
        let selectedMetadata = data.metadata.find(metadata => metadata.id == selectedIndividual);
        console.log(selectedMetadata);

        // inital the metadata chart
        let metadataChart = d3.select("#sample-metadata");
        metadataChart.html("");
        
        // append new metadata
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataChart.append("h5").text(`${key}: ${value}`);
        });

    });
  };
  
  // event listener for dropdown change
  d3.select("#selDataset").on("change", function() {
    let selectedIndividual = d3.select(this).property("value");
    updateBar(selectedIndividual);

    updateBubble(selectedIndividual);

    updateMetaData(selectedIndividual);
  });
  
  // Initialize the page
  init();

