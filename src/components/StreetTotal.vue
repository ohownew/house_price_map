<template>
    <div class="chart" id="StreetTotal"></div>
    <div class="features">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="lyt" label="户型" />
            <el-table-column prop="area" label="平均面积" />
            <el-table-column prop="price" label="单位面积租金" />
            <el-table-column prop="num" label="在租数量" />
        </el-table>
    </div>
    <div class="map-overlay top">
        <div class="map-overlay-inner">
            <fieldset>
                <label>Select layer</label>
                <select id="layer" name="layer">
                    <!-- Each value matches a layer ID. -->
                    <option value="water">Water</option>
                    <option value="building">Buildings</option>
                    <option value="triangles">Triangles</option>
                </select>
            </fieldset>
            <fieldset>
                <label>Choose a color</label>
                <div id="swatches"></div>
            </fieldset>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
const tableData = ref([]);
const districts = [
    ['罗湖区', 114.14312021034308, 22.577590531325097],
    ['福田区', 114.0446201887346, 22.549203064656897],
    ['南山区', 113.93615586602698, 22.553139483645754],
    ['宝安区', 113.85728868757083, 22.68400030713536],
    ['盐田区', 114.26608846307737, 22.59870987895339],
    ['龙华区', 114.02979607735925, 22.68685416924557],
    ['大鹏新区', 114.49796743711808, 22.57948354439653],
    ['龙岗区', 114.20670288520662, 22.695592730801433],
    ['光明区', 113.92647346606621, 22.76617659337744],
    ['坪山区', 114.3572535468446, 22.69105985015741]
];



onMounted(() => {
    
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;
    const map = new mapboxgl.Map({
      container: 'CommunityPOI', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/dark-v11', // style URL
      center: [114.15,22.628710311083694], // starting position
      zoom: 10 // starting zoom
    });

    // $.ajaxSettings.async = false;
    $.get('/src/assets/zf_com_info.geojson', (zf_com_info) => {
        $.get('/src/assets/zf_district_info.geojson', (zf_district_info) => {

            // console.log(zf_com_info);
            map.on('load', () => {
                // Add a data source containing GeoJSON data.
                map.addSource('zf_com_info', {
                    'type': 'geojson',
                    'data': zf_com_info
                });

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
                // 定义插值函数
                var interpolateColor = ['interpolate', 
                    ["linear"],
                    ['get', 'percentile_rank'], 
                    0, 'rgba(33,102,172,0)',
                    20, 'rgb(103,169,207)',
                    40, 'rgb(209,229,240)',
                    60, 'rgb(253,219,199)',
                    80, 'rgb(239,138,98)',
                    100, 'rgb(178,24,43)'
                ];
        
                // Add a layer showing the places.
                map.addLayer({
                    'id': 'zf_com',
                    'type': 'circle',
                    'source': 'zf_com_info',
                    'paint': {
                        'circle-color': interpolateColor,
                        'circle-radius': 5,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#ffffff'
                    }
                });

                // Create a popup, but don't add it to the map yet.
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });
                
                map.on('mouseenter', 'zf_com', (e) => {
                    // Change the cursor style as a UI indicator.
                    map.getCanvas().style.cursor = 'pointer';
                    // Copy coordinates array.
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const description = '<strong>' + e.features[0].properties.com_name + '</strong>'
                        + '<p>小区单位面积均价: ￥'
                        + Math.round(e.features[0].properties.avg_price_unit_area*10)/10 + '/m²</p>'
                        + '<p>小区在租房源量: '
                        + e.features[0].properties.rentable_num + '</p>'
                        + '<strong>点击poi查看户型明细</strong>'
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    // }
                    // Populate the popup and set its coordinates
                    // based on the feature found.
                    popup.setLngLat(coordinates).setHTML(description).addTo(map);
                });
                
                map.on('mouseleave', 'zf_com', () => {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
                });

                map.on('click', 'zf_com', (e) => {
                    let com_id = e.features[0].properties.com_id
                    $.get(`/api/layout?com_id=${com_id}`, (res) => {
                        let render_data = [];
                        res.forEach((ele) => {
                            let lyt = `${ele.bedroom}室${ele.hall}厅${ele.bathroom}卫`
                            let area = `${Math.round(ele.total_area/ele.rentable_num)}㎡`
                            let price = `￥${Math.round(ele.avg_price_unit_area)}`
                            let num = ele.rentable_num
                            render_data.push({lyt:lyt, area:area, price:price, num:num})
                        });
                        tableData.value = render_data;
                    });
                });
            });

        });
    })
    // console.log(zf_com_info)



})


</script>


<style scoped>
.chart {
  height: 100vh;
  border-radius: 4px;
}
.features {
    position: absolute;
    top: 10%;
    /* bottom: 80%; */
    left: 65%;
    /* height: 0%; */
    width: 30%;
    overflow: auto;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0.9;
    border-radius: 4px;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.map-overlay {
font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
position: absolute;
width: 200px;
top: 10%;
left: 5%;
padding: 10px;
}
 
.map-overlay .map-overlay-inner {
background-color: #fff;
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
border-radius: 3px;
padding: 10px;
margin-bottom: 10px;
}
 
.map-overlay-inner fieldset {
border: none;
padding: 0;
margin: 0 0 10px;
}
 
.map-overlay-inner fieldset:last-child {
margin: 0;
}
 
.map-overlay-inner select {
width: 100%;
}
 
.map-overlay-inner label {
display: block;
font-weight: bold;
margin: 0 0 5px;
}
 
.map-overlay-inner button {
display: inline-block;
width: 36px;
height: 20px;
border: none;
cursor: pointer;
}
 
.map-overlay-inner button:focus {
outline: none;
}
 
.map-overlay-inner button:hover {
box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.1);
}
</style>
