// Function to build the metadata panel
function buildMetadata(sample) {
  // Fetch the JSON data using d3
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
    
    // Extract the metadata field from the data
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultArray = metadata.filter(function(sampleObj) {
      return sampleObj.id == sample;
    });

    var result = resultArray[0];

    // Select the panel with id of `#sample-metadata` using d3
    var PANEL = d3.select("#sample-metadata");

    // Clear any existing metadata in the panel
    PANEL.html("");

    // Loop through the filtered result and append each key-value pair to the panel
    for (var key in result) {
      PANEL.append("h6").text(key.toUpperCase() + ": " + result[key]);
    }
  });
}

// Function to build both charts
function buildCharts(sample) {
  // Fetch the JSON data using d3
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {

    // Extract the samples field from the data
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var resultArray = samples.filter(function(sampleObj) {
      return sampleObj.id == sample;
    });

    var result = resultArray[0];

    // Extract the otu_ids, otu_labels, and sample_values from the result
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Build the layout for the Bubble Chart
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      margin: { t: 30 }
    };

    // Build the data for the Bubble Chart
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    // Render the Bubble Chart using Plotly
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Map the otu_ids to a list of strings for the yticks in the Bar Chart
    var yticks = otu_ids.map(function(otuID) {
      return "OTU " + otuID;
    });

    // Build the data for the Bar Chart
    var barData = [
      {
        y: yticks.slice(0, 10).reverse(),
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];

    // Build the layout for the Bar Chart
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 },
      xaxis: { title: "Number of Bacteria" }
    };

    // Render the Bar Chart using Plotly
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  // Fetch the JSON data using d3
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {

    // Extract the names field from the data
    var sampleNames = data.names;

    // Select the dropdown with id of `#selDataset` using d3
    var selector = d3.select("#selDataset");

    // Populate the select options with the list of sample names
    for (var i = 0; i < sampleNames.length; i++) {
      selector.append("option")
              .text(sampleNames[i])
              .property("value", sampleNames[i]);
    }

    // Get the first sample from the list
    var firstSample = sampleNames[0];

    // Build the charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function to handle changes in the dropdown selection
function optionChanged(newSample) {
  // Rebuild the charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard on page load
init();