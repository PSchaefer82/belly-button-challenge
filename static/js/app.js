// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
  let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
  let dataArrays = metadata.filter(dataObject => dataObject.id == sample);
  let dataArray = dataArrays[0];
    // Use d3 to select the panel with id of `#sample-metadata`
  let panel = d3.select("#sample-metadata");
  
   // Use `.html("") to clear any existing metadata
  panel.html("");






    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
  for(key in dataArray){
    panel.append("h6").text(`${key}: ${dataArray[key]}`);
  };
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field  
  let samples = data.samples;

    // Filter the samples for the object with the desired sample number
  let samplesArrays = samples.filter(dataObject => dataObject.id == sample);
  let samplesArray = samplesArrays[0];

    // Get the otu_ids, otu_labels, and sample_values
  let otu_ids = samplesArray.otu_ids;
  let otu_labels = samplesArray.otu_labels;
  let sample_values = samplesArray.sample_values;

    // Build a Bubble Chart
  let bubbleLayout = {
    title: "Bacteria Cultures per Sample", 
    xaxis: {title: "OTU ID"},
    yaxis: {title: "Number of Bacteria"}
  };

  let dataBubble = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {size: sample_values,
              color: otu_ids,
      }
    }
  ];

    // Render the Bubble Chart
  Plotly.newPlot("bubble", dataBubble, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(otuID => `OTU ${otuID} `);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barChart = [
      {
        y: yticks.slice(0, 10).reverse(),
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    // Render the Bar Chart
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 },
      xaxis: {'title': "Number of Bacteria"}
    }; 
Plotly.newPlot("bar", barChart, barLayout)

  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let samplesNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let i = 0; i < samplesNames.length; i++){
      dropDown.append("option").text(samplesNames[i]).property("value", samplesNames[i])
    };

    // Get the first sample from the list
    let sampleOne = samplesNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(sampleOne);
    buildCharts(sampleOne);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
