<template>
    <div class="chart" id="EchartsMapBox">yesok</div>
</template>

<script setup>
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap';
import 'echarts-gl';
import {onBeforeMount, onMounted, ref} from 'vue';

onMounted(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;
    mapboxgl.language = 'zh-CN'
    var myChart = echarts.init(document.getElementById('EchartsMapBox'));
    var option;

    const convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            res.push({
                name: data[i].com_name,
                value: [data[i].wgs84_longitude, data[i].wgs84_latitude, data[i].avg_price_unit_area]
            });
        }
        return res;
    };

    $.get("/src/assets/zf_com_info.json", (data) => {
        // console.log(convertData(data));
        myChart.setOption(
            (option = {
                mapbox3D: {
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [114.0173420638, 22.6287103111],
                    zoom: 10
                },
                // bmap: {
                //     center: [114.0173420638, 22.6287103111],
                //     zoom: 10,
                //     roam: true,
                // },
                series: {
                    type: 'scatter3D',
                    coordinateSystem: 'mapbox3D',
                    // type: 'scatter',
                    // coordinateSystem: 'bmap',
                    geoIndex: 0,
                    symbolSize: 10,
                    // symbolSize: function (params) {
                    //     return (params[2] / 100) * 15 + 5;
                    // },
                    zlevel: 1,
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        label: {
                        show: true
                        }
                    },
                    itemStyle: {
                        color: '#b02a02'
                    },
                    // encode: {
                    //     tooltip: 2
                    // },
                    data: convertData(data) // [[114.0173420638, 22.6287103111],]//
                }
            })
        );
    })

    option && myChart.setOption(option);
    
})
</script>


<style scoped>
.chart {
  height: 50vh;
}
</style>