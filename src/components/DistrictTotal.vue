<template>
    <div class="chart" id="DistrictTotal"></div>
    <div class="colname">
        <el-radio-group v-model="radio1" size="large" @change="handleChange">
        <el-radio-button label="单位面积均价" />
        <el-radio-button label="在租小区量" />
        <el-radio-button label="在租房源量" />
        </el-radio-group>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';

const col_name = ref('avg_price_unit_area');
const radio1 = ref('单位面积均价');


onMounted(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;
    const map = new mapboxgl.Map({
      container: 'DistrictTotal', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/dark-v11', // style URL
      center: [114.15,22.628710311083694], // starting position
      zoom: 10 // starting zoom
    });

    $.get('/src/assets/zf_district_info.geojson', (zf_district_info) => {

        // console.log(zf_com_info);
        map.on('load', () => {
            // Add a data source containing GeoJSON data.
            map.addSource('zf_district_info', {
                'type': 'geojson',
                'data': zf_district_info
            });
            // Add a black outline around the polygon.
            map.addLayer({
                'id': 'outline',
                'type': 'line',
                'source': 'zf_district_info',
                'layout': {},
                'paint': {
                    'line-color': '#ffffff',
                    'line-width': 2
                }
            });

            function render(colname) {
                // 计算最大值最小值
                let minValue = Infinity;
                let maxValue = -Infinity;
                zf_district_info.features.forEach((item)=>{
                    let fieldValue = item.properties[colname];

                    if (fieldValue < minValue) {
                        minValue = fieldValue;
                    }
                    if (fieldValue > maxValue) {
                        maxValue = fieldValue;
                    }
                });
                // 定义颜色范围
                const colorRange = [
                    '#e0efff',
                    '#4080ff',
                ];
                // 定义插值函数
                var interpolateColor = ['interpolate', 
                    ['linear'], 
                    ['get', colname], 
                    minValue, colorRange[0], 
                    maxValue, colorRange[1]
                ];
                // Add a new layer to visualize the polygon.
                map.addLayer({
                    'id': 'fill',
                    'type': 'fill',
                    'source': 'zf_district_info', // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': interpolateColor, //'#0080ff', // blue color fill
                        'fill-opacity': 0.6
                    }
                });
                // Add a layer to show district name.
                map.addLayer({
                    id: 'name',
                    // References the GeoJSON source defined above
                    // and does not require a `source-layer`
                    source: 'zf_district_info',
                    type: 'symbol',
                    layout: {
                        // Set the label content to the feature's `name` property
                        'text-field': ['format', 
                            ['get', 'division_n'],
                            '\n',
                            ['case',
                                ['==', colname, 'avg_price_unit_area'], ['concat', '单位面积均价', ['round', ['get', colname]], ' 元/㎡'],
                                ['==', colname, 'com_num'], ['concat', '在租小区量', ['round', ['get', colname]]],
                                ['==', colname, 'rentable_num'], ['concat', '在租房源量', ['round', ['get', colname]]],
                                'else'
                            ]
                        ]
                    }
                });
            };
            render(col_name.value);

            function handleChange() {
                map.removeLayer('fill');
                map.removeLayer('name');

                if (radio1.value === '单位面积均价') {
                    col_name.value = 'avg_price_unit_area';
                }
                else if (radio1.value === '在租小区量') {
                    col_name.value = 'com_num';
                }
                else if (radio1.value == '在租房源量') {
                    col_name.value = 'rentable_num';
                }

                render(col_name.value);
            }
            watch(radio1, handleChange);
        });
    });



})
</script>

<style scoped>
.chart {
  height: 100vh;
  border-radius: 4px;
}
.colname {
    position: absolute;
    top: 10%;
    /* bottom: 80%; */
    left: 5%;
    /* height: 0%; */
    width: auto;
    overflow: auto;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0.9;
    border-radius: 4px;
}
</style>