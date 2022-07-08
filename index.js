function btnChartStep() {
    document.getElementById("rawData").style.display = "none"
    document.getElementById("chartVisual").style.display = "block"
}

function btnDataStep() {
    document.getElementById("rawData").style.display = "block"
    document.getElementById("chartVisual").style.display = "none"
}

function textareaChanged() {

    let textarea = document.getElementById("textData")
    let textareaValue = textarea.value.trim();

    let dataTable = document.getElementById("data-table")

    dataTable.innerHTML = ""

    if (textareaValue.length > 0) {

        dataTable.style.display = "table"
        dataTable.style.border = "3px solid black"

        let rows = textareaValue.split("\n")

        for (let i = 0; i < rows.length; i++) {
            
            let cols = rows[i].split("\t")

            if (i == 1 && cols.length > 2) {
                document.getElementById("pie-option").disabled = true
                document.getElementById("doughnut-option").disabled = true
            }

            else if (cols.length <= 2) {
                document.getElementById("pie-option").disabled = false
                document.getElementById("doughnut-option").disabled = false
            }

            let dataRow = document.createElement("tr")
            dataRow.setAttribute("id", "Row" + i)

            for (let j = 0; j < cols.length; j++) {

                if (i == 0) {

                    let dataHead = document.createElement("th")
                    dataHead.innerText = cols[j]
                    dataHead.setAttribute("id", "row" + i + "_col" + j)
                    dataRow.appendChild(dataHead)
        
                }

                else {

                    let dataHead = document.createElement("td")
                    dataHead.innerText = cols[j]
                    dataHead.setAttribute("id", "row" + i + "_col" + j)
                    dataRow.appendChild(dataHead)

                }
        

            }

            dataTable.appendChild(dataRow)
        
        }

        //console.log(dataTable)

        let dataCells = document.getElementsByTagName("td")
        let headCells = document.getElementsByTagName("th")

        for (let dataCell of dataCells)
            dataCell.contentEditable = true
        
        for (let headCell of headCells)
            headCell.contentEditable = true

    }

}

function chartTypeChanged() {

    const chartStatus = Chart.getChart("chartCanva")
    if (chartStatus != undefined)
        chartStatus.destroy()

    const chartType = document.getElementById("chart-type").value;

    //console.log("chart type changed", chartType)

    if (chartType == 'hbar')
        makeBarChart('bar', 'y', 'right', 5)

    else if (chartType == 'vbar')
        makeBarChart('bar', 'x', 'top', 0)

    else if (chartType == 'line')
        makeBarChart('line', 'x', 'top', 0)

    else if (chartType == 'pie')
        makeBarChart('pie', 'x', 'top', 0)

    else if (chartType == 'doughnut')
        makeBarChart('doughnut', 'x', 'top', 0)

}

function makeBarChart(type, axisValue, labelAlign, labelOffset) {

    const chartStatus = Chart.getChart("chartCanva")
    if (chartStatus != undefined)
        chartStatus.destroy()

    let rowsCount = document.getElementById("data-table").childElementCount
    let colsCount = document.getElementById("Row0").childElementCount

    let axesTitle = document.getElementById("row0_col0").textContent
    let chartTitle = document.getElementById("chartTitle").value
    let chartSubTitle = document.getElementById("chartSubtitle").value

    let datasetValues = new Array()
   
    let rowHeads = new Array()     // finished - only once

    for (let i = 1; i < colsCount; i++) {

        let values = new Array()
        let colHeads = new Array()

        // getting column heads

        for (let j = 1; j < colsCount; j++) {
            let colHeadValue = document.getElementById("row0_col" + j).textContent
            colHeads.push(colHeadValue)
        }
        
        // getting data

        for (let j = 1; j < rowsCount; j++) {

            // getting row heads
            if (i == 1) {
                let rowHeadValue = document.getElementById("row" + j + "_col0").textContent
                rowHeads.push(rowHeadValue)
            }
        
            let dataValue = Number(document.getElementById("row" + j + "_col" + i).textContent.replace(/[,_-]/g, ''))
            values.push(dataValue)
            
        }

        if (type == 'line') {
            var borderColorValue = generateRandomColor()
            var backgroundColorValue = '#d3e2e3'
        }

        else if (type == 'pie' || type == 'doughnut') {
            var backgroundColorValue = new Array()
            var borderColorValue = 'black'
            for (let i = 1; i < rowsCount; i++) {
                let backgroundColorItem = generateRandomColor()
                backgroundColorValue.push(backgroundColorItem)
            }
        }

        else {
            var borderColorValue = 'black'
            var backgroundColorValue = generateRandomColor()
        }
        
        let objDataset = {
            backgroundColor: backgroundColorValue,
            data: [...values],
            label: colHeads[i - 1],
            borderColor: borderColorValue,
            borderWidth: 1,
            datalabels: {
                anchor: 'end',
                align: labelAlign,
                offset: labelOffset,
                font: {
                    size: 14,
                }
            }
        }
        
        datasetValues.push(objDataset)
        //console.log("obj data", objDataset.data)

        values.splice(0, values.length)

    }

   //console.log(datasetValues)

    const chartCanva = document.getElementById("chartCanva")
    const context = chartCanva.getContext('2d')
    
    chartGraphic = new Chart(context, {

        type: type,

        data: {
            labels: rowHeads,
            datasets: datasetValues
        },

        plugins: [ChartDataLabels],

        options: {

            layout: {
                padding: {
                    top: 15,
                    right: 20,
                    bottom: 15,
                    left: 20
                }
            },

            scales: {
                xAxes: {
                    title: {
                        text: axesTitle,
                        display: true,
                        font: {
                            weight: 'bold',
                            size: 16
                        }
                    }
                }
            },

            indexAxis: axisValue,

            plugins: {

                legend: {
                    display: true,
                    position: 'right'
                },

                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 20,
                        weight: 'bold',
                        color: 'black'
                    }
                },

                subtitle: {
                    display: true,
                    text: chartSubTitle,
                    padding: {
                        bottom: 10
                    },
                    font: {
                        size: 16,
                        weight: 'bold',
                        color: 'black'
                    }
                }

            },
           
        }

    })

    // console.log(chartGraphic.options.plugins.title.text)
    // console.log(axisValue)

}

function changeChartTitle() {

    const chartTitle = document.getElementById("chartTitle").value
    chartGraphic.options.plugins.title.text = chartTitle
    chartGraphic.update()
}

function changeChartSubtitle() {

    console.log(chartGraphic.options.plugins.subtitle.text)
    const chartSubtitle = document.getElementById("chartSubtitle").value
    chartGraphic.options.plugins.subtitle.text = chartSubtitle
    chartGraphic.update()
    console.log(chartGraphic.options.plugins.subtitle.text)
}

function downloadChartImage() {
    //var download = document.getElementById("btn-download");
    var image = document.getElementById("chartCanva").toDataURL()
    //var image = document.getElementById("chartCanva").toDataURL("image/png").replace("image/png", "image/octet-stream");
    //download.setAttribute("href", image);
    //document.getElementById("chartImage").href = image
    //document.getElementById("chartImage").click()
    document.getElementById("chartImagePreview").src = image
}

function generateRandomColor(){
    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal; 
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);   
    return `#${randColor.toUpperCase()}`
}