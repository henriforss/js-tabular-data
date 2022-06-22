/* Function to get data and return array with objects. */
const getData = async () => {
  const response = await fetch("data-victim.csv")
  const data = await response.text()

  /* Split by rows and remove header. */
  const table = data.split("\n").slice(1)

  /* Create an array with crimeobjects. */
  const crimeArray = []

  table.forEach(row => {
    const columns = row.split(";")
    const crime = columns[4].slice(1, -1)
    const year = parseInt(columns[3].slice(1, -1))
    const maleVictim = parseInt(columns[5])
    const femaleVictim = parseInt(columns[6])

    const crimeObject = {
      crime,
      year,
      maleVictim,
      femaleVictim
    }

    crimeArray.push(crimeObject)
  })
  
  /* Create an array with crimeobject merged by crime name. */
  const crimeNames = []
  const crimeObjectsMerged = []

  /* Get unique crime names. */
  crimeArray.forEach(obj => {
    if (crimeNames.includes(obj.crime) == false) {
      crimeNames.push(obj.crime)
    }
  })
  
  /* Filter and merge by crime name. Push into new array. */
  crimeNames.forEach(crimeName => {
    const tempArray = crimeArray.filter(obj => obj.crime == crimeName)
    
    const tempObject = {
      crime: crimeName,
      year: [],
      maleVictim: [],
      femaleVictim: [],
    }

    tempArray.forEach(obj => {
      tempObject.year.push(obj.year)
      tempObject.maleVictim.push(obj.maleVictim)
      tempObject.femaleVictim.push(obj.femaleVictim)
    })

    crimeObjectsMerged.push(tempObject)
  })
  
  /* Return new array with merged objecst. */
  return crimeObjectsMerged
}

/* Function to plot data in bar chart. Takes crime name as parameter. */
const barchartCrimeData = async ([crime, canvas]) => {
  const crimeObjectsMerged = await getData()

  /* Create variable. */
  let crimeToChart = ""

  /* Find crime-obj with parameter and assign to variable. */
  crimeObjectsMerged.forEach(obj => {
    if (obj.crime.toLowerCase().includes(crime.toLowerCase())) {
      crimeToChart = obj
    }
  })

  const ctx = document.getElementById(canvas).getContext("2d")
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: crimeToChart.year,
      datasets: [{
        label: "Miespuolinen uhri",
        data: crimeToChart.maleVictim,
        borderWidth: 0,
        backgroundColor: "rgb(66, 182, 245)"
      }, {
        label: "Naispuolinen uhri",
        data: crimeToChart.femaleVictim,
        borderWidth: 0,
        backgroundColor: "rgb(255, 155, 255)"
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: crimeToChart.crime
        }
      }
    }
  })  
}

/* Function to chart data in pie chart */
const piechartCrimeData = async () => {
  const crimeObjectsMerged = await getData()
  
  /* Sort according to number of crimes in most recent year. */
  let maleVictimSorted = crimeObjectsMerged.sort((a, b) => 
    b.maleVictim[b.maleVictim.length - 1] - a.maleVictim[a.maleVictim.length - 1]).slice(1, 11)
  let femaleVictimSorted = crimeObjectsMerged.sort((a, b) =>
    b.femaleVictim[b.femaleVictim.length -1] - a.femaleVictim[a.femaleVictim.length - 1]).slice(1, 11)
  
  maleData = {
    crime: [],
    victimNumber: [],
  }

  femaleData = {
    crime: [],
    victimNumber: [],
  }

  maleVictimSorted.forEach(obj => {
    maleData.crime.push(obj.crime)
    maleData.victimNumber.push(obj.maleVictim[obj.maleVictim.length - 1])
  })

  femaleVictimSorted.forEach(obj => {
    femaleData.crime.push(obj.crime)
    femaleData.victimNumber.push(obj.femaleVictim[obj.femaleVictim.length - 1])
  })

  /* Plot male victim data. */
  const ctx1 = document.getElementById("canvas-page17").getContext("2d")
  const chart1 = new Chart(ctx1, {
    type: 'pie',
    data: {
      labels: maleData.crime,
      datasets: [{
        data: maleData.victimNumber,
        borderWidth: 2,
        backgroundColor: [
          "rgba(66, 182, 245, 1.0)",
          "rgba(66, 182, 245, 0.9)",
          "rgba(66, 182, 245, 0.8)",
          "rgba(66, 182, 245, 0.7)",
          "rgba(66, 182, 245, 0.6)",
          "rgba(66, 182, 245, 0.5)",
          "rgba(66, 182, 245, 0.4)",
          "rgba(66, 182, 245, 0.3)",
          "rgba(66, 182, 245, 0.2)",
          "rgba(66, 182, 245, 0.1)",
        ]
      }]
    },
    options: {
      radius: "80%",
      plugins: {
        title: {
          display: true,
          text: "Miespuoliset uhrit (2021)"
        },
        legend: {
          display: true,
          position: "top",
          align: "center",
        }
      }
    }
  })
  
  const ctx2 = document.getElementById("canvas-page16").getContext("2d")
  const chart2 = new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: femaleData.crime,
      datasets: [{
        data: femaleData.victimNumber,
        borderWidth: 2,
        backgroundColor: [
          "rgba(255, 155, 255, 1.0)",
          "rgba(255, 155, 255, 0.9)",
          "rgba(255, 155, 255, 0.8)",
          "rgba(255, 155, 255, 0.7)",
          "rgba(255, 155, 255, 0.6)",
          "rgba(255, 155, 255, 0.5)",
          "rgba(255, 155, 255, 0.4)",
          "rgba(255, 155, 255, 0.3)",
          "rgba(255, 155, 255, 0.2)",
          "rgba(255, 155, 255, 0.1)",
        ]
      }]
    },
    options: {
      radius: "80%",
      plugins: {
        title: {
          display: true,
          text: "Naispuoliset uhrit (2021)"
        },
        legend: {
          display: true,
          position: "top",
          align: "center",
        }
      }
    }
  })
}

/* Function to populate dropdown menu on last page. */
const populateDropdown = async () => {
  const crimeObjectsMerged = await getData()

  const selector = document.getElementById("dropdown")

  crimeObjectsMerged.forEach(obj => {
    const option = document.createElement("option")
    option.value = obj.crime
    option.innerText = obj.crime
    selector.appendChild(option)
  })
}

/* Event listener listening for changes in dropdown menu on last page. */
document.getElementById("dropdown").onchange = () => {
  plotAnyChart()
}

/* Function to plot any chart on last page. */
const plotAnyChart = async () => {
  const crimeToPlot = document.getElementById("dropdown").value
  const chartStatus = Chart.getChart("canvas-page19")
  if (chartStatus != undefined) {
    chartStatus.destroy()
  }
  barchartCrimeData([crimeToPlot, "canvas-page19"]) 
}

/* Plot barcharts. */
barchartCrimeData(["yhteensä", "canvas-page3"])
barchartCrimeData(["törkeä raiskaus", "canvas-page5"])
barchartCrimeData(["lapsen seksuaalinen hyväksikäyttö 20:6", "canvas-page6"])
barchartCrimeData(["vainoaminen", "canvas-page7"])
barchartCrimeData(["ihmiskauppa", "canvas-page8"])
barchartCrimeData(["tapon yritys", "canvas-page10"])
barchartCrimeData(["törkeä pahoinpitely", "canvas-page11"])
barchartCrimeData(["törkeä ryöstö", "canvas-page12"])
barchartCrimeData(["murha 21:2§", "canvas-page13"])

/* Plot piecharts. */
piechartCrimeData()

/* Populate dropdown menu. */
populateDropdown()