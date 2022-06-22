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

/* Create a table with data for most recent year. */
const createTable = async () => {
  const crimeObjectsMerged = await getData()
  
  const crimeList = document.getElementById("table")

  /* Create table data and append to document. */
  crimeObjectsMerged.forEach(obj => {
    const row = document.createElement("tr")
    const cell1 = document.createElement("td")
    const cell2 = document.createElement("td")
    const cell3 = document.createElement("td")
    cell1.innerText = obj.crime
    cell2.innerText = obj.maleVictim[obj.maleVictim.length -1]
    cell3.innerText = obj.femaleVictim[obj.femaleVictim.length -1]
    row.appendChild(cell1)
    row.appendChild(cell2)
    row.appendChild(cell3)
    crimeList.appendChild(row)
  })
}

/* Visualize all data. */
const chartData = async () => {
  const crimeObjectsMerged = await getData()

  const crimeCharts = document.getElementById("charts")

  crimeObjectsMerged.forEach(obj => {
    const canvas = document.createElement("canvas")
    crimeCharts.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: obj.year,
        datasets: [{
          label: "Miespuolinen uhri",
          data: obj.maleVictim,
          borderWidth: 0,
          backgroundColor: "rgb(66, 182, 245)"
        }, {
          label: "Naispuolinen uhri",
          data: obj.femaleVictim,
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
            text: obj.crime
          }
        }
      }
    })
  })
}

/* Visualize top 10 most common crimes. */
const chartTopten = async () => {
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

  const pieCharts = document.getElementById("piecharts")
  const canvas1 = document.createElement("canvas")
  const canvas2 = document.createElement("canvas")
  pieCharts.appendChild(canvas1)
  pieCharts.appendChild(canvas2)

  const ctx1 = canvas1.getContext("2d")
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

  const ctx2 = canvas2.getContext("2d")
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
          text: "Naispuoliset uhrit uhrit (2021)"
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



createTable()
chartData()
chartTopten()
