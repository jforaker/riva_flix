
var colors =  ["#16A085",
        "#2ECC71",
        "#3498DB",
        "#9B59B6",
        "#34495E",
        "#F1C40F",
        "#E67E22",
        "#C0392B"
    ];

var shuffledColors = _.shuffle(colors)


Highcharts.theme = {
    colors: shuffledColors,

    chart:{

        backgroundColor:'',

        xAxis: {
            max: 100,
            min: 0
        },
        animation: {
            duration: 1500,
            easing: 'easeOutBounce'
        }
    },

    legend: {
        itemStyle: {
            color: '#555',
            font: '12px Helvetica,Arial'
        }
    },


    labels: {
        style: {
            color: '#333',
            font: '12px Helvetica,Arial'
        }
    },




    tooltip: {

        style: {
            color: '#333',
            font: '12px Helvetica,Arial'
        }
    }
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

