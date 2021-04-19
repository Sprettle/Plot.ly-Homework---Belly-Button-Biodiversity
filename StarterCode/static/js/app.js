// Initializes the page with the default plot
function init() {
    // Select html location '#selDataset' and assign to variable
    var dropdownMenu = d3.select("#selDataset");
    // Extract out all the ids
    d3.json("/data/samples.json").then((importedData) =>{
        var data = importedData; 
        var names_list = data.names;
        // Append each id within the names_list
        names_list.forEach((idNo)=>{
             dropdownMenu
            .append('option')
            .text(idNo)
            .property('value');
        });
        
        //ADD DEMO INFO AND CHARTS FOR ID 940 (firstId)//
        
        // Extract out the first idNo from names_list which contains all the idNos and name it as variable 'firstId'
        firstId = names_list[0];
        // Run function to add Demo Info about id 940.
        addDemoInfo(firstId); 
        // Run function to add Charts Info about id 940.
        addCharts(firstId);
        // Run function to add Gauge about id 940.
        addGauge(firstId);
        // Append paragraph and string in html id 'sample-metadata'
        info_table.append("p")
        .text("In the above dropdown, select an ID.");
    });
};
        
// When user selects an ID, run function 'optionChanged'
id_selection = d3.select("#selDataset").on("change", optionChanged);

// FUNCTION 'optionChanged' 
function optionChanged(idNo){    
    // Run the following 3 functions 
    // Note: function 'addGauge' is in file bonus.js
    addDemoInfo(idNo);
    addCharts(idNo);
    addGauge(idNo);
};
// FUNCTION 'addDemoInfo' 
function addDemoInfo(idNo){
    info_table = d3.select("#sample-metadata");
    info_table.html("");
    //Append data into table
    d3.json("/data/samples.json").then((importedData) => {
        var metaInfo = importedData.metadata;
        var filteredInfo = metaInfo.filter(obj => obj.id == idNo);
        var selectedInfo = filteredInfo[0];
        
        // APPEND TO INFO TABLE THE ID's
        Object.entries(selectedInfo).forEach(([key, value]) => {
                console.log(key, value);
                info_table.append("h5").text(`${key}: ${value}`);
                console.log(info_table);
            });
    });

}

// FUNCTION 'addCharts'
function addCharts(idNo){
    
    // Extract out id, otu_ids, sample_values
    d3.json("/data/samples.json").then((data) => {
    var metaData = data.samples;
    var filteredSampInfo = metaData.filter(obj => obj.id == idNo)[0];
    
    // y-values: otu_ids
    var samp_otu_id = filteredSampInfo.otu_ids;
    // Top 10 otu_ids
    var top_otu_id = samp_otu_id.slice(0,10);
    // Top 10 otu_ids in a string, e.g. OTU 1167
    var str_top_otu_id = top_otu_id.map(obj => "OTU "+ obj);
    // x-values: sample_values
    var sample_vals = filteredSampInfo.sample_values;
    // Top 10 counts of the otu_ids
    var top_sample_vals = sample_vals.slice(0,10);
    // otu_labels (for the bubble chart)
    var otu_labs = filteredSampInfo.otu_labels;

    //Plot the bar chart
    var trace = {
        x: top_sample_vals.reverse(),
        y: str_top_otu_id.reverse(),
        type: "bar",
        orientation: 'h'
    };
    var data = [trace];
    var layout = {
        xaxis: {title: "Count"},
        yaxis: {title:"OTU ID"}
    };
    Plotly.newPlot("bar", data, layout);

    //Plot the bubble chart
    var trace = {
        x: samp_otu_id,
        y: sample_vals,
        text: otu_labs,
        mode: 'markers',
        marker: {
            size: sample_vals, 
            color: sample_vals, 
            colorscale: 'Portland'
        }  
    };
    var data = [trace];
    var layout = {
        xaxis:{title:"OTU ID"},
        yaxis:{title:"Count"},
        showlegend: false,
        height: 600,
        width: 1200
    };
    Plotly.newPlot("bubble", data, layout);
    });
}

// FUNCTION 'addGauge' 
function addGauge(idNo){

    // EXTRACT variable washFreq of the selected ids
    d3.json("/data/samples.json").then((importedData) => {
        var data = importedData;
        var metadata = data.metadata;
        var filterIdData = metadata.filter(obj=>obj.id == idNo);
        var washFreq = parseFloat(filterIdData[0].wfreq);

        var gaugeData = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: washFreq,
              title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 10] },
                bar: { color: "white"},
                steps: [
                  { range: [0, 2], color: "#c94c4c" },
                  { range: [2, 4], color: "#f2ae72" },
                  { range: [4, 6], color: "#ffef96" },
                  { range: [6, 8], color: "#b1cbbb" },
                  { range: [8, 10], color: "#A0DAA9" }
                ],
              }
            }
          ];
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        
        Plotly.newPlot('gauge', gaugeData, layout);

    });
}
// Run function init()
init()