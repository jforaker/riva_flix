//$(function () {
//    $('#chart').highcharts({
//        chart: {
//            type: 'bar'
//        },
//        title: {
//            text: null
//        },
//        subtitle: {
//            text: null
//        },
//        xAxis: {
//            categories: ['Rotten Tomatoes Score'],
//            title: {
//                text: null
//            }
//        },
//        yAxis: {
//            min: 0,
//            title: null,
//            labels: {
//                overflow: 'justify'
//            }
//        },
//        tooltip: {
//            valueSuffix: ' tomatoes'
//        },
//        plotOptions: {
//            bar: {
//                dataLabels: {
//                    enabled: true
//                }
//            }
//        },
//        legend: {
//            layout: 'vertical',
//            align: 'center',
//            verticalAlign: 'top',
//            x: -40,
//            y: 50,
//            floating: true,
//            borderWidth: 0,
//            backgroundColor: '#FFFFFF',
//            shadow: false
//        },
//        credits: {
//            enabled: false
//        },
//        series: [{
//            name: 'Audience',
//            data: [28]
//        }, {
//            name: 'Critics',
//            data: [60]
//        }]
//    });
//});

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

    background:'#fff',

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

